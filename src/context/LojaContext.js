import { createContext, useContext } from 'react'

// Dados da franquia aberta agora. Quem chama useLoja() sempre está dentro de uma loja.
export const LojaContext = createContext(null)

export function useLoja() {
  const loja = useContext(LojaContext)
  if (!loja) throw new Error('useLoja() precisa estar dentro de <LojaProvider>.')
  return loja
}
