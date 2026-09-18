import { priceText } from '../../lib/preco.js'
import { useWhatsAppOrder } from './WhatsAppOrder.jsx'
import '../../styles/cart-button.css'

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 4h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2" />
    <circle cx="9.5" cy="20" r="1.4" />
    <circle cx="17" cy="20" r="1.4" />
  </svg>
)

// Carrinho do pedido pelo WhatsApp. Só aparece quando há itens escolhidos.
// `nav`: botão na barra do topo (todas as telas). `strip`: faixa em cima da barra de pedido do celular.
// Nenhuma das duas cobre o conteúdo da página.
export default function CartButton({ variant = 'nav' }) {
  const { open, count, total } = useWhatsAppOrder()
  if (!count) return null

  const items = `${count} ${count === 1 ? 'item' : 'itens'}`
  const openCart = () => open({ itemId: 'finalizar' })

  if (variant === 'strip') {
    return (
      <button type="button" className="cart-strip" onClick={openCart}>
        <span className="cart-strip__icon">
          <CartIcon />
        </span>
        <span className="cart-strip__title">Meu pedido</span>
        <span className="cart-strip__info">
          {items}, {priceText(total)}
        </span>
        <svg className="cart-strip__chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  return (
    <button type="button" className="nav__cart" onClick={openCart} aria-label={`Meu pedido no WhatsApp: ${items}, ${priceText(total)}`}>
      <CartIcon />
      <span className="nav__cart-label" aria-hidden="true">
        Meu pedido
      </span>
      <span className="nav__cart-count" aria-hidden="true">
        {count}
      </span>
    </button>
  )
}
