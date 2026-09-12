import { useCallback, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { scenes } from '../data/scenes.js'
import { buildStory } from './timelines.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

const sceneIndex = (id) => scenes.findIndex((s) => s.id === id)

/**
 * Controla a experiência inteira:
 * - modo narrativa: palco fixado + timeline mestre ligada ao scroll (com Lenis no desktop);
 * - modo estático: cenas empilhadas, usado com prefers-reduced-motion.
 */
export function useStory(rootRef) {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const progressRef = useRef(null)
  const navigate = useRef(() => {})

  const updateActive = useCallback((index) => {
    if (index === activeRef.current) return
    activeRef.current = index
    setActive(index)
  }, [])

  const setProgress = (value) => {
    progressRef.current?.style.setProperty('--p', value.toFixed(4))
  }

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = root.querySelector('.stage')
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 900px)',
          mobile: '(max-width: 899.98px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        ({ conditions }) => {
          if (conditions.reduce) return setupStatic(root, updateActive, setProgress, navigate)

          document.documentElement.classList.add('is-story')
          const mobile = !conditions.desktop
          const { tl, boundaries } = buildStory(root, { mobile })

          // Lenis só no desktop: no toque o scroll nativo é mais natural.
          let lenis = null
          const raf = (time) => lenis.raf(time * 1000)
          if (!mobile) {
            lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9 })
            lenis.on('scroll', ScrollTrigger.update)
            gsap.ticker.add(raf)
            gsap.ticker.lagSmoothing(0)
          }

          const unit = () => window.innerHeight * (mobile ? 0.5 : 0.58)
          const st = ScrollTrigger.create({
            trigger: stage,
            start: 'top top',
            end: () => `+=${Math.round(tl.duration() * unit())}`,
            pin: true,
            scrub: mobile ? 0.6 : 0.4,
            animation: tl,
            onUpdate: (self) => {
              setProgress(self.progress)
              const time = self.progress * tl.duration()
              let index = 0
              boundaries.forEach((b, i) => {
                if (time >= b) index = i
              })
              updateActive(index)
            },
          })

          navigate.current = (id) => {
            const time = tl.labels[id]
            if (time === undefined) return
            const y = st.start + (time / tl.duration()) * (st.end - st.start)
            const distance = Math.abs(window.scrollY - y)
            if (lenis) {
              lenis.scrollTo(y, { duration: gsap.utils.clamp(0.8, 2.6, distance / 2200) })
            } else {
              window.scrollTo({ top: y, behavior: 'smooth' })
            }
          }

          // Teclado: ao focar um card fora da área visível do cardápio, leva o scroll até ele.
          const track = root.querySelector('.menu__track')
          const onFocus = (event) => {
            const card = event.target.closest('.card-wrap')
            if (!card || !tl.labels.menuTrackStart) return
            const cards = [...track.children]
            const ratio = cards.indexOf(card) / Math.max(1, cards.length - 1)
            const time = tl.labels.menuTrackStart + ratio * (tl.labels.menuTrackEnd - tl.labels.menuTrackStart)
            window.scrollTo(0, st.start + (time / tl.duration()) * (st.end - st.start))
          }
          track?.addEventListener('focusin', onFocus)

          return () => {
            track?.removeEventListener('focusin', onFocus)
            if (lenis) {
              gsap.ticker.remove(raf)
              lenis.destroy()
            }
            document.documentElement.classList.remove('is-story')
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const goTo = useCallback((id) => navigate.current(id), [])
  const linkTo = useCallback(
    (id) => (event) => {
      event.preventDefault()
      navigate.current(id)
    },
    [],
  )

  return useMemo(() => ({ active, goTo, linkTo, progressRef }), [active, goTo, linkTo])
}

function setupStatic(root, updateActive, setProgress, navigate) {
  const sections = [...root.querySelectorAll('.scene')]
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateActive(sections.indexOf(entry.target))
      })
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  sections.forEach((s) => observer.observe(s))

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    setProgress(max > 0 ? window.scrollY / max : 0)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  navigate.current = (id) => {
    const index = sceneIndex(id)
    sections[index]?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  return () => {
    observer.disconnect()
    window.removeEventListener('scroll', onScroll)
  }
}
