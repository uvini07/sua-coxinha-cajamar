import { useRef } from 'react'
import { menu } from '../../data/products.js'
import { store } from '../../data/store.js'
import { useTilt } from '../../hooks/useTilt.js'
import Price from '../Price.jsx'
import '../../styles/scenes/menu.css'

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, '-')

function MenuCard({ item }) {
  const ref = useRef(null)
  useTilt(ref, 5)

  return (
    <li className="card-wrap">
      <article ref={ref} className={`card card--${slug(item.category)}`} aria-labelledby={`card-${item.id}`}>
        <div className="card__plate">
          <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
          <span className="card__tag">{item.category}</span>
        </div>
        <div className="card__body">
          <h3 id={`card-${item.id}`} className="card__name">
            {item.name}
          </h3>
          <p className="card__desc">{item.description}</p>
          <div className="card__footer">
            <Price cents={item.price} from={item.from} className="card__price" />
            <a className="btn btn--dark btn--small card__order" href={store.links.order} target="_blank" rel="noopener noreferrer">
              <span className="btn__label">
                Pedir<span className="sr-only"> {item.name} no iFood (abre em nova aba)</span>
              </span>
            </a>
          </div>
        </div>
      </article>
    </li>
  )
}

export default function MenuSection() {
  return (
    <section id="cardapio" className="scene scene--menu" aria-labelledby="cardapio-title">
      <div className="scene__inner menu">
        <header className="menu__head">
          <h2 id="cardapio-title" className="menu__title display h2">
            <span className="line">
              <span>Cardápio</span>
            </span>
          </h2>
          <p className="menu__intro">
            Preços do cardápio da loja. No iFood, os valores podem variar.
          </p>
          <span className="menu__progress" aria-hidden="true">
            <span className="menu__progress-fill" />
          </span>
        </header>

        <div className="menu__viewport">
          <ul className="menu__track">
            {menu.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </ul>
        </div>

        <p className="menu__note">{store.disclaimer}</p>
      </div>
    </section>
  )
}
