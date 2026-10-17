// SUA COXINHA JUNDIAÍ PIRAPORA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jundiai-pirapora',
  unit: 'Jundiaí Pirapora',
  cidade: 'Jundiaí',
  address: {
    street: '',
    district: 'Vila Rami',
    city: 'Jundiaí – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.2055, -46.896],
  whatsapp: '5511945041001',
  ifood: 'https://www.ifood.com.br/delivery/jundiai-sp/sua-coxinha-pirapora-salgados-vila-rami/78a90b85-15ea-47cf-8160-839dadd190da',
  food99: '',
  // CONFIRMAR: este WhatsApp já apareceu ligado à unidade de Várzea Paulista.
})
