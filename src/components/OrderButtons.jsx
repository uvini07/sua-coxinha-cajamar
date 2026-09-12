import { platforms, orderUrl } from '../data/store.js'
import '../styles/order-buttons.css'

// Botões "Pedir no iFood" e "Pedir no 99Food".
// Com `item`, abre o produto exato na plataforma (quando o link foi cadastrado).
// Plataforma sem link cadastrado não mostra botão.
export default function OrderButtons({ item, itemName, size = 'normal', className = '' }) {
  const available = platforms.filter((p) => orderUrl(p, item))

  return (
    <div className={`order-buttons order-buttons--${size} ${className}`}>
      {available.map((platform) => (
        <a
          key={platform.id}
          className={`order-btn order-btn--${platform.id}`}
          href={orderUrl(platform, item)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Pedir no {platform.name}
          <span className="sr-only">
            {itemName ? `: ${itemName}` : ''} (abre em nova aba)
          </span>
        </a>
      ))}
      {import.meta.env.DEV && available.length < platforms.length && (
        <p className="order-buttons__dev">[LINK DO 99FOOD — preencher em src/data/store.js]</p>
      )}
    </div>
  )
}
