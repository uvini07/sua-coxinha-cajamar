# Google Analytics e painel do franqueado

O site usa o **mesmo banco (Firebase `suacoxinhaapp`)** do app. Os clientes continuam sem login.
Só o painel `/painel` tem login: entra quem é **franqueado** no app (`equipe/{email}`, papel `franqueado`, ativo).

## Como funciona
1. Aviso de cookies (LGPD): nada do Google carrega antes do aceite. A escolha fica no cookie `sc_consentimento` (1 ano). O link "Cookies" no rodapé reabre o aviso. Política em `/cookies`.
2. Todo evento leva o parâmetro `loja` (= id da loja no app: `cajamar`, `jundiai`...).
   Eventos: `page_view`, `pedido_ifood`, `pedido_food99`, `abrir_whatsapp`, `pedido_whatsapp` (com valor), `contato_mapa`, `contato_whatsapp`, `contato_telefone`, `contato_instagram`.
3. `/painel` → login Google → função `relatorioSite` (repo do app, `functions/relatorioSite.js`) confere o cadastro e lê o GA4 **só da loja da pessoa**. O admin vê todas.

> Loja nova: o nome da pasta `src/lojas/<slug>` precisa ser igual ao id da loja no app.

## Configuração (uma vez só)
1. **GA4**: na propriedade do Firebase `suacoxinhaapp`, crie um *fluxo de dados Web* para `https://www.suacoxinhaloja.com.br`. Copie o ID `G-XXXX`.
2. **Dimensões personalizadas** (Administrador → Definições personalizadas), escopo *Evento*:
   - `loja` (parâmetro `loja`) — obrigatória
   - `item` (parâmetro `item`) — opcional, mostra "Produtos mais clicados"
3. **Vercel** (projeto do site) → Environment Variables: `VITE_GA_MEASUREMENT_ID=G-XXXX`. Faça um novo deploy.
4. **Acesso da função ao GA**: GA4 → Administrador → Gerenciamento de acesso à propriedade → adicione como **Leitor**:
   `132936922966-compute@developer.gserviceaccount.com` e `suacoxinhaapp@appspot.gserviceaccount.com`.
5. **Google Cloud** (projeto suacoxinhaapp): ative a *Google Analytics Data API*.
6. **GitHub do app** → Settings → Variables → Actions: `GA_PROPERTY_ID` = número da propriedade (Administrador → Detalhes da propriedade). Rode o workflow do Firebase.
7. **Firebase → Authentication → Settings → Domínios autorizados**: adicione `www.suacoxinhaloja.com.br` e `suacoxinhaloja.com.br`.

Os números aparecem algumas horas depois das primeiras visitas.
