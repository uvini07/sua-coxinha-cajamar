// SUA COXINHA JACAREÍ — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jacarei',
  unit: 'Jacareí',
  cidade: 'Jacareí',
  address: {
    street: '',
    district: 'São João',
    city: 'Jacareí – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.305, -45.966],
  whatsapp: '5512936182614',
  ifood: 'https://www.ifood.com.br/delivery/jacarei-sp/sua-coxinha---salgados-fritos-delivery-premium-sao-joao/18efb101-fdd4-4124-b660-45089e491f13',
  food99: '',
})
