// SUA COXINHA SOROCABA JOÃO RIBEIRO DE BARROS — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'sorocaba-joao-ribeiro-de-barros',
  unit: 'Sorocaba João Ribeiro de Barros',
  cidade: 'Sorocaba',
  address: {
    street: '',
    district: 'Vila Odim Antão',
    city: 'Sorocaba – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.505, -47.472],
  whatsapp: '5515997921122',
  ifood: 'https://www.ifood.com.br/delivery/sorocaba-sp/sua-coxinha-sorocaba---salgados-vila-odim-antao/788e0582-2857-4c18-968c-30e978409a60',
  food99: '',
})
