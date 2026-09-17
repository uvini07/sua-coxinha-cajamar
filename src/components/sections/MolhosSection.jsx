import { useState } from 'react'
import { molhos } from '../../data/molhos.js'
import '../../styles/sections/molhos.css'

// Seção dos molhos: cada garrafa reage ao mouse com uma inclinação 3D e,
// no toque ou clique, abre a dica de com o que ela combina.
export default function MolhosSection() {
  const [aberto, setAberto] = useState(null)

  const inclinar = (e) => {
    // Só com mouse: no toque a inclinação atrapalharia a rolagem.
    if (e.pointerType !== 'mouse') return
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    card.style.setProperty('--rx', `${(0.5 - y) * 14}deg`)
    card.style.setProperty('--ry', `${(x - 0.5) * 18}deg`)
    card.style.setProperty('--mx', `${x * 100}%`)
    card.style.setProperty('--my', `${y * 100}%`)
  }

  const endireitar = (e) => {
    const card = e.currentTarget
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  return (
    <section id="molhos" className="molhos" data-theme="dark" aria-labelledby="molhos-title">
      <div className="molhos__inner">
        <header className="molhos__head" data-reveal>
          <p className="molhos__kicker">Molhos artesanais</p>
          <h2 id="molhos-title" className="molhos__title display">
            Sabores que <span>transformam</span>
          </h2>
          <p className="molhos__sub">
            Ingredientes selecionados e o equilíbrio certo entre cremosidade e ardência. Passe o mouse ou toque na garrafa para
            conhecer cada uma.
          </p>
        </header>

        <ul className="molhos__grid">
          {molhos.map((m) => (
            <li key={m.id} className="molhos__item" data-reveal>
              <button
                type="button"
                className={`molho${aberto === m.id ? ' is-aberta' : ''}${m.quente ? ' molho--quente' : ''}`}
                onPointerMove={inclinar}
                onPointerLeave={endireitar}
                onClick={() => setAberto((a) => (a === m.id ? null : m.id))}
                aria-expanded={aberto === m.id}
                aria-controls={`molho-${m.id}`}
              >
                <span className="molho__cena">
                  <span className="molho__brilho" aria-hidden="true" />
                  <img className="molho__foto" src={m.image} alt={m.alt} loading="lazy" decoding="async" />
                  <span className="molho__sombra" aria-hidden="true" />
                </span>

                <span className="molho__info">
                  <span className="molho__nome">
                    {m.name} <strong>{m.highlight}</strong>
                  </span>
                  <span className="molho__ardencia">
                    <span className="sr-only">Nível de ardência: {m.level} de 5</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Pimenta key={n} acesa={n <= m.level} />
                    ))}
                  </span>
                  <span className="molho__texto">{m.text}</span>
                </span>

                <span id={`molho-${m.id}`} className="molho__extra">
                  <span className="molho__extra-label">Combina com</span>
                  <span className="molho__extra-texto">{m.combina}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pimenta({ acesa }) {
  return (
    <svg className={`pimenta${acesa ? ' pimenta--acesa' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.8 3.2c.4 1 1.3 1.7 2.4 1.9l1 .2-.3 1.9-1-.2c-.9-.2-1.7-.6-2.3-1.2-.2.6-.5 1.1-.9 1.6 1.4 1 2.3 2.7 2.3 4.5 0 3.4-2.9 6.3-6.6 6.9-2.6.4-4.7-.9-5-3-.3-2 1.3-3.8 3.7-4.1 1-.1 1.9.1 2.6.5-.3-2.6 1-5.1 3.3-6.4-.1-.4-.2-.9-.2-1.4l1-.2Z" />
    </svg>
  )
}
