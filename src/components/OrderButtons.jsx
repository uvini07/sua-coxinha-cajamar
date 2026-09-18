import { useLoja } from '../context/LojaContext.js'
import { linkPedido } from '../lib/plataformas.js'
import { useWhatsAppOrder } from './whatsapp/WhatsAppOrder.jsx'
import { WhatsAppIcon } from './whatsapp/ReviewView.jsx'
import '../styles/order-buttons.css'

const prepositions = { ifood: 'no', food99: 'no' }

// Botões de pedido: iFood e 99Food (entrega pelos apps) e WhatsApp (retirada na loja).
// Com `item`, iFood/99 abrem o produto exato (quando o link foi cadastrado) e o WhatsApp
// abre o pop-up já no produto. `compact` é a versão da barra fixa do celular.
export default function OrderButtons({ item, itemName, size = 'normal', compact = false, className = '' }) {
  const { open, count } = useWhatsAppOrder()
  const loja = useLoja()
  const available = loja.platforms.filter((p) => linkPedido(p, item))

  return (
    <div
      className={`order-buttons order-buttons--${size}${compact ? ' order-buttons--compact' : ''} ${className}`}
      data-platforms={available.length}
    >
      {available.map((platform) => (
        <a
          key={platform.id}
          className={`order-btn order-btn--${platform.id}`}
          href={linkPedido(platform, item)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Um único bloco de texto: evita que "Pedir no" e o nome quebrem separados */}
          <span className="order-btn__label">
            <span className="order-btn__pre">Pedir {prepositions[platform.id]} </span>
            <span className="order-btn__name">{platform.name}</span>
          </span>
          <span className="sr-only">
            {itemName ? `: ${itemName}` : ''} (abre em nova aba)
          </span>
        </a>
      ))}

      {loja.whatsapp && (
        <button type="button" className="order-btn order-btn--whatsapp" onClick={() => open({ itemId: item?.id })}>
          {!compact && <WhatsAppIcon />}
          <span className="order-btn__stack">
            <span className="order-btn__label">
              <span className="order-btn__pre">Pedir pelo </span>
              <span className="order-btn__name">WhatsApp</span>
              {itemName && <span className="sr-only">: {itemName}</span>}
            </span>
            {!compact && <span className="order-btn__sub">Somente retirada na loja</span>}
          </span>
          {compact && count > 0 && (
            <span className="order-btn__badge">
              {count}
              <span className="sr-only"> {count === 1 ? 'item' : 'itens'} no pedido</span>
            </span>
          )}
        </button>
      )}
    </div>
  )
}
