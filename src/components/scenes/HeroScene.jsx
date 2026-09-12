import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useStoryContext } from '../../context/StoryContext.js'
import { store } from '../../data/store.js'
import Button from '../Button.jsx'
import '../../styles/scenes/hero.css'

export default function HeroScene() {
  const ref = useRef(null)
  const { linkTo } = useStoryContext()

  // Único momento de entrada automática da página: título sobe da máscara e os produtos caem na cena.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
          .from('.hero__glow', { scale: 0.4, opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
          .from('.hero__word-inner', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.1)
          .from('.hero__coxinha img', { y: -120, rotate: -40, scale: 0.6, opacity: 0, duration: 1.4 }, 0.35)
          .from('.hero__churros img', { y: 140, rotate: 30, scale: 0.6, opacity: 0, duration: 1.4 }, 0.45)
          .from('.hero__copy > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.75)
          .from('.hero__hint', { opacity: 0, duration: 0.8 }, 1.2)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="inicio" className="scene scene--hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />

      <div className="scene__inner hero">
        <div className="hero__main">
          <h1 id="hero-title" className="hero__title display">
            <span className="hero__word hero__word--top">
              <span className="hero__word-inner">Coxinha</span>
            </span>
            <span className="sr-only"> e </span>
            <span className="hero__word hero__word--bottom">
              <span className="hero__word-inner">churros</span>
            </span>
          </h1>

          <div className="hero__product hero__coxinha">
            <img
              src="/assets/produtos/coxinha-g.webp"
              alt="Coxinha G cortada ao meio, com recheio de frango aparente"
              width="456"
              height="542"
              fetchPriority="high"
            />
          </div>
          <div className="hero__product hero__churros">
            <img
              src="/assets/produtos/churros-gourmet.webp"
              alt="Três churros gourmet com toppings de amendoim e confete"
              width="753"
              height="632"
              fetchPriority="high"
            />
          </div>
        </div>

        <div className="hero__copy">
          <p className="hero__lead lead">
            Da coxinha G de 250g ao copo de mini churros com cobertura. Na loja em {store.unit} ou no iFood.
          </p>
          <div className="hero__actions">
            <Button href="#cardapio" magnetic onClick={linkTo('cardapio')}>
              Ver cardápio
            </Button>
            <Button href={store.links.order} variant="ghost" external>
              Quero pedir
            </Button>
          </div>
        </div>

        <p className="hero__hint" aria-hidden="true">
          <span className="hero__hint-line" />
          Role para começar
        </p>
      </div>
    </section>
  )
}
