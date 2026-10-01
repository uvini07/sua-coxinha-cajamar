import { useEffect, useState } from 'react'
import { LojaContext } from '../context/LojaContext.js'
import { carregarLoja } from '../lojas/carregador.js'

// Aplica o tema da loja como variáveis CSS na página inteira.
// O CSS dos componentes usa esses nomes, então a mesma interface muda de cara por loja.
function aplicarTema(tema) {
  const raiz = document.documentElement
  const mapa = {
    '--marca': tema.marca,
    '--marca-clara': tema.marcaClara,
    '--tinta': tema.tinta,
    '--tinta-2': tema.tinta2,
    '--papel': tema.papel,
    '--font-display': tema.fonteTitulo,
    '--font-body': tema.fonteTexto,
  }
  Object.entries(mapa).forEach(([nome, valor]) => {
    if (valor) raiz.style.setProperty(nome, valor)
    else raiz.style.removeProperty(nome)
  })
}

// Ajusta título, descrição e metas de compartilhamento da loja aberta.
// A prévia de link do WhatsApp usa o HTML gerado no build (scripts/gerar-paginas.mjs);
// aqui é para a aba do navegador e para quem navega pelo site.
function aplicarSeo(loja) {
  document.title = loja.seo.title
  const meta = (seletor, valor) => {
    const el = document.head.querySelector(seletor)
    if (el && valor) el.setAttribute('content', valor)
  }
  meta('meta[name="description"]', loja.seo.description)
  meta('meta[property="og:title"]', loja.seo.shareTitle)
  meta('meta[property="og:description"]', loja.seo.shareDescription)
  meta('meta[name="theme-color"]', loja.tema.tinta)
  meta('meta[name="apple-mobile-web-app-title"]', loja.nomeCompleto)

  // PWA: troca pro manifest da loja (nome e atalho próprios), só quem chegou
  // direto em /<loja> já tem isso certo no HTML; quem navegou pela SPA, não.
  const manifest = document.head.querySelector('link[rel="manifest"]')
  if (manifest) manifest.setAttribute('href', `/${loja.slug}/manifest.webmanifest`)
}

export default function LojaProvider({ slug, children, aoFalhar }) {
  const [loja, setLoja] = useState(null)

  useEffect(() => {
    let atual = true
    setLoja(null)
    carregarLoja(slug).then((dados) => {
      if (!atual) return
      if (!dados) {
        aoFalhar?.()
        return
      }
      aplicarTema(dados.tema)
      aplicarSeo(dados)
      setLoja(dados)
    })
    return () => {
      atual = false
    }
  }, [slug, aoFalhar])

  if (!loja) return <div className="carregando" aria-busy="true" aria-label="Carregando a loja" />

  return <LojaContext.Provider value={loja}>{children}</LojaContext.Provider>
}
