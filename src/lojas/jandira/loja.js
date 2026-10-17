// SUA COXINHA JANDIRA — dados da planilha de unidades (16/10/2026).
// Cardápio, horários e textos vêm de Cajamar (ver ../_unidade.js). CONFIRMAR o
// horário desta loja e preencher food99 quando tiver o link do 99Food.
import { criarUnidade } from '../_unidade.js'

export default criarUnidade({
  slug: 'jandira',
  unit: 'Jandira',
  cidade: 'Jandira',
  address: {
    street: '',
    district: 'Centro',
    city: 'Jandira – SP',
    cep: '',
  },
  // Posição no mapa da página inicial — APROXIMADA: só o centro do bairro, endereço desconhecido.
  // Para acertar: Google Maps → aperte no ponto da loja → copie os dois números.
  coords: [-23.5278, -46.9023],
  whatsapp: '5511988720153',
  ifood: 'https://www.ifood.com.br/delivery/jandira-sp/sua-coxinha-jandira---salgados-centro/95e860bf-6dda-484f-8e32-96dab50526a3',
  food99: '',
})
