// FIREBASE DO PAINEL — o mesmo projeto do app (suacoxinhaapp).
//
// O site não tem login para clientes. Só o painel do franqueado usa o Firebase:
// a pessoa entra com o Google usando o e-mail cadastrado como franqueado no app
// (equipe/{email}), e a função /api/relatorio (na Vercel, gratuita) devolve os
// números da loja dela.
//
// Esta configuração é pública por natureza (viaja em qualquer app web do
// Firebase). Quem protege os dados é a função, que confere o cadastro no banco.
// Para apontar para outro projeto, use as variáveis VITE_FIREBASE_* no .env.local.

import { getApp, getApps, initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'

const env = import.meta.env

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyA1Be025Mhp9mcPOgCaJDml_dtIUP4hgwk',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'suacoxinhaapp.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'suacoxinhaapp',
  appId: env.VITE_FIREBASE_APP_ID || '1:132936922966:web:c9e8685a094b8715a908f7',
}

const app = getApps().length ? getApp() : initializeApp(config)
const auth = getAuth(app)
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

// O token do login vai junto: é com ele que a função confere quem é a pessoa.
export async function buscarRelatorio({ loja, dias }) {
  const token = await auth.currentUser?.getIdToken()
  const params = new URLSearchParams({ dias: String(dias), loja: loja || '' })
  let resp
  try {
    resp = await fetch(`/api/relatorio?${params}`, { headers: { Authorization: `Bearer ${token}` } })
  } catch {
    throw new ErroRelatorio('network', 'Sem conexão. Confira a internet e tente de novo.')
  }
  const corpo = await resp.json().catch(() => null)
  if (!resp.ok) {
    throw new ErroRelatorio(corpo?.erro?.codigo || 'internal', corpo?.erro?.mensagem || 'Algo deu errado. Tente de novo.')
  }
  return corpo
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
