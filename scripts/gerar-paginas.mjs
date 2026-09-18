// Gera um HTML por franquia depois do build (dist/<slug>/index.html).
//
// Por que: WhatsApp, Instagram e Facebook não executam JavaScript. Sem um HTML
// próprio por loja, a prévia de /cajamar e /jundiai sairia igual à da rede.
// O código da aplicação continua sendo um só: muda apenas o cabeçalho do HTML.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { SITE_URL } from '../site.config.js'

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

async function lerLojas() {
  const pastas = await readdir(resolve(raiz, 'src/lojas'), { withFileTypes: true })
  const lojas = []
  for (const pasta of pastas) {
    if (!pasta.isDirectory()) continue
    const arquivo = resolve(raiz, 'src/lojas', pasta.name, 'loja.js')
    const modulo = await import(pathToFileURL(arquivo).href).catch(() => null)
    if (modulo?.default) lojas.push({ slug: pasta.name, ...modulo.default })
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

  const destino = resolve(raiz, 'dist', loja.slug)
  await mkdir(destino, { recursive: true })
  await writeFile(resolve(destino, 'index.html'), html, 'utf8')
  console.log(`página gerada: /${loja.slug}`)
}

console.log(`${lojas.length} loja(s) no ar.`)
