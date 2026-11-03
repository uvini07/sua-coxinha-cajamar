import { useCallback, useEffect, useState } from 'react'
import { existeLoja } from '../lojas/carregador.js'

// MODO LOJA ÚNICA (temporário): a raiz e as outras lojas levam para /cajamar.
// Para voltar ao normal (página de escolha da loja), troque para null
// e remova o redirecionamento de "/" em vercel.json.
export const LOJA_UNICA = 'cajamar'

// Roteador mínimo: a franquia é o primeiro pedaço da URL (/cajamar, /jundiai...).
// Sem dependência externa — a aplicação tem uma página por loja, mais a raiz.
const lerCaminho = () => {
  if (LOJA_UNICA) {
    const slug = window.location.pathname.split('/').filter(Boolean)[0] ?? null
    if (!slug || (slug !== LOJA_UNICA && existeLoja(slug))) {
      window.history.replaceState({}, '', '/' + LOJA_UNICA + window.location.search + window.location.hash)
    }
  }
  const partes = window.location.pathname.split('/').filter(Boolean)
  return { slug: partes[0] ?? null, resto: partes.slice(1) }
}

export function useRota() {
  const [rota, setRota] = useState(lerCaminho)

  useEffect(() => {
    const aoVoltar = () => setRota(lerCaminho())
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  const navegar = useCallback((caminho) => {
    window.history.pushState({}, '', caminho)
    setRota(lerCaminho())
    window.scrollTo(0, 0)
  }, [])

  return { ...rota, navegar }
}
