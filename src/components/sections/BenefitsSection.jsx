import { useLoja } from '../../context/LojaContext.js'
import ImagePlaceholder from '../ImagePlaceholder.jsx'
import '../../styles/sections/benefits.css'

export default function BenefitsSection() {
  const loja = useLoja()
  const benefits = loja.benefits

  return (
    <section id="sobre" className="about" data-theme="dark" aria-labelledby="sobre-title">
      <div className="about__inner">
        <h2 id="sobre-title" className="about__title display" data-reveal>
          {loja.textos.sobreTitulo ?? 'Pra todo tipo de fome.'}
        </h2>

        <ul className="about__grid">
          {benefits.map((b) => (
            <li key={b.short} className="about__card" data-reveal>
              <div className={`about__media${b.photo ? ' about__media--photo' : ''}`}>
                {b.image ? (
                  <img src={b.image} alt={b.alt} loading="lazy" decoding="async" />
                ) : (
                  <ImagePlaceholder label={b.placeholder.label} spec={b.placeholder.spec} />
                )}
              </div>
              <div className="about__text">
                <h3 className="about__card-title">{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
