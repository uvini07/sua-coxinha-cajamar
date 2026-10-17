import { useEffect, useState } from 'react'

/* Pacotes da loja na tela de pausa: Coxinha M, combos, churros… com botão para
   o iFood e o WhatsApp. Os dados vêm de /pacotes.json (gerado no build por
   scripts/gerar-paginas.mjs), o mesmo arquivo que o Duelo usa em /duelo.
   A loja é a última que a pessoa abriu no site; dá para trocar ali mesmo. */

const CHAVE_LOJA = 'sua-coxinha:loja'

const lerLoja = () => {
  try {
    return localStorage.getItem(CHAVE_LOJA)
  } catch {
    return null
  }
}

const reais = (centavos) => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const linkWhatsapp = (numero, pacote) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(`Olá! Vim pelo jogo do Coxinildo e quero pedir: ${pacote.nome}`)}`

export default function Pacotes() {
  const [lojas, setLojas] = useState(null)
  const [slug, setSlug] = useState(lerLoja)

  useEffect(() => {
    let vivo = true
    fetch('/pacotes.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && setLojas(d?.lojas ?? []))
      .catch(() => vivo && setLojas([]))
    return () => {
      vivo = false
    }
  }, [])

  if (!lojas?.length) return null
  const loja = lojas.find((l) => l.slug === slug)

  const escolher = (e) => {
    setSlug(e.target.value)
    try {
      localStorage.setItem(CHAVE_LOJA, e.target.value)
    } catch {
      /* segue sem lembrar */
    }
  }

  return (
    <section className="pacotes" aria-label="Pacotes para pedir">
      <div className="pacotes__topo">
        <strong>Bateu a fome?</strong>
        <label>
          <span>Loja</span>
          <select value={loja?.slug ?? ''} onChange={escolher}>
            {!loja && <option value="">Escolha a sua loja</option>}
            {lojas.map((l) => (
              <option key={l.slug} value={l.slug}>{l.nome}</option>
            ))}
          </select>
        </label>
      </div>
      {loja && (
        <ul className="pacotes__lista">
          {loja.pacotes.map((p) => (
            <li key={p.id} className="pacote">
              <img src={p.imagem} alt="" loading="lazy" />
              <span className="pacote__nome">{p.nome}</span>
              <span className="pacote__preco">{reais(p.preco)}</span>
              <span className="pacote__botoes">
                {(p.ifood || loja.ifood) && (
                  <a className="pacote__btn pacote__btn--ifood" href={p.ifood || loja.ifood} target="_blank" rel="noopener noreferrer">
                    iFood
                  </a>
                )}
                {loja.whatsapp && (
                  <a className="pacote__btn pacote__btn--wa" href={linkWhatsapp(loja.whatsapp, p)} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
