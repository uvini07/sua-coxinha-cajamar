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
  out.push(`*Retirada:* ${pickupText(customer)}`)

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

/* ---------- Retirada agendada ---------- */

const pad = (n) => String(n).padStart(2, '0')
export const toDateValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
export const toTimeValue = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`

// Junta os campos de data e hora num horário real (no fuso do próprio aparelho).
const toDate = (dateValue, timeValue) => {
  const [y, m, d] = dateValue.split('-').map(Number)
  const [h, min] = timeValue.split(':').map(Number)
  return new Date(y, m - 1, d, h, min, 0, 0)
}

// Primeiro horário possível: agora + tempo de preparo, arredondado para os próximos 5 minutos.
export function earliestPickup(now = new Date()) {
  const date = new Date(now.getTime() + store.prepMinutes * 60000)
  date.setSeconds(0, 0)
  const rest = date.getMinutes() % 5
  if (rest) date.setMinutes(date.getMinutes() + (5 - rest))
  return date
}

const hoursLabel = (open, close) => `das ${open}h às ${close}h`

// Domingo de Páscoa pelo cálculo de Gauss: dele saem Carnaval, Sexta-feira Santa e Corpus Christi.
function pascoa(ano) {
  const a = ano % 19
  const b = Math.floor(ano / 100)
  const c = ano % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mes = Math.floor((h + l - 7 * m + 114) / 31)
  const dia = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(ano, mes - 1, dia)
}

const somaDias = (data, dias) => new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias)

// Feriados nacionais do ano (os municipais entram em `feriadosLocais`, no store.js).
function feriadosNacionais(ano) {
  const p = pascoa(ano)
  return new Set([
    `${ano}-01-01`, // Confraternização Universal
    `${ano}-04-21`, // Tiradentes
    `${ano}-05-01`, // Dia do Trabalho
    `${ano}-09-07`, // Independência
    `${ano}-10-12`, // Nossa Senhora Aparecida
    `${ano}-11-02`, // Finados
    `${ano}-11-15`, // Proclamação da República
    `${ano}-11-20`, // Consciência Negra
    `${ano}-12-25`, // Natal
    toDateValue(somaDias(p, -47)), // Carnaval
    toDateValue(somaDias(p, -2)), // Sexta-feira Santa
    toDateValue(somaDias(p, 60)), // Corpus Christi
  ])
}

export function ehFeriado(data) {
  const dia = toDateValue(data)
  return feriadosNacionais(data.getFullYear()).has(dia) || (store.feriadosLocais ?? []).includes(dia)
}

// Horário de atendimento do dia: feriado funciona como domingo.
export function horarioDoDia(data) {
  return ehFeriado(data) ? store.openingHours[0] : store.openingHours[data.getDay()]
}

const dayLabel = (date, now) => {
  const days = Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86400000)
  if (days === 0) return 'hoje'
  if (days === 1) return 'amanhã'
  return `dia ${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

// Confere a data e a hora escolhidas. Devolve uma mensagem de erro, ou null quando está tudo certo.
export function pickupError(dateValue, timeValue, now = new Date()) {
  if (!dateValue) return 'Escolha o dia da retirada.'
  if (!timeValue) return 'Escolha o horário da retirada.'

  const chosen = toDate(dateValue, timeValue)
  if (Number.isNaN(chosen.getTime())) return 'Escolha o dia e o horário da retirada.'

  const [open, close] = horarioDoDia(chosen) ?? []
  if (open === undefined) return 'A loja não abre neste dia.'
  const hour = chosen.getHours() + chosen.getMinutes() / 60
  if (hour < open || hour > close) {
    const quando = ehFeriado(chosen) ? 'Em feriado' : 'Neste dia'
    return `${quando} a loja atende ${hoursLabel(open, close)}. Escolha um horário nesse intervalo.`
  }

  const earliest = earliestPickup(now)
  if (chosen < earliest) {
    const sameDay = toDateValue(chosen) === toDateValue(earliest)
    const quando = sameDay ? `a partir das ${toTimeValue(earliest)}` : `a partir de ${dayLabel(earliest, now)}, às ${toTimeValue(earliest)}`
    return `O pedido leva até ${store.prepMinutes} minutos para ficar pronto. Escolha ${quando}.`
  }
  return null
}

// Texto da retirada que vai na mensagem do WhatsApp.
export function pickupText(customer, now = new Date()) {
  if (customer.when !== 'agendar') return `assim que ficar pronto (até ${store.prepMinutes} min)`
  const chosen = toDate(customer.date, customer.time)
  return `${dayLabel(chosen, now)} (${pad(chosen.getDate())}/${pad(chosen.getMonth() + 1)}) às ${customer.time}`
}
