// Seletor de quantidade com botões grandes. Com `removable`, o "menos" na quantidade 1 vira "remover".
export default function Stepper({ value, onChange, label, removable = false, max = 99 }) {
  const willRemove = removable && value <= 1

  return (
    <div className="wa-stepper" role="group" aria-label={`Quantidade de ${label}`}>
      <button
        type="button"
        className="wa-stepper__btn"
        onClick={() => onChange(value - 1)}
        disabled={!removable && value <= 1}
        aria-label={willRemove ? `Remover ${label}` : `Diminuir quantidade de ${label}`}
      >
        {willRemove ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
          </svg>
        )}
      </button>
      <output className="wa-stepper__value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="wa-stepper__btn"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5v14" />
        </svg>
      </button>
    </div>
  )
}
