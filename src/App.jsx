import { useRef } from 'react'
import { StoryContext } from './context/StoryContext.js'
import { useStory } from './animations/useStory.js'
import { useReveal } from './hooks/useReveal.js'
import Navbar from './components/Navbar.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import MobileOrderBar from './components/MobileOrderBar.jsx'
import HeroScene from './components/scenes/HeroScene.jsx'
import ProductScene from './components/scenes/ProductScene.jsx'
import CoxinhaScene from './components/scenes/CoxinhaScene.jsx'
import ChurrosScene from './components/scenes/ChurrosScene.jsx'
import CatalogSection from './components/sections/CatalogSection.jsx'
import BenefitsSection from './components/sections/BenefitsSection.jsx'
import OrderSection from './components/sections/OrderSection.jsx'

export default function App() {
  const rootRef = useRef(null)
  const story = useStory(rootRef)
  useReveal(rootRef, story.isStory)

  return (
    <StoryContext.Provider value={story}>
      <a className="skip-link" href="#cardapio" onClick={story.linkTo('cardapio')}>
        Pular para o cardápio
      </a>
      <Navbar />
      <ScrollProgress />
      <main ref={rootRef} className="story">
        {/* Abertura: animada pelo scroll no computador, rolagem normal no celular */}
        <div className="stage">
          <HeroScene />
          <ProductScene />
          <CoxinhaScene />
          <ChurrosScene />
        </div>
        <CatalogSection />
        <BenefitsSection />
        <OrderSection />
      </main>
      <MobileOrderBar />
    </StoryContext.Provider>
  )
}
