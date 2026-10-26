# Números do site e painel do franqueado

Tudo no plano **gratuito** do Firebase (`suacoxinhaapp`, o mesmo banco do app). Sem servidor e sem chave.
Os clientes continuam sem login. Só o painel `/painel` tem login: entra quem é **franqueado** no app
(`equipe/{email}`, papel `franqueado`, ativo) ou o admin.

## Como funciona
1. **Contadores próprios** (`src/analytics/contadores.js`): cada visita ou clique soma +1 em
   `sitePorLoja/{loja}/dias/{AAAA-MM-DD}` no Firestore. É anônimo (sem cookie, sem dado pessoal),
   então conta todo mundo, aceitando cookies ou não. As regras do app só aceitam +1 numa chave por vez.
   Contadores: `pv`, `visita`, `src__<origem>`, `dev__<aparelho>`, `pedido_ifood`, `pedido_food99`,
   `abrir_whatsapp`, `pedido_whatsapp`, `valor_whatsapp` (centavos), `contato_*`, `item__<produto>`.
   **Página inicial** (`/`): conta em `sitePorLoja/raiz` (não é loja; as regras aceitam o id `raiz` e só o
   admin lê). Além de `pv`/`visita`/`src__`/`dev__`: `abrir_pedir` (bolinha), `pedido_ifood` e
   `contato_whatsapp`/`contato_mapa` com `loja__<slug>` da loja escolhida (esses cliques também somam
   no painel daquela loja), `usar_localizacao`, `jogo_<id>` (tocou em Jogar) e `duelo_ifood` (pedido no
   iFood de dentro do Duelo, que também soma `pedido_ifood` na loja escolhida no jogo).
2. **`/painel`**: login Google → lê os contadores da loja direto do Firestore. As regras deixam o
   franqueado ler só a própria loja; o admin lê todas. No seletor do admin, "Página inicial do site" mostra a raiz.
3. **Aviso de cookies (LGPD)** e **Google Analytics** (`G-MCD6NPQGCK`) continuam como extra: o GA só
   carrega depois do aceite e serve para análises mais finas no próprio site do Google.

> Loja nova: o nome da pasta `src/lojas/<slug>` precisa ser igual ao id da loja no app.

## Configuração (uma vez só)
1. **Regras do Firestore**: publicar o `firestore.rules` do repositório do app
   (Firebase → Firestore → Regras → colar o arquivo → Publicar).
2. **Firebase → Authentication → Settings → Domínios autorizados**: `www.suacoxinhaloja.com.br` e `suacoxinhaloja.com.br`.
