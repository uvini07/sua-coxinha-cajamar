import { useEffect, useState } from 'react'
import { EVENTO_ABRIR, lerConsentimento, salvarConsentimento } from '../analytics/consentimento.js'
import '../styles/aviso-cookies.css'

// Aviso de cookies. Aparece na primeira visita e sempre que o link "Cookies"
// do rodapé pedir. "Recusar" vale tanto quanto "Aceitar": mesmo tamanho, mesmo peso.
export default function AvisoCookies({ navegar }) {
  const [aberto, setAberto] = useState(() => !lerConsentimento())
  const [detalhes, setDetalhes] = useState(false)
  const [estatisticas, setEstatisticas] = useState(() => lerConsentimento()?.estatisticas ?? false)

  useEffect(() => {
    const abrir = () => {
      setEstatisticas(lerConsentimento()?.estatisticas ?? false)
      setDetalhes(true)
      setAberto(true)
    }
    window.addEventListener(EVENTO_ABRIR, abrir)
    return () => window.removeEventListener(EVENTO_ABRIR, abrir)
  }, [])

  if (!aberto) return null

  const escolher = (valor) => {
    salvarConsentimento({ estatisticas: valor })
    setAberto(false)
  }

  const verPolitica = (e) => {
    e.preventDefault()
    navegar('/cookies')
  }

  return (
    <section className="cookies" role="dialog" aria-modal="false" aria-labelledby="cookies-titulo">
      <h2 id="cookies-titulo" className="cookies__titulo">Cookies 🍪</h2>
      <p className="cookies__texto">
        Usamos cookies essenciais para o site funcionar e, se você permitir, cookies de estatística (Google Analytics)
        para entender como o site é usado em cada loja. Nada de anúncios.{' '}
        <a href="/cookies" onClick={verPolitica}>Saiba mais</a>
      </p>

      {detalhes && (
        <ul className="cookies__lista">
          <li>
            <label className="cookies__opcao">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Essenciais</strong> — guardam sua escolha de cookies e o login do painel. Sempre ligados.
              </span>
            </label>
          </li>
          <li>
            <label className="cookies__opcao">
              <input type="checkbox" checked={estatisticas} onChange={(e) => setEstatisticas(e.target.checked)} />
              <span>
                <strong>Estatísticas</strong> — Google Analytics: páginas vistas e cliques nos botões de pedido, sem
                identificar você.
              </span>
            </label>
          </li>
        </ul>
      )}

      <div className="cookies__acoes">
        {detalhes ? (
          <button type="button" className="cookies__btn cookies__btn--forte" onClick={() => escolher(estatisticas)}>
            Salvar escolha
          </button>
        ) : (
          <>
            <button type="button" className="cookies__btn" onClick={() => escolher(false)}>
              Recusar
            </button>
            <button type="button" className="cookies__btn cookies__btn--forte" onClick={() => escolher(true)}>
              Aceitar
            </button>
          </>
        )}
        {!detalhes && (
          <button type="button" className="cookies__link" onClick={() => setDetalhes(true)}>
            Personalizar
          </button>
        )}
      </div>
    </section>
  )
}
