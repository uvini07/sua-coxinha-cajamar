import { useStoryContext } from '../../context/StoryContext.js'
import { catalog, drinks, priceText } from '../../data/products.js'
import { store } from '../../data/store.js'
import OrderButtons from '../OrderButtons.jsx'
import '../../styles/sections/catalog.css'

const groups = [...catalog, drinks]

function ProductCard({ item, tone }) {
  const titleId = `produto-${item.id}`

  return (
    <li className={`product product--${tone}`}>
      <article className="product__card" aria-labelledby={titleId}>
        <div className="product__photo">
          <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
        </div>

        <div className="product__body">
          <h4 id={titleId} className="product__name">
            {item.name}
          </h4>
          <p className="product__desc">{item.description}</p>

          {item.variants ? (
            <dl className="product__variants">
              {item.variants.map((v) => (
                <div key={v.label} className="product__variant">
                  <dt>{v.label}</dt>
                  <dd>{priceText(v.price)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="product__price">{priceText(item.price)}</p>
          )}

          {item.options && (
            <p className="product__options">
              <strong>{item.options.title}:</strong> {item.options.list.join(', ')}.
            </p>
          )}
          {item.extra && <p className="product__extra">{item.extra}</p>}

          <OrderButtons item={item} itemName={item.name} className="product__order" />
        </div>
      </article>
    </li>
  )
}

export default function CatalogSection() {
  const { linkTo } = useStoryContext()

  return (
    <section id="cardapio" className="catalog" data-theme="light" aria-labelledby="cardapio-title">
      <div className="catalog__inner">
        <header className="catalog__head">
          <h2 id="cardapio-title" className="catalog__title display">
            Cardápio
          </h2>
          <p className="catalog__intro">
            Todos os produtos e preços da loja. Escolha o que quiser e toque em <strong>Pedir no iFood</strong> ou{' '}
            <strong>Pedir no 99Food</strong>.
          </p>
        </header>

        <nav className="catalog__nav" id="categorias" aria-label="Categorias do cardápio">
          <ul>
            {groups.map((group) => (
              <li key={group.id}>
                <a href={`#cat-${group.id}`} onClick={linkTo(`cat-${group.id}`)}>
                  {group.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {catalog.map((group) => (
          <section key={group.id} id={`cat-${group.id}`} className="catalog__group" aria-labelledby={`titulo-${group.id}`}>
            <h3 id={`titulo-${group.id}`} className="catalog__group-title">
              {group.name}
            </h3>
            <ul className="catalog__grid">
              {group.items.map((item) => (
                <ProductCard key={item.id} item={item} tone={group.id} />
              ))}
            </ul>
            <a className="catalog__back" href="#categorias" onClick={linkTo('categorias')}>
              Voltar para as categorias
            </a>
          </section>
        ))}

        <section id={`cat-${drinks.id}`} className="catalog__group" aria-labelledby="titulo-bebidas">
          <h3 id="titulo-bebidas" className="catalog__group-title">
            {drinks.name}
          </h3>
          <div className="drinks">
            <ul className="drinks__list">
              {drinks.items.map((drink) => (
                <li key={drink.name} className="drinks__item">
                  <span>{drink.name}</span>
                  <span className="drinks__price">
                    {drink.from && <span className="drinks__from">a partir de </span>}
                    {priceText(drink.price)}
                  </span>
                </li>
              ))}
            </ul>
            <OrderButtons item={drinks} itemName="bebidas" className="drinks__order" />
          </div>
          <a className="catalog__back" href="#categorias" onClick={linkTo('categorias')}>
            Voltar para as categorias
          </a>
        </section>

        <p className="catalog__note">{store.disclaimer} Preços do cardápio da loja; nos aplicativos podem variar.</p>
      </div>
    </section>
  )
}
