// SUA COXINHA ITU — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'itu',
  unit: 'Itu',
  cidade: 'Itu',
  address: {
    street: 'R. Ana Eufrosina de Almeida Prado, 240 – Loja 8 – Pague Menos',
    district: 'Vila Cleto',
    city: 'Itu – SP',
    cep: '',
  },
  // Posição no mapa da página inicial (aproximada: centro do bairro). Para acertar:
  // Google Maps → botão direito no ponto da loja → copie os dois números.
  coords: [-23.27, -47.3],
  whatsapp: '5511914958941',
  ifood: 'https://www.ifood.com.br/delivery/itu-sp/sua-coxinha-itu-vila-cleto/337fbd92-3e7a-4e52-95c1-c6e40fd66dbd',
  food99: '',
})
