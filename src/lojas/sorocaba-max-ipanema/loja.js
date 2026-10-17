// SUA COXINHA SOROCABA MAX IPANEMA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'sorocaba-max-ipanema',
  unit: 'Sorocaba Max Ipanema',
  cidade: 'Sorocaba',
  address: {
    street: '',
    district: 'Jardim Planalto',
    city: 'Sorocaba – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — estimada: Max Atacadista, Av. Ipanema.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-23.4775, -47.4845],
  whatsapp: '5515991873396',
  ifood: 'https://www.ifood.com.br/delivery/sorocaba-sp/sua-coxinha-max-ipanema-jardim-planalto/ed207ce2-5328-4d96-8310-b7257597cea9',
  food99: '',
})
