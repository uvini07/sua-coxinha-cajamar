// Espaço reservado para uma foto real que ainda não foi fornecida.
// `label` descreve a imagem necessária; `spec` traz proporção e enquadramento.
export default function ImagePlaceholder({ label, spec, className = '' }) {
  return (
    <div className={`img-placeholder ${className}`} role="img" aria-label={`Espaço para foto: ${label}`}>
      <p>
        [{label} — inserir foto real aqui]
        {spec && <small>{spec}</small>}
      </p>
    </div>
  )
}
