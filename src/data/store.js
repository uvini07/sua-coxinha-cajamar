// Dados da loja. Fontes: perfil da loja no Google e cardápio oficial (AF_COX_25_001).
// Itens marcados com CONFIRMAR precisam ser validados pela loja antes de publicar.

export const store = {
  brand: 'Sua Coxinha',
  unit: 'Cajamar',
  logo: '/assets/marca/logo-sua-coxinha.svg',

  address: {
    street: 'Av. Ten. Marques, 4511 – Sala 3',
    district: 'Portal dos Ipês',
    city: 'Cajamar – SP',
  },

  // CONFIRMAR: horários vieram da bio do Instagram da loja.
  hours: [
    { days: 'Segunda a sábado', time: '7h às 22h' },
    { days: 'Domingo', time: '14h às 22h' },
  ],

  // CONFIRMAR: telefone listado no Google. Se for WhatsApp, preencha `whatsapp`.
  phone: '(11) 97640-3209',
  whatsapp: null, // ex.: '5511976403209' → gera link wa.me

  links: {
    order:
      'https://www.ifood.com.br/delivery/cajamar-sp/sua-coxinha-cajamar-vila-poupanca/5ce23c05-ea29-4fb3-99d3-2ac2b289fb57',
    maps: 'https://www.google.com/maps/place/sua+coxinha+cajamar/data=!4m2!3m1!1s0x94cf1db9a8e4c5b3:0x6633947b0099e086',
    instagram: 'https://www.instagram.com/suacoxinhacajamar/',
    franchise: 'https://franquia.suacoxinha.com.br',
  },

  disclaimer: 'Imagens meramente ilustrativas. Coxinhas contêm glúten e lactose.',
}

export const orderLabel = 'Fazer meu pedido'
