// SUA COXINHA JUNDIAÍ LOJA DE FÁBRICA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jundiai-loja-de-fabrica',
  unit: 'Jundiaí Loja de Fábrica',
  cidade: 'Jundiaí',
  address: {
    street: 'Av. Samuel Martins, 2423',
    district: 'Jardim do Lago',
    city: 'Jundiaí – SP',
    cep: '13203-630',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.201, -46.864],
  whatsapp: '5511934909038',
  ifood: 'https://www.ifood.com.br/delivery/jundiai-sp/sua-coxinha-premium---salgados-para-festa-e-delivery-jardim-do-lago/5e2a8a87-26d5-498f-89ac-71f8b17de0bd',
  food99: '',
})
