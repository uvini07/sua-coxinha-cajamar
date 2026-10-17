import { useEffect, useState } from 'react'

// Placar do Brasil do Duelo: vitórias de BolsoTudo e Lalulu somadas de todo
// mundo, no Firestore do app (jogos/duelo). Quem grava é o próprio jogo
// (repo jogo, src/placar.js); aqui só lê, uma vez por página.
const URL =
  'https://firestore.googleapis.com/v1/projects/suacoxinhaapp/databases/(default)/documents/jogos/duelo?key=AIzaSyA1Be025Mhp9mcPOgCaJDml_dtIUP4hgwk'

let promessa = null
const buscar = () =>
  (promessa ??= fetch(URL)
    .then(async (r) => {
      if (r.status === 404) return { bolso: 0, lula: 0 } // ninguém venceu ainda
      if (!r.ok) return null
      const f = (await r.json()).fields ?? {}
      return { bolso: Number(f.bolso?.integerValue ?? 0), lula: Number(f.lula?.integerValue ?? 0) }
    })
    .catch(() => null))

export function usePlacarDuelo(ativo = true) {
  const [placar, setPlacar] = useState(null)
  useEffect(() => {
    if (!ativo) return
    let vivo = true
    buscar().then((p) => vivo && setPlacar(p))
    return () => {
      vivo = false
    }
  }, [ativo])
  return placar
}
