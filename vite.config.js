import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { SITE_URL, IMAGEM_COMPARTILHAR } from './site.config.js'

// Troca os marcadores do index.html pelos valores de site.config.js.
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: (html) =>
    html.replaceAll('%SITE_URL%', SITE_URL).replaceAll('%IMAGEM_COMPARTILHAR%', IMAGEM_COMPARTILHAR),
})

export default defineConfig({
  plugins: [
    react(),
    siteUrl(),
    // Service worker só: o manifest é gerado por loja em scripts/gerar-paginas.mjs,
    // porque cada franquia (/cajamar, /jundiai...) instala como um app próprio.
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        // Páginas (inclusive as geradas por loja depois do build): tenta a rede
        // primeiro, pra sempre pegar o HTML e o SEO certos; cai pro cache só
        // quando não tem internet.
        navigateFallback: null,
        // O Duelo (public/duelo) é outro app, com 11 MB de sprites: fica fora do precache.
        globIgnores: ['duelo/**', 'fliperama/**'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: { cacheName: 'paginas', networkTimeoutSeconds: 3 },
          },
          {
            urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'estaticos' },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              // O número no nome é a geração da arte. As fotos e os ícones
              // mantêm o mesmo endereço quando trocam, e com CacheFirst quem já
              // visitou continuaria vendo os antigos por 30 dias. Subir este
              // número abre um cache limpo. Suba junto com qualquer troca de
              // identidade visual.
              cacheName: 'imagens-2',
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
})
