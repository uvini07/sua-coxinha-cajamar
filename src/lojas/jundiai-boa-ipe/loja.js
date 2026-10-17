// SUA COXINHA JUNDIAÍ BOA IPÊ — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jundiai-boa-ipe',
  unit: 'Jundiaí Boa Ipê',
  cidade: 'Jundiaí',
  address: {
    street: 'Av. Osmundo dos Santos Pellegrini, 1000 – Boa Supermercados',
    district: 'Recanto Quarto Centenário',
    city: 'Jundiaí – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — conferida: Boa Supermercados, Av. Osmundo dos Santos Pellegrini, 1000.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-23.18383, -46.91541],
  whatsapp: '5511955544870',
  ifood: 'https://www.ifood.com.br/delivery/jundiai-sp/sua-coxinha-ipe-recanto-quarto-centenario/43341d2a-150b-42e2-8043-327e9c9a52c5',
  food99: '',
})
