import { useEffect } from 'react'
import { abrirPreferencias } from '../analytics/consentimento.js'
import '../styles/paginas/politica.css'

// Política de cookies (/cookies). Texto curto e direto, linkado pelo aviso.
export default function PoliticaCookies({ navegar }) {
  useEffect(() => {
    document.title = 'Política de cookies | Sua Coxinha'
  }, [])

  const voltar = (e) => {
    e.preventDefault()
    if (history.length > 1) history.back()
    else navegar('/')
  }

  return (
    <main className="politica">
      <a className="politica__voltar" href="/" onClick={voltar}>← Voltar</a>
      <h1>Política de cookies</h1>
      <p>Atualizada em outubro de 2026.</p>

      <h2>O que são cookies</h2>
      <p>
        Cookies são pequenos arquivos que o site guarda no seu navegador. Alguns são necessários para o site funcionar;
        outros só são usados se você permitir.
      </p>

      <h2>Cookies que usamos</h2>
      <table>
        <thead>
          <tr><th>Nome</th><th>Para quê</th><th>Duração</th><th>Tipo</th></tr>
        </thead>
        <tbody>
          <tr><td>sc_consentimento</td><td>Guarda a sua escolha sobre cookies.</td><td>1 ano</td><td>Essencial</td></tr>
          <tr><td>Login do painel (Firebase)</td><td>Mantém o franqueado conectado em /painel. Só existe para quem entra no painel.</td><td>Até sair</td><td>Essencial</td></tr>
          <tr><td>_ga, _ga_*</td><td>Google Analytics: conta visitas e cliques nos botões de pedido de cada loja, de forma estatística, com IP anonimizado.</td><td>Até 2 anos</td><td>Estatística (opcional)</td></tr>
        </tbody>
      </table>

      <p>
        Não usamos cookies de anúncios nem vendemos dados. Os números de cada loja são vistos apenas pelo franqueado
        responsável por ela.
      </p>

      <h2>Como mudar sua escolha</h2>
      <p>
        <button type="button" className="politica__btn" onClick={abrirPreferencias}>Mudar preferências de cookies</button>
      </p>
      <p>
        Você também pode apagar os cookies pelas configurações do seu navegador. Dúvidas sobre seus dados: fale com a
        loja pelo WhatsApp.
      </p>
    </main>
  )
}
