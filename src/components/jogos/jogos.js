// Os jogos da casa. O fliperama é um app à parte, copiado já pronto para public/
// (veja o README), então abre com link normal, sem o roteador.
// `naRaiz: false` esconde um jogo da página inicial (sem loja) e o mantém nas lojas.
export const JOGOS = [
  {
    id: 'coxinha',
    nome: 'Coxinildo',
    chamada: 'Pega Pega, Coxinha Ninja e Coxinha Pong',
    href: '/fliperama',
    spa: false,
    imagens: ['/assets/produtos/mascote.webp'],
  },
]

// Os jogos de cada página: na raiz (sem loja) só os marcados para ela.
export const jogosDa = (loja) => (loja ? JOGOS : JOGOS.filter((j) => j.naRaiz !== false))

// Na página de uma loja, os jogos sabem de onde a pessoa veio (?loja=cajamar):
// o "voltar" volta para a loja e os pedidos vão para ela. Na raiz, sem nada.
export const linkDoJogo = (jogo, loja) => (loja ? `${jogo.href}?loja=${loja}` : jogo.href)

// Clique num jogo: o da SPA troca de rota sem recarregar; o outro segue o link.
export const abrirJogo = (jogo, navegar) => (e) => {
  if (!jogo.spa || !navegar || e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
  navegar(jogo.href)
}
