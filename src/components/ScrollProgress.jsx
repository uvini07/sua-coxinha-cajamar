import { useStoryContext } from '../context/StoryContext.js'
import { scenes } from '../data/scenes.js'
import '../styles/progress.css'

const pad = (n) => String(n).padStart(2, '0')

// Indicador "03 / 07" + barra. A barra é atualizada direto no DOM (variável --p)
// para não re-renderizar o React a cada quadro de scroll.
export default function ScrollProgress() {
  const { active, progressRef } = useStoryContext()
  const scene = scenes[active]

  return (
    <div ref={progressRef} className="progress" data-theme={scene.theme} data-scene={scene.id} aria-hidden="true">
      <span className="progress__count">
        <span className="progress__current" key={active}>
          {pad(active + 1)}
        </span>
        <span className="progress__total"> / {pad(scenes.length)}</span>
      </span>
      <span className="progress__track">
        <span className="progress__fill" />
      </span>
      <span className="progress__label">{scene.label}</span>
    </div>
  )
}
