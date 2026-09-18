# Sua Coxinha — plataforma das lojas

Um projeto, um código, várias franquias. Cada loja tem a sua página no mesmo domínio:

```
www.suacoxinhaloja.com.br/          escolha da loja
www.suacoxinhaloja.com.br/cajamar   loja de Cajamar
www.suacoxinhaloja.com.br/jundiai   loja de Jundiaí
```

A franquia é o primeiro pedaço da URL. O sistema carrega os dados daquela loja e
monta a página com os mesmos componentes: produtos, preços, contatos, endereço,
links e cores são independentes por loja.

## Rodar

```bash
npm install
npm run dev
```

Publicação: cada `git push` na branch `main` publica automaticamente na Vercel.

Endereço público: `site.config.js` (hoje `https://www.suacoxinhaloja.com.br`). Ao ligar
outro domínio, troque ali — as metas de compartilhamento e o canonical de todas as
lojas saem com o novo endereço no próximo build. O endereço antigo
(`sua-coxinha-cajamar.vercel.app`) redireciona para o novo pelo `vercel.json`: a raiz
vai para `/cajamar`, que era a loja daquele endereço.

## Como o site funciona

- **Computador:** a abertura (início, produtos, coxinha e churros) é animada pelo scroll. Depois dela, o site rola normalmente.
- **Celular e tablet:** rolagem normal do início ao fim. Só há uma aparição suave e rápida em alguns blocos. Uma barra fixa no rodapé mantém os botões de pedido sempre à mão.
- **Movimento reduzido** (configuração do sistema): nenhuma animação.
- **Cardápio:** texto grande, botões grandes com nome da plataforma e todas as informações visíveis, sem precisar passar o mouse.

## Onde editar (por loja)

Cada franquia é uma pasta em `src/lojas/<slug>/`. Mexer numa loja não afeta as outras.

| O que | Arquivo |
| --- | --- |
| Produtos, sabores, preços **e links de cada produto** | `src/lojas/<slug>/produtos.js` |
| Endereço, horários, WhatsApp, iFood, 99Food, textos, SEO, seções | `src/lojas/<slug>/loja.js` |
| Cores, logo e tipografia da loja (opcional) | `src/lojas/<slug>/tema.js` |
| Campos possíveis e valores padrão | `src/lojas/_schema.js` |
| De onde os dados vêm (trocar por banco no futuro) | `src/lojas/carregador.js` |
| Cores padrão da marca | `src/styles/tokens.css` |
| Animações da abertura | `src/animations/timelines.js` |
| Fotos | `public/assets/` |

## Cadastrar uma franquia nova

1. Copie uma pasta de loja: `cp -r src/lojas/cajamar src/lojas/osasco`.
2. Em `loja.js`, troque `slug`, `unit`, endereço, WhatsApp, horários, links e textos.
3. Cores: por padrão toda loja usa as cores da marca. Só crie um `tema.js` na pasta se aquela franquia precisar de cores próprias.
4. Em `produtos.js`, deixe só o que essa loja vende, com os preços dela.
5. `npm run dev` e abra `/osasco`.

Não é preciso criar página, componente ou rota: a pasta já vira `www.suacoxinhaloja.com.br/osasco`,
entra na lista da página inicial e ganha o seu próprio HTML (com título, descrição e
imagem de compartilhamento) no `npm run build`.

### Ícones e imagem de compartilhamento

São da marca e valem para todas as lojas — franquia nova não precisa de nada:

| O que | Arquivo | Vale para |
| --- | --- | --- |
| Ícone da aba e do atalho | `public/favicon.ico`, `favicon-192.png`, `favicon-512.png`, `apple-touch-icon.png` | todas as lojas |
| Imagem ao compartilhar o link | `public/compartilhar.jpg` | todas as lojas |

Se uma loja quiser a própria imagem de compartilhamento (uma foto da fachada, por
exemplo), coloque o arquivo em `public/` e aponte em `seo.shareImage` no `loja.js`
daquela franquia. O ícone da aba é sempre o da marca.

Seções ligadas/desligadas por loja ficam em `secoes`, no `loja.js`
(`abertura`, `cardapio`, `molhos`, `sobre`, `pedido`). A seção de molhos some sozinha
quando a loja não tem molhos cadastrados.

## Links de pedido por produto

Cada produto em `src/data/products.js` tem os campos `ifood` e `food99`:

```js
ifood: 'https://www.ifood.com.br/delivery/...',  // link exato do produto
food99: 'https://...',                           // link exato do produto
```

Para pegar o link, abra a loja no navegador do computador, clique no produto e copie o endereço da barra. Se um campo ficar vazio, o botão abre a página da loja. Se a loja do 99Food não estiver preenchida em `store.js`, o botão do 99Food não aparece.

## Pedido pelo WhatsApp (retirada na loja)

O botão verde "Pedir pelo WhatsApp" abre um pop-up com as etapas **Salgados → Doces → Bebidas → Finalizar**.
O cliente escolhe sabores e quantidades, informa o nome e o horário de retirada, e o site abre o WhatsApp
da loja com a mensagem do pedido pronta. Somente retirada na loja.

- Número do WhatsApp: `whatsapp` em `src/data/store.js`.
- Escolhas de cada produto (sabores, recheios, coberturas): campo `order` em `src/data/products.js`.
- Em quais etapas cada categoria aparece: `src/data/whatsappOrder.js`.
- Retirada: "assim que ficar pronto" ou dia e horário marcados. O prazo de preparo (`prepMinutes`) e o
  horário de funcionamento (`openingHours`) ficam em `src/data/store.js` e barram horários impossíveis.
- O pedido é esvaziado assim que o WhatsApp abre com a mensagem.
- O pedido fica salvo no aparelho do cliente até ele enviar. Enquanto houver itens, aparece o
  carrinho "Meu pedido": na barra do topo (todas as telas) e numa faixa acima da barra de pedido do celular.
- Link direto que já abre o pop-up (bom para a bio do Instagram): `https://www.suacoxinhaloja.com.br/cajamar#pedir-whatsapp`

## Fotos dos sabores

Na cena "Crocante por fora, cremosa por dentro" o cliente toca num sabor e a foto do recheio muda.

1. Salve o PNG de cada sabor em `public/assets/sabores/` com o nome da lista em `LEIA-ME.txt`
   (`frango.png`, `catupiry.png`, `costela.png`, `mussarela.png`, `pizza.png`, `carne-seca.png`,
   `cheddar-bacon.png`, `caipira.png`, `carne-moida.png`, `brocolis.png`).
2. Rode `npm run fotos`: o script recorta o fundo transparente e gera os `.webp` que o site usa.
3. Os nomes e a ordem dos sabores ficam em `flavors`, em `src/data/products.js`.

As fotos são ilustrativas, e o site diz isso embaixo da lista.

## Imagem do link (WhatsApp, Instagram, Facebook)

Ao compartilhar o link aparece a imagem `public/compartilhar.jpg` (1200x630).

- Para refazer: edite `scripts/og.html`, copie-o para `public/__og.html`, rode `npm run dev`, abra
  `http://localhost:5173/__og.html`, tire um print de 1200x630 salvando em `public/compartilhar.jpg`
  e apague o `public/__og.html`.
- Os textos e o endereço da imagem ficam nas tags `og:` em `index.html`. **Ao trocar de domínio,
  atualize as URLs absolutas de `og:url` e `og:image`.**
- O WhatsApp guarda a prévia por alguns dias. Para testar de novo, mande o link com algo no fim,
  como `?v=2`.

## Estrutura

```
src/
  animations/   useStory (abertura no computador), timelines, zigzag
  components/   Navbar, OrderButtons, MobileOrderBar, ScrollProgress, Button, Price, Logo
    whatsapp/   WhatsAppOrder (estado), OrderDialog, StepList, ItemView, ReviewView, orderLogic
    scenes/     HeroScene, ProductScene, CoxinhaScene, ChurrosScene
    sections/   CatalogSection, MolhosSection, BenefitsSection, OrderSection
  lojas/        uma pasta por franquia (loja.js, tema.js, produtos.js)
  paginas/      LojaPagina, EscolhaLoja, NaoEncontrada
  rotas/        useRota (a franquia vem da URL)
  lib/          preço, etapas do pedido, plataformas (código sem loja)
  context/      LojaContext (dados da loja aberta), StoryContext
  data/         cenas da abertura animada
  hooks/        useMagnetic, useReveal
  styles/       tokens, base, componentes, scenes/*, sections/*
```

## Pendências

1. Links exatos de cada produto no iFood e no 99Food (`produtos.js` de cada loja).
0. Dados reais da loja de Jundiaí (hoje é um exemplo para demonstrar o multi-loja).
2. Confirmar os horários (vieram da bio do Instagram).
3. Fotos dos produtos em alta resolução. As atuais foram recortadas do PDF do cardápio (~500px). Troque mantendo o mesmo nome em `public/assets/produtos/`, com fundo transparente e mínimo de 1200px no lado maior.
