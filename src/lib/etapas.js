// Monta as etapas do pedido pelo WhatsApp a partir do catálogo de UMA loja.
// Cada loja tem seu próprio catálogo, então as etapas também são por loja.

const slug = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

// Grupos do catálogo que entram em cada etapa, na ordem em que aparecem.
const ETAPAS = [
  {
    id: 'salgados',
    name: 'Salgados',
    hint: 'Toque no produto para escolher. Não quer salgado? Toque em Próximo.',
    grupos: ['coxinhas', 'festa', 'combos', 'molhos', 'casa'],
  },
  {
    id: 'doces',
    name: 'Doces',
    hint: 'Toque no produto para escolher. Não quer doce? Toque em Próximo.',
    grupos: ['churros'],
  },
]

export function montarEtapas(catalog = [], drinks = null) {
  const porId = new Map(catalog.map((g) => [g.id, g]))

  const etapas = ETAPAS.map((etapa) => ({
    id: etapa.id,
    name: etapa.name,
    hint: etapa.hint,
    sections: etapa.grupos.map((id) => porId.get(id)).filter(Boolean),
  })).filter((etapa) => etapa.sections.length)

  // Grupos do catálogo que a loja criou e não estão na lista acima entram nos salgados.
  const usados = new Set(ETAPAS.flatMap((e) => e.grupos))
  const extras = catalog.filter((g) => !usados.has(g.id))
  if (extras.length) {
    const salgados = etapas.find((e) => e.id === 'salgados')
    if (salgados) salgados.sections.push(...extras)
    else etapas.unshift({ id: 'salgados', name: 'Salgados', hint: ETAPAS[0].hint, sections: extras })
  }

  const bebidas = (drinks?.items ?? []).map((d) => ({ ...d, id: `bebida-${slug(d.name)}` }))
  if (bebidas.length) {
    etapas.push({
      id: 'bebidas',
      name: 'Bebidas',
      hint: 'Toque em Adicionar. Não quer bebida? Toque em Finalizar.',
      simple: true,
      sections: [{ id: 'bebidas', name: drinks.name ?? 'Bebidas', items: bebidas }],
    })
  }

  etapas.push({ id: 'finalizar', name: 'Finalizar', review: true })

  // id do produto -> { item, step }
  const itemIndex = new Map()
  etapas.forEach((step) => step.sections?.forEach((s) => s.items.forEach((item) => itemIndex.set(item.id, { item, step }))))

  return { orderSteps: etapas, itemIndex, drinkItems: bebidas }
}
