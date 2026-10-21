import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useStoryContext } from '../../context/StoryContext.js'
import { useLoja } from '../../context/LojaContext.js'
import Button from '../Button.jsx'
import { rastrear } from '../../analytics/ga.js'
import '../../styles/scenes/hero.css'

/**
 * Primeira tela. São duas faixas que nunca se sobrepõem: o texto no preto e as
 * fotos no amarelo, separados pela diagonal da marca. No celular elas empilham
 * (texto em cima, fotos embaixo) e no computador ficam lado a lado.
 *
 * A diagonal é o próprio palco das fotos, recortado — e não uma camada por cima.
 * Assim a linha cai sempre onde as fotos começam, em qualquer altura de tela.
 */
export default function HeroScene() {
  const ref = useRef(null)
  const { linkTo } = useStoryContext()
  const loja = useLoja()
  const ifood = loja.platforms.find((p) => p.id === 'ifood')

  // Única entrada automática do site: as palavras sobem da máscara, o amarelo
  // entra pela direita e os produtos caem na cena.
  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
        .from('.hero__palco', { xPercent: 102, duration: 1.2, ease: 'power3.inOut' }, 0)
        .from('.hero__word-inner', { yPercent: 110, duration: 1.1, stagger: 0.1 }, 0.25)
        .from('.hero__coxinha', { y: -110, rotate: -32, scale: 0.6, opacity: 0, duration: 1.3 }, 0.5)
        .from('.hero__churros', { y: 130, rotate: 26, scale: 0.6, opacity: 0, duration: 1.3 }, 0.6)
        .from('.hero__copy > *', { y: 26, opacity: 0, duration: 0.85, stagger: 0.1 }, 0.8)
        .from('.hero__hint', { autoAlpha: 0, duration: 0.8 }, 1.25)
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="inicio" className="scene scene--hero" data-theme="dark" aria-labelledby="hero-title">
      <div className="scene__inner hero">
        <div className="hero__grid">
          <div className="hero__texto">
            <h1 id="hero-title" className="hero__title display">
              <span className="hero__word hero__word--top">
                <span className="hero__word-inner">Coxinha</span>
              </span>
              <span className="hero__word hero__word--bottom">
                <span className="hero__word-inner">
                  <span className="hero__e">e</span> churros
                </span>
              </span>
            </h1>

            <div className="hero__copy">
              <p className="hero__lead lead">
                {loja.textos.heroLead ??
                  `Da coxinha G de 250g ao copo de mini churros com cobertura. Na loja em ${loja.unit}, no iFood ou no 99Food.`}
              </p>
              <div className="hero__actions">
                {ifood ? (
                  <Button href={ifood.url} external onClick={() => rastrear('pedido_ifood', { item: 'hero' })}>
                    Pedir iFood
                  </Button>
                ) : (
                  <Button href="#cardapio" onClick={linkTo('cardapio')}>
                    Ver cardápio
                  </Button>
                )}
                <Button href="#pedido" variant="ghost" onClick={linkTo('pedido')}>
                  Fazer pedido
                </Button>
              </div>
            </div>
          </div>

          {/* O amarelo e as fotos são camadas separadas: o recorte da diagonal
              fica só no fundo, então nenhuma foto é cortada pela linha. */}
          <div className="hero__palco" aria-hidden="true" />

          <div className="hero__fotos">
            <img
              className="hero__product hero__coxinha"
              src="/assets/produtos/coxinha-g.webp"
              alt="Coxinha G cortada ao meio, com recheio de frango aparente"
              width="456"
              height="542"
              fetchPriority="high"
            />
            <img
              className="hero__product hero__churros"
              src="/assets/produtos/churros-gourmet.webp"
              alt="Três churros gourmet com toppings de amendoim e confete"
              width="753"
              height="632"
              fetchPriority="high"
            />
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
