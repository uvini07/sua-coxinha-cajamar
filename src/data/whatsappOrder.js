// Estrutura do pedido pelo WhatsApp: as etapas do pop-up e onde cada produto aparece.
// Os produtos, preços e escolhas vêm de products.js.
import { catalog, drinks } from './products.js'

const group = (id) => catalog.find((g) => g.id === id)

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const drinkItems = drinks.items.map((d) => ({ ...d, id: `bebida-${slug(d.name)}` }))

export const orderSteps = [
  {
    id: 'salgados',
    name: 'Salgados',
    hint: 'Toque no produto para escolher. Não quer salgado? Toque em Próximo.',
    sections: ['coxinhas', 'festa', 'combos', 'molhos', 'casa'].map(group),
  },
  {
    id: 'doces',
    name: 'Doces',
    hint: 'Toque no produto para escolher. Não quer doce? Toque em Próximo.',
    sections: [group('churros')],
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    hint: 'Toque em Adicionar. Não quer bebida? Toque em Finalizar.',
    simple: true,
    sections: [{ id: 'bebidas', name: 'Bebidas', items: drinkItems }],
  },
  { id: 'finalizar', name: 'Finalizar', review: true },
]

// id do produto -> { item, step }
export const itemIndex = new Map()
orderSteps.forEach((step) =>
  step.sections?.forEach((section) => section.items.forEach((item) => itemIndex.set(item.id, { item, step }))),
)
