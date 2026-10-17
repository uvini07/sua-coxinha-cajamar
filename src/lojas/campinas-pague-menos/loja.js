// SUA COXINHA CAMPINAS PAGUE MENOS — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'campinas-pague-menos',
  unit: 'Campinas Pague Menos',
  cidade: 'Campinas',
  address: {
    street: '',
    district: 'Jardim Chapadão',
    city: 'Campinas – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — estimada: Pague Menos, Av. Andrade Neves, 2538.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-22.889, -47.074],
  whatsapp: '5519996962706',
  ifood: 'https://www.ifood.com.br/delivery/campinas-sp/sua-coxinha-campinas-jardim-chapadao/174651cb-257c-46ae-9f8a-776d2c8e8b66',
  food99: '',
})
