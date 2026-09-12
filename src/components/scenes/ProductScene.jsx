import { useStoryContext } from '../../context/StoryContext.js'
import { families } from '../../data/products.js'
import '../../styles/scenes/products.css'

const SPARKS = 6

export default function ProductScene() {
  const { linkTo } = useStoryContext()

  return (
    <section id="produtos" className="scene scene--products" aria-labelledby="produtos-title">
      <div className="scene__inner products">
        <h2 id="produtos-title" className="products__title display h2">
          <span className="line">
            <span>Salgado ou doce?</span>
          </span>
          <span className="line">
            <span>Pode os dois.</span>
          </span>
        </h2>

        <div className="products__families">
          {families.map((family) => (
            <div key={family.id} className={`family family--${family.id}`}>
              <h3 className="family__name">{family.name}</h3>
              <ul className="family__list">
                {family.items.map((item) => (
                  <li key={item.name} className="tile-wrap">
                    <a className="tile" href="#cardapio" onClick={linkTo('cardapio')}>
                      <span className="tile__plate">
                        <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
                        <span className="tile__sparks" aria-hidden="true">
                          {Array.from({ length: SPARKS }, (_, i) => (
                            <i key={i} style={{ '--i': i }} />
                          ))}
                        </span>
                      </span>
                      <span className="tile__name">{item.name}</span>
                      <span className="tile__detail">{item.detail}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
