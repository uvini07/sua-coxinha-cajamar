# Google Analytics e painel do franqueado

O site usa o **mesmo banco (Firebase `suacoxinhaapp`)** do app. Os clientes continuam sem login.
Só o painel `/painel` tem login: entra quem é **franqueado** no app (`equipe/{email}`, papel `franqueado`, ativo).

## Como funciona
1. Aviso de cookies (LGPD): nada do Google carrega antes do aceite. A escolha fica no cookie `sc_consentimento` (1 ano). O link "Cookies" no rodapé reabre o aviso. Política em `/cookies`.
2. Todo evento leva o parâmetro `loja` (= id da loja no app: `cajamar`, `jundiai`...).
   Eventos: `page_view`, `pedido_ifood`, `pedido_food99`, `abrir_whatsapp`, `pedido_whatsapp` (com valor), `contato_mapa`, `contato_whatsapp`, `contato_telefone`, `contato_instagram`.
3. `/painel` → login Google → função gratuita da Vercel `api/relatorio.js` confere o cadastro (lendo o Firestore com o login da própria pessoa) e lê o GA4 **só da loja dela**. O admin vê todas. Não precisa do plano Blaze.

> Loja nova: o nome da pasta `src/lojas/<slug>` precisa ser igual ao id da loja no app.

## Configuração (uma vez só)
1. **GA4**: fluxo Web do site já criado (`G-MCD6NPQGCK`, em `src/analytics/ga.js`).
2. **Dimensões personalizadas** (Administrador → Definições personalizadas), escopo *Evento*:
   - `loja` (parâmetro `loja`) — obrigatória
   - `item` (parâmetro `item`) — opcional, mostra "Produtos mais clicados"
3. **Conta de serviço que lê o GA** (gratuita): console.cloud.google.com, projeto suacoxinhaapp →
   IAM e administrador → Contas de serviço → Criar (nome `painel-site`, sem papéis) →
   abrir a conta → Chaves → Adicionar chave → JSON. Guarde o arquivo.
4. **Google Cloud**: APIs e serviços → ativar *Google Analytics Data API*.
5. **GA4** → Administrador → Gerenciamento de acesso à propriedade → adicionar o e-mail da conta
   do passo 3 (`painel-site@suacoxinhaapp.iam.gserviceaccount.com`) como **Leitor**.
6. **Vercel** (projeto sua-coxinha-cajamar) → Settings → Environment Variables:
   - `GA_PROPERTY_ID` = número da propriedade (Administrador → Detalhes da propriedade)
   - `GA_CREDENTIALS` = conteúdo inteiro do JSON do passo 3 (marque *Sensitive*)
   Depois: Deployments → último → ⋯ → Redeploy.
7. **Firebase → Authentication → Settings → Domínios autorizados**: `www.suacoxinhaloja.com.br` e `suacoxinhaloja.com.br`.

Os números aparecem algumas horas depois das primeiras visitas.
