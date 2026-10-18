import { JOGOS } from './jogos.js'
import CartaoJogo from './CartaoJogo.jsx'
import '../../styles/jogos.css'

// Bloco "Hora do intervalo": os jogos da casa, na raiz e no fim de cada loja.
export default function SecaoJogos({ navegar, className = '', children = null }) {
  return (
    <section id="jogos" className={`jogos ${className}`} aria-labelledby="jogos-titulo">
      <div className="jogos__inner">
        <p className="jogos__olho">Esperando a coxinha?</p>
        <h2 id="jogos-titulo" className="jogos__titulo display">Jogue enquanto ela chega</h2>
        <p className="jogos__sub">Grátis, direto no navegador. Funciona no celular e no computador.</p>
        <ul className="jogos__lista">
          {JOGOS.map((j) => (
            <li key={j.id}>
              <CartaoJogo jogo={j} navegar={navegar} />
            </li>
          ))}
        </ul>
        {children}
      </div>
    </section>
  )
}
