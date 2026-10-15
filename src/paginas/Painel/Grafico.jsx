import { useState } from 'react'

// Gráfico dia a dia: barras de visitantes e marcador de cliques para pedir.
// SVG puro, sem biblioteca: o painel é pequeno e não vale o peso de um pacote.
const ALTURA = 180

const rotuloDia = (iso) => {
  const [, m, d] = iso.split('-')
  return `${d}/${m}`
}

export default function Grafico({ dias }) {
  const [foco, setFoco] = useState(null)
  if (!dias.length) return <p className="painel-nota">Sem visitas no período.</p>

  const max = Math.max(1, ...dias.map((d) => Math.max(d.visitantes, d.pedidos)))
  const largura = 100 / dias.length
  const passoRotulo = Math.ceil(dias.length / 7)
  const ativo = foco ?? dias.length - 1
  const d = dias[ativo]

  return (
    <figure className="painel-grafico">
      <figcaption className="painel-grafico__legenda">
        <span><i className="painel-grafico__cor painel-grafico__cor--visitas" /> Visitantes</span>
        <span><i className="painel-grafico__cor painel-grafico__cor--pedidos" /> Cliques para pedir</span>
        <strong className="painel-grafico__foco" aria-live="polite">
          {rotuloDia(d.data)}: {d.visitantes} visitantes · {d.pedidos} cliques
        </strong>
      </figcaption>
      <svg
        viewBox={`0 0 100 ${ALTURA}`}
        preserveAspectRatio="none"
        className="painel-grafico__svg"
        role="img"
        aria-label={`Visitantes por dia, de ${rotuloDia(dias[0].data)} a ${rotuloDia(dias[dias.length - 1].data)}`}
        onMouseLeave={() => setFoco(null)}
      >
        {dias.map((dia, i) => {
          const h = (dia.visitantes / max) * (ALTURA - 8)
          const hp = (dia.pedidos / max) * (ALTURA - 8)
          return (
            <g key={dia.data} onMouseEnter={() => setFoco(i)} onClick={() => setFoco(i)}>
              <rect x={i * largura} y="0" width={largura} height={ALTURA} fill="transparent" />
              <rect
                className={`painel-grafico__barra${i === ativo ? ' painel-grafico__barra--ativa' : ''}`}
                x={i * largura + largura * 0.15}
                y={ALTURA - h}
                width={largura * 0.7}
                height={h}
                rx="0.6"
              />
              {dia.pedidos > 0 && (
                <rect className="painel-grafico__pedido" x={i * largura + largura * 0.15} y={ALTURA - hp - 1.5} width={largura * 0.7} height="3" />
              )}
            </g>
          )
        })}
      </svg>
      <div className="painel-grafico__eixo" aria-hidden="true">
        {dias.map((dia, i) => (
          <span key={dia.data} style={{ width: `${largura}%` }}>
            {i % passoRotulo === 0 ? rotuloDia(dia.data) : ''}
          </span>
        ))}
      </div>
    </figure>
  )
}
