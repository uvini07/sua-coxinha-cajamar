// Cardápio completo, transcrito do cardápio oficial (AF_COX_25_001_Novo_Cardapio.pdf).
// Para alterar o site, edite apenas este arquivo.
//
// LINKS DE PEDIDO POR PRODUTO
// Em cada produto, preencha `ifood` e `food99` com o link exato do produto na plataforma.
// Como pegar: abra a loja no navegador, clique no produto e copie o endereço da barra.
// Enquanto um link estiver vazio, o botão abre a página da loja (definida em store.js).
//
// PEDIDO PELO WHATSAPP
// `order` lista as escolhas do cliente no pop-up: `single` (uma opção) ou `multi` (várias).
// `maxFromVariant` usa o limite de sabores da quantidade escolhida (`flavors` em cada variante).
// `price` num grupo soma esse valor (em centavos) quando alguma opção é marcada.

const img = (name) => `/assets/produtos/${name}.webp`

// Sabores da coxinha. `image` é a foto do recheio (imagem ilustrativa), usada no seletor de sabores.
// Para trocar uma foto, substitua o arquivo em public/assets/sabores/ mantendo o nome.
// `onlyM: true` marca os sabores que existem apenas na coxinha M.
export const flavors = [
  { id: 'frango', name: 'Frango tradicional' },
  { id: 'catupiry', name: 'Frango com Catupiry®' },
  { id: 'costela', name: 'Costela bovina com requeijão' },
  { id: 'mussarela', name: 'Queijo mussarela' },
  { id: 'pizza', name: 'Pizza (presunto, queijo e orégano)' },
  { id: 'carne-seca', name: 'Carne seca com queijo' },
  { id: 'cheddar-bacon', name: 'Frango, cheddar e bacon' },
  { id: 'caipira', name: 'Caipira (frango, milho, bacon e requeijão)' },
  { id: 'brocolis', name: 'Brócolis', onlyM: true },
].map((f) => ({ ...f, image: `/assets/sabores/${f.id}.webp` }))

export const coxinhaFlavors = flavors.filter((f) => !f.onlyM).map((f) => f.name)
export const coxinhaMExtras = flavors.filter((f) => f.onlyM).map((f) => f.name)

export const festaFlavors = [
  'Frango tradicional',
  'Frango, cheddar e bacon',
  'Costela bovina',
  'Calabresa com queijo',
  'Carne moída',
  'Enroladinho de salsicha',
  'Mini kibe',
  'Pizza (queijo, presunto e orégano)',
  'Queijo mussarela',
  'Brócolis',
]

export const churrosSteps = [
  { title: 'Escolha o recheio', options: ['Doce de leite', 'Chocolate'] },
  {
    title: 'Escolha um topping',
    options: ['Confete colorido', 'Granulado de chocolate', 'Granulado colorido', 'Amendoim'],
  },
]

// `price` em centavos. `from: true` mostra "a partir de".
// `variants` lista quantidades com preços diferentes.
// `options` lista sabores ou escolhas (aparecem abertos, sem precisar tocar).
export const catalog = [
  {
    id: 'coxinhas',
    name: 'Coxinhas',
    items: [
      {
        id: 'coxinha-g',
        order: [{ id: 'sabor', title: 'Escolha o sabor', type: 'single', required: true, choices: coxinhaFlavors }],
        name: 'Coxinha G',
        description: 'Coxinha grande de 250g.',
        price: 1490,
        image: img('coxinha-g'),
        alt: 'Coxinha G cortada ao meio, com recheio de frango aparente',
        options: { title: 'Sabores', list: coxinhaFlavors },
        ifood: '',
        food99: '',
      },
      {
        id: 'coxinha-m',
        order: [{ id: 'sabor', title: 'Escolha o sabor', type: 'single', required: true, choices: [...coxinhaFlavors, ...coxinhaMExtras] }],
        name: 'Coxinha M',
        description: 'Coxinha média de 130g.',
        price: 990,
        image: img('coxinha-m'),
        alt: 'Coxinha M aberta, com recheio cremoso',
        options: { title: 'Sabores', list: [...coxinhaFlavors, ...coxinhaMExtras] },
        ifood: '',
        food99: '',
      },
      {
        id: 'coxinha-gourmet',
        name: 'Coxinha Gourmet',
        description: '3 coxinhas de 40g.',
        price: 250,
        image: img('coxinha-gourmet'),
        alt: 'Embalagem com três coxinhas gourmet',
        ifood: '',
        food99: '',
      },
      {
        id: 'copo-salgado',
        name: 'Copo Mágico Salgado',
        description: '20 mini coxinhas de frango.',
        price: 1890,
        image: img('copo-magico-salgado'),
        alt: 'Copo cheio de mini coxinhas',
        ifood: '',
        food99: '',
      },
    ],
  },
  {
    id: 'churros',
    name: 'Churros',
    items: [
      {
        id: 'churros-gourmet',
        order: [
          { id: 'recheio', title: 'Escolha o recheio', type: 'single', required: true, choices: churrosSteps[0].options },
          { id: 'topping', title: 'Escolha um topping', type: 'single', required: true, choices: churrosSteps[1].options },
        ],
        name: 'Churros Gourmet',
        description: 'Você escolhe o recheio e o topping.',
        price: 1290,
        image: img('churros-gourmet'),
        alt: 'Três churros gourmet com toppings',
        options: {
          title: 'Recheio e topping',
          list: ['Recheio: doce de leite ou chocolate', 'Topping: confete, granulado de chocolate, granulado colorido ou amendoim'],
        },
        ifood: '',
        food99: '',
      },
      {
        id: 'copo-doce',
        order: [{ id: 'recheio', title: 'Recheio dos mini churros', type: 'single', required: true, choices: ['Doce de leite', 'Chocolate'] }],
        name: 'Copo Mágico Doce',
        description: '12 mini churros de doce de leite ou chocolate.',
        price: 1890,
        image: img('copo-magico-doce'),
        alt: 'Copo de mini churros com cobertura de chocolate',
        ifood: '',
        food99: '',
      },
      {
        id: 'mini-churros',
        order: [{ id: 'sabores', title: 'Escolha os recheios', type: 'multi', required: true, maxFromVariant: true, choices: ['Doce de leite', 'Chocolate'] }],
        name: 'Mini Churros Recheados',
        description: 'Recheio de doce de leite ou chocolate.',
        price: 1290,
        from: true,
        image: img('mini-churros-coracao'),
        alt: 'Mini churros arrumados em formato de coração',
        variants: [
          { label: '10 unidades (1 sabor)', price: 1290, flavors: 1 },
          { label: '20 unidades (até 2 sabores)', price: 2290, flavors: 2 },
          { label: '50 unidades (até 2 sabores)', price: 4990, flavors: 2 },
          { label: '100 unidades (até 2 sabores)', price: 8990, flavors: 2 },
        ],
        ifood: '',
        food99: '',
      },
    ],
  },
  {
    id: 'festa',
    name: 'Para festa',
    items: [
      {
        id: 'caixa-gostosuras',
        order: [{ id: 'sabores', title: 'Escolha os sabores', type: 'multi', required: true, maxFromVariant: true, choices: festaFlavors }],
        name: 'Caixa de Mini Gostosuras',
        description: 'Mini salgados da linha festa, de 17g cada.',
        price: 1290,
        from: true,
        image: img('cesta-mini-coxinhas'),
        alt: 'Cesta cheia de mini coxinhas',
        variants: [
          { label: '10 unidades (1 sabor)', price: 1290, flavors: 1 },
          { label: '20 unidades (até 2 sabores)', price: 2290, flavors: 2 },
          { label: '50 unidades (até 5 sabores)', price: 4990, flavors: 5 },
          { label: '100 unidades (até 5 sabores)', price: 8990, flavors: 5 },
        ],
        options: { title: 'Sabores', list: festaFlavors },
        ifood: '',
        food99: '',
      },
      {
        id: 'linha-degust',
        name: 'Linha Degust',
        description: '100 mini coxinhas de frango, de 9g cada.',
        price: 4990,
        image: img('cesta-mini-coxinhas'),
        alt: 'Cesta com mini coxinhas',
        ifood: '',
        food99: '',
      },
    ],
  },
  {
    id: 'combos',
    name: 'Combos',
    items: [
      {
        id: 'combo-pra-voce',
        name: 'Combo Pra Você',
        description: '1 coxinha G (250g) e 1 Coca-Cola lata 350ml.',
        price: 2090,
        image: img('coxinha-combo'),
        alt: 'Coxinha G cortada ao meio',
        ifood: '',
        food99: '',
      },
      {
        id: 'combo-dupla-fome',
        name: 'Combo Dupla Fome',
        description: '2 coxinhas G (250g) e 1 Coca-Cola 600ml.',
        price: 3890,
        image: img('coxinha-combo'),
        alt: 'Coxinha G cortada ao meio',
        ifood: '',
        food99: '',
      },
      {
        id: 'combo-casal',
        order: [{ id: 'sabores', title: 'Escolha 3 sabores dos salgados', type: 'multi', required: true, max: 3, choices: festaFlavors }],
        name: 'Combo Casal',
        description: '30 salgados PP (escolha 3 sabores), 8 mini churros e 1 Coca-Cola 600ml.',
        price: 4480,
        image: img('combo-casal'),
        alt: 'Mini coxinhas, mini churros, molhos e refrigerante',
        ifood: '',
        food99: '',
      },
      {
        id: 'combo-mata-fome',
        name: 'Combo Mata Fome',
        description: '50 salgados PP e 2 refrigerantes lata 350ml.',
        price: 5990,
        image: img('cesta-mini-coxinhas'),
        alt: 'Cesta cheia de mini coxinhas',
        ifood: '',
        food99: '',
      },
    ],
  },
  {
    id: 'molhos',
    name: 'Molhos',
    items: [
      {
        id: 'molho-moderado',
        name: 'Molho Cremoso Moderado',
        description: '250g. Cremoso e equilibrado, com sabor suave e toque de ardência (3 de 5 pimentas).',
        price: 1990,
        image: '/assets/molhos/moderado.webp',
        alt: 'Garrafa do molho cremoso moderado, de rótulo vermelho',
        ifood: '',
        food99: '',
      },
      {
        id: 'molho-goiabinha',
        name: 'Pimenta Agridoce Goiabinha',
        description: '250g. O equilíbrio entre o picante da pimenta e o doce da goiabinha (4 de 5 pimentas).',
        price: 1990,
        image: '/assets/molhos/goiabinha.webp',
        alt: 'Garrafa da pimenta agridoce goiabinha, de rótulo verde escuro',
        ifood: '',
        food99: '',
      },
      {
        id: 'molho-suave',
        name: 'Molho Cremoso Suave',
        description: '250g. Sabor leve e marcante, perfeito para o dia a dia (4 de 5 pimentas).',
        price: 1990,
        image: '/assets/molhos/suave.webp',
        alt: 'Garrafa do molho cremoso suave, de rótulo amarelo',
        ifood: '',
        food99: '',
      },
      {
        id: 'molho-alho',
        name: 'Molho de Alho Picante',
        description: '250g. O sabor marcante do alho com um toque picante na medida certa (4 de 5 pimentas).',
        price: 1990,
        image: '/assets/molhos/alho.webp',
        alt: 'Garrafa do molho de alho picante, de rótulo azul turquesa',
        ifood: '',
        food99: '',
      },
    ],
  },
  {
    id: 'casa',
    name: 'Para casa',
    items: [
      {
        id: 'congelados',
        name: 'Mini Coxinhas Congeladas',
        description: '500g de mini coxinhas de frango. É só aquecer no forno ou na airfryer.',
        price: 2990,
        image: img('congelados'),
        alt: 'Caixa de mini coxinhas congeladas',
        ifood: '',
        food99: '',
      },
    ],
  },
]

// Bebidas aparecem em lista simples, sem foto.
export const drinks = {
  id: 'bebidas',
  name: 'Bebidas',
  ifood: '',
  food99: '',
  items: [
    { name: 'Água sem gás', price: 500 },
    { name: 'Água com gás', price: 500 },
    { name: 'Café coado curto', price: 300 },
    { name: 'Café com leite longo', price: 600 },
    { name: 'Refrigerante lata', price: 790 },
    { name: 'Suco lata', price: 1000 },
    { name: 'H2O!', price: 1000 },
    { name: 'Energético', price: 1190, from: true },
    { name: 'Refrigerante 200ml', price: 490 },
    { name: 'Refrigerante 600ml', price: 1190 },
    { name: 'Refrigerante 2L', price: 1490 },
    { name: 'Coca-Cola 2L', price: 1750 },
    { name: 'Cervejas', price: 700, from: true },
  ],
}

// Vitrine da cena 02 (desktop): leva direto para a categoria no cardápio.
export const families = [
  {
    id: 'coxinhas',
    name: 'Coxinhas',
    items: [
      { name: 'Coxinha G', detail: '250g · 8 sabores', image: img('coxinha-g'), alt: 'Coxinha G cortada ao meio' },
      { name: 'Coxinha M', detail: '130g · 9 sabores', image: img('coxinha-m'), alt: 'Coxinha M aberta' },
      { name: 'Coxinha Gourmet', detail: '3 unidades de 40g', image: img('coxinha-gourmet'), alt: 'Embalagem com três coxinhas gourmet' },
    ],
  },
  {
    id: 'churros',
    name: 'Churros',
    items: [
      { name: 'Churros Gourmet', detail: 'Recheio + topping', image: img('churros-gourmet'), alt: 'Três churros gourmet' },
      { name: 'Copo Mágico Doce', detail: '12 mini churros', image: img('copo-magico-doce'), alt: 'Copo com mini churros' },
      { name: 'Mini Churros Recheados', detail: 'Doce de leite ou chocolate', image: img('mini-churros'), alt: 'Três mini churros recheados' },
    ],
  },
]

export const formatPrice = (cents) => {
  const [reais, centavos] = (cents / 100).toFixed(2).split('.')
  return { reais, centavos }
}

export const priceText = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
