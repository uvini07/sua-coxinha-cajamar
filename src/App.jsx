import { lazy, Suspense, useCallback, useEffect } from 'react'
import { useRota } from './rotas/useRota.js'
import { existeLoja } from './lojas/carregador.js'
import { definirLoja, iniciarAnalytics, rastrearPagina } from './analytics/ga.js'

import LojaProvider from './components/LojaProvider.jsx'
import AvisoCookies from './components/AvisoCookies.jsx'
import LojaPagina from './paginas/LojaPagina.jsx'
import EscolhaLoja from './paginas/EscolhaLoja.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'
import PoliticaCookies from './paginas/PoliticaCookies.jsx'

import CoxinhaGame from './paginas/CoxinhaGame/CoxinhaGame.jsx'

// O painel traz o Firebase junto: só é baixado por quem abre /painel.
const Painel = lazy(() => import('./paginas/Painel/Painel.jsx'))

iniciarAnalytics()

// Rotas que não são loja. Precisam vir ANTES de existeLoja(slug).
const ROTAS_FIXAS = ['jogo-coxinha', 'cookies', 'painel']

// Uma plataforma, várias lojas:
//   /                -> escolha da loja
//   /cajamar         -> loja de Cajamar
//   /jogo-coxinha    -> tela do jogo
//   /cookies         -> política de cookies
//   /painel          -> painel do franqueado (login com a conta do app)
//   /naoexiste       -> loja não encontrada
export default function App() {
  const { slug, navegar } = useRota()

  const irParaRaiz = useCallback(
    () => navegar('/'),
    [navegar]
  )

  // Uma visualização por troca de rota, marcada com a loja (ou "rede").
  // O painel não conta: é uso interno.
  useEffect(() => {
    if (slug === 'painel') return
    const loja = slug && !ROTAS_FIXAS.includes(slug) && existeLoja(slug) ? slug : null
    // a página inicial tem contador próprio no painel ('raiz', só o admin vê)
    definirLoja(loja, loja || (!slug ? 'raiz' : null))
    rastrearPagina()
  }, [slug])

  return (
    <>
      <Pagina slug={slug} navegar={navegar} irParaRaiz={irParaRaiz} />
      {slug !== 'painel' && <AvisoCookies navegar={navegar} />}
    </>
  )
}

function Pagina({ slug, navegar, irParaRaiz }) {
  // Página inicial
  if (!slug) {
    return <EscolhaLoja navegar={navegar} />
  }

  if (slug === 'jogo-coxinha') {
    return <CoxinhaGame navegar={navegar} />
  }

  if (slug === 'cookies') {
    return <PoliticaCookies navegar={navegar} />
  }

  if (slug === 'painel') {
    return (
      <Suspense fallback={null}>
        <Painel navegar={navegar} />
      </Suspense>
    )
  }

  // Loja inexistente
  if (!existeLoja(slug)) {
    return (
      <NaoEncontrada
        slug={slug}
        navegar={navegar}
      />
    )
  }

  // Loja encontrada
  return (
    <LojaProvider
      slug={slug}
      aoFalhar={irParaRaiz}
    >
      <LojaPagina navegar={navegar} />
    </LojaProvider>
  )
}
