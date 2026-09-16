import { useRef, useState } from 'react'
import { priceText } from '../../data/products.js'
import { store } from '../../data/store.js'
import { orderSteps } from '../../data/whatsappOrder.js'
import { buildMessage, earliestPickup, pickupError, toDateValue, toTimeValue, whatsappUrl } from './orderLogic.js'
import Stepper from './Stepper.jsx'

// Última etapa: conferir o pedido, dados da retirada e enviar pelo WhatsApp.
export default function ReviewView({ summary, dispatch, customer, setCustomer, onGoToStep, onSent }) {
  const [showErrors, setShowErrors] = useState(false)
  const nameRef = useRef(null)
  const dateRef = useRef(null)
  const timeRef = useRef(null)
  const bodyRef = useRef(null)

  const update = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }))

  // Ao escolher "marcar dia e horário", já sugere hoje no primeiro horário possível.
  const chooseWhen = (e) => {
    const when = e.target.value
    setCustomer((c) => ({
      ...c,
      when,
      date: when === 'agendar' && !c.date ? toDateValue(earliestPickup()) : c.date,
      time: when === 'agendar' && !c.time ? toTimeValue(earliestPickup()) : c.time,
    }))
  }
  // O horário mínimo é recalculado a cada abertura da tela: agora + o tempo de preparo.
  const earliest = earliestPickup()
  const errors = {
    empty: summary.count === 0,
    name: !customer.name.trim(),
    pickup: customer.when === 'agendar' ? pickupError(customer.date, customer.time) : null,
  }
  const hasErrors = errors.empty || errors.name || Boolean(errors.pickup)
  const url = hasErrors ? undefined : whatsappUrl(buildMessage(summary, customer))

  const send = (event) => {
    if (!hasErrors) {
      // Deixa o navegador abrir o link antes de limpar o pedido (o link sumiria com o carrinho vazio).
      setTimeout(() => onSent(url), 0)
      return
    }
    event.preventDefault()
    setShowErrors(true)
    if (errors.empty) bodyRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    else if (errors.name) nameRef.current.focus()
    else if (!customer.date) dateRef.current?.focus()
    else timeRef.current?.focus()
  }

  const stepsWithLines = orderSteps.filter((s) => summary.lines.some((l) => l.step.id === s.id))

  return (
    <>
      <div ref={bodyRef} className="wa-body" data-lenis-prevent>
        <section className="wa-review" aria-labelledby="wa-review-title">
          <h3 id="wa-review-title" className="wa-section__title">
            Seu pedido
          </h3>

          {summary.count === 0 ? (
            <div className={`wa-empty${showErrors ? ' wa-empty--error' : ''}`}>
              <p>Seu pedido ainda está vazio.</p>
              <button type="button" className="wa-btn wa-btn--dark" onClick={() => onGoToStep(0)}>
                Escolher produtos
              </button>
            </div>
          ) : (
            stepsWithLines.map((step) => (
              <div key={step.id} className="wa-review__group">
                <h4 className="wa-review__step">{step.name}</h4>
                <ul className="wa-lines">
                  {summary.lines
                    .filter((l) => l.step.id === step.id)
                    .map((line) => (
                      <li key={line.key} className="wa-line">
                        <div className="wa-line__info">
                          <p className="wa-line__name">{line.name}</p>
                          {line.details.map((d) => (
                            <p key={d} className="wa-line__detail">
                              {d}
                            </p>
                          ))}
                          {line.note && <p className="wa-line__detail">Obs.: {line.note}</p>}
                        </div>
                        <div className="wa-line__side">
                          <p className="wa-line__total">{priceText(line.total)}</p>
                          <Stepper
                            value={line.qty}
                            label={line.name}
                            removable
                            onChange={(n) => dispatch({ type: 'qty', key: line.key, qty: n })}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ))
          )}

          {summary.count > 0 && (
            <>
              <p className="wa-review__total">
                <span>Total estimado</span>
                <strong>{priceText(summary.total)}</strong>
              </p>
              <div className="wa-review__actions">
                <button type="button" className="wa-btn wa-btn--ghost" onClick={() => onGoToStep(0)}>
                  Adicionar mais produtos
                </button>
                <button
                  type="button"
                  className="wa-review__clear"
                  onClick={() => window.confirm('Tirar todos os produtos do pedido?') && dispatch({ type: 'clear' })}
                >
                  Esvaziar pedido
                </button>
              </div>
              <p className="wa-review__saved">
                Seu pedido fica guardado neste aparelho. Pode fechar e voltar depois: é só tocar em <strong>Meu pedido</strong>.
              </p>
            </>
          )}
        </section>

        <section className="wa-pickup" aria-labelledby="wa-pickup-title">
          <h3 id="wa-pickup-title" className="wa-pickup__title">
            Retirada na loja
          </h3>
          <p>Pedidos pelo WhatsApp são somente para retirar na loja. A loja confirma o pedido e o valor pelo WhatsApp.</p>
          <p className="wa-pickup__address">
            {store.address.street}
            <br />
            {store.address.district}, {store.address.city}
          </p>
          <a className="wa-pickup__link" href={store.links.maps} target="_blank" rel="noopener noreferrer">
            Ver a loja no mapa<span className="sr-only"> (abre em nova aba)</span>
          </a>
        </section>

        <section className="wa-form" aria-labelledby="wa-form-title">
          <h3 id="wa-form-title" className="wa-section__title">
            Seus dados
          </h3>

          <div className="wa-field">
            <label className="wa-field__label" htmlFor="wa-name">
              Seu nome
            </label>
            <input
              ref={nameRef}
              id="wa-name"
              className="wa-input"
              type="text"
              autoComplete="given-name"
              enterKeyHint="done"
              maxLength={60}
              value={customer.name}
              onChange={update('name')}
              aria-invalid={showErrors && errors.name}
              aria-describedby={showErrors && errors.name ? 'wa-name-error' : undefined}
            />
            {showErrors && errors.name && (
              <p id="wa-name-error" className="wa-group__error">
                Digite seu nome para a loja saber de quem é o pedido.
              </p>
            )}
          </div>

          <fieldset className="wa-group wa-group--plain">
            <legend className="wa-field__label">Quando você vai retirar?</legend>
            <label className="wa-choice">
              <input type="radio" name="wa-when" value="pronto" checked={customer.when !== 'agendar'} onChange={chooseWhen} />
              <span className="wa-choice__mark" aria-hidden="true" />
              <span className="wa-choice__text">
                Assim que ficar pronto
                <span className="wa-choice__note">Fica pronto em até {store.prepMinutes} minutos</span>
              </span>
            </label>
            <label className="wa-choice">
              <input type="radio" name="wa-when" value="agendar" checked={customer.when === 'agendar'} onChange={chooseWhen} />
              <span className="wa-choice__mark" aria-hidden="true" />
              <span className="wa-choice__text">
                Marcar dia e horário
                <span className="wa-choice__note">Retirada a partir das {toTimeValue(earliest)}</span>
              </span>
            </label>

            {customer.when === 'agendar' && (
              <div className="wa-schedule">
                <div className="wa-field">
                  <label className="wa-field__label" htmlFor="wa-date">
                    Dia da retirada
                  </label>
                  <input
                    ref={dateRef}
                    id="wa-date"
                    className="wa-input wa-input--date"
                    type="date"
                    value={customer.date}
                    min={toDateValue(new Date())}
                    max={toDateValue(new Date(Date.now() + 30 * 86400000))}
                    onChange={update('date')}
                    aria-invalid={Boolean(showErrors && errors.pickup)}
                  />
                </div>

                <div className="wa-field">
                  <label className="wa-field__label" htmlFor="wa-time">
                    Horário
                  </label>
                  <input
                    ref={timeRef}
                    id="wa-time"
                    className="wa-input wa-input--time"
                    type="time"
                    step="300"
                    value={customer.time}
                    onChange={update('time')}
                    aria-invalid={Boolean(showErrors && errors.pickup)}
                  />
                </div>

                {showErrors && errors.pickup ? (
                  <p className="wa-group__error">{errors.pickup}</p>
                ) : (
                  <p className="wa-field__help">
                    O preparo leva até {store.prepMinutes} minutos. Hoje dá para retirar a partir das {toTimeValue(earliest)}.
                  </p>
                )}
                <p className="wa-field__help">
                  Loja aberta: {store.hours.map((h) => `${h.days.toLowerCase()}, ${h.time}`).join('; ')}.
                </p>
              </div>
            )}
          </fieldset>

          <div className="wa-field">
            <label className="wa-field__label" htmlFor="wa-notes">
              Observações <span className="wa-field__optional">(opcional)</span>
            </label>
            <textarea id="wa-notes" className="wa-input" rows="3" maxLength={300} value={customer.notes} onChange={update('notes')} />
          </div>
        </section>
      </div>

      <footer className="wa-foot wa-foot--send">
        {showErrors && hasErrors && (
          <p className="wa-foot__error" role="alert">
            {errors.empty ? 'Adicione pelo menos 1 produto.' : 'Falta preencher seus dados acima.'}
          </p>
        )}
        <a className="wa-btn wa-btn--whatsapp" href={url ?? '#'} target="_blank" rel="noopener noreferrer" onClick={send}>
          <WhatsAppIcon />
          <span>Enviar pedido no WhatsApp</span>
        </a>
      </footer>
    </>
  )
}

export function WhatsAppIcon() {
  return (
    <svg className="wa-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Z" />
      <path d="M9 8.6c.2-.4.5-.4.8-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.7c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.6 0 .9-.7 1.8-1.7 1.9-1 .1-2.6-.3-4.4-2S8.5 11 8.6 10c0-.6.2-1.1.4-1.4Z" />
    </svg>
  )
}
