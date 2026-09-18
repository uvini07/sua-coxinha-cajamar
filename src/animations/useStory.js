import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import { storyScenes } from '../data/cenas.js'
import { buildStory } from './timelines.js'

gsap.registerPlugin(ScrollTrigger, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

// A abertura animada só roda em computador (mouse, tela larga) e sem "reduzir movimento".
// No celular e no tablet a página rola normalmente do início ao fim.
const STORY_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const navOffset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72

export function useStory(rootRef) {
  const [storyIndex, setStoryIndex] = useState(0)
  const [section, setSection] = useState({ id: 'inicio', theme: 'dark' })
  const [isStory, setIsStory] = useState(false)
  const storyIndexRef = useRef(0)
  const progressRef = useRef(null)
  const api = useRef({ timeline: null, trigger: null, lenis: null })

  const setProgress = (value) => {
    progressRef.current?.style.setProperty('--p', value.toFixed(4))
  }

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = root.querySelector('.stage')
      const mm = gsap.matchMedia()

      mm.add(STORY_QUERY, () => {
        document.documentElement.classList.add('is-story')
        setIsStory(true)

        const { tl, boundaries } = buildStory(root)

        const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.9 })
        const raf = (time) => lenis.raf(time * 1000)
        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)

        const trigger = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: () => `+=${Math.round(tl.duration() * window.innerHeight * 0.58)}`,
          pin: true,
          scrub: 0.4,
          animation: tl,
          onUpdate: (self) => {
            setProgress(self.progress)
            const time = self.progress * tl.duration()
            let index = 0
            boundaries.forEach((b, i) => {
              if (time >= b) index = i
            })
            if (index !== storyIndexRef.current) {
              storyIndexRef.current = index
              setStoryIndex(index)
            }
          },
        })

        api.current = { timeline: tl, trigger, lenis }

        return () => {
          gsap.ticker.remove(raf)
          lenis.destroy()
          api.current = { timeline: null, trigger: null, lenis: null }
          document.documentElement.classList.remove('is-story')
          setIsStory(false)
        }
      })

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // Qual seção está sob a navbar (define a cor da navbar e o link ativo).
  useEffect(() => {
    const root = rootRef.current
    const targets = isStory
      ? [root.querySelector('.stage'), ...root.querySelectorAll(':scope > section')]
      : [...root.querySelectorAll('section[data-theme]')]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target
          setSection({ id: el.classList.contains('stage') ? 'story' : el.id, theme: el.dataset.theme })
        })
      },
      // Com a janela ainda sem altura (aba abrindo em segundo plano), a conta dava
      // negativo e o navegador recusava a margem, derrubando a página inteira.
      { rootMargin: `-${navOffset()}px 0px -${Math.max(0, window.innerHeight - navOffset() - 1)}px 0px` },
    )
    targets.forEach((t) => t && observer.observe(t))
    return () => observer.disconnect()
  }, [isStory, rootRef])

  const goTo = useCallback((id) => {
    const { timeline, trigger, lenis } = api.current
    if (timeline && timeline.labels[id] !== undefined) {
      const y = trigger.start + (timeline.labels[id] / timeline.duration()) * (trigger.end - trigger.start)
      lenis.scrollTo(y, { duration: gsap.utils.clamp(0.8, 2.4, Math.abs(window.scrollY - y) / 2200) })
      return
    }
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) {
      lenis.scrollTo(el, { offset: -navOffset() + 1, duration: 1.4 })
    } else {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset() + 1
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
    }
    // Leva o foco junto, para quem navega pelo teclado ou leitor de tela.
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }, [])

  const linkTo = useCallback(
    (id) => (event) => {
      event.preventDefault()
      goTo(id)
    },
    [goTo],
  )

  // Trava a rolagem da página por trás de uma janela (pop-up) aberta.
  const lockScroll = useCallback((locked) => {
    const { lenis } = api.current
    if (lenis) locked ? lenis.stop() : lenis.start()
    document.documentElement.classList.toggle('scroll-locked', locked)
  }, [])

  const current = useMemo(() => {
    if (isStory && section.id === 'story') {
      return { ...storyScenes[storyIndex], inStory: true }
    }
    return { id: section.id, theme: section.theme, inStory: false }
  }, [isStory, section, storyIndex])

  return useMemo(
    () => ({ current, storyIndex, isStory, goTo, linkTo, lockScroll, progressRef }),
    [current, storyIndex, isStory, goTo, linkTo, lockScroll],
  )
}
