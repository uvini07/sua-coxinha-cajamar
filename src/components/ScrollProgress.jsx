import { useStoryContext } from '../context/StoryContext.js'
import { storyScenes } from '../data/scenes.js'
import '../styles/progress.css'

const pad = (n) => String(n).padStart(2, '0')

// Indicador "02 / 04" da abertura animada. Só existe no computador, durante a abertura.
// A barra é atualizada direto no DOM (variável --p) para não re-renderizar a cada quadro.
export default function ScrollProgress() {
  const { isStory, current, storyIndex, progressRef } = useStoryContext()
  if (!isStory) return null

  const scene = storyScenes[storyIndex]

  return (
    <div
      ref={progressRef}
      className="progress"
      data-theme={scene.theme}
      data-hidden={!current.inStory}
      aria-hidden="true"
    >
      <span className="progress__count">
        <span className="progress__current" key={storyIndex}>
          {pad(storyIndex + 1)}
        </span>
        <span className="progress__total"> / {pad(storyScenes.length)}</span>
      </span>
      <span className="progress__track">
        <span className="progress__fill" />
      </span>
      <span className="progress__label">{scene.label}</span>
    </div>
  )
}
