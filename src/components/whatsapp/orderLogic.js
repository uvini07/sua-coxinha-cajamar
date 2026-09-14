import { priceText } from '../../data/products.js'
import { store } from '../../data/store.js'
import { itemIndex, orderSteps } from '../../data/whatsappOrder.js'

// Quantas opções o cliente pode marcar num grupo.
export function groupMax(group, variant) {
  if (group.type === 'single') return 1
  if (group.max) return group.max
  if (group.maxFromVariant) return variant?.flavors ?? 1
  return group.choices.length
}

export function unitPrice(item, variantIndex, selections) {
  const base = item.variants ? item.variants[variantIndex]?.price ?? item.price : item.price
  const extras = (item.order ?? []).reduce(
    (sum, g) => sum + (g.price && selections[g.id]?.length ? g.price : 0),
    0,
  )
  return base + extras
}

// Grupos obrigatórios que ainda não foram escolhidos.
export function missingGroups(item, selections) {
  return (item.order ?? []).filter((g) => g.required && !selections[g.id]?.length).map((g) => g.id)
}

// "Escolha o sabor" -> "Sabor"
const shortLabel = (title) => {
  const text = title.replace(/^Escolha (?:o|os|a|as|um|uma|\d+) /, '')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function lineDetails(item, variantIndex, selections) {
  const details = []
  if (item.variants) details.push(item.variants[variantIndex].label)
  ;(item.order ?? []).forEach((g) => {
    const chosen = selections[g.id]
    if (!chosen?.length) return
    const extra = g.price ? ` (+ ${priceText(g.price)})` : ''
    details.push(`${shortLabel(g.title)}: ${chosen.join(', ')}${extra}`)
  })
  return details
}

export const lineKey = (itemId, variantIndex, selections, note) =>
  JSON.stringify([itemId, variantIndex, Object.entries(selections).filter(([, v]) => v.length).sort(), note])

// Completa uma linha salva no carrinho com nome, preço atual e detalhes.
export function resolveLine(line) {
  const entry = itemIndex.get(line.itemId)
  if (!entry) return null
  const { item, step } = entry
  const unit = unitPrice(item, line.variantIndex, line.selections)
  return {
    ...line,
    item,
    step,
    name: item.name,
    unit,
    total: unit * line.qty,
    details: lineDetails(item, line.variantIndex, line.selections),
  }
}

export function summarize(lines) {
  const resolved = lines.map(resolveLine).filter(Boolean)
  return {
    lines: resolved,
    count: resolved.reduce((n, l) => n + l.qty, 0),
    total: resolved.reduce((n, l) => n + l.total, 0),
    countByStep: resolved.reduce((acc, l) => ({ ...acc, [l.step.id]: (acc[l.step.id] ?? 0) + l.qty }), {}),
  }
}

export function buildMessage(summary, customer) {
  const out = [`Olá, ${store.brand} ${store.unit}! Quero fazer um pedido para *retirar na loja*.`, '']
  out.push(`*Nome:* ${customer.name.trim()}`)
  out.push(`*Retirada:* ${customer.when === 'horario' ? `às ${customer.time}` : 'assim que ficar pronto'}`)

  orderSteps.forEach((step) => {
    const lines = summary.lines.filter((l) => l.step.id === step.id)
    if (!lines.length) return
    out.push('', `*${step.name}*`)
    lines.forEach((l) => {
      out.push(`${l.qty}x ${l.name}: ${priceText(l.total)}`)
      l.details.forEach((d) => out.push(`   ${d}`))
      if (l.note) out.push(`   Obs.: ${l.note}`)
    })
  })

  out.push('', `*Total estimado: ${priceText(summary.total)}*`)
  if (customer.notes.trim()) out.push('', `*Observações:* ${customer.notes.trim()}`)
  return out.join('\n')
}

export const whatsappUrl = (text) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`
