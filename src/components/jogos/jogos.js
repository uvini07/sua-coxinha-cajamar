// Os jogos da casa. O Sr. Coxinha é uma rota da SPA (/jogo-coxinha); o Duelo é
// outro app, copiado já pronto para public/duelo (veja o README), então abre
// com link normal, sem passar pelo roteador.
export const JOGOS = [
  {
    id: 'coxinha',
    nome: 'Sr. Coxinha',
    chamada: 'Pegue as coxinhas, fuja do brócolis',
    href: '/jogo-coxinha',
    spa: true,
    imagens: ['/assets/produtos/mascote.webp'],
  },
  {
    id: 'duelo',
    nome: 'Duelo Presidencial',
    chamada: 'Luta de plataforma: jogue o rival pra fora da ilha',
    href: '/duelo',
    spa: false,
    imagens: ['/duelo/sprites/bolso-portrait.webp', '/duelo/sprites/lula-portrait.webp'],
  },
]

// Clique num jogo: o da SPA troca de rota sem recarregar; o outro segue o link.
export const abrirJogo = (jogo, navegar) => (e) => {
  if (!jogo.spa || !navegar || e.metaKey || e.ctrlKey || e.shiftKey) return
  e.preventDefault()
  navegar(jogo.href)
}
