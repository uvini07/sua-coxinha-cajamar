// CONFIGURAÇÃO DA LOJA DE CAJAMAR
// Cada franquia tem uma pasta em src/lojas/<slug>/ com estes três arquivos:
//   loja.js      → estes dados (endereço, contatos, horários, SEO, seções)
//   tema.js      → cores, logo e tipografia
//   produtos.js  → catálogo, preços e sabores
// Mexer aqui muda só Cajamar. A lista de campos possíveis está em src/lojas/_schema.js.

export default {
  // Aparece na URL: suacoxinha.com.br/cajamar
  slug: 'cajamar',
  brand: 'Sua Coxinha',
  unit: 'Cajamar',

  address: {
    street: 'Av. Ten. Marques, 4511 – Sala 3',
    district: 'Portal dos Ipês',
    city: 'Cajamar – SP',
    cep: '07790-000',
  },

  // CONFIRMAR: horários vieram da bio do Instagram da loja.
  hours: [
    { days: 'Segunda a sábado', time: '7h às 22h' },
    { days: 'Domingo e feriados', time: '14h às 22h' },
  ],

  // Horário de funcionamento por dia da semana (0 = domingo), em horas.
  // Usado para conferir o horário de retirada escolhido pelo cliente.
  openingHours: {
    0: [14, 22],
    1: [7, 22],
    2: [7, 22],
    3: [7, 22],
    4: [7, 22],
    5: [7, 22],
    6: [7, 22],
  },

  // Em feriados a loja funciona como domingo. Os feriados nacionais são calculados
  // sozinhos; aqui entram os da cidade e os dias de horário diferente (AAAA-MM-DD).
  feriadosLocais: [],

  // CONFIRMAR: prazo de preparo. O cliente só pode marcar a retirada depois desse tempo.
  prepMinutes: 45,

  // WhatsApp confirmado pelo letreiro da loja.
  phone: '(11) 97640-3209',
  whatsapp: '5511976403209',

  links: {
    maps: 'https://www.google.com/maps/place/sua+coxinha+cajamar/data=!4m2!3m1!1s0x94cf1db9a8e4c5b3:0x6633947b0099e086',
    instagram: 'https://www.instagram.com/suacoxinhacajamar/',
    franchise: 'https://franquia.suacoxinha.com.br',
    ifood: 'https://www.ifood.com.br/delivery/cajamar-sp/sua-coxinha-cajamar-vila-poupanca/5ce23c05-ea29-4fb3-99d3-2ac2b289fb57',
    // Link de compartilhamento da loja no app 99Food.
    food99: 'https://oia.99app.com/dlp9/xeuFH9',
  },

  instagramHandle: '@suacoxinhacajamar',

  // Entrega é pelos aplicativos; o pedido pelo WhatsApp é só retirada na loja.
  entrega: {
    propria: false,
    taxa: null,
    tempo: null,
    observacao: 'Entrega pelo iFood e pelo 99Food. Pedido pelo WhatsApp é só retirada na loja.',
  },

  // Seções que aparecem nesta loja, na ordem da página.
  secoes: ['abertura', 'cardapio', 'molhos', 'sobre', 'pedido'],

  seo: {
    title: 'Sua Coxinha Cajamar | Coxinhas e churros',
    description:
      'Coxinhas de 9g a 250g, churros gourmet e mini churros recheados. Sua Coxinha em Cajamar: peça pelo iFood, pelo 99Food ou pelo WhatsApp com retirada na loja.',
    shareTitle: 'Sua Coxinha Cajamar | Coxinhas e churros',
    shareDescription:
      'Cardápio completo, do mini salgado à coxinha G. Peça pelo iFood, pelo 99Food ou pelo WhatsApp com retirada na loja.',
    shareImage: '/compartilhar.jpg',
    shareImageAlt: 'Logo da Sua Coxinha em fundo amarelo',
  },

  // Textos da loja
  textos: {
    heroLead: 'Da coxinha G de 250g ao copo de mini churros com cobertura. Na loja em Cajamar, no iFood ou no 99Food.',
    pedidoTitulo: 'Bateu a fome?',
    pedidoSub: 'Receba em casa pelo iFood ou 99Food. Ou monte seu pedido pelo WhatsApp e retire na loja.',
    sobreTitulo: 'Pra todo tipo de fome.',
  },

  disclaimer: 'Imagens meramente ilustrativas. Coxinhas contêm glúten e lactose.',

  // Foto da fachada usada na seção "Onde pedir".
  fotoLoja: { image: '/assets/loja/placa.webp', alt: 'Placa redonda iluminada da Sua Coxinha, Coxinharia Gourmet, na frente da loja', caption: 'Fachada amarela, com o letreiro da Sua Coxinha.' },

  // Diferenciais da seção "Sobre".
  benefits: [
    {
      short: 'Tamanhos',
      title: 'Do 9g ao 250g.',
      text: 'Da mini coxinha da linha degust à coxinha G: tem tamanho pro lanche, pra festa e pra fome grande.',
      image: '/assets/produtos/coxinha-g-sombra.webp',
      alt: 'Coxinha G cortada ao meio',
    },
    {
      short: 'Sabores',
      title: 'Mais de 10 recheios.',
      text: 'Frango com Catupiry®, costela com requeijão, carne seca com queijo, calabresa, mini kibe e outros.',
      image: '/assets/produtos/coxinha-meia.webp',
      alt: 'Metade de uma coxinha com recheio cremoso',
    },
    {
      short: 'Festas',
      title: 'De 10 a 100 unidades.',
      text: 'Kits de mini salgados e de mini churros recheados para a sua festa.',
      image: '/assets/produtos/cesta-mini-coxinhas.webp',
      alt: 'Cesta cheia de mini coxinhas',
    },
    {
      short: 'Em casa',
      title: 'É só aquecer.',
      text: 'Mini coxinhas congeladas de 500g, prontas para o forno ou a airfryer.',
      image: '/assets/produtos/congelados.webp',
      alt: 'Caixa de mini coxinhas congeladas',
    },
    {
      short: 'Na loja',
      title: 'No iFood ou na loja.',
      text: 'Av. Ten. Marques, 4511, Portal dos Ipês, Cajamar.',
      image: '/assets/loja/fachada.webp',
      alt: 'Fachada amarela da loja Sua Coxinha em Cajamar, com o letreiro iluminado',
      photo: true,
    },
  ],
}
