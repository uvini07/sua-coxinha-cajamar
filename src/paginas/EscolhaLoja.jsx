import { lojasResumo } from '../lojas/carregador.js'
import Logo from '../components/Logo.jsx'
import '../styles/paginas/escolha.css'

// Raiz do site (suacoxinha.com.br): lista as franquias e leva para a página de cada uma.
// Cresce sozinha: toda loja cadastrada aparece aqui.
export default function EscolhaLoja({ navegar, aviso = null }) {
  const abrir = (slug) => (e) => {
    e.preventDefault()
    navegar(`/${slug}`)
  }

  return (
    <main className="escolha">
      <header className="escolha__head">
        <Logo className="escolha__logo" />
        {aviso && <p className="escolha__aviso">{aviso}</p>}
        <h1 className="escolha__title display">Escolha a sua loja</h1>
        <p className="escolha__sub">Cada loja tem o seu cardápio, os seus preços e o seu WhatsApp.</p>
      </header>

      <ul className="escolha__lista">
        {lojasResumo.map((loja) => (
          <li key={loja.slug}>
            <a
              className="escolha__card"
              href={`/${loja.slug}`}
              onClick={abrir(loja.slug)}
              style={{ '--cor-loja': loja.tema?.marca ?? 'var(--marca)' }}
            >
              <span className="escolha__cidade">{loja.unit}</span>
              <span className="escolha__endereco">
                {loja.endereco}
                {loja.bairro ? <>, {loja.bairro}</> : null}
              </span>
              <span className="escolha__ir" aria-hidden="true">
                Ver a loja
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="escolha__rodape">
        <a href="https://franquia.suacoxinha.com.br" target="_blank" rel="noopener noreferrer">
          Seja um franqueado
        </a>
      </footer>
    </main>
  )
}
