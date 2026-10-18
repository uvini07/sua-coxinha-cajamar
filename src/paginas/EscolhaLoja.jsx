import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { abrirPreferencias } from '../analytics/consentimento.js'
import { lojasResumo } from '../lojas/carregador.js'
import Logo from '../components/Logo.jsx'
import { distanciaKm, formatarDistancia } from './escolha/distancia.js'
import PedirRapido from './escolha/PedirRapido.jsx'
import SecaoJogos from '../components/jogos/SecaoJogos.jsx'
import BolinhaJogos from '../components/jogos/BolinhaJogos.jsx'
import '../styles/paginas/escolha.css'

// O Leaflet só é baixado quando a página abre, sem travar a lista.
const MapaLojas = lazy(() => import('./escolha/MapaLojas.jsx'))

// Volta o título, a cor e o manifest pros da rede, caso a pessoa tenha navegado
// de uma loja (LojaProvider troca esses metas) de volta pra cá, pela SPA.
function resetarMetasDaRede() {
  document.title = 'Sua Coxinha | Escolha a sua loja'
  const meta = (seletor, valor) => document.head.querySelector(seletor)?.setAttribute('content', valor)
  meta('meta[name="theme-color"]', '#131313')
  meta('meta[name="apple-mobile-web-app-title"]', 'Sua Coxinha')
  document.head.querySelector('link[rel="manifest"]')?.setAttribute('href', '/manifest.webmanifest')
}

const lojasNoMapa = lojasResumo.filter((l) => Array.isArray(l.coords))

// Cidades para os filtros: as com mais lojas primeiro.
const cidades = Object.entries(
  lojasResumo.reduce((acc, l) => ({ ...acc, [l.municipio]: (acc[l.municipio] || 0) + 1 }), {}),
)
  .map(([nome, total]) => ({ nome, total }))
  .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, 'pt-BR'))

// Busca sem acento e sem diferença de maiúscula: "jundiai" acha "Jundiaí".
const normalizar = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const linkWhatsapp = (numero) => `https://wa.me/${numero}`

// Por enquanto a raiz não leva para a página de cada loja (/cajamar, /jundiai…):
// os cartões mostram a loja com WhatsApp e mapa. Para religar, troque para true.
const LINK_PARA_LOJA = false

// Raiz do site: encontra a loja mais perto, no mapa ou na lista, e leva para o cardápio dela.
// Cresce sozinha: toda loja cadastrada em src/lojas aparece aqui (e no mapa, se tiver `coords`).
export default function EscolhaLoja({ navegar, aviso = null }) {
  useEffect(resetarMetasDaRede, [])

  const [cidade, setCidade] = useState(null)
  const [posicao, setPosicao] = useState(null)
  const [localizando, setLocalizando] = useState(false)
  const [erroLocal, setErroLocal] = useState(null)
  const [selecionada, setSelecionada] = useState(null)
  const [busca, setBusca] = useState('')
  // O mapa começa fechado (e o Leaflet nem é baixado): abre em "Achar a loja
  // mais perto", "Ver no mapa" ou no ícone de mapa de um cartão.
  const [mapaAberto, setMapaAberto] = useState(false)
  const [foco, setFoco] = useState(() => ({ pontos: lojasNoMapa.map((l) => l.coords) }))
  const mapaRef = useRef(null)
  const introRef = useRef(null)

  const abrir = (slug) => (e) => {
    e.preventDefault()
    navegar(`/${slug}`)
  }

  // Lista visível: filtrada pela cidade; com localização, da mais perto para a mais longe.
  const lojas = useMemo(() => {
    const termo = normalizar(busca)
    const base = lojasResumo.filter(
      (l) =>
        (!cidade || l.municipio === cidade) &&
        (!termo || normalizar(`${l.unit} ${l.municipio} ${l.bairro} ${l.endereco}`).includes(termo)),
    )
    const comDistancia = base.map((l) => ({ ...l, km: posicao && l.coords ? distanciaKm(posicao, l.coords) : null }))
    return posicao ? [...comDistancia].sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9)) : comDistancia
  }, [cidade, posicao, busca])

  // Para a bolinha "Pedir": todas as lojas, a mais perto primeiro quando há localização.
  const todasPorDistancia = useMemo(() => {
    const comKm = lojasResumo.map((l) => ({ ...l, km: posicao && l.coords ? distanciaKm(posicao, l.coords) : null }))
    return posicao ? comKm.sort((a, b) => (a.km ?? 1e9) - (b.km ?? 1e9)) : comKm
  }, [posicao])
  const listaRef = useRef(null)

  const noMapa = useMemo(() => lojas.filter((l) => l.coords), [lojas])
  const loja = selecionada ? lojas.find((l) => l.slug === selecionada) : null

  const filtrar = (nome) => {
    const nova = nome === cidade ? null : nome
    setCidade(nova)
    setSelecionada(null)
    const pontos = (nova ? lojasNoMapa.filter((l) => l.municipio === nova) : lojasNoMapa).map((l) => l.coords)
    setFoco({ pontos })
  }

  const usarLocalizacao = () => {
    if (!navigator.geolocation) {
      setErroLocal('Seu navegador não informa a localização. Escolha a cidade abaixo.')
      return
    }
    setLocalizando(true)
    setErroLocal(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const aqui = [coords.latitude, coords.longitude]
        const perto = [...lojasNoMapa].sort((a, b) => distanciaKm(aqui, a.coords) - distanciaKm(aqui, b.coords))
        setPosicao(aqui)
        setCidade(null)
        setBusca('')
        setMapaAberto(true)
        setTimeout(() => mapaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
        // a lista volta a mostrar todas, da mais perto para a mais longe
        setSelecionada(perto[0]?.slug ?? null)
        setFoco({ pontos: [aqui, ...perto.slice(0, 2).map((l) => l.coords)] })
        setLocalizando(false)
      },
      (erro) => {
        setLocalizando(false)
        setErroLocal(
          erro.code === erro.PERMISSION_DENIED
            ? 'Sem permissão para a localização. Tudo bem: escolha a cidade abaixo.'
            : 'Não deu para achar sua localização agora. Escolha a cidade abaixo.',
        )
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }

  const verNoMapa = useCallback((slug) => {
    setSelecionada(slug)
    setMapaAberto(true)
    // espera o mapa aparecer na tela antes de rolar até ele
    setTimeout(() => mapaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }, [])

  // Agrupa por cidade quando não há localização (com localização, a ordem é a distância).
  const grupos = useMemo(() => {
    if (posicao) return [{ nome: null, lojas }]
    const mapa = new Map()
    lojas.forEach((l) => mapa.set(l.municipio, [...(mapa.get(l.municipio) || []), l]))
    return cidades.filter((c) => mapa.has(c.nome)).map((c) => ({ nome: c.nome, lojas: mapa.get(c.nome) }))
  }, [lojas, posicao])

  return (
    <main className="escolha">
      <div className={`escolha__painel${mapaAberto ? ' escolha__painel--mapa' : ''}`}>
        <header className="escolha__topo">
          <Logo className="escolha__logo" />
          <a className="escolha__franquia" href="https://franquia.suacoxinha.com.br" target="_blank" rel="noopener noreferrer">
            Seja franqueado
          </a>
        </header>

        {/* Destaque da primeira tela: os jogos. O aviso embaixo mostra que as lojas vêm depois. */}
        <SecaoJogos navegar={navegar} className="jogos--escolha">
          <button
            type="button"
            className="jogos__rolar"
            onClick={() => introRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            Role para achar a sua loja
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </SecaoJogos>

        {aviso && <p className="escolha__aviso" role="status">{aviso}</p>}

        <section className="escolha__intro" aria-labelledby="escolha-titulo" ref={introRef}>
          <h1 id="escolha-titulo" className="escolha__titulo display">
            Tem Sua Coxinha perto de você
          </h1>
          <p className="escolha__sub">
            {lojasResumo.length} lojas em {cidades.length} cidades. Ache a mais perto de você e fale com ela.
          </p>
          <button type="button" className="escolha__local" onClick={usarLocalizacao} disabled={localizando}>
            <IconeAlvo />
            {localizando ? 'Procurando você…' : posicao ? 'Atualizar minha localização' : 'Achar a loja mais perto'}
          </button>
          <button type="button" className="escolha__vermapa" onClick={() => setMapaAberto((v) => !v)} aria-expanded={mapaAberto}>
            <IconeMapa />
            {mapaAberto ? 'Esconder o mapa' : 'Ver as lojas no mapa'}
          </button>
          {erroLocal && <p className="escolha__erro" role="alert">{erroLocal}</p>}
        </section>

        <div className="escolha__busca" role="search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Buscar cidade, bairro ou loja"
            aria-label="Buscar loja por cidade, bairro ou nome"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button type="button" className="escolha__limpar" onClick={() => setBusca('')} aria-label="Limpar busca">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>

        {mapaAberto && (
        <div className="escolha__mapa" ref={mapaRef}>
          <Suspense fallback={<div className="mapa-lojas mapa-lojas--carregando" aria-hidden="true" />}>
            <MapaLojas lojas={noMapa} selecionada={selecionada} posicao={posicao} foco={foco} onSelecionar={setSelecionada} />
          </Suspense>
          {loja && (
            <article className="escolha__flutuante" aria-live="polite" aria-label={`Loja selecionada: ${loja.nome}`}>
              <button type="button" className="escolha__fechar" onClick={() => setSelecionada(null)} aria-label="Fechar">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
              </button>
              <p className="escolha__flutuante-cidade">
                {loja.municipio}
                {loja.km != null && <span> · {formatarDistancia(loja.km)}</span>}
              </p>
              <h2 className="escolha__flutuante-nome">{loja.apelido}</h2>
              <p className="escolha__flutuante-end">{loja.bairro}</p>
              <div className="escolha__acoes">
                {LINK_PARA_LOJA ? (
                  <a className="escolha__btn escolha__btn--forte" href={`/${loja.slug}`} onClick={abrir(loja.slug)}>
                    Ver cardápio e pedir
                  </a>
                ) : (
                  loja.whatsapp && (
                    <a className="escolha__btn escolha__btn--forte" href={linkWhatsapp(loja.whatsapp)} target="_blank" rel="noopener noreferrer">
                      Falar no WhatsApp
                    </a>
                  )
                )}
                {loja.maps && (
                  <a className="escolha__icone" href={loja.maps} target="_blank" rel="noopener noreferrer" aria-label={`Como chegar na ${loja.nome}`}>
                    <IconeRota />
                  </a>
                )}
              </div>
            </article>
          )}
        </div>
        )}

        <nav className="escolha__cidades" aria-label="Filtrar por cidade">
          <button type="button" className="escolha__chip" aria-pressed={!cidade} onClick={() => filtrar(null)}>
            Todas <span>{lojasResumo.length}</span>
          </button>
          {cidades.map((c) => (
            <button key={c.nome} type="button" className="escolha__chip" aria-pressed={cidade === c.nome} onClick={() => filtrar(c.nome)}>
              {c.nome} <span>{c.total}</span>
            </button>
          ))}
        </nav>

        <div className="escolha__lista" ref={listaRef} aria-live="polite">
          {lojas.length === 0 && (
            <p className="escolha__vazio">
              Nenhuma loja encontrada para “{busca}”. Tente o nome da cidade, como Jundiaí ou Campinas.
            </p>
          )}
          {posicao && <h2 className="escolha__grupo">{cidade ? `${cidade}, da mais perto` : 'Mais perto de você'}</h2>}
          {grupos.map((g) => (
            <section key={g.nome ?? 'perto'} aria-label={g.nome ?? 'Lojas mais perto'}>
              {g.nome && (
                <h2 className="escolha__grupo">
                  {g.nome} <span>{g.lojas.length === 1 ? '1 loja' : `${g.lojas.length} lojas`}</span>
                </h2>
              )}
              <ul>
                {g.lojas.map((l, i) => (
                  <li key={l.slug}>
                    <article className={`escolha__card${l.slug === selecionada ? ' escolha__card--ativa' : ''}`}>
                      {LINK_PARA_LOJA ? (
                        <a className="escolha__card-link" href={`/${l.slug}`} onClick={abrir(l.slug)}>
                        <span className="escolha__card-nome">
                          {posicao ? l.unit : l.apelido}
                          {posicao && !cidade && i === 0 && <span className="escolha__selo">Mais perto</span>}
                        </span>
                        <span className="escolha__card-end">
                          {l.endereco.startsWith('Sua Coxinha') ? l.bairro : `${l.endereco.split(' – ')[0]} · ${l.bairro}`}
                        </span>
                        <span className="escolha__card-ir">
                          Ver cardápio
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </a>
                      ) : (
                        <div className="escolha__card-link escolha__card-link--sem-link">
                        <span className="escolha__card-nome">
                          {posicao ? l.unit : l.apelido}
                          {posicao && !cidade && i === 0 && <span className="escolha__selo">Mais perto</span>}
                        </span>
                        <span className="escolha__card-end">
                          {l.endereco.startsWith('Sua Coxinha') ? l.bairro : `${l.endereco.split(' – ')[0]} · ${l.bairro}`}
                        </span>
                        </div>
                      )}
                      <div className="escolha__card-lado">
                        {l.km != null && <span className="escolha__km">{formatarDistancia(l.km)}</span>}
                        {l.whatsapp && (
                          <a className="escolha__icone escolha__icone--wa" href={linkWhatsapp(l.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp da ${l.nome}`}>
                            <IconeWhatsapp />
                          </a>
                        )}
                        {l.coords && (
                          <button type="button" className="escolha__icone" onClick={() => verNoMapa(l.slug)} aria-label={`Ver ${l.nome} no mapa`}>
                            <IconePino />
                          </button>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <PedirRapido lojas={todasPorDistancia} aoAbrirLoja={() => listaRef.current?.scrollIntoView({ behavior: 'smooth' })} />

        <BolinhaJogos navegar={navegar} />

        <footer className="escolha__rodape">
          <button type="button" className="escolha__cookies" onClick={abrirPreferencias}>
            Cookies
          </button>
        </footer>
      </div>
    </main>
  )
}

function IconeAlvo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      <path d="M12 1.5v3.5M12 19v3.5M1.5 12H5M19 12h3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function IconeMapa() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Zm0 0v13m6-10.5v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IconePino() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" fill="currentColor" />
    </svg>
  )
}

function IconeRota() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M9 14v-2.5a1.5 1.5 0 0 1 1.5-1.5H15m-2-2 2 2-2 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconeWhatsapp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="escolha__svg">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.2-.2-.5-.3Z"
      />
    </svg>
  )
}
