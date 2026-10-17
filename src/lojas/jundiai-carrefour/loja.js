// SUA COXINHA JUNDIAÍ CARREFOUR — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jundiai-carrefour',
  unit: 'Jundiaí Carrefour',
  cidade: 'Jundiaí',
  address: {
    street: 'Av. Profa. Maria do Carmo Guimarães Pellegrini, 800 – Carrefour',
    district: 'Vila Viotto',
    city: 'Jundiaí – SP',
    cep: '',
  },
  whatsapp: '5511910044999',
  ifood: 'https://www.ifood.com.br/delivery/jundiai-sp/sua-coxinha-salgados---carrefour-vila-viotto/813471d3-7bef-4792-99ba-f26a259f1380',
  food99: '',
})
