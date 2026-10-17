// Distância em linha reta (km) entre dois pontos [lat, lng].
export function distanciaKm([lat1, lng1], [lat2, lng2]) {
  const rad = (g) => (g * Math.PI) / 180
  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

// As posições das lojas são aproximadas, então a distância é arredondada.
export function formatarDistancia(km) {
  if (km < 1) return `${Math.max(100, Math.round((km * 1000) / 100) * 100)} m`
  if (km < 10) return `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
  return `${Math.round(km)} km`
}
