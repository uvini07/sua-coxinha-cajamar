// SUA COXINHA CAMPINAS ENXUTO — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'campinas-enxuto',
  unit: 'Campinas Enxuto',
  cidade: 'Campinas',
  address: {
    street: '',
    district: 'Jardim Aurélia',
    city: 'Campinas – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — estimada: Enxuto, Jardim Aurélia.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-22.9015, -47.0835],
  whatsapp: '5519991367022',
  ifood: 'https://www.ifood.com.br/delivery/campinas-sp/sua-coxinha-enxuto---salgados-premium-jardim-aurelia/e4f50a78-4623-4ad8-aca3-a4f75bb539f8',
  food99: '',
})
