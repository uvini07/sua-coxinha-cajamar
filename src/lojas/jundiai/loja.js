// CONFIGURAÇÃO DA LOJA DE JUNDIAÍ
// Exemplo de segunda franquia: preços, contatos, horários e cores próprios.
// ATENÇÃO: os dados abaixo são de demonstração — troque pelos reais antes de divulgar.

export default {
  slug: 'jundiai',
  brand: 'Sua Coxinha',
  unit: 'Jundiaí',

  address: {
    street: 'Av. 9 de Julho, 1200',
    district: 'Centro',
    city: 'Jundiaí – SP',
    cep: '13201-000',
  },

  hours: [
    { days: 'Segunda a sábado', time: '9h às 21h' },
    { days: 'Domingo e feriados', time: 'fechado' },
  ],

  // Domingo (0) fora da lista: a loja não abre, e o sistema já avisa na retirada.
  openingHours: {
    1: [9, 21],
    2: [9, 21],
    3: [9, 21],
    4: [9, 21],
    5: [9, 21],
    6: [9, 21],
  },

  feriadosLocais: [],
  prepMinutes: 40,

  phone: '(11) 90000-0000',
  whatsapp: '5511900000000',

  links: {
    maps: 'https://www.google.com/maps/search/?api=1&query=Sua+Coxinha+Jundiai',
    instagram: '',
    franchise: 'https://franquia.suacoxinha.com.br',
    ifood: '',
    food99: '',
  },

  instagramHandle: '',

  entrega: {
    propria: true,
    taxa: 700,
    tempo: 'até 50 min',
    observacao: 'Entrega própria no Centro e bairros vizinhos. Pedido pelo WhatsApp é só retirada na loja.',
  },

  // Esta loja não usa a seção de molhos (não tem a linha no estoque).
  secoes: ['abertura', 'cardapio', 'sobre', 'pedido'],

  seo: {
    title: 'Sua Coxinha Jundiaí | Coxinhas e churros',
    description: 'Coxinhas, churros gourmet e kits para festa em Jundiaí. Peça pelo WhatsApp e retire na loja.',
    shareDescription: 'Cardápio da Sua Coxinha em Jundiaí. Peça pelo WhatsApp e retire na loja.',
  },

  textos: {
    heroLead: 'Da coxinha G de 250g ao churros gourmet. Na loja em Jundiaí, no Centro.',
    pedidoTitulo: 'Bateu a fome?',
    pedidoSub: 'Monte seu pedido pelo WhatsApp e retire na loja. Entrega própria no Centro.',
    sobreTitulo: 'Feita na hora, do nosso jeito.',
  },

  disclaimer: 'Imagens meramente ilustrativas. Coxinhas contêm glúten e lactose.',

  fotoLoja: null,

  benefits: [
    {
      short: 'Tamanhos',
      title: 'Do 9g ao 250g.',
      text: 'Da mini coxinha à coxinha G: tem tamanho pro lanche, pra festa e pra fome grande.',
      image: '/assets/produtos/coxinha-g-sombra.webp',
      alt: 'Coxinha G cortada ao meio',
    },
    {
      short: 'Festas',
      title: 'Kits para festa.',
      text: 'Caixas de mini salgados com até 4 sabores à escolha.',
      image: '/assets/produtos/cesta-mini-coxinhas.webp',
      alt: 'Cesta cheia de mini coxinhas',
    },
    {
      short: 'Entrega',
      title: 'Entrega no Centro.',
      text: 'Entrega própria no Centro e bairros vizinhos, em até 50 minutos.',
      image: '/assets/produtos/coxinha-meia.webp',
      alt: 'Metade de uma coxinha com recheio cremoso',
    },
  ],
}
