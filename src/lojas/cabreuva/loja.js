// SUA COXINHA CABREÚVA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'cabreuva',
  unit: 'Cabreúva',
  cidade: 'Cabreúva',
  address: {
    street: '',
    district: 'Portal da Concórdia',
    city: 'Cabreúva – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.307, -47.133],
  whatsapp: '5511941912202',
  ifood: 'https://www.ifood.com.br/delivery/cabreuva-sp/sua-coxinha-cabreuva---salgados-portal-da-concordia/bfa5974f-c828-438d-9aae-0d76311060fb',
  food99: '',
})
