// CATÁLOGO DA LOJA DE CAJAMAR
// Cada franquia tem o seu próprio arquivo como este, em src/lojas/<slug>/produtos.js.
// Mexer aqui muda só Cajamar: nenhuma outra loja é afetada.
// Transcrito do cardápio oficial (AF_COX_25_001_Novo_Cardapio.pdf).
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

// Sabores da coxinha (os mesmos na G e na M). `image` é a foto do recheio
// (imagem ilustrativa), usada no seletor de sabores. Para trocar uma foto,
// substitua o arquivo em public/assets/sabores/ mantendo o nome.
export const flavors = [
  { id: 'frango', name: 'Frango tradicional' },
  { id: 'catupiry', name: 'Frango com Catupiry®' },
  { id: 'costela', name: 'Costela bovina com requeijão' },
  { id: 'mussarela', name: 'Queijo mussarela' },
  { id: 'pizza', name: 'Pizza (presunto, queijo e orégano)' },
  { id: 'carne-seca', name: 'Carne seca com queijo' },
  { id: 'cheddar-bacon', name: 'Frango, cheddar e bacon' },
  { id: 'caipira', name: 'Caipira (frango, milho, bacon e requeijão)' },
].map((f) => ({ ...f, image: `/assets/sabores/${f.id}.webp` }))

export const coxinhaFlavors = flavors.map((f) => f.name)

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

// Sabores das coxinhas que vêm nos combos (lista própria, menor que a do balcão).
export const comboCoxinhaFlavors = [
  'Frango tradicional',
  'Frango com Catupiry®',
  'Costela bovina com requeijão',
  'Caipira (frango, milho, bacon e requeijão)',
  'Calabresa com queijo',
  'Queijo mussarela',
  'Pizza (presunto, queijo e orégano)',
]

// Sabores dos salgadinhos PP do Combo Mata Fome (até 5 sabores por combo).
export const mataFomeFlavors = [
  'Frango tradicional',
  'Calabresa com queijo',
  'Costela bovina com requeijão',
  'Queijo mussarela',
  'Pizza (presunto, queijo e orégano)',
  'Carne seca com queijo',
  'Frango, cheddar e bacon',
  'Carne moída',
  'Brócolis',
  'Palmito',
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
        order: [{ id: 'sabor', title: 'Escolha o sabor', type: 'single', required: true, choices: coxinhaFlavors }],
        name: 'Coxinha M',
        description: 'Coxinha média de 130g.',
        price: 990,
        image: img('coxinha-m'),
        alt: 'Coxinha M aberta, com recheio cremoso',
        options: { title: 'Sabores', list: coxinhaFlavors },
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
        order: [{ id: 'sabor', title: 'Escolha o sabor da coxinha', type: 'single', required: true, choices: comboCoxinhaFlavors }],
        name: 'Combo Pra Você',
        description: '1 coxinha G (250g) e 1 Coca-Cola lata 350ml. Escolha o sabor da coxinha.',
        price: 2090,
        image: img('coxinha-combo'),
        alt: 'Coxinha G cortada ao meio',
        options: { title: 'Sabores', list: comboCoxinhaFlavors },
        ifood: '',
        food99: '',
      },
      {
        id: 'combo-dupla-fome',
        order: [
          { id: 'sabores', title: 'Escolha até 2 sabores (1 para cada coxinha)', type: 'multi', required: true, max: 2, choices: comboCoxinhaFlavors },
        ],
        name: 'Combo Dupla Fome',
        description: '2 coxinhas G (250g) e 1 Coca-Cola 600ml. Escolha os sabores das coxinhas.',
        price: 3890,
        image: img('coxinha-combo'),
        alt: 'Coxinha G cortada ao meio',
        options: { title: 'Sabores', list: comboCoxinhaFlavors },
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
        order: [{ id: 'sabores', title: 'Escolha até 5 sabores', type: 'multi', required: true, max: 5, choices: mataFomeFlavors }],
        name: 'Combo Mata Fome',
        description: '50 salgados PP (escolha até 5 sabores) e 2 refrigerantes lata 350ml.',
        price: 5990,
        image: img('cesta-mini-coxinhas'),
        alt: 'Cesta cheia de mini coxinhas',
        options: { title: 'Sabores', list: mataFomeFlavors },
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
      { name: 'Coxinha M', detail: '130g · 8 sabores', image: img('coxinha-m'), alt: 'Coxinha M aberta' },
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

// Linha de molhos artesanais desta loja. O nível de ardência é o mesmo impresso no rótulo (de 1 a 5).
// `pedido` liga cada garrafa ao produto do pedido pelo WhatsApp (products.js).
export const molhoPrice = 1990

export const molhos = [
  {
    id: 'moderado',
    pedido: 'molho-moderado',
    name: 'Molho cremoso',
    highlight: 'Moderado',
    image: '/assets/molhos/moderado.webp',
    alt: 'Garrafa do molho cremoso moderado, de rótulo vermelho',
    level: 3,
    quente: false,
    text: 'Cremoso e equilibrado, com sabor suave e toque de ardência.',
    combina: 'Coxinha G, porções e lanches',
  },
  {
    id: 'goiabinha',
    pedido: 'molho-goiabinha',
    name: 'Pimenta agridoce',
    highlight: 'Goiabinha',
    image: '/assets/molhos/goiabinha.webp',
    alt: 'Garrafa da pimenta agridoce goiabinha, de rótulo verde escuro',
    level: 4,
    quente: true,
    text: 'O equilíbrio perfeito entre o picante da pimenta e o doce da goiabinha.',
    combina: 'Mini salgados, queijos e carnes',
  },
  {
    id: 'suave',
    pedido: 'molho-suave',
    name: 'Molho cremoso',
    highlight: 'Suave',
    image: '/assets/molhos/suave.webp',
    alt: 'Garrafa do molho cremoso suave, de rótulo amarelo',
    level: 4,
    quente: true,
    text: 'Sabor leve e marcante, perfeito para o dia a dia.',
    combina: 'Coxinha de qualquer tamanho e batata',
  },
  {
    id: 'alho',
    pedido: 'molho-alho',
    name: 'Molho de',
    highlight: 'Alho picante',
    image: '/assets/molhos/alho.webp',
    alt: 'Garrafa do molho de alho picante, de rótulo azul turquesa',
    level: 4,
    quente: true,
    text: 'O sabor marcante do alho com um toque picante na medida certa.',
    combina: 'Salgados fritos, pastel e churrasco',
  },
]

// GALERIA DE FOTOS (entre "Para casa" e "Bebidas" no cardápio)
// As fotos ficam em public/assets/galeria/<album>/, em dois tamanhos: <nome>.webp
// (até 1400px) e <nome>-sm.webp (até 720px, para o celular). `w` e `h` são o
// tamanho da versão grande, para a página não pular enquanto a foto carrega.
// `tamanho` define o bloco na grade do computador: destaque (2x2), alta (1x2),
// larga (2x1) ou normal. `foco` é o ponto da foto que nunca pode ser cortado.
// `categoria` liga a foto à categoria do cardápio (botão "Ver no cardápio").
const foto = (album, nome, w, h) => ({
  src: `/assets/galeria/${album}/${nome}.webp`,
  srcSm: `/assets/galeria/${album}/${nome}-sm.webp`,
  w,
  h,
})

export const galeria = {
  id: 'fotos',
  name: 'Fotos',
  intro: 'A loja, os produtos de verdade e quem passa por aqui.',
  albuns: [
    {
      id: 'produtos',
      nome: 'Produtos',
      layout: 'grade',
      fotos: [
        {
          ...foto('produtos', 'coxinha-bacon', 1080, 1350),
          tamanho: 'destaque',
          foco: '50% 45%',
          etiqueta: 'Coxinhas',
          titulo: 'Crocante por fora, recheada até a ponta.',
          texto: 'Massa de batata e casquinha dourada. Tem de frango, costela, cheddar com bacon e mais.',
          alt: 'Coxinha dourada em um banquinho de madeira, com pedaços de bacon caindo por cima',
          categoria: 'coxinhas',
        },
        {
          ...foto('produtos', 'copo-magico-cheddar', 720, 1280),
          tamanho: 'alta',
          foco: '50% 45%',
          etiqueta: 'Copo Mágico',
          titulo: 'Mini coxinhas com cheddar.',
          alt: 'Mão segurando o copo amarelo da Sua Coxinha cheio de mini coxinhas com cheddar, em frente à vitrine',
          categoria: 'coxinhas',
        },
        {
          ...foto('produtos', 'mini-churros-cesta', 1080, 1350),
          tamanho: 'alta',
          foco: '50% 45%',
          etiqueta: 'Churros',
          titulo: 'Mini churros no açúcar e canela.',
          alt: 'Mini churros saltando de uma cesta de palha com pano xadrez vermelho',
          categoria: 'churros',
        },
        {
          ...foto('produtos', 'churros-na-caixa', 1080, 1350),
          tamanho: 'larga',
          foco: '50% 72%',
          etiqueta: 'Churros Gourmet',
          titulo: 'Chocolate ou doce de leite, na caixinha.',
          alt: 'Dois churros gourmet na embalagem rosa e amarela da Sua Coxinha, um com chocolate e outro com doce de leite',
          categoria: 'churros',
        },
        {
          ...foto('produtos', 'mini-salgados-e-churros', 1050, 1400),
          tamanho: 'larga',
          foco: '50% 72%',
          etiqueta: 'Para festa',
          titulo: 'Salgado, doce e molho na mesma mesa.',
          alt: 'Cesta de mini coxinhas e bolinhas de queijo, cesta de mini churros, molhos e uma lata de refrigerante',
          categoria: 'festa',
        },
        {
          ...foto('produtos', 'cesta-mini-coxinhas', 1080, 1350),
          foco: '50% 72%',
          etiqueta: 'Linha Degust',
          titulo: 'Mini salgados.',
          alt: 'Cesta de palha com mini coxinhas e bolinhas de queijo, com três molhos ao fundo',
          categoria: 'festa',
        },
        {
          ...foto('produtos', 'coxinha-g-na-embalagem', 500, 500),
          foco: '50% 50%',
          etiqueta: 'Coxinha G',
          titulo: '250g na mão.',
          alt: 'Mão segurando uma coxinha grande na embalagem da Sua Coxinha',
          categoria: 'coxinhas',
        },
        {
          ...foto('produtos', 'mini-salgados-no-papel', 1080, 1350),
          tamanho: 'larga',
          foco: '50% 38%',
          etiqueta: 'Na embalagem',
          titulo: 'Sai quentinho, do jeito que chega pra você.',
          alt: 'Mão segurando mini coxinhas no papel amarelo e branco da Sua Coxinha, com coxinhas abertas ao fundo',
          categoria: 'festa',
        },
      ],
    },
    {
      id: 'loja',
      nome: 'A loja',
      layout: 'grade',
      fotos: [
        {
          ...foto('loja', 'balcao-retire-aqui', 630, 1400),
          tamanho: 'alta',
          foco: '50% 55%',
          etiqueta: 'Retire aqui',
          titulo: 'Pediu no WhatsApp? Retira no balcão.',
          alt: 'Balcão da loja com teto amarelo, letreiro Retire Aqui, vitrine de salgados e mesa com banquetas',
        },
        {
          ...foto('loja', 'salao-atendimento', 1400, 1050),
          tamanho: 'larga',
          foco: '50% 55%',
          etiqueta: 'O salão',
          titulo: 'Senta, pede e come quentinho.',
          alt: 'Salão da loja com clientes no caixa, balcão de azulejo preto e mesas com banquetas pretas e amarelas',
        },
        {
          ...foto('loja', 'equipe-degustacao', 960, 1280),
          tamanho: 'alta',
          foco: '50% 40%',
          etiqueta: 'Equipe',
          titulo: 'Tem degustação.',
          alt: 'Atendente sorrindo com uma bandeja de mini coxinhas para degustação, em frente à parede com o logo da marca',
        },
        {
          ...foto('loja', 'parede-melhor-coxinha', 1400, 1050),
          tamanho: 'larga',
          foco: '65% 40%',
          etiqueta: 'Portal dos Ipês',
          titulo: 'A melhor coxinha do mundo é feita aqui.',
          alt: 'Parede cinza com a frase A melhor coxinha do mundo é feita aqui e o logo amarelo iluminado',
        },
      ],
    },
    {
      id: 'clientes',
      nome: 'Clientes',
      layout: 'leque',
      fotos: [
        {
          ...foto('clientes', 'turma-com-mascote', 1400, 1050),
          foco: '50% 45%',
          titulo: 'A turma toda com o mascote.',
          alt: 'Grupo de amigos sorrindo com o mascote de coxinha na frente da loja amarela',
        },
        {
          ...foto('clientes', 'copo-magico-na-mesa', 934, 1400),
          foco: '50% 45%',
          titulo: 'Copo Mágico com nome.',
          alt: 'Menina sorrindo segurando uma mini coxinha, com o copo mágico personalizado na mesa',
        },
        {
          ...foto('clientes', 'abraco-no-mascote', 1050, 1400),
          foco: '40% 45%',
          titulo: 'Abraço no mascote.',
          alt: 'Menino de camisa xadrez abraçando o mascote de coxinha em frente à loja',
        },
        {
          ...foto('clientes', 'dupla-com-mascote', 1068, 1400),
          foco: '50% 40%',
          titulo: 'Foto obrigatória na porta.',
          alt: 'Casal fazendo joinha ao lado do mascote de coxinha na frente da loja',
        },
        {
          ...foto('clientes', 'churros-na-mesa', 960, 1280),
          foco: '45% 45%',
          titulo: 'Churros com confete.',
          alt: 'Menino sorrindo sentado à mesa com um churros coberto de chocolate e confeitos',
        },
        {
          ...foto('clientes', 'amigos-com-mascote', 1050, 1400),
          foco: '50% 45%',
          titulo: 'Passou, tirou foto.',
          alt: 'Dois amigos posando com o mascote de coxinha em frente à fachada amarela',
        },
      ],
    },
  ],
}
