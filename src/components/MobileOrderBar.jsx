import { useStoryContext } from '../context/StoryContext.js'
import OrderButtons from './OrderButtons.jsx'
import '../styles/mobile-order-bar.css'

// Barra fixa no rodapé do celular: pedir sempre a um toque, em qualquer parte do site.
// Some na abertura e na seção "Onde pedir", que já tem os mesmos botões.
export default function MobileOrderBar() {
  const { current } = useStoryContext()
  const hidden = current.id === 'inicio' || current.id === 'pedido'

  return (
    <div className="order-bar" data-hidden={hidden} inert={hidden}>
      <OrderButtons compact />
    </div>
  )
}
