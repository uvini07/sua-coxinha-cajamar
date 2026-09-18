import { useState } from 'react'
import { useLoja } from '../../context/LojaContext.js'
import { priceText } from '../../lib/preco.js'
import '../../styles/sections/molhos.css'

// As quatro garrafas ficam sempre na tela, lado a lado. A que recebe o mouse,
// o toque ou o foco cresce e acende; as outras recuam.
export default function MolhosSection() {
  const { molhos, molhoPrice } = useLoja()
  const [escolhido, setEscolhido] = useState(0)
  const [sobre, setSobre] = useState(null)

  const ativo = sobre ?? escolhido
  const molho = molhos[ativo]

  return (
    <section id="molhos" className="molhos" data-theme="dark" aria-labelledby="molhos-title">
      <div className="molhos__inner">
        <header className="molhos__head" data-reveal>
          <p className="molhos__kicker">Molhos artesanais</p>
          <h2 id="molhos-title" className="molhos__title display">
            Sabores que <span>transformam</span>
          </h2>
        </header>

        <ul className="molhos__prateleira" data-reveal onMouseLeave={() => setSobre(null)}>
          {molhos.map((m, i) => (
            <li key={m.id} className={`molhos__slot${i === ativo ? ' is-ativa' : ''}`}>
              <button
                type="button"
                className={`garrafa${m.quente ? ' garrafa--quente' : ''}`}
                onClick={() => setEscolhido(i)}
                onMouseEnter={() => setSobre(i)}
                onFocus={() => setSobre(i)}
                onBlur={() => setSobre(null)}
                aria-pressed={i === ativo}
              >
                <span className="garrafa__chao" aria-hidden="true" />
                <img src={m.image} alt={m.alt} loading="lazy" decoding="async" />
                <span className="garrafa__nome">
                  {m.name} <strong>{m.highlight}</strong>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="molhos__ficha" aria-live="polite" data-reveal>
          <div key={molho.id} className="molhos__cartao">
            <p className={`molhos__nome${molho.quente ? ' is-quente' : ''}`}>
              {molho.name} <strong>{molho.highlight}</strong>
            </p>
            <p className={`molhos__ardencia${molho.quente ? ' is-quente' : ''}`}>
              <span className="sr-only">Nível de ardência: {molho.level} de 5</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pimenta key={n} acesa={n <= molho.level} />
              ))}
            </p>
            <p className="molhos__texto">{molho.text}</p>
            <p className="molhos__combina">
              <span>Combina com</span> {molho.combina}
            </p>
          </div>

          <p className="molhos__preco">
            <span>250g</span>
            {priceText(molhoPrice)}
          </p>
        </div>
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
