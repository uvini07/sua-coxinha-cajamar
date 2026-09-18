// FORMA DE UMA LOJA
//
// Cada franquia é uma pasta em src/lojas/<slug>/ com loja.js, tema.js e produtos.js.
// Este arquivo documenta os campos, aplica os valores padrão e calcula o que é
// derivado (plataformas de pedido, etapas do pedido, links do menu).
//
// Para cadastrar uma franquia nova: copie uma pasta existente, troque o slug e o
// conteúdo. A rota /<slug> passa a existir sozinha, sem mexer em componente nenhum.

import { montarEtapas } from '../lib/etapas.js'
import { montarPlataformas } from '../lib/plataformas.js'

// Nome e ordem das seções da página. A loja escolhe quais usa em `secoes`.
export const SECOES = {
  abertura: { id: 'inicio', label: 'Início' },
  cardapio: { id: 'cardapio', label: 'Cardápio' },
  molhos: { id: 'molhos', label: 'Molhos' },
  sobre: { id: 'sobre', label: 'Sobre' },
  pedido: { id: 'pedido', label: 'Onde pedir' },
}

// Cores da marca, usadas por toda loja que não tiver um tema.js próprio.
const TEMA_PADRAO = {
  marca: '#f9c115',
  marcaClara: '#ffd23f',
  tinta: '#141415',
  tinta2: '#2a2a2c',
  papel: '#ffffff',
  logo: '/assets/marca/logo-sua-coxinha.svg',
  fonteTitulo: null,
  fonteTexto: null,
}

const LOJA_PADRAO = {
  brand: 'Sua Coxinha',
  unit: '',
  address: { street: '', district: '', city: '', cep: '' },
  hours: [],
  openingHours: {},
  feriadosLocais: [],
  prepMinutes: 45,
  phone: '',
  whatsapp: '',
  links: {},
  instagramHandle: '',
  entrega: { propria: false, taxa: null, tempo: null, observacao: '' },
  secoes: ['abertura', 'cardapio', 'sobre', 'pedido'],
  seo: {},
  textos: {},
  disclaimer: '',
  fotoLoja: null,
  benefits: [],
}

const CATALOGO_PADRAO = {
  catalog: [],
  drinks: null,
  molhos: [],
  molhoPrice: 0,
  families: [],
  flavors: [],
  churrosSteps: [],
}

// Junta config + tema + catálogo numa única loja pronta para a interface usar.
export function criarLoja({ slug, loja = {}, tema = {}, produtos = {} }) {
  const config = { ...LOJA_PADRAO, ...loja, slug: loja.slug ?? slug }
  const catalogo = { ...CATALOGO_PADRAO, ...produtos }
  const { orderSteps, itemIndex } = montarEtapas(catalogo.catalog, catalogo.drinks)

  const secoes = config.secoes.filter((s) => SECOES[s])
  // Molhos só aparecem no menu se a loja tiver molhos cadastrados.
  const disponiveis = secoes.filter((s) => (s === 'molhos' ? catalogo.molhos.length > 0 : true))

  return {
    ...config,
    ...catalogo,
    tema: { ...TEMA_PADRAO, ...tema },
    secoes: disponiveis,
    temSecao: (nome) => disponiveis.includes(nome),
    // Links do menu: a abertura vira o link "Início" só no celular, então fica de fora.
    navLinks: disponiveis.filter((s) => s !== 'abertura').map((s) => SECOES[s]),
    platforms: montarPlataformas(config.links),
    orderSteps,
    itemIndex,
    nomeCompleto: `${config.brand} ${config.unit}`.trim(),
    seo: {
      title: config.seo.title ?? `${config.brand} ${config.unit}`.trim(),
      description: config.seo.description ?? '',
      shareTitle: config.seo.shareTitle ?? config.seo.title ?? `${config.brand} ${config.unit}`.trim(),
      shareDescription: config.seo.shareDescription ?? config.seo.description ?? '',
      shareImage: config.seo.shareImage ?? '/compartilhar.jpg',
      shareImageAlt: config.seo.shareImageAlt ?? `${config.brand} ${config.unit}`.trim(),
    },
  }
}
