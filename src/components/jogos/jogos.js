// Os jogos da casa. Os dois são apps à parte, copiados já prontos para public/
// (fliperama e duelo, veja o README), então abrem com link normal, sem o roteador.
export const JOGOS = [
  {
    id: 'coxinha',
    nome: 'Coxinildo',
    chamada: 'Pega Pega, Coxinha Ninja e Coxinha Pong',
    href: '/fliperama',
    spa: false,
    // Por enquanto a raiz (página inicial) mostra só o Duelo; nas lojas aparecem os dois.
    naRaiz: false,
    imagens: ['/assets/produtos/mascote.webp'],
  },
  {
    id: 'duelo',
    nome: 'Duelo de Titãs: Eleição',
    chamada: 'Luta de plataforma: jogue o rival pra fora da ilha',
    href: '/duelo',
    spa: false,
    // capa montada com os dois retratos frente a frente (public/assets/jogos)
    imagens: ['/assets/jogos/duelo-capa.webp'],
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
