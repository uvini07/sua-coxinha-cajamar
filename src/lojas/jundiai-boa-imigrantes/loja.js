// SUA COXINHA JUNDIAÍ BOA IMIGRANTES — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jundiai-boa-imigrantes',
  unit: 'Jundiaí Boa Imigrantes',
  cidade: 'Jundiaí',
  address: {
    street: 'Av. dos Imigrantes Italianos, 1973 – Boa Supermercados',
    district: 'Ponte de São João',
    city: 'Jundiaí – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — conferida: Boa Supermercados, Av. dos Imigrantes Italianos, 1973.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-23.18818, -46.8564],
  whatsapp: '5511934811973',
  ifood: 'https://www.ifood.com.br/delivery/jundiai-sp/sua-coxinha-premium-imigrantes---coxinhas-e-delivery-ponte-de-sao-joao/c80ab405-7627-4be7-9345-b06f49da3cac',
  food99: '',
})
