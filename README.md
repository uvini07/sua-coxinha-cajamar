# Sua Coxinha Cajamar — landing page

Landing page em formato de narrativa por scroll: 7 cenas em tela cheia, trocadas por uma borda serrilhada (a mesma do cardápio) enquanto o usuário rola a página.

## Rodar

```bash
npm install
npm run dev
```

Build de produção: `npm run build` (gera a pasta `dist/`, pronta para Vercel, Netlify ou qualquer hospedagem estática).

## Tecnologia

- **Vite + React**
- **GSAP + ScrollTrigger**: timeline mestre ligada ao scroll (`src/animations/timelines.js`)
- **Lenis**: scroll suave, só no desktop (no celular o scroll é o nativo)
- Sem Three.js: as fotos reais dos produtos, com transformações 3D em CSS/GSAP, deixam a página mais leve e fiel ao produto

## Onde editar

| O que | Arquivo |
| --- | --- |
| Produtos, sabores, preços | `src/data/products.js` |
| Endereço, horários, telefone, links | `src/data/store.js` |
| Diferenciais (cena 06) | `src/data/benefits.js` |
| Ordem e nomes das cenas | `src/data/scenes.js` |
| Cores e tipografia | `src/styles/tokens.css` |
| Animações de cada cena | `src/animations/timelines.js` |
| Fotos | `public/assets/produtos/` |

## Estrutura

```
src/
  animations/   useStory (pin + Lenis + modo estático), timelines por cena, zigzag
  components/   Navbar, ScrollProgress, Button, Price, Logo, ImagePlaceholder
    scenes/     HeroScene, ProductScene, CoxinhaScene, ChurrosScene,
                MenuSection, BenefitsSection, FinalCTA
  data/         conteúdo editável
  hooks/        useMagnetic, useTilt
  styles/       tokens, base, navbar, progress, scenes/*
```

## Acessibilidade e desempenho

- Com `prefers-reduced-motion`, a narrativa é desligada: as cenas viram seções normais, sem pin.
- Só `transform`, `opacity` e `clip-path` são animados. O blur é usado só no desktop.
- No celular: menos elementos flutuantes, sem blur e sem Lenis.
- Foco visível, link para pular direto ao cardápio, preços lidos por extenso em leitores de tela.

## Pendências da loja

**Confirmar antes de publicar** (marcados com `CONFIRMAR` em `src/data/store.js`):

1. Telefone **(11) 97640-3209**, que veio do Google. Se for WhatsApp, preencha `whatsapp: '5511976403209'` e o botão vira link do WhatsApp.
2. Horários: seg a sáb, 7h às 22h; dom, 14h às 22h. Vieram da bio do Instagram.
3. Preços: transcritos do cardápio `AF_COX_25_001`.

**Imagens.** As fotos atuais foram recortadas do PDF do cardápio e estão em baixa resolução (~500px). Troque pelos arquivos originais mantendo o mesmo nome:

| Arquivo | Onde aparece | Formato ideal |
| --- | --- | --- |
| `coxinha-g.webp` e `coxinha-g-sombra.webp` | Hero, cena 03, cardápio | PNG/WebP com fundo transparente, vertical 4:5, mín. 1600×2000, cortada ao meio com recheio visível, produto centralizado |
| `churros-gourmet.webp` | Hero, cena 04, cardápio | Fundo transparente, horizontal ~6:5, mín. 2000×1700, os 3 churros nas embalagens |
| `coxinha-m.webp` | Cena 03 (início do crescimento) | Fundo transparente, 1:1, mín. 1200×1200 |
| `mini-churros.webp`, `molhos-doces.webp` | Elementos flutuantes da cena 04 | Fundo transparente, mín. 1000px no lado maior |
| Demais produtos | Cardápio | Fundo transparente, mín. 1200px no lado maior |
| **Fachada ou balcão da loja** (falta) | Cena 06, "No iFood ou na loja" | Foto real, vertical 4:5, mín. 1200×1500, com a marca visível. Hoje é um espaço reservado |
| Logo oficial em SVG | Navbar | O logo atual foi extraído do PDF em vetor. Confirme se é a versão oficial |
