// SUA COXINHA SANTOS — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'santos',
  unit: 'Santos',
  cidade: 'Santos',
  address: {
    street: 'Av. Rei Alberto I, 316',
    district: 'Ponta da Praia',
    city: 'Santos – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.986, -46.3],
  whatsapp: '5513997890161',
  ifood: 'https://www.ifood.com.br/delivery/santos-sp/sua-coxinha-santos---salgados-premium-delivery-ponta-da-praia/254899ad-4e48-465d-84dc-cf3d7abf9423',
  food99: '',
  // Horário publicado na inauguração (santaportal.com.br): segunda a sábado, 9h às 21h.
  hours: [
    { days: 'Segunda a sábado', time: '9h às 21h' },
    { days: 'Domingo', time: 'fechado' },
  ],
  openingHours: { 1: [9, 21], 2: [9, 21], 3: [9, 21], 4: [9, 21], 5: [9, 21], 6: [9, 21] },
})
