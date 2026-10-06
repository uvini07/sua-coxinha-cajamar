// Endereço público do site. É o único lugar para trocar quando o domínio mudar
// O www é o endereço principal: na Vercel, suacoxinhaloja.com.br redireciona para ele.
// Usado nas metas de compartilhamento (WhatsApp, Instagram, Facebook) e no canonical.
// Lembrete: o redirecionamento do endereço antigo fica em vercel.json.
export const SITE_URL = 'https://www.suacoxinhaloja.com.br'

// Arte padrão que aparece na prévia do link (WhatsApp, Instagram, Facebook).
// O ?v= existe porque essas redes guardam a imagem por muito tempo: ao trocar o
// arquivo em public/, suba o número aqui para elas buscarem a nova.
export const IMAGEM_COMPARTILHAR = '/compartilhar.jpg?v=4'
