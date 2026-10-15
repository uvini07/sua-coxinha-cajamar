import { useCallback, useEffect, useState } from 'react'
import { buscarRelatorio, entrar, mensagemDeErro, observarUsuario, sair } from './firebase.js'
import Grafico from './Grafico.jsx'
import './painel.css'

// PAINEL DO FRANQUEADO (/painel)
//
// Entra quem tem conta de franqueado no app Sua Coxinha (mesmo e-mail, mesmo
// banco). Cada franqueado vê só a própria loja; o admin escolhe a loja ou a rede.
// Os números vêm do Google Analytics do site, pela função `relatorioSite` do app.

const PERIODOS = [
  { dias: 7, nome: '7 dias' },
  { dias: 28, nome: '28 dias' },
  { dias: 90, nome: '90 dias' },
]

const ORIGENS = {
  direto: 'Direto (link ou digitado)',
  google: 'Google',
  instagram: 'Instagram',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
  ifood: 'iFood',
  outro: 'Outros sites',
}
const APARELHOS = { celular: 'Celular', computador: 'Computador', tablet: 'Tablet' }

const inteiro = (n) => Math.round(n || 0).toLocaleString('pt-BR')
const reais = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const porcento = (n) => `${((n || 0) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`

export default function Painel({ navegar }) {
  const [usuario, setUsuario] = useState(undefined) // undefined = conferindo a sessão
  const [entrando, setEntrando] = useState(false)
  const [erroLogin, setErroLogin] = useState(null)

  useEffect(() => {
    document.title = 'Painel do franqueado | Sua Coxinha'
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)
    const parar = observarUsuario(setUsuario)
    return () => {
      parar()
      robots.remove()
    }
  }, [])

  const aoEntrar = async () => {
    setErroLogin(null)
    setEntrando(true)
    try {
      await entrar()
    } catch (erro) {
      setErroLogin(mensagemDeErro(erro))
    } finally {
      setEntrando(false)
    }
  }

  if (usuario === undefined) return <main className="painel painel--centro"><p className="painel__carregando">Carregando…</p></main>

  if (!usuario) {
    return (
      <main className="painel painel--centro">
        <section className="painel-login" aria-labelledby="painel-login-titulo">
          <img src="/assets/marca/logo-sua-coxinha.svg" alt="Sua Coxinha" className="painel-login__logo" />
          <h1 id="painel-login-titulo">Painel do franqueado</h1>
          <p>Veja como as pessoas usam o site da sua loja: visitas, de onde vêm e quantos pedidos começam por aqui.</p>
          <button type="button" className="painel-btn painel-btn--forte" onClick={aoEntrar} disabled={entrando}>
            <IconeGoogle /> {entrando ? 'Entrando…' : 'Entrar com Google'}
          </button>
          <p className="painel-login__nota">Use o mesmo e-mail da sua conta de franqueado no app Sua Coxinha.</p>
          {erroLogin && <p className="painel-erro" role="alert">{erroLogin}</p>}
          <a href="/" className="painel-login__voltar" onClick={(e) => { e.preventDefault(); navegar('/') }}>
            ← Voltar para o site
          </a>
        </section>
      </main>
    )
  }

  return <Relatorio usuario={usuario} />
}

function Relatorio({ usuario }) {
  const [dias, setDias] = useState(28)
  const [loja, setLoja] = useState('')
  const [estado, setEstado] = useState({ carregando: true, dados: null, erro: null })

  const carregar = useCallback(async () => {
    setEstado((e) => ({ ...e, carregando: true, erro: null }))
    try {
      const dados = await buscarRelatorio({ loja, dias })
      setEstado({ carregando: false, dados, erro: null })
      if (!loja) setLoja(dados.loja)
    } catch (erro) {
      setEstado({ carregando: false, dados: null, erro: mensagemDeErro(erro) || 'Algo deu errado.' })
    }
  }, [loja, dias])

  useEffect(() => {
    carregar()
  }, [carregar])

  const { carregando, dados, erro } = estado
  const admin = dados?.usuario.papel === 'admin'
  const nomeLoja = loja === 'todas' ? 'Toda a rede' : dados?.lojas.find((l) => l.id === (loja || dados.loja))?.nome

  return (
    <main className="painel">
      <header className="painel-topo">
        <div>
          <p className="painel-topo__marca">Sua Coxinha · Painel do franqueado</p>
          <h1 className="painel-topo__loja">{nomeLoja || 'Sua loja'}</h1>
        </div>
        <div className="painel-topo__conta">
          <span title={usuario.email}>{dados?.usuario.nome || usuario.displayName || usuario.email}</span>
          <button type="button" className="painel-btn" onClick={sair}>Sair</button>
        </div>
      </header>

      <div className="painel-filtros">
        {admin && (
          <label className="painel-select">
            <span>Loja</span>
            <select value={loja} onChange={(e) => setLoja(e.target.value)}>
              <option value="todas">Toda a rede</option>
              {dados.lojas.map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          </label>
        )}
        <div className="painel-periodos" role="group" aria-label="Período">
          {PERIODOS.map((p) => (
            <button
              key={p.dias}
              type="button"
              className="painel-chip"
              aria-pressed={dias === p.dias}
              onClick={() => setDias(p.dias)}
            >
              {p.nome}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <div className="painel-erro painel-erro--bloco" role="alert">
          <p>{erro}</p>
          {erro.includes('franqueado') ? (
            <button type="button" className="painel-btn" onClick={sair}>Entrar com outra conta</button>
          ) : (
            <button type="button" className="painel-btn" onClick={carregar}>Tentar de novo</button>
          )}
        </div>
      )}

      {!erro && !dados && <p className="painel__carregando">Buscando os números da loja…</p>}

      {dados && (
        <div className={`painel-corpo${carregando ? ' painel-corpo--atualizando' : ''}`} aria-busy={carregando}>
          <Conteudo dados={dados} />
        </div>
      )}
    </main>
  )
}

function Conteudo({ dados }) {
  // Contadores ausentes valem zero.
  const a = new Proxy(dados.atual, { get: (o, k) => o[k] || 0 })
  const aa = new Proxy(dados.anterior, { get: (o, k) => o[k] || 0 })
  const pedidos = a.pedido_ifood + a.pedido_food99 + a.pedido_whatsapp
  const pedidosAntes = aa.pedido_ifood + aa.pedido_food99 + aa.pedido_whatsapp
  const conversao = a.visita ? pedidos / a.visita : 0
  const conversaoAntes = aa.visita ? pedidosAntes / aa.visita : 0
  const semDados = a.visita === 0 && a.pv === 0

  return (
    <>
      <p className="painel-nota">
        Últimos {dados.dias} dias, comparado aos {dados.dias} dias anteriores. Atualizado{' '}
        {new Date(dados.geradoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}. Contagem anônima, sem
        dados pessoais.
      </p>

      {semDados && (
        <p className="painel-vazio">
          Ainda não há visitas registradas neste período. A contagem começa na primeira visita à página da loja.
        </p>
      )}

      <section aria-labelledby="t-visitas">
        <h2 id="t-visitas" className="painel-titulo">Visitas ao site</h2>
        <div className="painel-kpis">
          <Kpi nome="Visitas" valor={inteiro(a.visita)} atual={a.visita} antes={aa.visita} />
          <Kpi nome="Páginas vistas" valor={inteiro(a.pv)} atual={a.pv} antes={aa.pv} />
        </div>
      </section>

      <section aria-labelledby="t-pedidos">
        <h2 id="t-pedidos" className="painel-titulo">Pedidos que começaram no site</h2>
        <div className="painel-kpis">
          <Kpi nome="Cliques para pedir" valor={inteiro(pedidos)} atual={pedidos} antes={pedidosAntes} destaque />
          <Kpi nome="iFood" valor={inteiro(a.pedido_ifood)} atual={a.pedido_ifood} antes={aa.pedido_ifood} />
          <Kpi nome="99Food" valor={inteiro(a.pedido_food99)} atual={a.pedido_food99} antes={aa.pedido_food99} />
          <Kpi
            nome="Pedidos no WhatsApp"
            valor={inteiro(a.pedido_whatsapp)}
            atual={a.pedido_whatsapp}
            antes={aa.pedido_whatsapp}
            extra={a.valor_whatsapp ? `${reais(a.valor_whatsapp / 100)} em pedidos` : null}
          />
          <Kpi nome="Conversão" valor={porcento(conversao)} atual={conversao} antes={conversaoAntes} extra="cliques para pedir ÷ visitas" />
        </div>
        <p className="painel-nota">
          iFood e 99Food: quem clicou para pedir (o pedido é fechado no app deles). WhatsApp: pedidos montados no site e
          enviados para a loja.
        </p>
      </section>

      <section aria-labelledby="t-dia">
        <h2 id="t-dia" className="painel-titulo">Dia a dia</h2>
        <Grafico dias={dados.diario} />
      </section>

      <div className="painel-grade">
        <Lista id="t-origem" titulo="De onde vêm" itens={dados.origens.map((o) => ({ ...o, nome: ORIGENS[o.nome] || o.nome }))} />
        <Lista id="t-aparelho" titulo="Aparelho" itens={dados.aparelhos.map((o) => ({ ...o, nome: APARELHOS[o.nome] || o.nome }))} />
        {dados.itens && dados.itens.length > 0 && (
          <Lista id="t-itens" titulo="Produtos mais clicados" unidade="cliques" itens={dados.itens.map((i) => ({ ...i, nome: i.nome === 'loja' ? 'Botão geral da loja' : i.nome.replace(/-/g, ' ') }))} />
        )}
        <Lista
          id="t-contato"
          titulo="Contato"
          unidade="cliques"
          itens={[
            { nome: 'Abriu o carrinho do WhatsApp', valor: a.abrir_whatsapp },
            { nome: 'Ver no mapa', valor: a.contato_mapa },
            { nome: 'WhatsApp direto', valor: a.contato_whatsapp },
            { nome: 'Instagram', valor: a.contato_instagram },
            { nome: 'Telefone', valor: a.contato_telefone },
          ]}
        />
      </div>
    </>
  )
}

function Kpi({ nome, valor, atual, antes, extra, destaque }) {
  let variacao = null
  if (antes > 0) {
    const v = (atual - antes) / antes
    variacao = { texto: `${v >= 0 ? '+' : ''}${(v * 100).toFixed(0)}%`, sobe: v >= 0 }
  }
  return (
    <div className={`painel-kpi${destaque ? ' painel-kpi--destaque' : ''}`}>
      <p className="painel-kpi__nome">{nome}</p>
      <p className="painel-kpi__valor">{valor}</p>
      {variacao && (
        <p className={`painel-kpi__var painel-kpi__var--${variacao.sobe ? 'sobe' : 'desce'}`}>
          <span aria-hidden="true">{variacao.sobe ? '▲' : '▼'}</span> {variacao.texto}
          <span className="sr-only"> em relação ao período anterior</span>
        </p>
      )}
      {extra && <p className="painel-kpi__extra">{extra}</p>}
    </div>
  )
}

function Lista({ id, titulo, itens, unidade = 'visitas' }) {
  const max = Math.max(1, ...itens.map((i) => i.valor))
  return (
    <section className="painel-lista" aria-labelledby={id}>
      <h2 id={id} className="painel-titulo">{titulo}</h2>
      {itens.length === 0 ? (
        <p className="painel-nota">Sem dados no período.</p>
      ) : (
        <ul>
          {itens.map((i) => (
            <li key={i.nome}>
              <div className="painel-lista__linha">
                <span>{i.nome}</span>
                <strong>{inteiro(i.valor)}<span className="sr-only"> {unidade}</span></strong>
              </div>
              <div className="painel-lista__barra" aria-hidden="true">
                <span style={{ width: `${(i.valor / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function IconeGoogle() {
  return (
    <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}
