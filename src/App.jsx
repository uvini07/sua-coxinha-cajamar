import { useCallback, useEffect } from 'react'
import { useRota } from './rotas/useRota.js'
import { definirLoja, iniciarAnalytics, rastrearPagina } from './analytics/ga.js'

import LojaProvider from './components/LojaProvider.jsx'
import AvisoCookies from './components/AvisoCookies.jsx'
// MODO TEMPORÁRIO (só Cajamar): a raiz "/" e "/cajamar" mostram a loja de Cajamar.
// Painel, jogo, escolha de loja e as outras franquias estão desligados.
// A versão completa está guardada em src/App.completo.bkp.jsx: para religar,
// copie esse arquivo de volta por cima deste (App.jsx).
import LojaPagina from './paginas/LojaPagina.jsx'
// DESLIGADO (temporário): escolha de loja e página de loja não encontrada.
// import EscolhaLoja from './paginas/EscolhaLoja.jsx'
// import NaoEncontrada from './paginas/NaoEncontrada.jsx'
import PoliticaCookies from './paginas/PoliticaCookies.jsx'

// DESLIGADO (temporário): jogo.
// import CoxinhaGame from './paginas/CoxinhaGame/CoxinhaGame.jsx'

// DESLIGADO (temporário): painel.
// const Painel = lazy(() => import('./paginas/Painel/Painel.jsx'))

iniciarAnalytics()

// Única loja no ar por enquanto.
const LOJA_UNICA = 'cajamar'

// Modo temporário (versão completa em App.completo.bkp.jsx):
//   /                -> loja de Cajamar
//   /cajamar         -> loja de Cajamar
//   /cookies         -> política de cookies
//   qualquer outro   -> loja de Cajamar
export default function App() {
  const { slug, navegar } = useRota()

  const irParaRaiz = useCallback(() => navegar('/'), [navegar])

  useEffect(() => {
    definirLoja(slug === 'cookies' ? null : LOJA_UNICA, slug === 'cookies' ? null : LOJA_UNICA)
    rastrearPagina()
  }, [slug])

  return (
    <>
      <Pagina slug={slug} navegar={navegar} irParaRaiz={irParaRaiz} />
      <AvisoCookies navegar={navegar} />
    </>
  )
}

function Pagina({ slug, navegar, irParaRaiz }) {
  // Política de cookies continua no ar (o aviso de cookies aponta para ela).
  if (slug === 'cookies') {
    return <PoliticaCookies navegar={navegar} />
  }

  // Qualquer outro endereço ("/", "/cajamar", "/painel", outras lojas...) abre Cajamar.
  return (
    <LojaProvider slug={LOJA_UNICA} aoFalhar={irParaRaiz}>
      <LojaPagina navegar={navegar} />
    </LojaProvider>
  )
}
