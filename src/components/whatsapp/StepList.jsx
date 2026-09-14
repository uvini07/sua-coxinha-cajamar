import { useLayoutEffect, useRef } from 'react'
import { priceText } from '../../data/products.js'
import Stepper from './Stepper.jsx'

// Lista de produtos de uma etapa (Salgados, Doces ou Bebidas).
export default function StepList({ step, summary, dispatch, onOpenItem, onNext, nextLabel, onReview, scrollTop, onScrollSave }) {
  const bodyRef = useRef(null)

  useLayoutEffect(() => {
    bodyRef.current.scrollTop = scrollTop ?? 0
  }, [scrollTop])

  const qtyOf = (itemId) => summary.lines.filter((l) => l.itemId === itemId).reduce((n, l) => n + l.qty, 0)
  const open = (id) => {
    onScrollSave(bodyRef.current.scrollTop)
    onOpenItem(id)
  }

  return (
    <>
      <div ref={bodyRef} className="wa-body" data-lenis-prevent>
        <p className="wa-hint">{step.hint}</p>

        {step.sections.map((section) => (
          <section key={section.id} className="wa-section" aria-labelledby={`wa-sec-${section.id}`}>
            <h3 id={`wa-sec-${section.id}`} className="wa-section__title">
              {section.name}
            </h3>

            <ul className="wa-list">
              {section.items.map((item) => {
                const qty = qtyOf(item.id)

                if (step.simple) {
                  const add = () => dispatch({ type: 'add', line: { key: item.id, itemId: item.id, variantIndex: null, selections: {}, note: '', qty: 1 } })
                  return (
                    <li key={item.id} className="wa-drink">
                      <span className="wa-drink__info">
                        <span className="wa-drink__name">{item.name}</span>
                        <span className="wa-drink__price">{priceText(item.price)}</span>
                      </span>
                      {qty ? (
                        <Stepper value={qty} label={item.name} removable onChange={(n) => dispatch({ type: 'qty', key: item.id, qty: n })} />
                      ) : (
                        <button type="button" className="wa-add" onClick={add}>
                          Adicionar
                          <span className="sr-only"> {item.name}</span>
                        </button>
                      )}
                    </li>
                  )
                }

                return (
                  <li key={item.id}>
                    <button type="button" className="wa-item" onClick={() => open(item.id)}>
                      <span className="wa-item__info">
                        <span className="wa-item__name">{item.name}</span>
                        <span className="wa-item__desc">{item.description}</span>
                        <span className="wa-item__price">
                          {item.from && <span className="wa-item__from">A partir de </span>}
                          {priceText(item.price)}
                        </span>
                        {qty > 0 && <span className="wa-item__badge">{qty} no pedido</span>}
                      </span>
                      <span className="wa-item__photo">
                        <img src={item.image} alt="" loading="lazy" decoding="async" />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <footer className="wa-foot">
        {summary.count > 0 ? (
          <button type="button" className="wa-foot__cart" onClick={onReview}>
            <span className="wa-foot__count">
              {summary.count} {summary.count === 1 ? 'item' : 'itens'}
            </span>
            <span className="wa-foot__total">{priceText(summary.total)}</span>
          </button>
        ) : (
          <p className="wa-foot__empty">Nenhum item ainda</p>
        )}
        <button type="button" className="wa-btn wa-btn--primary" onClick={onNext}>
          {nextLabel}
        </button>
      </footer>
    </>
  )
}
