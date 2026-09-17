import { useRef, useState } from 'react'
import { molhos } from '../../data/molhos.js'
import '../../styles/sections/molhos.css'

// Carrossel dos molhos: a garrafa escolhida fica grande no centro e as outras
// ficam menores ao lado. Tocar ou clicar em uma delas traz a garrafa para o meio.
export default function MolhosSection() {
  const [ativo, setAtivo] = useState(0)
  const toqueX = useRef(null)

  // Distância até a garrafa em destaque, dando a volta na lista (-2, -1, 0, 1...).
  const deslocamento = (i) => {
    const total = molhos.length
    let off = i - ativo
    if (off > total / 2) off -= total
    if (off < -total / 2) off += total
    return off
  }

  const girar = (passo) => setAtivo((a) => (a + passo + molhos.length) % molhos.length)

  const aoTeclar = (e) => {
    if (e.key === 'ArrowRight') girar(1)
    if (e.key === 'ArrowLeft') girar(-1)
  }

  const inicioToque = (e) => (toqueX.current = e.changedTouches[0].clientX)
  const fimToque = (e) => {
    if (toqueX.current === null) return
    const d = e.changedTouches[0].clientX - toqueX.current
    if (Math.abs(d) > 45) girar(d < 0 ? 1 : -1)
    toqueX.current = null
  }

  const atual = molhos[ativo]

  return (
    <section id="molhos" className="molhos" data-theme="dark" aria-labelledby="molhos-title">
      <div className="molhos__inner">
        <header className="molhos__head" data-reveal>
          <p className="molhos__kicker">Molhos artesanais</p>
          <h2 id="molhos-title" className="molhos__title display">
            Sabores que <span>transformam</span>
          </h2>
        </header>

        <div
          className="molhos__palco"
          role="group"
          aria-label="Molhos da Sua Coxinha"
          tabIndex={0}
          onKeyDown={aoTeclar}
          onTouchStart={inicioToque}
          onTouchEnd={fimToque}
          data-reveal
        >
          <button type="button" className="molhos__seta molhos__seta--esq" onClick={() => girar(-1)} aria-label="Molho anterior">
            <Seta />
          </button>

          <ul className="molhos__trilho">
            {molhos.map((m, i) => {
              const off = deslocamento(i)
              const centro = off === 0
              return (
                <li key={m.id} className="molhos__slot" style={{ '--off': off, '--dist': Math.abs(off) }}>
                  <button
                    type="button"
                    className={`garrafa${centro ? ' is-ativa' : ''}${m.quente ? ' garrafa--quente' : ''}`}
                    onClick={() => setAtivo(i)}
                    aria-label={centro ? undefined : `Ver ${m.name} ${m.highlight}`}
                    aria-current={centro ? 'true' : undefined}
                    tabIndex={centro ? -1 : 0}
                  >
                    <img src={m.image} alt={centro ? m.alt : ''} loading="lazy" decoding="async" />
                  </button>
                </li>
              )
            })}
          </ul>

          <button type="button" className="molhos__seta molhos__seta--dir" onClick={() => girar(1)} aria-label="Próximo molho">
            <Seta />
          </button>
        </div>

        <div className="molhos__ficha" aria-live="polite" data-reveal>
          <p className={`molhos__nome${atual.quente ? ' is-quente' : ''}`}>
            {atual.name} <strong>{atual.highlight}</strong>
          </p>
          <p className={`molhos__ardencia${atual.quente ? ' is-quente' : ''}`}>
            <span className="sr-only">Nível de ardência: {atual.level} de 5</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pimenta key={n} acesa={n <= atual.level} />
            ))}
          </p>
          <p className="molhos__texto">{atual.text}</p>
          <p className="molhos__combina">
            <span>Combina com</span> {atual.combina}
          </p>

          <ol className="molhos__pontos">
            {molhos.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={`molhos__ponto${i === ativo ? ' is-ativo' : ''}`}
                  onClick={() => setAtivo(i)}
                  aria-label={`${m.name} ${m.highlight}`}
                  aria-current={i === ativo ? 'true' : undefined}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Seta() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Pimenta({ acesa }) {
  return (
    <svg className={`pimenta${acesa ? ' pimenta--acesa' : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.8 3.2c.4 1 1.3 1.7 2.4 1.9l1 .2-.3 1.9-1-.2c-.9-.2-1.7-.6-2.3-1.2-.2.6-.5 1.1-.9 1.6 1.4 1 2.3 2.7 2.3 4.5 0 3.4-2.9 6.3-6.6 6.9-2.6.4-4.7-.9-5-3-.3-2 1.3-3.8 3.7-4.1 1-.1 1.9.1 2.6.5-.3-2.6 1-5.1 3.3-6.4-.1-.4-.2-.9-.2-1.4l1-.2Z" />
    </svg>
  )
}
