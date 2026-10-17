// SUA COXINHA CAMPINAS DOM PEDRO — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'campinas-dom-pedro',
  unit: 'Campinas Dom Pedro',
  cidade: 'Campinas',
  address: {
    street: '',
    district: 'Parque Imperador',
    city: 'Campinas – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-22.8475, -47.063],
  whatsapp: '5511999687349',
  ifood: 'https://www.ifood.com.br/delivery/campinas-sp/sua-coxinha---dom-pedro-campinas-parque-imperador/2e25dab5-fafe-4021-b0c7-790e30137b73',
  food99: '',
})
