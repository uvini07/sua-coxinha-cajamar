import gsap from 'gsap'
import { zigzag } from './zigzag.js'

/**
 * Timeline da abertura animada (somente computador). Cada cena adiciona seu trecho
 * a partir de um tempo `at` e devolve o tempo em que termina. Os rótulos (labels)
 * têm o id da cena e servem para a navegação levar o scroll até ela.
 * Depois da última cena o palco é liberado e o site rola normalmente.
 */
export function buildStory(root) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
  const sceneEls = gsap.utils.toArray(root.querySelectorAll('.stage .scene'))
  const scope = (id) => {
    const el = root.querySelector(`#${id}`)
    return { el, q: gsap.utils.selector(el) }
  }

  const ctx = {
    tl,
    boundaries: [0],
    blur: (px) => ({ filter: `blur(${px}px)` }),
    teeth: 56,
    depth: 2,
  }

  // Entrada de cena com a borda serrilhada do cardápio subindo.
  ctx.wipe = (el, at, duration = 0.8) => {
    const index = sceneEls.indexOf(el)
    gsap.set(el, { clipPath: zigzag(0, ctx.teeth, ctx.depth), autoAlpha: 0, zIndex: index + 1 })
    tl.set(el, { autoAlpha: 1 }, at)
    tl.to(el, { clipPath: zigzag(1, ctx.teeth, ctx.depth), duration, ease: 'power2.inOut' }, at)
    // A cena anterior sai da pintura e do foco quando fica totalmente coberta.
    tl.set(sceneEls[index - 1], { autoAlpha: 0 }, at + duration)
    ctx.boundaries[index] = at + duration / 2
  }

  let t = hero(scope('inicio'), ctx)
  t = products(scope('produtos'), ctx, t)
  t = coxinha(scope('coxinha'), ctx, t)
  t = churros(scope('churros'), ctx, t, scope('coxinha'))
  tl.addLabel('fim', t)

  return { tl, boundaries: ctx.boundaries }
}

function hero({ q }, { tl, blur }) {
  tl.addLabel('inicio', 0)
  tl.to(q('.hero__copy, .hero__hint'), { y: -50, autoAlpha: 0, duration: 0.55, ease: 'power2.in', ...blur(10) }, 0.12)
  tl.to(q('.hero__word--top'), { xPercent: -24, duration: 1.4, ease: 'none' }, 0)
  tl.to(q('.hero__word--bottom'), { xPercent: 24, duration: 1.4, ease: 'none' }, 0)
  tl.to(q('.hero__coxinha'), { scale: 1.55, rotate: 14, yPercent: -18, duration: 1.4, ease: 'power1.in' }, 0)
  tl.to(q('.hero__churros'), { scale: 1.3, rotate: -16, xPercent: 18, yPercent: 26, duration: 1.4, ease: 'power1.in' }, 0)
  tl.to(q('.hero__glow'), { scale: 1.7, duration: 1.4, ease: 'none' }, 0)
  return 0.7
}

function products({ el, q }, ctx, at) {
  const { tl, wipe } = ctx
  wipe(el, at)
  tl.from(q('.products__title .line > span'), { yPercent: 105, stagger: 0.08, duration: 0.6 }, at + 0.35)
  tl.from(q('.family__name'), { y: 30, autoAlpha: 0, stagger: 0.12, duration: 0.5 }, at + 0.5)
  tl.from(
    q('.tile-wrap'),
    { y: 90, rotateX: -28, autoAlpha: 0, transformOrigin: '50% 100%', stagger: 0.06, duration: 0.7 },
    at + 0.55,
  )
  tl.addLabel('produtos', at + 1.1)
  return at + 1.8
}

function coxinha({ el, q }, ctx, at) {
  const { tl, wipe } = ctx
  wipe(el, at)
  tl.addLabel('coxinha', at + 0.9)

  tl.fromTo(q('.cx__word'), { xPercent: 6 }, { xPercent: -22, duration: 3, ease: 'none' }, at)
  tl.fromTo(q('.cx__light'), { '--lx': '30%', '--ly': '70%' }, { '--lx': '62%', '--ly': '38%', duration: 2.4, ease: 'none' }, at)
  tl.from(q('.cx__title .line > span'), { yPercent: 105, stagger: 0.08, duration: 0.6 }, at + 0.45)
  tl.from(q('.cx__lead'), { y: 24, autoAlpha: 0, duration: 0.5 }, at + 0.6)

  // M (130g) cresce até virar G (250g).
  const grow = at + 0.6
  const size = q('.cx__size-num')[0]
  const counter = { g: 130 }
  tl.fromTo(
    q('.cx__product'),
    { scale: 0.52, rotate: -16, yPercent: 10 },
    { scale: 1, rotate: 5, yPercent: 0, duration: 1.7, ease: 'power1.inOut' },
    grow,
  )
  tl.to(
    counter,
    {
      g: 250,
      duration: 1.7,
      ease: 'power1.inOut',
      onUpdate: () => {
        size.textContent = Math.round(counter.g)
      },
    },
    grow,
  )
  gsap.set(q('.cx__img--g, .cx__size--g'), { autoAlpha: 0 })
  gsap.set(q('.cx__img--m, .cx__size--m'), { autoAlpha: 1 })
  size.textContent = '130'
  tl.to(q('.cx__img--m'), { autoAlpha: 0, duration: 0.35 }, grow + 0.7)
  tl.to(q('.cx__img--g'), { autoAlpha: 1, duration: 0.35 }, grow + 0.7)
  tl.to(q('.cx__size--m'), { autoAlpha: 0, yPercent: -40, duration: 0.3 }, grow + 0.8)
  tl.fromTo(q('.cx__size--g'), { yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, grow + 0.9)
  tl.fromTo(q('.cx__shadow'), { scaleX: 0.5, opacity: 0.4 }, { scaleX: 1, opacity: 0.8, duration: 1.7, ease: 'power1.inOut' }, grow)
  tl.fromTo(q('.cx__crumb'), { y: (i) => 120 + i * 40 }, { y: (i) => -80 - i * 50, duration: 2.6, ease: 'none' }, at + 0.2)

  tl.from(q('.cx__flavors-title'), { y: 20, autoAlpha: 0, duration: 0.4 }, at + 0.8)
  tl.from(q('.cx__flavor'), { x: 40, autoAlpha: 0, stagger: 0.07, duration: 0.45 }, at + 0.9)
  tl.from(q('.cx__note'), { autoAlpha: 0, duration: 0.4 }, at + 1.6)
  return at + 2.6
}

function churros({ el, q }, ctx, at, previous) {
  const { tl, wipe, blur } = ctx

  // A coxinha avança em direção à câmera e sai de cena.
  tl.to(previous.q('.cx__product'), { scale: 3.2, yPercent: -10, autoAlpha: 0, duration: 0.8, ease: 'power2.in', ...blur(16) }, at)
  tl.to(previous.q('.cx__copy, .cx__flavors'), { y: -40, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, at)

  wipe(el, at + 0.3)
  tl.addLabel('churros', at + 1.3)

  tl.fromTo(
    q('.ch__product'),
    { xPercent: 70, rotate: 32, scale: 0.7 },
    { xPercent: 0, rotate: -6, scale: 1, duration: 1.2, ease: 'power3.out' },
    at + 0.55,
  )
  tl.fromTo(q('.ch__product'), { '--glow': 0 }, { '--glow': 1, duration: 0.8 }, at + 1)
  tl.from(q('.ch__title .line > span'), { yPercent: 105, stagger: 0.08, duration: 0.6 }, at + 0.8)
  tl.from(q('.ch__price'), { y: 20, autoAlpha: 0, duration: 0.45 }, at + 1)
  tl.fromTo(
    q('.ch__float'),
    { y: (i) => 260 + i * 90, rotate: (i) => (i % 2 ? -30 : 30) },
    { y: (i) => -120 - i * 60, rotate: (i) => (i % 2 ? 20 : -20), duration: 3.2, ease: 'none' },
    at + 0.3,
  )

  const steps = q('.ch__step')
  steps.forEach((step, i) => {
    const start = at + 1.3 + i * 0.6
    tl.from(step, { y: 36, autoAlpha: 0, duration: 0.45 }, start)
    tl.from(step.querySelectorAll('.chip'), { scale: 0.6, autoAlpha: 0, stagger: 0.06, duration: 0.3, ease: 'back.out(2)' }, start + 0.2)
  })
  tl.from(q('.ch__cta'), { y: 20, autoAlpha: 0, duration: 0.4 }, at + 2.6)
  // Pausa final: a cena fica parada um pouco antes de o cardápio subir.
  return at + 3.6
}
