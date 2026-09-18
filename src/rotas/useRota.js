import { useCallback, useEffect, useState } from 'react'

// Roteador mínimo: a franquia é o primeiro pedaço da URL (/cajamar, /jundiai...).
// Sem dependência externa — a aplicação tem uma página por loja, mais a raiz.
const lerCaminho = () => {
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
