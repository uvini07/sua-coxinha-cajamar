import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useStoryContext } from '../../context/StoryContext.js'
import { store } from '../../data/store.js'
import Button from '../Button.jsx'
import '../../styles/scenes/hero.css'

/**
 * Conteúdo da primeira tela. É desenhado duas vezes, uma sobre a outra:
 * a camada de baixo (fundo preto) e uma cópia recortada na diagonal (fundo amarelo),
 * com as cores invertidas. Assim títulos, fotos e botões trocam de cor exatamente na linha.
 * A cópia é só visual: sem ids, sem foco e sem cliques (o clique atravessa para a de baixo).
 */
function HeroContent({ copy = false }) {
  const { linkTo } = useStoryContext()
  const onYellow = copy

  return (
    <div className={`scene__inner hero${onYellow ? ' hero--on-yellow' : ''}`}>
      <div className="hero__main">
        {copy ? (
          <p className="hero__title display">
            <span className="hero__word hero__word--top">
              <span className="hero__word-inner">Coxinha</span>
            </span>
            <span className="hero__word hero__word--bottom">
              <span className="hero__word-inner">churros</span>
            </span>
          </p>
        ) : (
          <h1 id="hero-title" className="hero__title display">
            <span className="hero__word hero__word--top">
              <span className="hero__word-inner">Coxinha</span>
            </span>
            <span className="sr-only"> e </span>
            <span className="hero__word hero__word--bottom">
              <span className="hero__word-inner">churros</span>
            </span>
          </h1>
        )}

        <div className="hero__product hero__coxinha">
          <img
            src="/assets/produtos/coxinha-g.webp"
            alt={copy ? '' : 'Coxinha G cortada ao meio, com recheio de frango aparente'}
            width="456"
            height="542"
            fetchPriority="high"
          />
        </div>
        <div className="hero__product hero__churros">
          <img
            src="/assets/produtos/churros-gourmet.webp"
            alt={copy ? '' : 'Três churros gourmet com toppings de amendoim e confete'}
            width="753"
            height="632"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="hero__copy">
        <p className="hero__lead lead">
          Da coxinha G de 250g ao copo de mini churros com cobertura. Na loja em {store.unit}, no iFood ou no 99Food.
        </p>
        <div className="hero__actions">
          <Button href="#cardapio" variant={onYellow ? 'dark' : 'primary'} onClick={linkTo('cardapio')}>
            Ver cardápio
          </Button>
          <Button href="#pedido" variant={onYellow ? 'ghost-dark' : 'ghost'} onClick={linkTo('pedido')}>
            Fazer pedido
          </Button>
        </div>
      </div>

      <p className="hero__hint" aria-hidden="true">
        <span className="hero__hint-line" />
        Role para começar
      </p>
    </div>
  )
}

export default function HeroScene() {
  const ref = useRef(null)

  // Único momento de entrada automática: títulos sobem da máscara e os produtos caem na cena.
  // Os seletores pegam as duas camadas, que animam juntas.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
          .from('.hero__split', { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', duration: 1.3, ease: 'power3.inOut' }, 0)
          .from('.hero__word-inner', { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0.2)
          .from('.hero__coxinha img', { y: -120, rotate: -40, scale: 0.6, opacity: 0, duration: 1.4 }, 0.45)
          .from('.hero__churros img', { y: 140, rotate: 30, scale: 0.6, opacity: 0, duration: 1.4 }, 0.55)
          .from('.hero__copy > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.85)
          .from('.hero__hint', { opacity: 0, duration: 0.8 }, 1.3)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="inicio" className="scene scene--hero" data-theme="dark" aria-labelledby="hero-title">
      <HeroContent />
      <div className="hero__split" aria-hidden="true" inert>
        <HeroContent copy />
      </div>
    </section>
  )
}
