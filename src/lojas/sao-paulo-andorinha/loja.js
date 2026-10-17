// SUA COXINHA SÃO PAULO ANDORINHA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'sao-paulo-andorinha',
  unit: 'São Paulo Andorinha',
  cidade: 'São Paulo',
  address: {
    street: '',
    district: 'Lauzane Paulista',
    city: 'São Paulo – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.472, -46.645],
  whatsapp: '5511925172047',
  ifood: 'https://www.ifood.com.br/delivery/sao-paulo-sp/sua-coxinha---salgados-premium-delivery-lauzane-paulista/7aa61a46-0732-4054-ad50-35f3bc4d9346',
  food99: '',
})
