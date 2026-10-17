import { useEffect, useRef, useState } from 'react'
import { JOGOS } from './jogos.js'
import CartaoJogo from './CartaoJogo.jsx'
import '../../styles/jogos.css'

// Bolinha flutuante com o mascote: abre um balão com os jogos.
// `acimaDaBarra` sobe a bolinha no celular, onde a loja tem a barra de pedido no rodapé.
export default function BolinhaJogos({ navegar, acimaDaBarra = false }) {
  const [aberta, setAberta] = useState(false)
  const raiz = useRef(null)

  useEffect(() => {
    if (!aberta) return
    const fora = (e) => !raiz.current?.contains(e.target) && setAberta(false)
    const esc = (e) => e.key === 'Escape' && setAberta(false)
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', esc)
    }
  }, [aberta])

  return (
    <div ref={raiz} className={`bolinha-jogos${acimaDaBarra ? ' bolinha-jogos--barra' : ''}`} data-aberta={aberta}>
      {aberta && (
        <div className="bolinha-jogos__balao" id="bolinha-jogos-balao" role="dialog" aria-label="Jogos da Sua Coxinha">
          <p className="bolinha-jogos__titulo">Bora jogar?</p>
          {JOGOS.map((j) => (
            <CartaoJogo key={j.id} jogo={j} navegar={navegar} compacto />
          ))}
        </div>
      )}
      <button
        type="button"
        className="bolinha-jogos__botao"
        onClick={() => setAberta((v) => !v)}
        aria-expanded={aberta}
        aria-controls="bolinha-jogos-balao"
        aria-label={aberta ? 'Fechar jogos' : 'Abrir jogos'}
      >
        <img src="/assets/produtos/mascote.webp" alt="" />
        <span className="bolinha-jogos__selo" aria-hidden="true">Jogar</span>
      </button>
    </div>
  )
}
