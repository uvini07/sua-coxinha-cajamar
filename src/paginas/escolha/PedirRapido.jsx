import { useEffect, useRef, useState } from 'react'
import { formatarDistancia } from './distancia.js'
import '../../styles/paginas/pedir-rapido.css'

// PEDIR RÁPIDO — a bolinha flutuante da página inicial.
// Um círculo dividido em dois (iFood e WhatsApp). Ao tocar, abre uma
// folha de baixo para cima: a pessoa escolhe por onde quer pedir e depois a
// loja (a mais perto primeiro, se ela já deu a localização). Plataforma que
// nenhuma loja tem ainda aparece como "em breve".

const CANAIS = [
  { id: 'ifood', nome: 'iFood', dica: 'Entrega em casa' },
  { id: 'whatsapp', nome: 'WhatsApp', dica: 'Retirada na loja' },
]

const linkDo = (canal, loja) => (canal === 'whatsapp' ? (loja.whatsapp ? `https://wa.me/${loja.whatsapp}` : '') : loja[canal])

export default function PedirRapido({ lojas, aoAbrirLoja }) {
  const dialogo = useRef(null)
  const [canal, setCanal] = useState(null)

  const abrir = () => {
    setCanal(null)
    dialogo.current?.showModal()
  }
  const fechar = () => dialogo.current?.close()

  // Fecha ao tocar fora da folha (no fundo escurecido).
  useEffect(() => {
    const d = dialogo.current
    const fora = (e) => {
      if (e.target === d) d.close()
    }
    d?.addEventListener('click', fora)
    return () => d?.removeEventListener('click', fora)
  }, [])

  const disponiveis = (id) => lojas.filter((l) => linkDo(id, l))
  const escolhido = CANAIS.find((c) => c.id === canal)

  return (
    <>
      <button type="button" className="pedir-bolinha" onClick={abrir} aria-haspopup="dialog" aria-label="Pedir agora: iFood ou WhatsApp">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          {/* duas metades: iFood à esquerda, WhatsApp à direita */}
          <path d="M32 2 A30 30 0 0 0 32 62 Z" fill="#ea1d2c" />
          <path d="M32 2 A30 30 0 0 1 32 62 Z" fill="#25d366" />
          <path d="M32 2 L32 62" stroke="#131313" strokeWidth="2" />
          <text x="17.5" y="35.5" className="pedir-bolinha__txt" fill="#fff" style={{ fontSize: 9 }}>iFood</text>
          <text x="46" y="36" className="pedir-bolinha__txt" fill="#073b1c">Zap</text>
        </svg>
        <span className="pedir-bolinha__rotulo">Pedir</span>
      </button>

      <dialog ref={dialogo} className="pedir-folha" aria-labelledby="pedir-titulo">
        <div className="pedir-folha__alca" aria-hidden="true" />
        <header className="pedir-folha__topo">
          {canal ? (
            <button type="button" className="pedir-folha__voltar" onClick={() => setCanal(null)} aria-label="Voltar para as opções">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ) : null}
          <h2 id="pedir-titulo">{escolhido ? `Pedir pelo ${escolhido.nome}` : 'Por onde você quer pedir?'}</h2>
          <button type="button" className="pedir-folha__fechar" onClick={fechar} aria-label="Fechar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
          </button>
        </header>

        {!canal && (
          <ul className="pedir-canais">
            {CANAIS.map((c) => {
              const total = disponiveis(c.id).length
              return (
                <li key={c.id}>
                  <button type="button" className={`pedir-canal pedir-canal--${c.id}`} disabled={!total} onClick={() => setCanal(c.id)}>
                    <span className="pedir-canal__nome">{c.nome}</span>
                    <span className="pedir-canal__dica">{total ? c.dica : 'Em breve'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {canal && (
          <>
            <p className="pedir-folha__sub">
              {lojas.some((l) => l.km != null) ? 'Escolha a loja. A mais perto está em primeiro.' : 'Escolha a loja que vai preparar o seu pedido.'}
            </p>
            <ul className="pedir-lojas">
              {disponiveis(canal).map((l) => (
                <li key={l.slug}>
                  <a className="pedir-loja" href={linkDo(canal, l)} target="_blank" rel="noopener noreferrer" onClick={fechar}>
                    <span className="pedir-loja__nome">{l.unit}</span>
                    <span className="pedir-loja__onde">
                      {l.bairro}
                      {l.km != null && <strong> · {formatarDistancia(l.km)}</strong>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {canal === 'whatsapp' && (
              <p className="pedir-folha__nota">
                Prefere montar o pedido com os preços?{' '}
                <button type="button" className="pedir-folha__link" onClick={() => { fechar(); aoAbrirLoja?.() }}>
                  Escolha a loja na lista
                </button>
                .
              </p>
            )}
          </>
        )}
      </dialog>
    </>
  )
}
