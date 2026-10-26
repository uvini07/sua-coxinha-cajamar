// GOOGLE ANALYTICS 4
//
// Um só fluxo de dados para a rede inteira. O que separa uma franquia da outra é
// o parâmetro `loja` (o slug: cajamar, jundiai...) que vai em TODO evento. No GA4
// ele precisa estar cadastrado como dimensão personalizada "loja" (escopo: evento)
// — é por ela que o painel /painel filtra os números de cada franqueado.
//
// O script do Google só é baixado depois do aceite de cookies (consentimento.js).
// Em desenvolvimento nada é enviado. O ID é público (aparece no código de
// qualquer site com GA); VITE_GA_MEASUREMENT_ID troca por outro, se precisar.

import { aoMudarConsentimento, lerConsentimento } from './consentimento.js'
import { contarEvento, contarPagina } from './contadores.js'

const ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-MCD6NPQGCK' // fluxo Web "Site Sua Coxinha"
const ATIVO = Boolean(ID) && !import.meta.env.DEV

let carregado = false
let lojaAtual = null
let contadorAtual = null // onde os contadores do painel somam: a loja, ou 'raiz' na página inicial
const fila = [] // eventos de antes do aceite: só saem se a pessoa aceitar

function gtag() {
  window.dataLayer.push(arguments)
}

function carregar() {
  if (carregado || !ATIVO) return
  carregado = true
  window.dataLayer = window.dataLayer || []
  window.gtag = gtag
  gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  gtag('js', new Date())
  // page_view é enviado à mão, a cada troca de rota, já com a loja.
  gtag('config', ID, { send_page_view: false, anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`
  document.head.appendChild(s)
  fila.splice(0).forEach(([nome, params]) => gtag('event', nome, params))
}

const permitido = () => lerConsentimento()?.estatisticas === true

export function iniciarAnalytics() {
  if (permitido()) carregar()
  aoMudarConsentimento((c) => {
    if (c.estatisticas) carregar()
    else if (carregado) gtag('consent', 'update', { analytics_storage: 'denied' })
  })
}

// Loja da página aberta agora (null na escolha de loja, no jogo, no painel).
// `contador`: onde somar os contadores do painel (a própria loja, ou 'raiz' na página inicial).
export function definirLoja(slug, contador = slug) {
  lojaAtual = slug || null
  contadorAtual = contador || null
}

export function rastrear(nome, params = {}) {
  // Contadores anônimos do painel: valem sempre, sem cookie (contadores.js).
  if (contadorAtual && nome !== 'page_view') contarEvento(contadorAtual, nome, params)
  if (!ATIVO) return
  const completo = { loja: lojaAtual ?? 'rede', ...params }
  const consent = lerConsentimento()
  if (consent?.estatisticas) {
    carregar()
    gtag('event', nome, completo)
  } else if (!consent && fila.length < 30) {
    fila.push([nome, completo])
  }
}

export function rastrearPagina() {
  if (contadorAtual) contarPagina(contadorAtual)
  rastrear('page_view', {
    page_location: location.href,
    page_path: location.pathname,
    page_title: document.title,
  })
}
