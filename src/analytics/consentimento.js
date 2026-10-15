// CONSENTIMENTO DE COOKIES (LGPD)
//
// Nada de analytics roda antes de a pessoa escolher. A escolha fica num cookie
// próprio (`sc_consentimento`, 1 ano), que é estritamente necessário e por isso
// não depende de aceite. Mudou de ideia? O link "Cookies" no rodapé reabre o aviso.
//
// Categorias:
//   necessarios — escolha de cookies, login do painel. Sempre ligados.
//   estatisticas — Google Analytics: visitas e cliques de cada loja.

const COOKIE = 'sc_consentimento'
const VERSAO = 1 // suba quando mudar o texto ou as categorias: pede o aceite de novo
const UM_ANO = 60 * 60 * 24 * 365

const ouvintes = new Set()

function lerCookie(nome) {
  const par = document.cookie.split('; ').find((c) => c.startsWith(`${nome}=`))
  return par ? decodeURIComponent(par.slice(nome.length + 1)) : null
}

export function lerConsentimento() {
  try {
    const valor = JSON.parse(lerCookie(COOKIE) || 'null')
    return valor && valor.v === VERSAO ? valor : null
  } catch {
    return null
  }
}

export function salvarConsentimento({ estatisticas }) {
  const valor = { v: VERSAO, estatisticas: Boolean(estatisticas), em: new Date().toISOString() }
  const seguro = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(valor))}; Max-Age=${UM_ANO}; Path=/; SameSite=Lax${seguro}`
  if (!valor.estatisticas) apagarCookiesGoogle()
  ouvintes.forEach((fn) => fn(valor))
  return valor
}

export function aoMudarConsentimento(fn) {
  ouvintes.add(fn)
  return () => ouvintes.delete(fn)
}

// Pedido para reabrir o aviso (link "Cookies" do rodapé).
export const EVENTO_ABRIR = 'sc:abrir-cookies'
export const abrirPreferencias = () => window.dispatchEvent(new Event(EVENTO_ABRIR))

// Quem recusa depois de ter aceitado: tira os _ga* do navegador.
function apagarCookiesGoogle() {
  const host = location.hostname
  const dominios = ['', host, `.${host}`, `.${host.replace(/^www\./, '')}`]
  document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((nome) => nome === '_ga' || nome.startsWith('_ga_') || nome === '_gid')
    .forEach((nome) =>
      dominios.forEach((d) => {
        document.cookie = `${nome}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ''}`
      }),
    )
}
