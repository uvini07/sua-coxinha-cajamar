import { abrirJogo } from './jogos.js'

export default function CartaoJogo({ jogo, navegar, compacto = false }) {
  return (
    <a
      className={`jogo-card jogo-card--${jogo.id}${compacto ? ' jogo-card--compacto' : ''}`}
      href={jogo.href}
      onClick={abrirJogo(jogo, navegar)}
    >
      <span className="jogo-card__arte" aria-hidden="true">
        {jogo.imagens.map((src) => (
          <img key={src} src={src} alt="" loading="lazy" decoding="async" />
        ))}
      </span>
      <span className="jogo-card__texto">
        <span className="jogo-card__nome">{jogo.nome}</span>
        <span className="jogo-card__chamada">{jogo.chamada}</span>
      </span>
      <span className="jogo-card__jogar">
        Jogar
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7Z" fill="currentColor" />
        </svg>
      </span>
    </a>
  )
}
