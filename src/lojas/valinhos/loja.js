// SUA COXINHA VALINHOS — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'valinhos',
  unit: 'Valinhos',
  cidade: 'Valinhos',
  address: {
    street: '',
    district: 'Ortizes',
    city: 'Valinhos – SP',
    cep: '',
  },
  whatsapp: '5511995552323',
  ifood: 'https://www.ifood.com.br/delivery/valinhos-sp/sua-coxinha-valinhos---salgados-ortizes/34b73d79-88f3-4e0e-8aff-f97a8c8407c5',
  food99: '',
})
