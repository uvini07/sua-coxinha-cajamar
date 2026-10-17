// SUA COXINHA INDAIATUBA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'indaiatuba',
  unit: 'Indaiatuba',
  cidade: 'Indaiatuba',
  address: {
    street: '',
    district: 'João Pioli',
    city: 'Indaiatuba – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.07, -47.21],
  whatsapp: '5519981063932',
  ifood: 'https://www.ifood.com.br/delivery/indaiatuba-sp/sua-coxinha---salgados-premium-delivery-joao-pioli/e30efaf2-59de-46e0-a415-0482d1fe99a1',
  food99: '',
})
