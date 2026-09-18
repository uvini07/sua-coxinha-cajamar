import { useCallback } from 'react'
import { useRota } from './rotas/useRota.js'
import { existeLoja } from './lojas/carregador.js'
import LojaProvider from './components/LojaProvider.jsx'
import LojaPagina from './paginas/LojaPagina.jsx'
import EscolhaLoja from './paginas/EscolhaLoja.jsx'
import NaoEncontrada from './paginas/NaoEncontrada.jsx'

// Uma plataforma, várias lojas: a franquia é o primeiro pedaço da URL.
//   /            -> escolha da loja
//   /cajamar     -> loja de Cajamar
//   /naoexiste   -> aviso de loja não encontrada
export default function App() {
  const { slug, navegar } = useRota()
  const irParaRaiz = useCallback(() => navegar('/'), [navegar])

  if (!slug) return <EscolhaLoja navegar={navegar} />
  if (!existeLoja(slug)) return <NaoEncontrada slug={slug} navegar={navegar} />

  return (
    <LojaProvider slug={slug} aoFalhar={irParaRaiz}>
      <LojaPagina />
    </LojaProvider>
  )
}
