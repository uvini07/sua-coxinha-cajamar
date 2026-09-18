import { useRef } from 'react'
import { StoryContext } from '../context/StoryContext.js'
import { useLoja } from '../context/LojaContext.js'
import { useStory } from '../animations/useStory.js'
import { useReveal } from '../hooks/useReveal.js'
import Navbar from '../components/Navbar.jsx'
import ScrollProgress from '../components/ScrollProgress.jsx'
import MobileOrderBar from '../components/MobileOrderBar.jsx'
import { WhatsAppOrderProvider } from '../components/whatsapp/WhatsAppOrder.jsx'
import HeroScene from '../components/scenes/HeroScene.jsx'
import ProductScene from '../components/scenes/ProductScene.jsx'
import CoxinhaScene from '../components/scenes/CoxinhaScene.jsx'
import ChurrosScene from '../components/scenes/ChurrosScene.jsx'
import CatalogSection from '../components/sections/CatalogSection.jsx'
import MolhosSection from '../components/sections/MolhosSection.jsx'
import BenefitsSection from '../components/sections/BenefitsSection.jsx'
import OrderSection from '../components/sections/OrderSection.jsx'

// Página de uma franquia. Os componentes são os mesmos para todas as lojas;
// o que muda são os dados, que vêm do contexto da loja, e as seções ativas.
export default function LojaPagina() {
  const loja = useLoja()
  const rootRef = useRef(null)
  const story = useStory(rootRef)
  useReveal(rootRef, story.isStory)

  const primeiroLink = loja.navLinks[0]?.id ?? 'pedido'

  return (
    <StoryContext.Provider value={story}>
      <WhatsAppOrderProvider>
        <a className="skip-link" href={`#${primeiroLink}`} onClick={story.linkTo(primeiroLink)}>
          Pular para o cardápio
        </a>
        <Navbar />
        <ScrollProgress />
        <main ref={rootRef} className="story">
          {/* Abertura: animada pelo scroll no computador, rolagem normal no celular */}
          {loja.temSecao('abertura') && (
            <div className="stage">
              <HeroScene />
              <ProductScene />
              <CoxinhaScene />
              <ChurrosScene />
            </div>
          )}
          {loja.temSecao('cardapio') && <CatalogSection />}
          {loja.temSecao('molhos') && <MolhosSection />}
          {loja.temSecao('sobre') && <BenefitsSection />}
          {loja.temSecao('pedido') && <OrderSection />}
        </main>
        <MobileOrderBar />
      </WhatsAppOrderProvider>
    </StoryContext.Provider>
  )
}
