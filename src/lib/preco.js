// Formatação de preço (em centavos). Não depende de loja nenhuma.
export const formatPrice = (cents) => {
  const [reais, centavos] = (cents / 100).toFixed(2).split('.')
  return { reais, centavos }
}

export const priceText = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`
