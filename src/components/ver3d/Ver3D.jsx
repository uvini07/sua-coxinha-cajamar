import { useRef } from 'react'
import '../../styles/ver3d.css'

// Botão "Ver em 3D na sua mesa" + janela do visualizador.
//
// ESTRUTURA PRONTA, SEM MODELOS AINDA.
// Quando os modelos existirem, cada produto ganha o campo `model3d` em
// src/lojas/<slug>/produtos.js (ex.: model3d: '/models/coxinha-g.glb') e o
// visualizador entra no lugar marcado com data-ver3d-palco abaixo
// (ex.: <model-viewer src={modelo} ar camera-controls auto-rotate />).
// Sem `model3d`, a janela mostra o aviso de "em breve".
export default function Ver3D({ nome, modelo, className = '', children }) {
  const dialogRef = useRef(null)

  const abrir = () => dialogRef.current?.showModal()
  const fechar = () => dialogRef.current?.close()

  return (
    <>
      <button type="button" className={`ver3d ${className}`} onClick={abrir}>
        <Cubo />
        <span>{children ?? 'Ver em 3D na sua mesa'}</span>
      </button>

      <dialog
        ref={dialogRef}
        className="ver3d__janela"
        aria-label={nome ? `${nome} em 3D` : 'Cardápio 3D'}
        onClick={(e) => e.target === dialogRef.current && fechar()}
      >
        <div className="ver3d__conteudo">
          <button type="button" className="ver3d__fechar" onClick={fechar} aria-label="Fechar">
            ×
          </button>
          <p className="ver3d__kicker">Cardápio 3D</p>
          <h3 className="ver3d__titulo">{nome ?? 'Nossos produtos em tamanho real'}</h3>

          <div className="ver3d__palco" data-ver3d-palco data-modelo={modelo || undefined}>
            <Cubo grande />
            <p>
              {modelo
                ? 'Carregando o modelo 3D…'
                : 'Em breve você vai poder girar este produto e colocá-lo na sua mesa pela câmera do celular.'}
            </p>
          </div>

          <p className="ver3d__dica">
            No celular, toque em <strong>Ver na sua mesa</strong> e aponte a câmera para uma superfície plana.
          </p>
        </div>
      </dialog>
    </>
  )
}

function Cubo({ grande }) {
  return (
    <svg
      className={grande ? 'ver3d__cubo ver3d__cubo--grande' : 'ver3d__cubo'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 2 3 7v10l9 5 9-5V7z" />
      <path d="M3 7l9 5 9-5M12 12v10" />
    </svg>
  )
}
