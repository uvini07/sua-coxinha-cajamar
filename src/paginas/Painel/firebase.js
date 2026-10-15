// FIREBASE DO PAINEL — o mesmo projeto do app (suacoxinhaapp).
//
// O site não tem login para clientes. Só o painel do franqueado usa o Firebase:
// a pessoa entra com o Google usando o e-mail cadastrado como franqueado no app
// (equipe/{email}), e a função `relatorioSite` devolve os números da loja dela.
//
// Esta configuração é pública por natureza (viaja em qualquer app web do
// Firebase). Quem protege os dados é a função, que confere o cadastro no banco.
// Para apontar para outro projeto, use as variáveis VITE_FIREBASE_* no .env.local.

import { getApp, getApps, initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'

const env = import.meta.env

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyA1Be025Mhp9mcPOgCaJDml_dtIUP4hgwk',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'suacoxinhaapp.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'suacoxinhaapp',
  appId: env.VITE_FIREBASE_APP_ID || '1:132936922966:web:c9e8685a094b8715a908f7',
}

// Mesma região das funções do app (REGIAO_FUNCOES no workflow de lá).
const REGIAO = env.VITE_FUNCOES_REGIAO || 'southamerica-east1'

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

const chamarRelatorio = httpsCallable(getFunctions(app, REGIAO), 'relatorioSite')

export async function buscarRelatorio({ loja, dias }) {
  const { data } = await chamarRelatorio({ loja, dias })
  return data
}

// Mensagem legível para os erros do login e da função.
export function mensagemDeErro(erro) {
  const codigo = String(erro?.code || '')
  if (codigo.includes('popup-closed') || codigo.includes('cancelled-popup')) return null
  if (codigo.includes('popup-blocked')) return 'O navegador bloqueou a janela de login. Libere pop-ups para este site.'
  if (codigo.includes('unauthorized-domain')) return 'Este endereço ainda não está liberado no login do Firebase.'
  if (codigo.includes('permission-denied') || codigo.includes('unauthenticated') || codigo.includes('failed-precondition') || codigo.includes('unavailable')) {
    return erro.message
  }
  return 'Algo deu errado. Confira a internet e tente de novo.'
}
