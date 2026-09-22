import { useEffect, useRef } from 'react'
import { useStoryContext } from '../../context/StoryContext.js'

// Foto ampliada. Setas do teclado ou deslize do dedo passam as fotos; Esc fecha.
export default function GalleryLightbox({ fotos, indice, onMudar, onFechar, onCategoria, nomeCategoria }) {
  const { lockScroll } = useStoryContext()
  const dialogRef = useRef(null)
  const toque = useRef(null)
  const travada = useRef(false)
  const aberta = indice !== null
  const f = aberta ? fotos[indice] : null
  const total = fotos.length

  useEffect(() => {
    const dialog = dialogRef.current
    if (aberta && !dialog.open) dialog.showModal()
    if (!aberta && dialog.open) dialog.close()
    // Só mexe na rolagem quando o estado muda (o Esc fecha o pop-up antes do React).
    if (travada.current !== aberta) {
      travada.current = aberta
      lockScroll(aberta)
    }
  }, [aberta, lockScroll])

  const passar = (direcao) => onMudar((indice + direcao + total) % total)

  const tecla = (event) => {
    if (event.key === 'ArrowRight') passar(1)
    if (event.key === 'ArrowLeft') passar(-1)
  }

  const inicioToque = (event) => {
    toque.current = { x: event.clientX, y: event.clientY }
  }

  const fimToque = (event) => {
    if (!toque.current) return
    const dx = event.clientX - toque.current.x
    const dy = event.clientY - toque.current.y
    toque.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) passar(dx < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="gal-luz"
      aria-label="Foto ampliada"
      onClose={onFechar}
      onKeyDown={tecla}
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      {f && (
        <div className="gal-luz__caixa" onPointerDown={inicioToque} onPointerUp={fimToque}>
          <div className="gal-luz__topo">
            <p className="gal-luz__conta" aria-live="polite">
              {indice + 1} <span>/ {total}</span>
            </p>
            <button type="button" className="gal-luz__fechar" onClick={onFechar} autoFocus>
              <span className="sr-only">Fechar foto</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <figure className="gal-luz__figura">
            <img key={f.src} src={f.src} width={f.w} height={f.h} alt={f.alt} draggable="false" />
            <figcaption className="gal-luz__legenda">
              {f.etiqueta && <span className="gal-card__etiqueta">{f.etiqueta}</span>}
              <span className="gal-luz__titulo">{f.titulo}</span>
              {f.categoria && (
                <a
                  className="gal-luz__link"
                  href={`#cat-${f.categoria}`}
                  onClick={(e) => {
                    e.preventDefault()
                    onCategoria(f.categoria)
                  }}
                >
                  Ver {nomeCategoria(f.categoria)} no cardápio <span aria-hidden="true">→</span>
                </a>
              )}
            </figcaption>
          </figure>

          {total > 1 && (
            <>
              <button type="button" className="gal-luz__nav gal-luz__nav--ant" onClick={() => passar(-1)}>
                <span className="sr-only">Foto anterior</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" className="gal-luz__nav gal-luz__nav--prox" onClick={() => passar(1)}>
                <span className="sr-only">Próxima foto</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </dialog>
  )
}
