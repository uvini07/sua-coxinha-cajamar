// Produtos, sabores e preços transcritos do cardápio oficial (AF_COX_25_001_Novo_Cardapio.pdf).
// Para alterar o site, edite apenas este arquivo.
// Fotos: recortadas do próprio cardápio (baixa resolução). Troque pelos arquivos originais em alta.

const img = (name) => `/assets/produtos/${name}.webp`

export const coxinhaFlavors = [
  'Frango tradicional',
  'Frango com Catupiry®',
  'Costela bovina com requeijão',
  'Queijo mussarela',
  'Pizza (presunto, queijo e orégano)',
  'Carne seca com queijo',
  'Frango, cheddar e bacon',
  'Caipira (frango, milho, bacon e requeijão)',
]

// Sabores extras disponíveis apenas na coxinha M.
export const coxinhaMExtras = ['Carne moída', 'Brócolis']

export const churrosSteps = [
  { title: 'Escolha o recheio', options: ['Doce de leite', 'Chocolate'] },
  {
    title: 'Escolha um topping',
    options: ['Confete colorido', 'Granulado de chocolate', 'Granulado colorido', 'Amendoim'],
  },
]

// Vitrine da cena 02: poucos itens, grandes, por família.
export const families = [
  {
    id: 'coxinhas',
    name: 'Coxinhas',
    items: [
      { name: 'Coxinha G', detail: '250g · 8 sabores', image: img('coxinha-g'), alt: 'Coxinha G cortada ao meio, com recheio de frango aparente' },
      { name: 'Coxinha M', detail: '130g · 10 sabores', image: img('coxinha-m'), alt: 'Coxinha M aberta, com recheio cremoso' },
      { name: 'Coxinha Gourmet', detail: '3 unidades de 40g', image: img('coxinha-gourmet'), alt: 'Embalagem com três coxinhas gourmet' },
    ],
  },
  {
    id: 'churros',
    name: 'Churros',
    items: [
      { name: 'Churros Gourmet', detail: 'Recheio + topping à sua escolha', image: img('churros-gourmet'), alt: 'Três churros gourmet com toppings em embalagens da marca' },
      { name: 'Copo Mágico Doce', detail: '12 mini churros', image: img('copo-magico-doce'), alt: 'Copo com mini churros e cobertura de chocolate escorrendo' },
      { name: 'Mini Churros Recheados', detail: 'Doce de leite ou chocolate', image: img('mini-churros'), alt: 'Três mini churros recheados com doce de leite' },
    ],
  },
]

// Cardápio completo (cena 05). `price` em centavos; `from` indica "a partir de".
export const menu = [
  {
    id: 'coxinha-g',
    category: 'Coxinhas',
    name: 'Coxinha G',
    description: '250g. Escolha entre 8 sabores, do frango tradicional à caipira.',
    price: 1490,
    image: img('coxinha-g'),
    alt: 'Coxinha G cortada ao meio',
  },
  {
    id: 'coxinha-m',
    category: 'Coxinhas',
    name: 'Coxinha M',
    description: '130g. Todos os sabores da G, mais carne moída e brócolis.',
    price: 990,
    image: img('coxinha-m'),
    alt: 'Coxinha M aberta',
  },
  {
    id: 'coxinha-gourmet',
    category: 'Coxinhas',
    name: 'Coxinha Gourmet',
    description: '3 unidades de 40g.',
    price: 990,
    image: img('coxinha-gourmet'),
    alt: 'Embalagem com três coxinhas gourmet',
  },
  {
    id: 'copo-salgado',
    category: 'Coxinhas',
    name: 'Copo Mágico Salgado',
    description: '20 mini coxinhas de frango. Cobertura grátis de requeijão ou cheddar.',
    price: 1890,
    image: img('copo-magico-salgado'),
    alt: 'Copo cheio de mini coxinhas',
  },
  {
    id: 'churros-gourmet',
    category: 'Churros',
    name: 'Churros Gourmet',
    description: 'Recheio de doce de leite ou chocolate, com o topping que você escolher.',
    price: 1290,
    image: img('churros-gourmet'),
    alt: 'Três churros gourmet com toppings',
  },
  {
    id: 'copo-doce',
    category: 'Churros',
    name: 'Copo Mágico Doce',
    description: '12 mini churros. Cobertura grátis de doce de leite ou creme de avelã.',
    price: 1890,
    image: img('copo-magico-doce'),
    alt: 'Copo de mini churros com cobertura',
  },
  {
    id: 'mini-churros',
    category: 'Churros',
    name: 'Mini Churros Recheados',
    description: 'Doce de leite ou chocolate. De 10 a 100 unidades.',
    price: 1290,
    from: true,
    image: img('mini-churros-coracao'),
    alt: 'Mini churros arrumados em formato de coração',
  },
  {
    id: 'caixa-gostosuras',
    category: 'Para festa',
    name: 'Caixa de Mini Gostosuras',
    description: 'Mini salgados da linha festa (17g). De 10 a 100 unidades, até 5 sabores.',
    price: 1290,
    from: true,
    image: img('cesta-mini-coxinhas'),
    alt: 'Cesta cheia de mini coxinhas',
  },
  {
    id: 'combos',
    category: 'Combos',
    name: 'Combos',
    description: 'Pra você, Dupla Fome, Casal e Mata Fome. Coxinhas, salgados e refrigerante.',
    price: 2090,
    from: true,
    image: img('combo-casal'),
    alt: 'Combo com mini coxinhas, mini churros, molhos e refrigerante',
  },
  {
    id: 'congelados',
    category: 'Para casa',
    name: 'Mini Coxinhas Congeladas',
    description: '500g de mini coxinhas de frango. É só aquecer no forno ou airfryer.',
    price: 2990,
    image: img('congelados'),
    alt: 'Caixa de mini coxinhas congeladas',
  },
]

export const formatPrice = (cents) => {
  const [reais, centavos] = (cents / 100).toFixed(2).split('.')
  return { reais, centavos }
}
