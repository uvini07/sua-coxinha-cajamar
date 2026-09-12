// Borda serrilhada inspirada no cardápio. Gera um clip-path que sobe pela cena.
// progress 0 = cena escondida abaixo; 1 = cena cobrindo a tela inteira.
// Sempre o mesmo número de pontos, para o GSAP interpolar a string.
export function zigzag(progress, teeth, depth) {
  const base = 100 + depth - progress * (100 + depth * 2)
  const points = ['0% 100%', '100% 100%']
  for (let i = teeth; i >= 0; i--) {
    const x = (i / teeth) * 100
    const y = base + (i % 2 ? depth : 0)
    points.push(`${x.toFixed(3)}% ${y.toFixed(3)}%`)
  }
  return `polygon(${points.join(', ')})`
}
