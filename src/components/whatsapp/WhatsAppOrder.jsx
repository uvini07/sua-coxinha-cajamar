import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useStoryContext } from '../../context/StoryContext.js'
import { useLoja } from '../../context/LojaContext.js'
import { summarize } from './orderLogic.js'
import OrderDialog from './OrderDialog.jsx'

const WhatsAppOrderContext = createContext({ open: () => {}, count: 0, total: 0, isOpen: false })
export const useWhatsAppOrder = () => useContext(WhatsAppOrderContext)

// O pedido fica salvo no aparelho, separado por loja: o carrinho de Cajamar não
// aparece em Jundiaí (e a mensagem nunca vai para o WhatsApp da loja errada).
const chaveDoPedido = (slug) => `sua-coxinha:pedido-whatsapp:${slug}:v1`
const emptyCustomer = { name: '', when: 'pronto', date: '', time: '', notes: '' }

function loadSaved(loja) {
  try {
    const saved = JSON.parse(localStorage.getItem(chaveDoPedido(loja.slug)))
    return {
      lines: (saved?.lines ?? []).filter((l) => loja.itemIndex.has(l.itemId) && l.qty > 0),
      customer: { ...emptyCustomer, ...saved?.customer },
    }
  } catch {
    return { lines: [], customer: emptyCustomer }
  }
}

function cartReducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const existing = lines.find((l) => l.key === action.line.key)
      if (!existing) return [...lines, action.line]
      return lines.map((l) => (l === existing ? { ...l, qty: Math.min(99, l.qty + action.line.qty) } : l))
    }
    case 'qty':
      return lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(99, action.qty) } : l)).filter((l) => l.qty > 0)
    case 'clear':
      return []
    default:
      return lines
  }
}

export function WhatsAppOrderProvider({ children }) {
  const loja = useLoja()
  const [initial] = useState(() => loadSaved(loja))
  const [lines, dispatch] = useReducer(cartReducer, initial.lines)
  const [customer, setCustomer] = useState(initial.customer)
  const [dialog, setDialog] = useState({ open: false, target: null, openedAt: 0 })
  const { lockScroll } = useStoryContext()

  useEffect(() => {
    try {
      localStorage.setItem(chaveDoPedido(loja.slug), JSON.stringify({ lines, customer }))
    } catch {
      /* navegador sem armazenamento: o pedido vale só nesta visita */
    }
  }, [lines, customer, loja.slug])

  // Abrir o pop-up cria uma entrada no histórico: o botão "voltar" do celular fecha o pop-up
  // em vez de sair do site.
  const open = useCallback((target = null) => {
    window.history.pushState({ waOrder: 1 }, '')
    setDialog({ open: true, target, openedAt: Date.now() })
  }, [])

  const close = useCallback(() => {
    const depth = window.history.state?.waOrder ?? 0
    if (depth) window.history.go(-depth)
    else setDialog((d) => ({ ...d, open: false }))
  }, [])

  useEffect(() => {
    const onPop = (event) => {
      if (!event.state?.waOrder) setDialog((d) => (d.open ? { ...d, open: false } : d))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    lockScroll(dialog.open)
  }, [dialog.open, lockScroll])

  // Link direto: .../#pedir-whatsapp abre o pop-up (útil na bio do Instagram).
  useEffect(() => {
    if (window.location.hash !== '#pedir-whatsapp') return
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    open()
  }, [open])

  const summary = useMemo(() => summarize(loja, lines), [loja, lines])
  const value = useMemo(
    () => ({ open, count: summary.count, total: summary.total, isOpen: dialog.open }),
    [open, summary.count, summary.total, dialog.open],
  )

  return (
    <WhatsAppOrderContext.Provider value={value}>
      {children}
      <OrderDialog
        {...dialog}
        onClose={close}
        summary={summary}
        dispatch={dispatch}
        customer={customer}
        setCustomer={setCustomer}
      />
    </WhatsAppOrderContext.Provider>
  )
}
