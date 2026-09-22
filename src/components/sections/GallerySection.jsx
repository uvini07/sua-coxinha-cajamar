import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useStoryContext } from '../../context/StoryContext.js'
import { useLoja } from '../../context/LojaContext.js'
import GalleryLightbox from './GalleryLightbox.jsx'
import '../../styles/sections/gallery.css'

// As palavras do papel de embrulho da loja, correndo no topo da galeria.
const PALAVRAS = ['Crocante', 'Quentinha', 'Gostosa', 'Hummm', 'Fresquinha', 'Saborosa']

// Gota do logo, usada como separador.
function Gota() {
  return (
    <svg className="gal-gota" viewBox="0 0 24 32" aria-hidden="true" focusable="false">
      <path d="M12 1C8 9 3 14.5 3 21a9 9 0 0 0 18 0C21 14.5 16 9 12 1Zm0 25.5a5 5 0 0 1-5-5c0-3 2.2-6.3 5-10.5 2.8 4.2 5 7.5 5 10.5a5 5 0 0 1-5 5Z" />
    </svg>
  )
}

function Faixa() {
  const trilho = PALAVRAS.flatMap((p) => [p, null])
  return (
    <div className="gal-faixa" aria-hidden="true">
      {[0, 1].map((copia) => (
        <div key={copia} className="gal-faixa__trilho">
          {trilho.map((p, i) => (p ? <span key={i}>{p}</span> : <Gota key={i} />))}
        </div>
      ))}
    </div>
  )
}

const srcSet = (f) => `${f.srcSm} ${Math.min(720, f.w)}w, ${f.src} ${f.w}w`

// Luz que acompanha o cursor dentro do card (só com mouse).
function acompanharCursor(event) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${((event.clientX - r.left) / r.width) * 100}%`)
  el.style.setProperty('--my', `${((event.clientY - r.top) / r.height) * 100}%`)
}

// Card da grade: foto inteira, vinheta escura na esquerda com as informações.
function CardGrade({ f, i, onAbrir, onCategoria, nomeCategoria }) {
  return (
    <li className={`gal-card gal-card--${f.tamanho ?? 'normal'}`} style={{ '--i': i }} onPointerMove={acompanharCursor}>
      <figure className="gal-card__figura">
        <img
          className="gal-card__img"
          src={f.srcSm}
          srcSet={srcSet(f)}
          sizes={f.tamanho === 'destaque' || f.tamanho === 'larga' ? '(min-width: 700px) 50vw, 80vw' : '(min-width: 700px) 25vw, 80vw'}
          width={f.w}
          height={f.h}
          alt={f.alt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: f.foco }}
        />
        <figcaption className="gal-card__info">
          {f.etiqueta && <span className="gal-card__etiqueta">{f.etiqueta}</span>}
          <span className="gal-card__titulo">{f.titulo}</span>
          {f.texto && <span className="gal-card__texto">{f.texto}</span>}
          {f.categoria && (
            <a className="gal-card__link" href={`#cat-${f.categoria}`} onClick={onCategoria(f.categoria)}>
              Ver no cardápio<span className="sr-only">: {nomeCategoria(f.categoria)}</span>
              <span className="gal-seta" aria-hidden="true">→</span>
            </a>
          )}
        </figcaption>
      </figure>

      {/* O card inteiro amplia a foto; o link do cardápio (na legenda) fica por cima. */}
      <button type="button" className="gal-card__ampliar" onClick={() => onAbrir(i)}>
        <span className="sr-only">Ampliar foto: {f.titulo}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
        </svg>
      </button>
    </li>
  )
}

// Foto de cliente: moldura branca, em leque no computador.
function CardLeque({ f, i, total, onAbrir }) {
  const meio = (total - 1) / 2
  const pos = i - meio
  return (
    <li
      className="gal-polaroid"
      style={{ '--i': i, '--pos': pos, '--dist': Math.abs(pos) }}
    >
      <button type="button" className="gal-polaroid__botao" onClick={() => onAbrir(i)}>
        <span className="gal-polaroid__foto">
          <img
            src={f.srcSm}
            srcSet={srcSet(f)}
            sizes="(min-width: 900px) 280px, 70vw"
            width={f.w}
            height={f.h}
            alt={f.alt}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: f.foco }}
          />
        </span>
        <span className="gal-polaroid__legenda">{f.titulo}</span>
      </button>
    </li>
  )
}

// Setas e barra de progresso do carrossel (celular, e o leque até o tablet).
function useCarrossel(trilhoRef) {
  const barraRef = useRef(null)
  const [limites, setLimites] = useState({ inicio: true, fim: false })

  const atualizar = useCallback(() => {
    const el = trilhoRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const p = max > 0 ? el.scrollLeft / max : 0
    barraRef.current?.style.setProperty('--p', p.toFixed(3))
    setLimites((antes) => {
      const agora = { inicio: el.scrollLeft < 8, fim: el.scrollLeft > max - 8 }
      return antes.inicio === agora.inicio && antes.fim === agora.fim ? antes : agora
    })
  }, [trilhoRef])

  useEffect(() => {
    const el = trilhoRef.current
    if (!el) return
    atualizar()
    el.addEventListener('scroll', atualizar, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      el.removeEventListener('scroll', atualizar)
      window.removeEventListener('resize', atualizar)
    }
  }, [trilhoRef, atualizar])

  const mover = (direcao) => {
    const el = trilhoRef.current
    const card = el?.firstElementChild
    if (!card) return
    const passo = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 16)
    el.scrollBy({ left: direcao * passo, behavior: 'smooth' })
  }

  return { barraRef, limites, mover }
}

function Setas({ limites, mover, rotulo }) {
  return (
    <div className="gal-setas">
      <button type="button" className="gal-seta-btn" onClick={() => mover(-1)} disabled={limites.inicio}>
        <span className="sr-only">Fotos anteriores de {rotulo}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button type="button" className="gal-seta-btn" onClick={() => mover(1)} disabled={limites.fim}>
        <span className="sr-only">Próximas fotos de {rotulo}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

function Album({ album, visto, onAbrir, onCategoria, nomeCategoria, instagram }) {
  const trilhoRef = useRef(null)
  const { barraRef, limites, mover } = useCarrossel(trilhoRef)
  const leque = album.layout === 'leque'

  return (
    <div
      id={`painel-${album.id}`}
      role="tabpanel"
      aria-labelledby={`aba-${album.id}`}
      className={`gal-painel gal-painel--${album.layout}${visto ? ' is-in' : ''}`}
    >
      <div className="gal-painel__topo">
        <p className="gal-painel__conta">
          <strong>{String(album.fotos.length).padStart(2, '0')}</strong> fotos · toque para ampliar
        </p>
        <Setas limites={limites} mover={mover} rotulo={album.nome} />
      </div>

      <div className="gal-palco">
        {leque && instagram.url && (
          <>
            <a className="gal-balao gal-balao--a" href={instagram.url} target="_blank" rel="noopener noreferrer">
              {instagram.handle}
            </a>
            <span className="gal-balao gal-balao--b" aria-hidden="true">
              Marca a gente!
            </span>
          </>
        )}

        <ul ref={trilhoRef} className={leque ? 'gal-leque' : 'gal-grade'}>
          {album.fotos.map((f, i) =>
            leque ? (
              <CardLeque key={f.src} f={f} i={i} total={album.fotos.length} onAbrir={onAbrir} />
            ) : (
              <CardGrade key={f.src} f={f} i={i} onAbrir={onAbrir} onCategoria={onCategoria} nomeCategoria={nomeCategoria} />
            ),
          )}
        </ul>
      </div>

      <div ref={barraRef} className="gal-progresso" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}

export default function GallerySection() {
  const loja = useLoja()
  const { goTo, linkTo, lockScroll } = useStoryContext()
  const { galeria, catalog } = loja
  const [ativo, setAtivo] = useState(0)
  const [aberta, setAberta] = useState(null)
  const [visto, setVisto] = useState(false)
  const secaoRef = useRef(null)
  const abasRef = useRef([])
  const indicadorRef = useRef(null)

  const album = galeria.albuns[ativo]

  // As fotos entram quando a seção aparece na tela (uma vez só).
  useEffect(() => {
    const el = secaoRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisto(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisto(true)
        obs.disconnect()
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Pílula amarela que desliza até a aba escolhida.
  useLayoutEffect(() => {
    const posicionar = () => {
      const aba = abasRef.current[ativo]
      const ind = indicadorRef.current
      if (!aba || !ind) return
      ind.style.setProperty('--x', `${aba.offsetLeft}px`)
      ind.style.setProperty('--w', `${aba.offsetWidth}px`)
    }
    posicionar()
    window.addEventListener('resize', posicionar)
    document.fonts?.ready.then(posicionar)
    return () => window.removeEventListener('resize', posicionar)
  }, [ativo])

  const escolher = (i) => {
    setAtivo(i)
    abasRef.current[i]?.focus()
  }

  // Setas do teclado entre as abas, como pede o padrão de abas acessíveis.
  const teclaAbas = (event) => {
    const n = galeria.albuns.length
    const mapa = { ArrowRight: ativo + 1, ArrowLeft: ativo - 1, Home: 0, End: n - 1 }
    if (!(event.key in mapa)) return
    event.preventDefault()
    escolher((mapa[event.key] + n) % n)
  }

  const nomeCategoria = (id) => catalog.find((g) => g.id === id)?.name ?? ''
  const irParaCategoria = (id) => (event) => {
    event.preventDefault()
    goTo(`cat-${id}`)
  }

  const fecharEIr = (id) => {
    setAberta(null)
    lockScroll(false)
    requestAnimationFrame(() => goTo(`cat-${id}`))
  }

  return (
    <section
      ref={secaoRef}
      id={`cat-${galeria.id}`}
      className="catalog__group gal"
      aria-labelledby="titulo-fotos"
    >
      <Faixa />

      <header className="gal-cabeca">
        <div>
          <h3 id="titulo-fotos" className="catalog__group-title gal-titulo">
            {galeria.name}
            <span className="gal-titulo__marca" aria-hidden="true">
              reais
            </span>
          </h3>
          <p className="gal-intro">{galeria.intro}</p>
        </div>

        <div className="gal-abas" role="tablist" aria-label="Álbuns de fotos" onKeyDown={teclaAbas}>
          <span ref={indicadorRef} className="gal-abas__indicador" aria-hidden="true" />
          {galeria.albuns.map((a, i) => (
            <button
              key={a.id}
              ref={(el) => (abasRef.current[i] = el)}
              id={`aba-${a.id}`}
              type="button"
              role="tab"
              aria-selected={i === ativo}
              aria-controls={`painel-${a.id}`}
              tabIndex={i === ativo ? 0 : -1}
              className="gal-aba"
              onClick={() => setAtivo(i)}
            >
              {a.nome}
              <span className="gal-aba__conta">{a.fotos.length}</span>
            </button>
          ))}
        </div>
      </header>

      {/* A chave recria o painel a cada troca de aba, para as fotos entrarem de novo. */}
      <Album
        key={album.id}
        album={album}
        visto={visto}
        onAbrir={setAberta}
        onCategoria={irParaCategoria}
        nomeCategoria={nomeCategoria}
        instagram={{ url: loja.links.instagram, handle: loja.instagramHandle }}
      />

      <a className="catalog__back" href="#categorias" onClick={linkTo('categorias')}>
        Voltar para as categorias
      </a>

      <GalleryLightbox
        fotos={album.fotos}
        indice={aberta}
        onMudar={setAberta}
        onFechar={() => setAberta(null)}
        onCategoria={fecharEIr}
        nomeCategoria={nomeCategoria}
      />
    </section>
  )
}
