import Ver3D from '../ver3d/Ver3D.jsx'
import '../../styles/sections/cardapio3d.css'

// Chamada para o cardápio 3D. Por enquanto o botão abre a janela com o aviso
// de "em breve"; quando os modelos chegarem, ele passa a abrir o cardápio 3D.
export default function Cardapio3DSection() {
  return (
    <section id="cardapio-3d" className="c3d" data-theme="light" aria-labelledby="c3d-title">
      <div className="c3d__inner" data-reveal>
        <div className="c3d__icone" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M12 2 3 7v10l9 5 9-5V7z" />
            <path d="M3 7l9 5 9-5M12 12v10" />
          </svg>
        </div>
        <div className="c3d__texto">
          <h2 id="c3d-title" className="c3d__titulo display">
            Quer ver nossos produtos em tamanho real?
          </h2>
          <p className="c3d__sub">Abra nosso cardápio 3D e veja na sua mesa.</p>
        </div>
        <Ver3D className="ver3d--grande">Abrir cardápio 3D</Ver3D>
      </div>
    </section>
  )
}
