# Sua Coxinha Cajamar — site

Site da loja Sua Coxinha em Cajamar, com cardápio completo e pedido pelo iFood ou 99Food.

## Rodar

```bash
npm install
npm run dev
```

Publicação: cada `git push` na branch `main` publica automaticamente na Vercel.

## Como o site funciona

- **Computador:** a abertura (início, produtos, coxinha e churros) é animada pelo scroll. Depois dela, o site rola normalmente.
- **Celular e tablet:** rolagem normal do início ao fim. Só há uma aparição suave e rápida em alguns blocos. Uma barra fixa no rodapé mantém os botões de pedido sempre à mão.
- **Movimento reduzido** (configuração do sistema): nenhuma animação.
- **Cardápio:** texto grande, botões grandes com nome da plataforma e todas as informações visíveis, sem precisar passar o mouse.

## Onde editar

| O que | Arquivo |
| --- | --- |
| Produtos, sabores, preços **e links de cada produto** | `src/data/products.js` |
| Endereço, horários, WhatsApp, **link das lojas no iFood e 99Food** | `src/data/store.js` |
| Diferenciais ("Pra todo tipo de fome") | `src/data/benefits.js` |
| Cores e tipografia | `src/styles/tokens.css` |
| Animações da abertura | `src/animations/timelines.js` |
| Fotos | `public/assets/` |

## Links de pedido por produto

Cada produto em `src/data/products.js` tem os campos `ifood` e `food99`:

```js
ifood: 'https://www.ifood.com.br/delivery/...',  // link exato do produto
food99: 'https://...',                           // link exato do produto
```

Para pegar o link, abra a loja no navegador do computador, clique no produto e copie o endereço da barra. Se um campo ficar vazio, o botão abre a página da loja. Se a loja do 99Food não estiver preenchida em `store.js`, o botão do 99Food não aparece.

## Estrutura

```
src/
  animations/   useStory (abertura no computador), timelines, zigzag
  components/   Navbar, OrderButtons, MobileOrderBar, ScrollProgress, Button, Price, Logo
    scenes/     HeroScene, ProductScene, CoxinhaScene, ChurrosScene
    sections/   CatalogSection, BenefitsSection, OrderSection
  data/         conteúdo editável
  hooks/        useMagnetic, useReveal
  styles/       tokens, base, componentes, scenes/*, sections/*
```

## Pendências

1. Link da loja no 99Food (`store.js`, plataforma `food99`).
2. Links exatos de cada produto no iFood e no 99Food (`products.js`).
3. Confirmar os horários (vieram da bio do Instagram).
4. Fotos dos produtos em alta resolução. As atuais foram recortadas do PDF do cardápio (~500px). Troque mantendo o mesmo nome em `public/assets/produtos/`, com fundo transparente e mínimo de 1200px no lado maior.
