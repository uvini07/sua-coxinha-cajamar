import { useCallback } from 'react'
import { useRota } from './rotas/useRota.js'
import { existeLoja } from './lojas/carregador.js'

import LojaProvider from './components/LojaProvider.jsx'
import LojaPagina from './paginas/LojaPagina.jsx'
import EscolhaLoja from './paginas/EscolhaLoja.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

import CoxinhaGame from './paginas/CoxinhaGame/CoxinhaGame.jsx'


// Uma plataforma, várias lojas:
//   /                -> escolha da loja
//   /cajamar         -> loja de Cajamar
//   /jogo-coxinha    -> tela do jogo
//   /naoexiste       -> loja não encontrada
export default function App() {
  const { slug, navegar } = useRota()

  const irParaRaiz = useCallback(
    () => navegar('/'),
    [navegar]
  )

  // Página inicial
  if (!slug) {
    return <EscolhaLoja navegar={navegar} />
  }

  // ROTA ESPECIAL DO JOGO
  // Ela precisa vir ANTES de existeLoja(slug)
  if (slug === 'jogo-coxinha') {
    return <CoxinhaGame navegar={navegar} />
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
      <LojaPagina />
    </LojaProvider>
  )
}