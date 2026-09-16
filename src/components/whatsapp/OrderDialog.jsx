import { useCallback, useEffect, useRef, useState } from 'react'
import { store } from '../../data/store.js'
import { itemIndex, orderSteps } from '../../data/whatsappOrder.js'
import ItemView from './ItemView.jsx'
import ReviewView, { WhatsAppIcon } from './ReviewView.jsx'
import StepList from './StepList.jsx'
import '../../styles/whatsapp.css'

const REVIEW = orderSteps.length - 1

// Pop-up do pedido pelo WhatsApp. No celular ocupa a tela como uma folha que sobe;
// no computador fica centralizado.
export default function OrderDialog({ open, target, openedAt, onClose, summary, dispatch, customer, setCustomer }) {
  const dialogRef = useRef(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [itemId, setItemId] = useState(null)
  const [sent, setSent] = useState(false)
  const [sentUrl, setSentUrl] = useState('')
  const [toast, setToast] = useState('')
  const listScroll = useRef({})

  const step = orderSteps[stepIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const openItem = useCallback((id) => {
    window.history.pushState({ waOrder: 2 }, '')
    setItemId(id)
  }, [])

  const closeItem = useCallback(() => {
    if (window.history.state?.waOrder === 2) window.history.back()
    else setItemId(null)
  }, [])

  // Voltar do celular: sai da tela do produto e volta para a lista.
  useEffect(() => {
    const onPop = (event) => {
      if (event.state?.waOrder === 1) setItemId(null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Ao abrir: vai para a etapa ou o produto de onde o cliente veio.
  useEffect(() => {
    if (!openedAt) return
    setSent(false)
    setItemId(null)
    listScroll.current = {}
    const id = target?.itemId
    const stepMatch = orderSteps.findIndex((s) => s.id === id)
    const entry = id && itemIndex.get(id)
    if (stepMatch >= 0) setStepIndex(stepMatch)
    else if (entry) {
      setStepIndex(orderSteps.indexOf(entry.step))
      if (!entry.step.simple) openItem(id)
    } else setStepIndex(summary.count > 0 ? REVIEW : 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedAt])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const goToStep = (index) => {
    setSent(false)
    setStepIndex(index)
    listScroll.current[orderSteps[index].id] = 0
  }

  const addLine = (line) => {
    dispatch({ type: 'add', line })
    setToast(`Adicionado ao pedido: ${itemIndex.get(line.itemId).item.name}`)
    closeItem()
  }

  // Pedido enviado ao WhatsApp: guarda o link (para "tentar de novo") e esvazia o carrinho.
  // O nome fica salvo para o próximo pedido.
  const finishOrder = (url) => {
    setSentUrl(url)
    setSent(true)
    dispatch({ type: 'clear' })
    setCustomer((c) => ({ ...c, when: 'pronto', date: '', time: '', notes: '' }))
  }

  const onCancel = (event) => {
    event.preventDefault()
    if (itemId) closeItem()
    else onClose()
  }

  const item = itemId && itemIndex.get(itemId)?.item
  const nextStep = orderSteps[stepIndex + 1]
  const nextLabel = nextStep?.review ? 'Finalizar pedido' : `Próximo: ${nextStep?.name}`

  return (
    <dialog
      ref={dialogRef}
      className="wa-dialog"
      aria-labelledby="wa-title"
      onCancel={onCancel}
      onClick={(e) => e.target === dialogRef.current && onClose()}
    >
      <div className="wa-sheet">
        <header className="wa-head">
          <div className="wa-head__row">
            {item ? (
              <button type="button" className="wa-head__btn" onClick={closeItem}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
                Voltar
              </button>
            ) : (
              <span className="wa-head__icon" aria-hidden="true">
                <WhatsAppIcon />
              </span>
            )}
            <h2 id="wa-title" className="wa-head__title" tabIndex={-1} autoFocus>
              Pedido pelo WhatsApp
            </h2>
            <button type="button" className="wa-head__btn wa-head__btn--close" onClick={onClose}>
              Fechar
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <p className="wa-head__pickup">
            <strong>Somente retirada na loja</strong>
            <span>{store.address.street.split(' – ')[0]}</span>
          </p>

          {!item && (
            <nav className="wa-tabs" aria-label="Etapas do pedido">
              <ol>
                {orderSteps.map((s, i) => {
                  const count = s.review ? summary.count : summary.countByStep[s.id]
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        className="wa-tab"
                        aria-current={i === stepIndex && !sent ? 'step' : undefined}
                        onClick={() => goToStep(i)}
                      >
                        <span className="wa-tab__label">{s.name}</span>
                        {count > 0 && (
                          <span className="wa-tab__count">
                            {count}
                            <span className="sr-only"> {count === 1 ? 'item' : 'itens'}</span>
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}
        </header>

        {item ? (
          <ItemView key={item.id} item={item} onAdd={addLine} />
        ) : sent ? (
          <SentView url={sentUrl} onNewOrder={() => goToStep(0)} onClose={onClose} />
        ) : step.review ? (
          <ReviewView
            summary={summary}
            dispatch={dispatch}
            customer={customer}
            setCustomer={setCustomer}
            onGoToStep={goToStep}
            onSent={finishOrder}
          />
        ) : (
          <StepList
            key={step.id}
            step={step}
            summary={summary}
            dispatch={dispatch}
            onOpenItem={openItem}
            onNext={() => goToStep(stepIndex + 1)}
            nextLabel={nextLabel}
            onReview={() => goToStep(REVIEW)}
            scrollTop={listScroll.current[step.id]}
            onScrollSave={(y) => (listScroll.current[step.id] = y)}
          />
        )}

        <p className="wa-toast" role="status" data-visible={Boolean(toast)}>
          {toast}
        </p>
      </div>
    </dialog>
  )
}

function SentView({ url, onNewOrder, onClose }) {
  const titleRef = useRef(null)
  useEffect(() => titleRef.current?.focus(), [])

  return (
    <div className="wa-body wa-sent" data-lenis-prevent>
      <div className="wa-sent__icon" aria-hidden="true">
        <WhatsAppIcon />
      </div>
      <h3 ref={titleRef} tabIndex={-1} className="wa-sent__title">
        Falta só um toque!
      </h3>
      <p className="wa-sent__text">
        Abrimos o WhatsApp com o seu pedido. Confira a mensagem e toque em <strong>enviar</strong> lá no WhatsApp.
      </p>
      <p className="wa-sent__text">A loja responde confirmando o pedido e o valor. Depois é só retirar na loja.</p>
      <p className="wa-sent__text">Seu carrinho foi esvaziado para o próximo pedido.</p>
      <div className="wa-sent__actions">
        <a className="wa-btn wa-btn--dark" href={url} target="_blank" rel="noopener noreferrer">
          O WhatsApp não abriu? Tentar de novo
        </a>
        <button type="button" className="wa-btn wa-btn--ghost" onClick={onNewOrder}>
          Começar um novo pedido
        </button>
        <button type="button" className="wa-btn wa-btn--ghost" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  )
}
