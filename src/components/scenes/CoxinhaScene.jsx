import { useRef, useState } from 'react'
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

export default function CoxinhaScene() {
  const [flavor, setFlavor] = useState(flavors[0])
  const imgRef = useRef(null)

  // Troca a foto do recheio com uma piscada curta, para o cliente perceber a mudança.
  const chooseFlavor = (next) => {
    setFlavor(next)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    imgRef.current?.animate?.(
      [
        { opacity: 0.3, transform: 'scale(0.97)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
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
                  onClick={() => chooseFlavor(item)}
                >
                  {item.name}
                  {item.onlyM && <span className="cx__flavor-tag">só na M</span>}
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
