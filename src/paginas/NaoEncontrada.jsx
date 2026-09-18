import EscolhaLoja from './EscolhaLoja.jsx'

// URL de loja que não existe: em vez de quebrar, mostra o aviso e a lista de lojas.
export default function NaoEncontrada({ slug, navegar }) {
  return (
    <EscolhaLoja
      navegar={navegar}
      aviso={slug ? `Não encontramos a loja "${slug}".` : 'Não encontramos essa página.'}
    />
  )
}
