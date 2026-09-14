import { useRef, useState } from 'react'
import { priceText } from '../../data/products.js'
import { groupMax, lineKey, missingGroups, unitPrice } from './orderLogic.js'
import Stepper from './Stepper.jsx'

// Tela de um produto: quantidade/tamanho, sabores e adicionais, observação e "Adicionar".
export default function ItemView({ item, onAdd }) {
  const [variantIndex, setVariantIndex] = useState(item.variants ? 0 : null)
  const [selections, setSelections] = useState({})
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const groupRefs = useRef({})

  const variant = item.variants?.[variantIndex]
  const missing = missingGroups(item, selections)
  const unit = unitPrice(item, variantIndex, selections)

  const chooseVariant = (index) => {
    setVariantIndex(index)
    // Se a nova quantidade permite menos sabores, mantém só os primeiros escolhidos.
    const next = item.variants[index]
    setSelections((s) => {
      const trimmed = { ...s }
      ;(item.order ?? []).forEach((g) => {
        if (g.type === 'multi' && trimmed[g.id]) trimmed[g.id] = trimmed[g.id].slice(0, groupMax(g, next))
      })
      return trimmed
    })
  }

  const toggle = (group, choice) =>
    setSelections((s) => {
      const current = s[group.id] ?? []
      if (group.type === 'single') return { ...s, [group.id]: choice ? [choice] : [] }
      if (current.includes(choice)) return { ...s, [group.id]: current.filter((c) => c !== choice) }
      if (current.length >= groupMax(group, variant)) return s
      return { ...s, [group.id]: [...current, choice] }
    })

  const add = () => {
    if (missing.length) {
      setShowErrors(true)
      const el = groupRefs.current[missing[0]]
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.querySelector('input')?.focus({ preventScroll: true })
      return
    }
    const cleanNote = note.trim()
    onAdd({
      key: lineKey(item.id, variantIndex, selections, cleanNote),
      itemId: item.id,
      variantIndex,
      selections,
      note: cleanNote,
      qty,
    })
  }

  return (
    <>
      <div className="wa-body wa-body--item" data-lenis-prevent>
        <div className="wa-product">
          <div className="wa-product__photo">
            <img src={item.image} alt={item.alt} decoding="async" />
          </div>
          <h3 className="wa-product__name">{item.name}</h3>
          <p className="wa-product__desc">{item.description}</p>
          {!item.variants && <p className="wa-product__price">{priceText(item.price)}</p>}
        </div>

        {item.variants && (
          <fieldset className="wa-group">
            <legend className="wa-group__head">
              <span className="wa-group__title">Escolha a quantidade</span>
              <span className="wa-tag">Obrigatório</span>
            </legend>
            {item.variants.map((v, i) => (
              <label key={v.label} className="wa-choice">
                <input type="radio" name="wa-variant" checked={variantIndex === i} onChange={() => chooseVariant(i)} />
                <span className="wa-choice__mark" aria-hidden="true" />
                <span className="wa-choice__text">{v.label}</span>
                <span className="wa-choice__price">{priceText(v.price)}</span>
              </label>
            ))}
          </fieldset>
        )}

        {(item.order ?? []).map((group) => {
          const chosen = selections[group.id] ?? []
          const max = groupMax(group, variant)
          const hasError = showErrors && missing.includes(group.id)
          const errorId = `wa-err-${group.id}`

          return (
            <fieldset
              key={group.id}
              ref={(el) => (groupRefs.current[group.id] = el)}
              className={`wa-group${hasError ? ' wa-group--error' : ''}`}
              aria-describedby={hasError ? errorId : undefined}
            >
              <legend className="wa-group__head">
                <span className="wa-group__title">
                  {group.title}
                  {group.price ? ` (+ ${priceText(group.price)})` : ''}
                </span>
                <span className={`wa-tag${group.required ? '' : ' wa-tag--light'}`}>
                  {group.required ? 'Obrigatório' : 'Opcional'}
                </span>
              </legend>
              {group.type === 'multi' && (
                <p className="wa-group__hint">
                  {max === 1 ? 'Escolha 1 opção.' : `Escolha até ${max} opções.`} <strong>{chosen.length} de {max}</strong>
                </p>
              )}
              {hasError && (
                <p id={errorId} className="wa-group__error">
                  {group.type === 'multi' ? 'Escolha pelo menos 1 opção para continuar.' : 'Escolha 1 opção para continuar.'}
                </p>
              )}

              {group.type === 'single' && !group.required && (
                <label className="wa-choice">
                  <input type="radio" name={`wa-${group.id}`} checked={!chosen.length} onChange={() => toggle(group, null)} />
                  <span className="wa-choice__mark" aria-hidden="true" />
                  <span className="wa-choice__text">Não, obrigado</span>
                </label>
              )}

              {group.choices.map((choice) => {
                const checked = chosen.includes(choice)
                const blocked = group.type === 'multi' && !checked && chosen.length >= max
                return (
                  <label key={choice} className={`wa-choice${blocked ? ' wa-choice--blocked' : ''}`}>
                    <input
                      type={group.type === 'single' ? 'radio' : 'checkbox'}
                      name={`wa-${group.id}`}
                      checked={checked}
                      disabled={blocked}
                      onChange={() => toggle(group, choice)}
                    />
                    <span className={`wa-choice__mark${group.type === 'multi' ? ' wa-choice__mark--box' : ''}`} aria-hidden="true" />
                    <span className="wa-choice__text">{choice}</span>
                  </label>
                )
              })}
            </fieldset>
          )
        })}

        <div className="wa-field">
          <label className="wa-field__label" htmlFor="wa-item-note">
            Alguma observação? <span className="wa-field__optional">(opcional)</span>
          </label>
          <textarea
            id="wa-item-note"
            className="wa-input"
            rows="2"
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex.: sabor da coxinha do combo"
          />
        </div>
      </div>

      <footer className="wa-foot wa-foot--item">
        <Stepper value={qty} label={item.name} onChange={setQty} />
        <button type="button" className="wa-btn wa-btn--primary wa-btn--grow" onClick={add}>
          <span>Adicionar</span>
          <span>{priceText(unit * qty)}</span>
        </button>
      </footer>
    </>
  )
}
