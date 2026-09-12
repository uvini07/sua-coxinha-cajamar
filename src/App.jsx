import { useRef } from 'react'
import { StoryContext } from './context/StoryContext.js'
import { useStory } from './animations/useStory.js'
import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import HeroScene from './components/scenes/HeroScene.jsx'
import ProductScene from './components/scenes/ProductScene.jsx'
import CoxinhaScene from './components/scenes/CoxinhaScene.jsx'
import ChurrosScene from './components/scenes/ChurrosScene.jsx'
import MenuSection from './components/scenes/MenuSection.jsx'
import BenefitsSection from './components/scenes/BenefitsSection.jsx'
import FinalCTA from './components/scenes/FinalCTA.jsx'

export default function App() {
  const rootRef = useRef(null)
  const story = useStory(rootRef)

  return (
    <StoryContext.Provider value={story}>
      <a className="skip-link" href="#cardapio" onClick={story.linkTo('cardapio')}>
        Pular para o cardápio
      </a>
      <Navbar />
      <ScrollProgress />
      <main ref={rootRef} className="story">
        <div className="stage">
          <HeroScene />
          <ProductScene />
          <CoxinhaScene />
          <ChurrosScene />
          <MenuSection />
          <BenefitsSection />
          <FinalCTA />
        </div>
      </main>
    </StoryContext.Provider>
  )
}
