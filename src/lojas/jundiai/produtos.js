// CATÁLOGO DA LOJA DE JUNDIAÍ
// Independente de Cajamar: produtos e preços próprios. O que não existir aqui
// simplesmente não aparece nesta loja.

const img = (name) => `/assets/produtos/${name}.webp`

export const flavors = [
  { id: 'frango', name: 'Frango tradicional' },
  { id: 'catupiry', name: 'Frango com Catupiry®' },
  { id: 'costela', name: 'Costela bovina com requeijão' },
  { id: 'mussarela', name: 'Queijo mussarela' },
  { id: 'carne-seca', name: 'Carne seca com queijo' },
].map((f) => ({ ...f, image: `/assets/sabores/${f.id}.webp` }))

export const coxinhaFlavors = flavors.map((f) => f.name)

export const festaFlavors = ['Frango tradicional', 'Calabresa com queijo', 'Queijo mussarela', 'Carne moída']

export const churrosSteps = [
  { title: 'Escolha o recheio', options: ['Doce de leite', 'Chocolate'] },
  { title: 'Escolha um topping', options: ['Granulado de chocolate', 'Granulado colorido', 'Amendoim'] },
]

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
        price: 1590,
        image: img('coxinha-g'),
        alt: 'Coxinha G cortada ao meio, com recheio de frango aparente',
        options: { title: 'Sabores', list: coxinhaFlavors },
        ifood: '',
        food99: '',
      },
      {
        id: 'coxinha-m',
        order: [{ id: 'sabor', title: 'Escolha o sabor', type: 'single', required: true, choices: coxinhaFlavors }],
        name: 'Coxinha M',
        description: 'Coxinha média de 130g.',
        price: 1090,
        image: img('coxinha-m'),
        alt: 'Coxinha M aberta, com recheio cremoso',
        options: { title: 'Sabores', list: coxinhaFlavors },
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
        description: 'Churros com recheio e topping à escolha.',
        price: 1390,
        image: img('churros-gourmet'),
        alt: 'Três churros gourmet com toppings',
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
        order: [{ id: 'sabores', title: 'Escolha os sabores', type: 'multi', required: true, max: 4, choices: festaFlavors }],
        name: 'Caixa de Mini Gostosuras',
        description: '50 mini salgados de 17g (escolha até 4 sabores).',
        price: 6490,
        image: img('cesta-mini-coxinhas'),
        alt: 'Cesta cheia de mini coxinhas',
        options: { title: 'Sabores', list: festaFlavors },
        ifood: '',
        food99: '',
      },
    ],
  },
]

export const drinks = {
  id: 'bebidas',
  name: 'Bebidas',
  items: [
    { name: 'Água sem gás', price: 500 },
    { name: 'Refrigerante lata', price: 850 },
    { name: 'Suco lata', price: 1050 },
  ],
}

// Vitrine da abertura animada (computador).
export const families = [
  {
    id: 'coxinhas',
    name: 'Coxinhas',
    items: [
      { name: 'Coxinha G', detail: '250g · 5 sabores', image: img('coxinha-g'), alt: 'Coxinha G cortada ao meio' },
      { name: 'Coxinha M', detail: '130g · 5 sabores', image: img('coxinha-m'), alt: 'Coxinha M aberta' },
    ],
  },
  {
    id: 'churros',
    name: 'Churros',
    items: [{ name: 'Churros Gourmet', detail: 'Recheio + topping', image: img('churros-gourmet'), alt: 'Três churros gourmet' }],
  },
]

// Esta loja ainda não vende a linha de molhos: a seção some sozinha.
export const molhos = []
export const molhoPrice = 0
