// SUA COXINHA SÃO PAULO ASSAÍ PENHA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'sao-paulo-assai-penha',
  unit: 'São Paulo Assaí Penha',
  cidade: 'São Paulo',
  address: {
    street: '',
    district: 'Jardim América da Penha',
    city: 'São Paulo – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — estimada: Assaí, Av. Condessa Elizabeth de Robiano, 5500.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-23.5175, -46.533],
  whatsapp: '5511958117896',
  ifood: 'https://www.ifood.com.br/delivery/sao-paulo-sp/sua-coxinha-delivery---assai-penha-jardim-america-da-penha/a0bdb0a1-926c-43d1-9313-d12839e80eb2',
  food99: '',
})
