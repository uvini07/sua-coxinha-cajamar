// SUA COXINHA UBATUBA SHIBATA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'ubatuba-shibata',
  unit: 'Ubatuba Shibata',
  cidade: 'Ubatuba',
  address: {
    street: '',
    district: 'Mato Dentro',
    city: 'Ubatuba – SP',
    cep: '',
  },
  whatsapp: '5512992096637',
  ifood: 'https://www.ifood.com.br/delivery/ubatuba-sp/sua-coxinha-ubatuba-salgados-premium-mato-dentro/69273ef8-2b69-45a5-9f8f-78d10425c86d',
  food99: '',
})
