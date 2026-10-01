// Gera um HTML por franquia depois do build (dist/<slug>/index.html).
//
// Por que: WhatsApp, Instagram e Facebook não executam JavaScript. Sem um HTML
// próprio por loja, a prévia de /cajamar e /jundiai sairia igual à da rede.
// O código da aplicação continua sendo um só: muda apenas o cabeçalho do HTML.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SITE_URL } from '../site.config.js'
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
      theme_color: tema.tinta ?? '#141415',
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
  html = trocarMeta(html, 'property', 'og:image', `${SITE}${seo.shareImage ?? '/compartilhar.jpg'}`)
  html = trocarMeta(html, 'property', 'og:image:alt', seo.shareImageAlt ?? nome)
  html = trocarMeta(html, 'property', 'og:site_name', nome)
  html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escapar(url)}$2`)

  // PWA: a loja instala como um app próprio, com o nome e a cor dela.
  html = trocarManifest(html, `/${loja.slug}/manifest.webmanifest`)
  html = trocarMeta(html, 'name', 'theme-color', loja.tema?.tinta ?? '#141415')
  html = trocarMeta(html, 'name', 'apple-mobile-web-app-title', nome)

  const destino = resolve(raiz, 'dist', loja.slug)
  await mkdir(destino, { recursive: true })
  await writeFile(resolve(destino, 'index.html'), html, 'utf8')
  await writeFile(resolve(destino, 'manifest.webmanifest'), manifestDaLoja(loja), 'utf8')
  console.log(`página gerada: /${loja.slug}`)
}

console.log(`${lojas.length} loja(s) no ar.`)
