// CONTADORES PRÓPRIOS DE CADA LOJA (Firestore do app, plano gratuito)
//
// Mesmo método do site da Taise: cada visita ou clique soma +1 num contador do
// dia, em sitePorLoja/{loja}/dias/{AAAA-MM-DD}. Nada pessoal é gravado (nem IP,
// nem identificador, nem cookie) — por isso conta mesmo sem o aceite de cookies.
// O painel /painel lê esses contadores com o login do franqueado.
//
// A gravação usa a API REST do Firestore em vez do SDK: o visitante não baixa o
// Firebase inteiro só para somar +1. As regras do app (firestore.rules) só
// aceitam +1 em UMA chave por escrita, e só em loja que existe.

const PROJETO = 'suacoxinhaapp'
const CHAVE_API = 'AIzaSyA1Be025Mhp9mcPOgCaJDml_dtIUP4hgwk' // pública, a mesma do app
const BASE = `projects/${PROJETO}/databases/(default)/documents`
const URL_COMMIT = `https://firestore.googleapis.com/v1/${BASE}:commit?key=${CHAVE_API}`

const ATIVO = !import.meta.env.DEV

const limpar = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30)

const ehRobo = () => navigator.webdriver || /bot|crawl|spider|lighthouse|preview/i.test(navigator.userAgent)

// Dia no fuso de Brasília, para o "hoje" da loja virar à meia-noite daqui.
const hoje = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())

const umaVez = (chave) => {
  try {
    if (sessionStorage.getItem(chave)) return false
    sessionStorage.setItem(chave, '1')
    return true
  } catch {
    return true
  }
}

// Soma `quanto` ao contador `chave` da loja (ou da 'raiz', a página inicial), no dia de hoje.
export function somar(loja, chave, quanto = 1) {
  if (!ATIVO || !loja || ehRobo()) return
  const nome = `${BASE}/sitePorLoja/${loja}/dias/${hoje()}`
  const corpo = {
    writes: [
      {
        update: { name: nome, fields: { _k: { stringValue: chave } } },
        updateMask: { fieldPaths: ['_k'] },
        updateTransforms: [{ fieldPath: chave, increment: { integerValue: String(Math.round(quanto)) } }],
      },
    ],
  }
  fetch(URL_COMMIT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    keepalive: true, // o clique no iFood abre outra aba: a contagem não pode se perder
  }).catch(() => {
    /* contador nunca pode quebrar o site */
  })
}

function origem() {
  const utm = new URLSearchParams(location.search).get('utm_source')
  if (utm) return limpar(utm) || 'outro'
  if (!document.referrer) return 'direto'
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, '')
    if (host === location.hostname.replace(/^www\./, '')) return null // navegação interna
    if (/instagram/.test(host)) return 'instagram'
    if (/facebook|fb\.com/.test(host)) return 'facebook'
    if (/google\./.test(host)) return 'google'
    if (/whatsapp|wa\.me/.test(host)) return 'whatsapp'
    if (/tiktok/.test(host)) return 'tiktok'
    if (/ifood/.test(host)) return 'ifood'
    return 'outro'
  } catch {
    return 'outro'
  }
}

const aparelho = () => (/Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'celular' : /iPad|Tablet/i.test(navigator.userAgent) ? 'tablet' : 'computador')

// Chamado a cada página de loja aberta.
export function contarPagina(loja) {
  somar(loja, 'pv')
  // Visita = primeira página da loja nesta aba. Origem e aparelho, uma vez por visita.
  if (umaVez(`sc-visita-${loja}`)) {
    somar(loja, 'visita')
    const de = origem()
    if (de) somar(loja, `src__${de}`)
    somar(loja, `dev__${aparelho()}`)
  }
}

// Eventos de clique (os mesmos nomes do Google Analytics).
// Na raiz, `params.destino` é a loja escolhida: soma em `loja__<slug>` na raiz e o
// clique (pedido no iFood, WhatsApp, mapa) também conta no painel daquela loja.
export function contarEvento(loja, nome, params = {}) {
  somar(loja, nome)
  if (params.destino) {
    somar(loja, `loja__${limpar(params.destino)}`)
    if (/^(pedido_|contato_)/.test(nome)) somar(params.destino, nome)
  }
  if (params.item && nome.startsWith('pedido_')) somar(loja, `item__${limpar(params.item)}`)
  if (nome === 'pedido_whatsapp' && params.value > 0) somar(loja, 'valor_whatsapp', params.value * 100)
}
