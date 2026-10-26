// FIREBASE DO PAINEL — o mesmo projeto do app (suacoxinhaapp).
//
// O site não tem login para clientes. Só o painel do franqueado usa o Firebase:
// a pessoa entra com o Google usando o e-mail cadastrado como franqueado no app
// (equipe/{email}), e o painel lê os contadores da loja dela em
// sitePorLoja/{loja}/dias (gravados pelo site, ver src/analytics/contadores.js).
// Tudo no plano gratuito do Firebase: sem servidor, sem chave.
//
// Esta configuração é pública por natureza (viaja em qualquer app web do
// Firebase). Quem protege os dados é a função, que confere o cadastro no banco.
// Para apontar para outro projeto, use as variáveis VITE_FIREBASE_* no .env.local.

import { getApp, getApps, initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { collection, doc, documentId, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'

const env = import.meta.env

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyA1Be025Mhp9mcPOgCaJDml_dtIUP4hgwk',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'suacoxinhaapp.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'suacoxinhaapp',
  appId: env.VITE_FIREBASE_APP_ID || '1:132936922966:web:c9e8685a094b8715a908f7',
}

const app = getApps().length ? getApp() : initializeApp(config)
const auth = getAuth(app)
const db = getFirestore(app)
auth.languageCode = 'pt-BR'

export const observarUsuario = (fn) => onAuthStateChanged(auth, fn)

export function entrar() {
  const provedor = new GoogleAuthProvider()
  provedor.setCustomParameters({ prompt: 'select_account' })
  return signInWithPopup(auth, provedor)
}

export const sair = () => signOut(auth)

class ErroRelatorio extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const EMAIL_ADMIN = 'marcelinhojordao07@gmail.com' // igual a souAdmin() em firestore.rules do app

const diaISO = (data) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(data)
const somarDias = (iso, n) => {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// Quem está logado e quais lojas pode ver. As regras do Firestore conferem de novo.
async function quemSou() {
  const email = String(auth.currentUser?.email || '').toLowerCase()
  if (email === EMAIL_ADMIN) {
    const snap = await getDocs(collection(db, 'lojas'))
    const lojas = snap.docs
      .map((d) => ({ id: d.id, nome: d.get('nome') || d.id }))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    return { email, papel: 'admin', nome: 'Administrador', lojas }
  }
  const membro = await getDoc(doc(db, 'equipe', email)).catch(() => null)
  if (!membro?.exists() || membro.get('ativo') !== true || membro.get('papel') !== 'franqueado') {
    throw new ErroRelatorio('permission-denied', 'Esta conta não é de franqueado. Use o e-mail cadastrado no app.')
  }
  const loja = membro.get('loja')
  const docLoja = await getDoc(doc(db, 'lojas', loja)).catch(() => null)
  return { email, papel: 'franqueado', nome: membro.get('nome') || email, lojas: [{ id: loja, nome: docLoja?.get('nome') || loja }] }
}

// Contadores de uma loja entre dois dias (inclusive): { 'AAAA-MM-DD': { pv, visita, ... } }
async function lerDias(loja, de, ate) {
  const snap = await getDocs(
    query(collection(db, 'sitePorLoja', loja, 'dias'), where(documentId(), '>=', de), where(documentId(), '<=', ate)),
  )
  const out = {}
  snap.docs.forEach((d) => {
    const { _k, ...resto } = d.data()
    out[d.id] = resto
  })
  return out
}

export async function buscarRelatorio({ loja, dias }) {
  let quem
  try {
    quem = await quemSou()
  } catch (erro) {
    if (erro instanceof ErroRelatorio) throw erro
    throw new ErroRelatorio('unavailable', 'Não foi possível ler o cadastro agora. Tente de novo.')
  }
  // 'raiz' = página inicial do site (não é loja; só o admin vê)
  const escolhida = quem.papel === 'franqueado' ? quem.lojas[0].id
    : loja === 'todas' || loja === 'raiz' || quem.lojas.some((l) => l.id === loja) ? loja : quem.lojas[0]?.id || 'todas'
  const ids = escolhida === 'todas' ? quem.lojas.map((l) => l.id) : [escolhida]

  const fim = diaISO(new Date())
  const inicio = somarDias(fim, -(dias - 1))
  const inicioAntes = somarDias(inicio, -dias)

  let porLoja
  try {
    porLoja = await Promise.all(ids.map((id) => lerDias(id, inicioAntes, fim)))
  } catch {
    throw new ErroRelatorio('unavailable', 'Não foi possível ler os números agora. Tente de novo.')
  }

  // Soma as lojas dia a dia.
  const porDia = {}
  porLoja.forEach((diasDaLoja) =>
    Object.entries(diasDaLoja).forEach(([dia, cont]) => {
      porDia[dia] ??= {}
      Object.entries(cont).forEach(([k, v]) => (porDia[dia][k] = (porDia[dia][k] || 0) + (Number(v) || 0)))
    }),
  )

  const somar = (de, ate) => {
    const t = {}
    Object.entries(porDia).forEach(([dia, cont]) => {
      if (dia < de || dia > ate) return
      Object.entries(cont).forEach(([k, v]) => (t[k] = (t[k] || 0) + v))
    })
    return t
  }
  const atual = somar(inicio, fim)
  const anterior = somar(inicioAntes, somarDias(inicio, -1))
  const grupo = (prefixo) =>
    Object.entries(atual)
      .filter(([k]) => k.startsWith(`${prefixo}__`))
      .map(([k, v]) => ({ nome: k.slice(prefixo.length + 2), valor: v }))
      .sort((a, b) => b.valor - a.valor)

  const diario = []
  for (let d = inicio; d <= fim; d = somarDias(d, 1)) {
    const c = porDia[d] || {}
    diario.push({ data: d, visitantes: c.visita || 0, visualizacoes: c.pv || 0, pedidos: (c.pedido_ifood || 0) + (c.pedido_food99 || 0) + (c.pedido_whatsapp || 0) })
  }

  return {
    usuario: { email: quem.email, nome: quem.nome, papel: quem.papel },
    loja: escolhida,
    lojas: quem.lojas,
    dias,
    geradoEm: new Date().toISOString(),
    atual,
    anterior,
    diario,
    origens: grupo('src'),
    aparelhos: grupo('dev'),
    itens: grupo('item'),
    destinos: grupo('loja'),
  }
}

// Mensagem legível para os erros do login e da função.
export function mensagemDeErro(erro) {
  const codigo = String(erro?.code || '')
  if (codigo.includes('popup-closed') || codigo.includes('cancelled-popup')) return null
  if (codigo.includes('popup-blocked')) return 'O navegador bloqueou a janela de login. Libere pop-ups para este site.'
  if (codigo.includes('unauthorized-domain')) return 'Este endereço ainda não está liberado no login do Firebase.'
  // Erros da nossa função já vêm com mensagem em português.
  if (erro instanceof ErroRelatorio) return erro.message
  return 'Algo deu errado. Confira a internet e tente de novo.'
}
