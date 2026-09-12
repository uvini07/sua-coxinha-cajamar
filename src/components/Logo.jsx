import logoSvg from '../assets/logo-sua-coxinha.svg?raw'

// Logo vetorial extraído do cardápio. As letras usam currentColor para funcionar
// em fundo claro e escuro; a gota amarela mantém a cor da marca.
const markup = logoSvg.trim().replace('<svg ', '<svg aria-hidden="true" focusable="false" ')

export default function Logo({ className = '' }) {
  return <span className={`logo ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />
}
