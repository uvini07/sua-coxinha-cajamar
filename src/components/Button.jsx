import { useRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic.js'

export default function Button({
  href,
  children,
  variant = 'primary',
  size,
  external = false,
  magnetic = false,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  useMagnetic(ref, magnetic)

  const classes = ['btn', variant !== 'primary' && `btn--${variant}`, size && `btn--${size}`, className]
    .filter(Boolean)
    .join(' ')

  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a ref={ref} href={href} className={classes} {...externalProps} {...rest}>
      <span className="btn__label">{children}</span>
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  )
}
