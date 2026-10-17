// BASE DAS UNIDADES QUE USAM O CARDÁPIO E OS TEXTOS DE CAJAMAR
//
// Cada unidade só informa o que é dela: nome, endereço, WhatsApp e links.
// O resto (horários, seções, textos, diferenciais) vem de Cajamar, com o nome
// da cidade trocado. O cardápio vem de ../cajamar/produtos.js (ver produtos.js
// de cada unidade). Para uma unidade ter algo diferente, é só sobrescrever o
// campo no loja.js dela.

import cajamar from './cajamar/loja.js'

const telefone = (whatsapp) => {
  const n = whatsapp.replace(/^55/, '')
  return `(${n.slice(0, 2)}) ${n.slice(2, -4)}-${n.slice(-4)}`
}

export function criarUnidade({ slug, unit, cidade, address, whatsapp, ifood, food99 = '', maps, ...resto }) {
  // Sem a rua confirmada, o lugar da rua mostra o nome da unidade (o mapa acha pela busca).
  address = { ...address, street: address.street || `Sua Coxinha ${unit}` }
  const local = cidade || address.city.replace(/\s*–.*$/, '')
  const titulo = `Sua Coxinha ${unit} | Coxinhas e churros`
  const mapa =
    maps ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      [address.street.startsWith('Sua Coxinha') ? '' : 'Sua Coxinha', address.street, address.district, address.city].filter(Boolean).join(' '),
    )}`
  const ondeFica = [address.street, address.district, local].filter(Boolean).join(', ')

  return {
    ...cajamar,
    slug,
    unit,
    address,
    phone: telefone(whatsapp),
    whatsapp,
    links: { ...cajamar.links, maps: mapa, instagram: '', ifood, food99 },
    instagramHandle: '',
    seo: {
      ...cajamar.seo,
      title: titulo,
      shareTitle: titulo,
      description: `Coxinhas de 9g a 250g, churros gourmet e mini churros recheados. Sua Coxinha ${unit}, em ${local}: peça pelo iFood ou pelo WhatsApp com retirada na loja.`,
      shareDescription: 'Cardápio completo, do mini salgado à coxinha G. Peça pelo iFood ou pelo WhatsApp com retirada na loja.',
    },
    textos: {
      ...cajamar.textos,
      heroLead: `Da coxinha G de 250g ao copo de mini churros com cobertura. Na loja em ${local} ou no iFood.`,
      pedidoSub: 'Receba em casa pelo iFood. Ou monte seu pedido pelo WhatsApp e retire na loja.',
    },
    entrega: {
      ...cajamar.entrega,
      observacao: 'Entrega pelo iFood. Pedido pelo WhatsApp é só retirada na loja.',
    },
    // A foto da fachada é de Cajamar: as outras unidades ficam sem ela até ter a própria.
    fotoLoja: null,
    benefits: cajamar.benefits.map((b) =>
      b.short === 'Na loja'
        ? { short: 'Na loja', title: 'No iFood ou na loja.', text: ondeFica, image: '/assets/produtos/coxinha-g-sombra.webp', alt: 'Coxinha G cortada ao meio' }
        : b,
    ),
    ...resto,
  }
}
