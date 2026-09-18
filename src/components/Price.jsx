import { formatPrice } from '../lib/preco.js'

// Preço no estilo do cardápio: R$ pequeno, reais grandes e centavos sobrescritos.
export default function Price({ cents, from = false, className = '' }) {
  const { reais, centavos } = formatPrice(cents)
  const spoken = `${from ? 'a partir de ' : ''}${reais} reais e ${centavos} centavos`

  return (
    <span className={`price ${className}`}>
      <span className="sr-only">{spoken}</span>
      <span className="price__visual" aria-hidden="true" style={{ display: 'contents' }}>
        {from && <span className="price__from">a partir de</span>}
        <span className="price__currency">R$</span>
        <span className="price__reais">{reais}</span>
        <span className="price__cents">,{centavos}</span>
      </span>
    </span>
  )
}
