import { churrosSteps } from '../../data/products.js'
import Price from '../Price.jsx'
import '../../styles/scenes/churros.css'

const floats = [
  { src: '/assets/produtos/mini-churros.webp', className: 'ch__float--a' },
  { src: '/assets/produtos/molhos-doces.webp', className: 'ch__float--b' },
  { src: '/assets/produtos/mini-churros.webp', className: 'ch__float--c' },
]

export default function ChurrosScene() {
  return (
    <section id="churros" className="scene scene--churros" aria-labelledby="churros-title">
      <div className="ch__floats" aria-hidden="true">
        {floats.map((f) => (
          <img key={f.className} className={`ch__float ${f.className}`} src={f.src} alt="" loading="lazy" decoding="async" />
        ))}
      </div>

      <div className="scene__inner ch">
        <div className="ch__visual">
          <div className="ch__product">
            <img
              src="/assets/produtos/churros-gourmet.webp"
              alt="Três churros gourmet: um com doce de leite e amendoim, outro com granulado e outro com confete"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="ch__copy">
          <h2 id="churros-title" className="ch__title display h2">
            <span className="line">
              <span>Churros</span>
            </span>
            <span className="line">
              <span>do seu jeito.</span>
            </span>
          </h2>

          <p className="ch__price">
            <span>Churros Gourmet</span>
            <Price cents={1290} />
          </p>

          <ol className="ch__steps">
            {churrosSteps.map((step, i) => (
              <li key={step.title} className="ch__step">
                <p className="ch__step-n">Passo {i + 1}</p>
                <h3 className="ch__step-title">{step.title}</h3>
                <ul className="chips">
                  {step.options.map((option) => (
                    <li key={option} className="chip">
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
