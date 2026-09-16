import { useEffect, useRef, useState } from 'react'
import { flavors } from '../../data/products.js'
import Price from '../Price.jsx'
import '../../styles/scenes/coxinha.css'

// Migalhas decorativas com posições fixas (profundidade via tamanho e desfoque).
const CRUMBS = Array.from({ length: 9 }, (_, i) => ({
  left: `${8 + i * 10.5}%`,
  top: `${55 + Math.sin(i * 1.7) * 30}%`,
  width: `${5 + ((i * 7) % 9)}px`,
  filter: i % 3 ? `blur(${i % 3}px)` : undefined,
}))

// Mantém na memória as fotos já baixadas, para a troca ser instantânea da segunda vez em diante.
const carregadas = new Set()

function carregar(src) {
  if (carregadas.has(src)) return Promise.resolve()
  const img = new Image()
  img.src = src
  const pronto = img.decode ? img.decode() : Promise.resolve()
  return pronto.catch(() => {}).then(() => carregadas.add(src))
}

export default function CoxinhaScene() {
  const [flavor, setFlavor] = useState(flavors[0])
  const [carregando, setCarregando] = useState(null)
  const imgRef = useRef(null)

  // Com conexão boa, deixa as outras fotos prontas enquanto a pessoa lê a página.
  useEffect(() => {
    const rede = navigator.connection
    if (rede?.saveData || (rede?.effectiveType && !rede.effectiveType.includes('4g'))) return
    const agendar = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 1200))
    const id = agendar(() => flavors.forEach((f) => carregar(f.image)))
    return () => window.cancelIdleCallback?.(id)
  }, [])

  // Só troca a foto depois que ela está baixada: sem piscar nem aparecer pela metade.
  const chooseFlavor = async (next) => {
    if (next.id === flavor.id) return
    if (!carregadas.has(next.image)) {
      setCarregando(next.id)
      await carregar(next.image)
      setCarregando(null)
    }
    setFlavor(next)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    requestAnimationFrame(() =>
      imgRef.current?.animate?.(
        [
          { opacity: 0, transform: 'scale(0.97)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      ),
    )
  }

  return (
    <section id="coxinha" className="scene scene--coxinha" data-theme="dark" aria-labelledby="coxinha-title">
      <div className="cx__light" aria-hidden="true" />
      <p className="cx__word display" aria-hidden="true">
        coxinha
      </p>
      <div className="cx__crumbs" aria-hidden="true">
        {CRUMBS.map((style, i) => (
          <span key={i} className="cx__crumb" style={style} />
        ))}
      </div>

      <div className="scene__inner cx">
        <div className="cx__copy" data-reveal>
          <h2 id="coxinha-title" className="cx__title display h2">
            <span className="line">
              <span>Crocante por fora,</span>
            </span>
            <span className="line">
              <span>cremosa por dentro.</span>
            </span>
          </h2>
          <p className="cx__lead">Massa de batata, recheio bem temperado e dois tamanhos pra escolher.</p>

          <div className="cx__sizes">
            <p className="sr-only">Coxinha M: 130g, R$ 9,90. Coxinha G: 250g, R$ 14,90.</p>
            <p className="cx__weight display" aria-hidden="true">
              <span className="cx__size-num">250</span>
              <span className="cx__unit">g</span>
            </p>
            <div className="cx__size-labels" aria-hidden="true">
              <p className="cx__size cx__size--m">
                <span>Coxinha M</span>
                <Price cents={990} />
              </p>
              <p className="cx__size cx__size--g">
                <span>Coxinha G</span>
                <Price cents={1490} />
              </p>
            </div>
          </div>
        </div>

        <div className="cx__stage" data-reveal>
          <div className="cx__product">
            <img
              className="cx__img cx__img--m"
              src="/assets/produtos/coxinha-m.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <img
              ref={imgRef}
              className="cx__img cx__img--g"
              src={flavor.image}
              alt={`Coxinha cortada ao meio, com recheio de ${flavor.name.toLowerCase()}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = '/assets/produtos/coxinha-g-sombra.webp'
              }}
            />
          </div>
          <span className="cx__shadow" aria-hidden="true" />
        </div>

        <div className="cx__flavors" data-reveal>
          <h3 className="cx__flavors-title" id="cx-sabores">
            Sabores
          </h3>
          <p className="cx__flavors-hint">Toque num sabor para ver por dentro.</p>
          <ul className="cx__flavor-list" aria-labelledby="cx-sabores">
            {flavors.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="cx__flavor"
                  aria-pressed={item.id === flavor.id}
                  aria-busy={carregando === item.id}
                  data-loading={carregando === item.id}
                  onClick={() => chooseFlavor(item)}
                  onPointerEnter={() => carregar(item.image)}
                  onTouchStart={() => carregar(item.image)}
                >
                  {item.name}
                  {item.onlyM && <span className="cx__flavor-tag">só na M</span>}
                  {carregando === item.id && <span className="cx__flavor-spinner" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="cx__note">Imagens meramente ilustrativas.</p>
        </div>

      </div>
    </section>
  )
}
