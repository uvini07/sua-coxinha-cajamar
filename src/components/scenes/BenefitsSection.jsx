import { benefits } from '../../data/benefits.js'
import ImagePlaceholder from '../ImagePlaceholder.jsx'
import '../../styles/scenes/benefits.css'

export default function BenefitsSection() {
  return (
    <section id="sobre" className="scene scene--about" aria-labelledby="sobre-title">
      <div className="scene__inner about">
        <div className="about__side">
          <h2 id="sobre-title" className="about__title display h2">
            <span className="line">
              <span>Pra todo tipo</span>
            </span>
            <span className="line">
              <span>de fome.</span>
            </span>
          </h2>
          <ol className="about__index" aria-hidden="true">
            {benefits.map((b) => (
              <li key={b.short} className="about__index-item">
                {b.short}
              </li>
            ))}
          </ol>
        </div>

        <div className="about__stage">
          {benefits.map((b) => (
            <article key={b.short} className="about__item">
              <div className="about__media">
                {b.image ? (
                  <img src={b.image} alt={b.alt} loading="lazy" decoding="async" />
                ) : (
                  <ImagePlaceholder label={b.placeholder.label} spec={b.placeholder.spec} />
                )}
              </div>
              <div className="about__text">
                <h3 className="about__item-title display">{b.title}</h3>
                <p className="about__item-text">{b.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
