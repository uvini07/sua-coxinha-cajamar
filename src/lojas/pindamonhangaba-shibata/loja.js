// SUA COXINHA PINDAMONHANGABA SHIBATA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'pindamonhangaba-shibata',
  unit: 'Pindamonhangaba Shibata',
  cidade: 'Pindamonhangaba',
  address: {
    street: '',
    district: 'Parque São Benedito',
    city: 'Pindamonhangaba – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — estimada: Shibata, R. Dr. Frederico Machado, 67.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-22.924, -45.4605],
  whatsapp: '5512997704296',
  ifood: 'https://www.ifood.com.br/delivery/pindamonhangaba-sp/sua-coxinha-salgados-premium-pinda-parque-sao-benedito/7c16d19c-85dd-4d84-8bb9-89d1fad18326',
  food99: '',
})
