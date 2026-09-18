// Plataformas de pedido da loja (iFood, 99Food). Cada loja tem os seus links.
const CATALOGO_PLATAFORMAS = [
  { id: 'ifood', name: 'iFood' },
  { id: 'food99', name: '99Food' },
]

export function montarPlataformas(links = {}) {
  return CATALOGO_PLATAFORMAS.filter((p) => links[p.id]).map((p) => ({ ...p, url: links[p.id] }))
}

// Link de um produto na plataforma: link exato do produto, senão a página da loja.
export const linkPedido = (plataforma, item) => (item && item[plataforma.id]) || plataforma.url
