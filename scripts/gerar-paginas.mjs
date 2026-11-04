// Gera um HTML por franquia depois do build (dist/<slug>/index.html).
//
// Por que: WhatsApp, Instagram e Facebook não executam JavaScript. Sem um HTML
// próprio por loja, a prévia de /cajamar e /jundiai sairia igual à da rede.
// O código da aplicação continua sendo um só: muda apenas o cabeçalho do HTML.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SITE_URL, IMAGEM_COMPARTILHAR } from '../site.config.js'
import { criarLoja } from '../src/lojas/_schema.js'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = process.env.SITE_URL ?? SITE_URL

const escapar = (texto = '') =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const trocarTag = (html, regex, novo) => html.replace(regex, novo)

// String.raw: sem ele o \s da expressão viraria a letra "s" dentro do template.
const trocarMeta = (html, atributo, nome, valor) =>
  html.replace(
    new RegExp(String.raw`(<meta\s+${atributo}="${nome}"\s+content=")[^"]*(")`),
    `$1${escapar(valor)}$2`,
  )

const trocarManifest = (html, href) =>
  html.replace(/(<link\s+rel="manifest"\s+href=")[^"]*(")/, `$1${escapar(href)}$2`)

// Manifest da franquia: cada loja instala como um app próprio (nome, cor e
// atalho da tela inicial dela), não como a rede inteira.
function manifestDaLoja(loja) {
  const nome = `${loja.brand} ${loja.unit}`.trim()
  const tema = loja.tema ?? {}
  return JSON.stringify(
    {
      name: nome,
      short_name: loja.unit || loja.brand,
      description: loja.seo?.description ?? '',
      start_url: `/${loja.slug}`,
      scope: `/${loja.slug}`,
      display: 'standalone',
      orientation: 'portrait-primary',
      background_color: tema.papel ?? '#ffffff',
      theme_color: tema.tinta ?? '#131313',
      lang: 'pt-BR',
      icons: [
        { src: '/favicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      ],
    },
    null,
    2,
  )
}

// Importa um módulo opcional da loja (tema.js nem toda franquia tem).
async function importarOpcional(caminho) {
  const modulo = await import(pathToFileURL(caminho).href).catch(() => null)
  return modulo?.default ?? {}
}

// Mesma montagem que o site usa em tempo de execução (src/lojas/carregador.js),
// pra loja.tema e loja.seo saírem com os mesmos padrões aplicados.
async function lerLojas() {
  const pastas = await readdir(resolve(raiz, 'src/lojas'), { withFileTypes: true })
  const lojas = []
  for (const pasta of pastas) {
    if (!pasta.isDirectory()) continue
    const base = resolve(raiz, 'src/lojas', pasta.name)
    const loja = await importarOpcional(resolve(base, 'loja.js'))
    if (!Object.keys(loja).length) continue
    const tema = await importarOpcional(resolve(base, 'tema.js'))
    lojas.push(criarLoja({ slug: pasta.name, loja, tema, produtos: {} }))
  }
  return lojas
}


// ---------- SEO (Google) ----------
// O site é um app React: o conteúdo só aparece depois do JavaScript. Para o Google
// entender cada página logo de cara, cada HTML leva:
//   1. dados estruturados (JSON-LD) da loja: nome, endereço, telefone, horário;
//   2. um texto simples dentro de #root (o React apaga ao abrir, o visitante nem vê).
// No fim do build saem também robots.txt e sitemap.xml.
const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const hora = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`

function jsonLdDaLoja(loja, url) {
  const nome = `${loja.brand} ${loja.unit}`.trim()
  const a = loja.address ?? {}
  const [cidade, uf] = String(a.city ?? '').split(/\s*[–-]\s*/)
  const dados = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${url}#loja`,
    name: nome,
    alternateName: [`${loja.brand} Loja ${loja.unit}`, `Coxinha ${loja.unit}`, loja.brand],
    url,
    image: `${SITE}${loja.seo?.shareImage ?? IMAGEM_COMPARTILHAR}`,
    logo: `${SITE}/favicon-512.png`,
    description: loja.seo?.description ?? '',
    servesCuisine: ['Salgados', 'Coxinha', 'Churros'],
    priceRange: '$',
    telephone: loja.phone ? `+${loja.whatsapp || loja.phone.replace(/\D/g, '')}` : undefined,
    address: a.street
      ? {
          '@type': 'PostalAddress',
          streetAddress: a.street,
          addressLocality: cidade || a.city,
          addressRegion: uf || 'SP',
          postalCode: a.cep,
          addressCountry: 'BR',
        }
      : undefined,
    geo: loja.coords ? { '@type': 'GeoCoordinates', latitude: loja.coords[0], longitude: loja.coords[1] } : undefined,
    hasMap: loja.links?.maps || undefined,
    sameAs: [loja.links?.instagram, loja.links?.ifood].filter(Boolean),
    parentOrganization: { '@id': `${SITE}/#organizacao` },
  }
  if (loja.openingHours) {
    dados.openingHoursSpecification = Object.entries(loja.openingHours)
      .filter(([, h]) => Array.isArray(h))
      .map(([d, [abre, fecha]]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: DIAS[d], opens: hora(abre), closes: hora(fecha) }))
  }
  return dados
}

const ORGANIZACAO = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organizacao`,
      name: 'Sua Coxinha',
      alternateName: ['Sua Coxinha Loja', 'Sua Coxinha Franquia'],
      url: `${SITE}/`,
      logo: `${SITE}/favicon-512.png`,
    },
    { '@type': 'WebSite', '@id': `${SITE}/#site`, name: 'Sua Coxinha', alternateName: 'Sua Coxinha Loja', url: `${SITE}/`, inLanguage: 'pt-BR' },
  ],
}

const scriptJsonLd = (dados) =>
  `<script type="application/ld+json">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>`

const comJsonLd = (html, dados) => html.replace('</head>', `  ${scriptJsonLd(dados)}\n  </head>`)
const comConteudo = (html, conteudo) => html.replace('<div id="root"></div>', `<div id="root">${conteudo}</div>`)

const base = await readFile(resolve(raiz, 'dist/index.html'), 'utf8')
const lojas = await lerLojas()

for (const loja of lojas) {
  const nome = `${loja.brand} ${loja.unit}`.trim()
  const seo = loja.seo ?? {}
  const titulo = seo.title ?? nome
  const descricao = seo.description ?? ''
  const url = `${SITE}/${loja.slug}`

  let html = base
  html = trocarTag(html, /<title>[^<]*<\/title>/, `<title>${escapar(titulo)}</title>`)
  html = trocarMeta(html, 'name', 'description', descricao)
  html = trocarMeta(html, 'property', 'og:title', seo.shareTitle ?? titulo)
  html = trocarMeta(html, 'property', 'og:description', seo.shareDescription ?? descricao)
  html = trocarMeta(html, 'property', 'og:url', url)
  html = trocarMeta(html, 'property', 'og:image', `${SITE}${seo.shareImage ?? IMAGEM_COMPARTILHAR}`)
  html = trocarMeta(html, 'property', 'og:image:alt', seo.shareImageAlt ?? nome)
  html = trocarMeta(html, 'property', 'og:site_name', nome)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escapar(url)}$2`)

  // PWA: a loja instala como um app próprio, com o nome e a cor dela.
  html = trocarManifest(html, `/${loja.slug}/manifest.webmanifest`)
  html = trocarMeta(html, 'name', 'theme-color', loja.tema?.tinta ?? '#131313')
  html = trocarMeta(html, 'name', 'apple-mobile-web-app-title', nome)

  // SEO: dados da loja para o Google e um texto que ele lê sem JavaScript.
  html = comJsonLd(html, jsonLdDaLoja(loja, url))
  const a = loja.address ?? {}
  const endereco = [a.street, a.district, a.city, a.cep].filter(Boolean).join(', ')
  html = comConteudo(
    html,
    `<h1>${escapar(nome)}</h1><p>${escapar(descricao)}</p>` +
      (endereco ? `<p>Endereço: ${escapar(endereco)}</p>` : '') +
      (loja.phone ? `<p>WhatsApp: ${escapar(loja.phone)}</p>` : '') +
      (loja.hours ?? []).map((h) => `<p>${escapar(h.days)}: ${escapar(h.time)}</p>`).join('') +
      `<p><a href="/">Ver todas as lojas Sua Coxinha</a></p>`,
  )

  const destino = resolve(raiz, 'dist', loja.slug)
  await mkdir(destino, { recursive: true })
  await writeFile(resolve(destino, 'index.html'), html, 'utf8')
  await writeFile(resolve(destino, 'manifest.webmanifest'), manifestDaLoja(loja), 'utf8')
  console.log(`página gerada: /${loja.slug}`)
}

console.log(`${lojas.length} loja(s) no ar.`)

// Página inicial (rede): dados da marca + links para todas as lojas, para o
// Google achar cada uma a partir da raiz.
{
  let html = comJsonLd(base, ORGANIZACAO)
  html = comConteudo(
    html,
    '<h1>Sua Coxinha</h1><p>Coxinhas de 9g a 250g, churros gourmet e kits para festa. Escolha a sua loja Sua Coxinha:</p><ul>' +
      lojas.map((l) => `<li><a href="/${l.slug}">${escapar(`${l.brand} ${l.unit}`.trim())}</a></li>`).join('') +
      '</ul>',
  )
  await writeFile(resolve(raiz, 'dist/index.html'), html, 'utf8')
}

// robots.txt e sitemap.xml: dizem ao Google o que indexar.
const hoje = new Date().toISOString().slice(0, 10)
const urls = [`${SITE}/`, ...lojas.map((l) => `${SITE}/${l.slug}`)]
await writeFile(
  resolve(raiz, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc><lastmod>${hoje}</lastmod></url>`).join('\n') +
    '\n</urlset>\n',
  'utf8',
)
await writeFile(resolve(raiz, 'dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /painel\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8')
console.log(`sitemap.xml: ${urls.length} endereço(s)`)

// Rotas que não são loja: um HTML de verdade em cada uma. Sem isso, a Vercel
// devolve o 404 dela antes de o app abrir (só existiam /, /cajamar e /jundiai).
// O painel não entra no Google: noindex já no HTML.
const ROTAS_FIXAS = {
  painel: { titulo: 'Painel do franqueado | Sua Coxinha', robots: 'noindex, nofollow' },
  cookies: { titulo: 'Política de cookies | Sua Coxinha' },
  'jogo-coxinha': { titulo: 'Coxinildo, o jogo | Sua Coxinha' },
}

for (const [rota, { titulo, robots }] of Object.entries(ROTAS_FIXAS)) {
  let html = trocarTag(base, /<title>[^<]*<\/title>/, `<title>${escapar(titulo)}</title>`)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escapar(`${SITE}/${rota}`)}$2`)
  if (robots) html = html.replace('</head>', `  <meta name="robots" content="${robots}" />\n  </head>`)
  const destino = resolve(raiz, 'dist', rota)
  await mkdir(destino, { recursive: true })
  await writeFile(resolve(destino, 'index.html'), html, 'utf8')
  console.log(`página gerada: /${rota}`)
}

// Pacotes que os jogos mostram na pausa (Coxinildo e Duelo, em /duelo).
// Um arquivo só, com os links de pedido de cada loja; o jogo usa a loja que a
// pessoa abriu por último (localStorage 'sua-coxinha:loja') ou a que ela escolher.
const PACOTES = ['combo-casal', 'combo-dupla-fome', 'combo-pra-voce', 'coxinha-m', 'coxinha-g', 'churros-gourmet', 'copo-doce']

const pacotesDasLojas = []
for (const loja of lojas) {
  // produtos.js exporta `catalog` com nome (não default), por isso não usa importarOpcional
  const modulo = await import(pathToFileURL(resolve(raiz, 'src/lojas', loja.slug, 'produtos.js')).href).catch(() => ({}))
  const itens = (modulo.catalog ?? []).flatMap((c) => c.items ?? [])
  pacotesDasLojas.push({
    slug: loja.slug,
    nome: `${loja.brand} ${loja.unit}`.trim(),
    ifood: loja.links?.ifood ?? '',
    food99: loja.links?.food99 ?? '',
    whatsapp: loja.whatsapp ?? '',
    pacotes: PACOTES.map((id) => itens.find((i) => i.id === id))
      .filter(Boolean)
      .map((i) => ({ id: i.id, nome: i.name, descricao: i.description, preco: i.price, imagem: i.image, ifood: i.ifood || '' })),
  })
}
await writeFile(resolve(raiz, 'dist/pacotes.json'), JSON.stringify({ lojas: pacotesDasLojas }), 'utf8')
console.log(`pacotes dos jogos: ${pacotesDasLojas.length} loja(s)`)
