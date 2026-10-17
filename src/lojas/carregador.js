// CARREGADOR DAS LOJAS
//
// É o único lugar que sabe DE ONDE vêm os dados das franquias. Hoje vêm das pastas
// em src/lojas/<slug>/; no dia em que houver painel administrativo, só este arquivo
// muda (passa a buscar no banco) — nenhum componente precisa ser tocado.
//
// As pastas são descobertas sozinhas: criar src/lojas/osasco/ já cria a rota /osasco.

import { criarLoja } from './_schema.js'

// Configuração e tema são leves: entram no pacote principal (a página raiz lista todas).
const configs = import.meta.glob('./*/loja.js', { eager: true, import: 'default' })
const temas = import.meta.glob('./*/tema.js', { eager: true, import: 'default' })
// O catálogo é o arquivo grande: só é baixado quando alguém abre aquela loja.
const catalogos = import.meta.glob('./*/produtos.js')

const slugDoCaminho = (caminho) => caminho.split('/')[1]

const porSlug = Object.fromEntries(
  Object.entries(configs).map(([caminho, config]) => {
    const slug = slugDoCaminho(caminho)
    return [slug, { slug, config, tema: temas[`./${slug}/tema.js`] ?? {}, catalogo: catalogos[`./${slug}/produtos.js`] }]
  }),
)

const carregadas = new Map()

// Lista curta para a página de escolha da loja e para o menu de franquias.
export const lojasResumo = Object.values(porSlug)
  .map(({ slug, config, tema }) => {
    const cidade = config.address?.city ?? ''
    const municipio = cidade.split(' – ')[0].trim()
    // "Jundiaí Boa Imigrantes" → "Boa Imigrantes": a cidade já aparece no agrupamento.
    const apelido = config.unit.startsWith(`${municipio} `) ? config.unit.slice(municipio.length + 1) : config.unit
    return {
      slug,
      brand: config.brand,
      unit: config.unit,
      nome: `${config.brand} ${config.unit}`.trim(),
      apelido,
      cidade,
      municipio,
      endereco: config.address?.street ?? '',
      bairro: config.address?.district ?? '',
      coords: config.coords ?? null,
      whatsapp: config.whatsapp ?? '',
      maps: config.links?.maps ?? '',
      ifood: config.links?.ifood ?? '',
      food99: config.links?.food99 ?? '',
      tema,
    }
  })
  .sort((a, b) => a.unit.localeCompare(b.unit, 'pt-BR'))

export const existeLoja = (slug) => Boolean(slug && porSlug[slug])

// Devolve a loja pronta (config + tema + catálogo + etapas do pedido).
export async function carregarLoja(slug) {
  if (!existeLoja(slug)) return null
  if (carregadas.has(slug)) return carregadas.get(slug)

  const { config, tema, catalogo } = porSlug[slug]
  const produtos = catalogo ? await catalogo() : {}
  const loja = criarLoja({ slug, loja: config, tema, produtos })
  carregadas.set(slug, loja)
  return loja
}
