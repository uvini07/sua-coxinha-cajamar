// RELATÓRIO DO PAINEL — função gratuita da Vercel (plano Hobby), em /api/relatorio
//
// Chamada pelo /painel com o login do Firebase (o mesmo do app). Ela:
//   1. confere o token do login com as chaves públicas do Google;
//   2. lê equipe/{email} no Firestore COM O TOKEN DA PRÓPRIA PESSOA — as regras
//      do app já deixam cada um ler o próprio cadastro, então não precisa de
//      chave de administrador nem do plano Blaze;
//   3. devolve os números do Google Analytics SÓ da loja daquele franqueado.
//      O admin vê todas as lojas.
//
// Variáveis na Vercel (Settings → Environment Variables):
//   GA_PROPERTY_ID   número da propriedade do GA4
//   GA_CREDENTIALS   JSON inteiro da chave da conta de serviço que lê o GA4
// Passo a passo em ANALYTICS.md.

import { createRemoteJWKSet, jwtVerify } from 'jose'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { consultar } from './_ga.js'

const PROJETO = process.env.FIREBASE_PROJECT_ID || 'suacoxinhaapp'
const EMAIL_ADMIN = 'marcelinhojordao07@gmail.com' // igual a souAdmin() em firestore.rules do app
const PERIODOS = [7, 28, 90]
const CACHE_MS = 10 * 60 * 1000 // o GA4 atualiza devagar; poupa a cota da API

const chavesGoogle = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)
const FIRESTORE = `https://firestore.googleapis.com/v1/projects/${PROJETO}/databases/(default)/documents`

let cliente = null
const cache = new Map()

class ErroPainel extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem)
    this.status = status
    this.codigo = codigo
  }
}

async function verificarLogin(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) throw new ErroPainel(401, 'unauthenticated', 'Entre com a sua conta Google.')
  try {
    const { payload } = await jwtVerify(token, chavesGoogle, {
      issuer: `https://securetoken.google.com/${PROJETO}`,
      audience: PROJETO,
    })
    if (!payload.email || payload.email_verified !== true) {
      throw new ErroPainel(403, 'permission-denied', 'E-mail não verificado.')
    }
    return { token, email: String(payload.email).toLowerCase() }
  } catch (erro) {
    if (erro instanceof ErroPainel) throw erro
    throw new ErroPainel(401, 'unauthenticated', 'Sua sessão expirou. Entre de novo.')
  }
}

// Lê do Firestore como a própria pessoa (as regras do app decidem o que ela pode ver).
async function lerFirestore(caminho, token) {
  const resp = await fetch(`${FIRESTORE}/${caminho}`, { headers: { Authorization: `Bearer ${token}` } })
  if (resp.status === 404 || resp.status === 403) return null
  if (!resp.ok) throw new ErroPainel(502, 'unavailable', 'Não foi possível ler o cadastro agora.')
  return resp.json()
}

const campo = (doc, nome) => {
  const v = doc?.fields?.[nome]
  return v ? (v.stringValue ?? v.booleanValue ?? v.integerValue ?? null) : null
}
const idDoc = (doc) => doc.name.split('/').pop()

async function autorizar({ token, email }, lojaPedida) {
  if (email === EMAIL_ADMIN) {
    const lista = await lerFirestore('lojas?pageSize=200', token)
    const lojas = (lista?.documents || [])
      .map((d) => ({ id: idDoc(d), nome: campo(d, 'nome') || idDoc(d) }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    const loja = lojaPedida === 'todas' || lojas.some((l) => l.id === lojaPedida) ? lojaPedida : lojas[0]?.id || 'todas'
    return { email, papel: 'admin', nome: 'Administrador', loja, lojas }
  }

  const membro = await lerFirestore(`equipe/${encodeURIComponent(email)}`, token)
  if (!membro || campo(membro, 'ativo') !== true || campo(membro, 'papel') !== 'franqueado') {
    throw new ErroPainel(403, 'permission-denied', 'Esta conta não é de franqueado. Use o e-mail cadastrado no app.')
  }
  const loja = campo(membro, 'loja')
  const docLoja = await lerFirestore(`lojas/${encodeURIComponent(loja)}`, token)
  return {
    email,
    papel: 'franqueado',
    nome: campo(membro, 'nome') || email,
    loja,
    lojas: [{ id: loja, nome: campo(docLoja, 'nome') || loja }],
  }
}

function clienteGA() {
  if (cliente) return cliente
  let chave
  try {
    chave = JSON.parse(process.env.GA_CREDENTIALS || '')
  } catch {
    throw new ErroPainel(503, 'failed-precondition', 'Analytics ainda não configurado (GA_CREDENTIALS).')
  }
  cliente = new BetaAnalyticsDataClient({
    credentials: { client_email: chave.client_email, private_key: chave.private_key },
    projectId: chave.project_id,
  })
  return cliente
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex')
  try {
    if (req.method !== 'GET') throw new ErroPainel(405, 'invalid-argument', 'Método não permitido.')
    const propriedade = process.env.GA_PROPERTY_ID
    if (!propriedade) throw new ErroPainel(503, 'failed-precondition', 'Analytics ainda não configurado (GA_PROPERTY_ID).')

    const dias = PERIODOS.includes(Number(req.query.dias)) ? Number(req.query.dias) : 28
    const quem = await autorizar(await verificarLogin(req), String(req.query.loja || ''))

    const chave = `${quem.loja}:${dias}`
    const guardado = cache.get(chave)
    let dados = guardado && Date.now() - guardado.em < CACHE_MS ? guardado.dados : null
    const geradoEm = dados ? guardado.em : Date.now()
    if (!dados) {
      const ga = clienteGA()
      try {
        dados = await consultar(ga, propriedade, quem.loja, quem.lojas.map((l) => l.id), dias)
      } catch (erro) {
        console.error('GA4', erro)
        throw new ErroPainel(502, 'unavailable', 'Não foi possível ler o Google Analytics agora. Tente de novo em instantes.')
      }
      cache.set(chave, { em: geradoEm, dados })
    }

    res.status(200).json({
      usuario: { email: quem.email, nome: quem.nome, papel: quem.papel },
      loja: quem.loja,
      lojas: quem.lojas,
      dias,
      geradoEm: new Date(geradoEm).toISOString(),
      ...dados,
    })
  } catch (erro) {
    if (!(erro instanceof ErroPainel)) console.error(erro)
    const e = erro instanceof ErroPainel ? erro : new ErroPainel(500, 'internal', 'Algo deu errado. Tente de novo.')
    res.status(e.status).json({ erro: { codigo: e.codigo, mensagem: e.message } })
  }
}
