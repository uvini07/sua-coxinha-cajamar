# Como religar as outras lojas, o painel e os jogos

Desde 2026-10-27 o site está em **modo temporário: só a loja de Cajamar**.
`/`, `/cajamar` e qualquer outro endereço abrem Cajamar. Só `/cookies` continua além dela.

Nada foi apagado. O que mudou e como desfazer:

## 1. App.jsx (rotas, painel, escolha de loja, outras lojas)
A versão completa está em `src/App.completo.bkp.jsx`.

```bash
cp src/App.completo.bkp.jsx src/App.jsx
```

Isso religa: escolha de loja na raiz, todas as franquias (`/jundiai`, `/santos`...), `/painel`, `/jogo-coxinha`, `/cookies` e a página "não encontrada".

## 2. Botões de jogos dentro da loja
Em `src/paginas/LojaPagina.jsx`, descomente:

```jsx
<SecaoJogos navegar={navegar} loja={loja.slug} />
<BolinhaJogos navegar={navegar} loja={loja.slug} acimaDaBarra />
```

## 3. Geração das páginas por loja (build)
Em `scripts/gerar-paginas.mjs`, troque

```js
const lojas = (await lerLojas()).filter((l) => l.slug === 'cajamar')
```
por
```js
const lojas = await lerLojas()
```

## 4. Jogos (Duelo e Fliperama)
Os arquivos foram movidos de `public/` para `_desligado/` (fora do site). Para voltar:

```bash
git mv _desligado/duelo public/duelo
git mv _desligado/fliperama public/fliperama
git mv _desligado/fliperama-extras public/fliperama-extras
rmdir _desligado
```

## 5. vercel.json
- Na lista `redirects`, volte a regra (lembre da vírgula na regra anterior):
  `{ "source": "/jogo-coxinha", "destination": "/fliperama", "permanent": false }`
- Em `rewrites`, volte a exclusão: `(?!assets/|duelo|fliperama|pacotes|favicon|apple-touch-icon|compartilhar)`

## Atalho
O commit que desligou tudo pode ser revertido por inteiro com `git revert <hash>`
(ver `git log --oneline -- RELIGAR-LOJAS.md`).
