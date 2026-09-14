import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useStoryContext } from '../../context/StoryContext.js'
import { itemIndex } from '../../data/whatsappOrder.js'
import { summarize } from './orderLogic.js'
import OrderDialog from './OrderDialog.jsx'

const WhatsAppOrderContext = createContext({ open: () => {}, count: 0 })
export const useWhatsAppOrder = () => useContext(WhatsAppOrderContext)

// O pedido fica salvo no aparelho: se a pessoa sair e voltar, não perde o que escolheu.
const STORAGE_KEY = 'sua-coxinha:pedido-whatsapp:v1'
const emptyCustomer = { name: '', when: 'pronto', time: '', notes: '' }

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return {
      lines: (saved?.lines ?? []).filter((l) => itemIndex.has(l.itemId) && l.qty > 0),
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
  const [initial] = useState(loadSaved)
  const [lines, dispatch] = useReducer(cartReducer, initial.lines)
  const [customer, setCustomer] = useState(initial.customer)
  const [dialog, setDialog] = useState({ open: false, target: null, openedAt: 0 })
  const { lockScroll } = useStoryContext()

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, customer }))
    } catch {
      /* navegador sem armazenamento: o pedido vale só nesta visita */
    }
  }, [lines, customer])

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

  const summary = useMemo(() => summarize(lines), [lines])
  const value = useMemo(() => ({ open, count: summary.count }), [open, summary.count])

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
