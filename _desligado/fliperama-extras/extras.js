// Extras do Fliperama do Coxinildo: trilha sonora nas partidas e outdoors nos três jogos.
// O jogo em si vem compilado do projeto coxinhagame (public/fliperama); este módulo só observa a página:
// - .jogo[data-estado="jogando"] → toca a música do jogo (para no menu, na pausa e no fim);
// - o botão de som do próprio jogo (localStorage "sua-coxinha:jogo:som") também desliga a música;
// - os outdoors entram nos cenários (.cena, .cozinha, .arena), atrás de tudo o que se mexe.
// Ao atualizar public/fliperama com um build novo, mantenha as duas linhas de /fliperama-extras/ no index.html.

const IMG = (f) => new URL(`./img/${f}`, import.meta.url).href

// Placas → imagem pronta em public/fliperama-extras/img/ (null = desenhada aqui). Ver README, "Outdoors".
const IMAGENS = {
  'pega-1': null, // Pega Pega: outdoor atrás da cerca (27:10)
  'pega-2': null, // Pega Pega: segundo outdoor atrás da cerca (27:10)
  'ninja-esq': null, // Coxinha Ninja: quadro na parede, à esquerda do letreiro (4:3)
  'ninja-dir': null, // Coxinha Ninja: quadro na parede, à direita do letreiro (4:3)
  'ninja-balcao': null, // Coxinha Ninja: painel de LED no balcão (passa andando; cada placa 34:10)
  'pong-placas': null, // Coxinha Pong: placas na torcida (computador; 27:10)
  'pong-quadra': null, // Coxinha Pong: logo pintado na quadra (transparente, 3:1)
}

const FRASES = {
  coxinha: { foto: 'coxinha-g.webp', linhas: ['COXINHA É', 'SEMPRE UMA', 'BOA IDEIA'] },
  churros: { foto: 'churros-gourmet.webp', linhas: ['CHURROS', 'TAMBÉM É', 'BRIGA BOA'] },
  combo: { foto: 'combo-dupla-fome.webp', linhas: ['COMBO', 'PERFEITO PRA', 'TODA PARTIDA'] },
  caixa: { foto: 'caixa-gostosuras.webp', linhas: ['JOGOU,', 'MERECE UMA', 'COXINHA'] },
}

/* ======================= outdoors ======================= */

function anuncio(slot, tipo, opt = {}) {
  const file = IMAGENS[slot]
  if (file) return `<div class="fx-ad fx-ad--imagem"><img src="${IMG(file)}" alt=""></div>`
  switch (tipo) {
    case 'amarela': return `<div class="fx-ad fx-ad--amarela"><img src="${IMG('logo-preto.svg')}" alt="Sua Coxinha"></div>`
    case 'escura': return `<div class="fx-ad fx-ad--escura"><img src="${IMG('logo-branco.svg')}" alt="Sua Coxinha"></div>`
    case 'markfy': return `<div class="fx-ad fx-ad--markfy"><img src="${IMG('markfy.webp')}" alt="Markfy"><small>TECNOLOGIA QUE ENTREGA</small></div>`
    case 'cardapio': return `<div class="fx-ad fx-ad--cardapio"><img src="${IMG('coxinha-combo.webp')}" alt=""><span>COXINHA<br>CHURROS<br>COMBOS</span><img src="${IMG('churros-gourmet.webp')}" alt=""></div>`
    case 'frase': return `<div class="fx-ad fx-ad--frase"><img src="${IMG(opt.foto)}" alt=""><span>${opt.linhas.join('<br>')}</span></div>`
    default: return ''
  }
}

const el = (html) => {
  const t = document.createElement('template')
  t.innerHTML = html.trim()
  return t.content.firstElementChild
}

// outdoor de estrada (placa em dois postes, com refletores)
const outdoor = (cls, slot, tipo, opt) => `
  <div class="fx-outdoor ${cls}" aria-hidden="true">
    <div class="fx-outdoor__placa">${anuncio(slot, tipo, opt)}</div>
    <i class="fx-outdoor__luz"></i><i class="fx-outdoor__luz"></i>
    <i class="fx-outdoor__poste"></i><i class="fx-outdoor__poste"></i>
  </div>`

// faixa de LED que passa andando (a sequência vai duas vezes para emendar sem pulo)
function led(cls, slot, seq) {
  const um = seq.map(([tipo, opt]) => `<div class="fx-led__placa">${anuncio(slot, tipo, opt)}</div>`).join('')
  return `<div class="fx-led ${cls}" aria-hidden="true"><div class="fx-led__trilho">${um}${um}</div></div>`
}

// cada jogo: onde entram os outdoors (o container é decoração estática do jogo, o React não mexe nele)
const CENARIOS = [
  {
    jogo: 'pega', sel: '.cena',
    montar(cena) {
      // camada com parallax, atrás da cerca
      const camada = el(`<div class="camada fx-camada" style="--d:.2" aria-hidden="true">
        ${outdoor('fx-pega-a', 'pega-1', 'amarela')}
        ${outdoor('fx-pega-b', 'pega-2', 'markfy')}
      </div>`)
      const cerca = cena.querySelector('.cena__cerca')
      cena.insertBefore(camada, cerca || null)
    },
  },
  {
    jogo: 'ninja', sel: '.cozinha',
    montar(coz) {
      coz.append(
        el(`<div class="fx-quadro fx-quadro--esq" aria-hidden="true">${anuncio('ninja-esq', 'frase', FRASES.coxinha)}</div>`),
        el(`<div class="fx-quadro fx-quadro--dir" aria-hidden="true">${anuncio('ninja-dir', 'markfy')}</div>`),
        el(led('fx-led--balcao', 'ninja-balcao', [['escura'], ['cardapio'], ['markfy'], ['frase', FRASES.churros], ['amarela'], ['frase', FRASES.combo]])),
      )
    },
  },
  {
    jogo: 'pong', sel: '.arena',
    montar(arena) {
      arena.append(
        el(`<div class="fx-placas fx-placas--esq" aria-hidden="true">
          <div class="fx-placas__placa">${anuncio('pong-placas', 'escura')}</div>
          <div class="fx-placas__placa">${anuncio('pong-placas', 'cardapio')}</div>
          <div class="fx-placas__placa">${anuncio('pong-placas', 'markfy')}</div>
        </div>`),
        el(`<div class="fx-placas fx-placas--dir" aria-hidden="true">
          <div class="fx-placas__placa">${anuncio('pong-placas', 'markfy')}</div>
          <div class="fx-placas__placa">${anuncio('pong-placas', 'frase', FRASES.caixa)}</div>
          <div class="fx-placas__placa">${anuncio('pong-placas', 'escura')}</div>
        </div>`),
      )
      // logos pintados na quadra (a quadra é decoração; bolas e raquetes passam por cima)
      const quadra = document.querySelector('.jogo--pong .quadra')
      if (quadra && !quadra.querySelector('.fx-pintura')) {
        const markfy = IMAGENS['pong-quadra'] ? IMG(IMAGENS['pong-quadra']) : IMG('markfy.webp')
        quadra.append(
          el(`<span class="fx-pintura fx-pintura--cima" aria-hidden="true"><img src="${markfy}" alt=""></span>`),
          el(`<span class="fx-pintura fx-pintura--baixo" aria-hidden="true">COXINHA · CHURROS · COMBOS</span>`),
        )
      }
    },
  },
]

function tipoDoJogo(jogo) {
  if (!jogo) return null
  if (jogo.classList.contains('jogo--ninja')) return 'ninja'
  if (jogo.classList.contains('jogo--pong')) return 'pong'
  return 'pega'
}

function colocarOutdoors(jogo, tipo) {
  for (const c of CENARIOS) {
    if (c.jogo !== tipo) continue
    const alvo = jogo.querySelector(c.sel)
    if (alvo && !alvo.dataset.fxOutdoors) {
      alvo.dataset.fxOutdoors = '1'
      c.montar(alvo)
    }
  }
}

/* ======================= trilha sonora ======================= */
// Sequenciador de 16 passos por compasso, agendado um pouco à frente do relógio de áudio.
// Cada música: bpm, acordes (um por compasso), padrões de bateria e baixo e a melodia por compasso.

const NOTA = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11, Bb: 10, Eb: 3 }
function midi(n) {
  const m = /^([A-G][#b]?)(\d)$/.exec(n)
  return 12 * (Number(m[2]) + 1) + NOTA[m[1]]
}
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)

// melodia: "passo:nota:duração" separados por espaço (passo 0-15, duração em passos)
const mel = (s) => s.trim().split(/\s+/).map((t) => { const [p, n, d] = t.split(':'); return [Number(p), midi(n), Number(d || 2)] })

const TRILHAS = {
  // Pega Pega: baião alegre de sanfona, zabumba e triângulo
  pega: {
    bpm: 128,
    acordes: ['C3', 'F3', 'G3', 'C3', 'A2', 'F3', 'G3', 'C3'],
    menor: [4],
    baixo: [[0, 0, 3], [3, 0, 3], [8, 7, 2], [11, 0, 2], [14, 7, 2]],
    bateria: { bumbo: [0, 3, 8, 11], caixa: [4, 12], triangulo: [0, 2, 4, 6, 8, 10, 12, 14], aberto: [2, 6, 10, 14] },
    lead: 'sanfona',
    melodia: [
      mel('0:E5 2:G5 4:C6 6:G5 8:E5:3 12:G5:3'),
      mel('0:F5 2:A5 4:C6 6:A5 8:F5:3 12:A5:3'),
      mel('0:G5 2:B5 4:D6 6:B5 8:G5:3 12:D5:3'),
      mel('0:E5:3 4:C5:3 8:G4:3 12:C5:3'),
      mel('0:A5 2:C6 4:E6 6:C6 8:A5:3 12:E5:3'),
      mel('0:F5 2:A5 4:C6 6:A5 8:C6:3 12:A5:3'),
      mel('0:G5:2 4:B5:2 8:D6:2 12:B5 14:G5'),
      mel('0:C6:6 8:G5:3 12:E5:3'),
    ],
  },
  // Coxinha Ninja: correria na cozinha, arpejos rápidos e bateria seca
  ninja: {
    bpm: 150,
    acordes: ['A2', 'F2', 'G2', 'E2', 'A2', 'F2', 'D3', 'E2'],
    menor: [0, 4, 6],
    baixo: [[0, 0, 1], [2, 0, 1], [4, 12, 1], [6, 0, 1], [8, 0, 1], [10, 0, 1], [12, 12, 1], [14, 7, 1]],
    bateria: { bumbo: [0, 6, 8, 10], caixa: [4, 12], chimbal: [0, 2, 4, 6, 8, 10, 12, 14], aberto: [7, 15] },
    lead: 'quadrada',
    arpejo: [0, 2, 1, 3, 2, 1, 0, 1, 0, 2, 1, 3, 2, 3, 1, 2],
    melodia: [
      null, null, null, null,
      mel('0:A5:2 2:C6:2 4:E6:3 8:D6:2 10:C6:2 12:B5:4'),
      mel('0:A5:2 2:C6:2 4:F6:3 8:E6:2 10:C6:2 12:A5:4'),
      mel('0:D6:2 2:F6:2 4:A6:3 8:F6:2 10:D6:2 12:F6:4'),
      mel('0:E6:3 4:D6:2 6:C6:2 8:B5:6 14:G#5:2'),
    ],
  },
  // Coxinha Pong: clima de arena, samba com surdo, tamborim e metais
  pong: {
    bpm: 116,
    acordes: ['F2', 'D2', 'A#2', 'C3', 'F2', 'D2', 'G2', 'C3'],
    menor: [1, 5, 6],
    baixo: [[0, 0, 2], [3, 0, 1], [4, 7, 2], [8, 0, 2], [11, 0, 1], [12, 7, 2], [14, 12, 1]],
    bateria: { surdo: [4, 12], surdoMudo: [0, 8], tamborim: [0, 3, 6, 8, 10, 13, 14], ganza: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    lead: 'metal',
    acordesNoLead: [0, 3, 6, 10],
    melodia: [
      mel('0:A5:2 3:C6:2 6:A5:2 8:F5:4 13:G5:2'),
      mel('0:A5:2 3:F5:2 6:D5:2 8:A5:4 13:A5:2'),
      mel('0:D6:2 3:A#5:2 6:F5:2 8:D6:4 13:C6:2'),
      mel('0:C6:3 4:A#5:2 6:A5:2 8:G5:6'),
      mel('0:F5:2 2:A5:2 4:C6:2 6:F6:4 12:E6:2 14:D6:2'),
      mel('0:D6:2 2:C6:2 4:A5:2 6:F5:4 12:A5:3'),
      mel('0:G5:2 2:A#5:2 4:D6:2 6:G6:4 12:F6:2 14:E6:2'),
      mel('0:E6:3 4:D6:2 6:C6:2 8:C6:6'),
    ],
  },
}

let ctx = null
let saida = null
let ruido = null

function audio() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -18; comp.ratio.value = 3
  saida = ctx.createGain()
  saida.gain.value = 0
  saida.connect(comp).connect(ctx.destination)
  const len = ctx.sampleRate
  ruido = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = ruido.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return ctx
}

// o som só nasce dentro de um toque/tecla (iOS): todo gesto acorda o áudio
function acordar() {
  const c = audio()
  if (c && c.state === 'suspended') c.resume()
}
for (const ev of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(ev, acordar, true)

function env(g, t, pico, ataque, dur, solta = 0.05) {
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(pico, t + ataque)
  g.gain.setValueAtTime(pico, t + Math.max(ataque, dur - solta))
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + solta)
}

function osc(t, f, dur, { tipo = 'square', vol = 0.1, ataque = 0.01, corte = 0, vib = 0, para = 0 } = {}) {
  const o = ctx.createOscillator()
  o.type = tipo
  o.frequency.setValueAtTime(f, t)
  if (para) o.frequency.exponentialRampToValueAtTime(para, t + dur)
  let no = o
  if (corte) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = corte; fl.Q.value = 0.8; o.connect(fl); no = fl }
  if (vib) {
    const l = ctx.createOscillator(); const lg = ctx.createGain()
    l.frequency.value = 5.5; lg.gain.value = vib
    l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.1)
  }
  const g = ctx.createGain()
  env(g, t, vol, ataque, dur)
  no.connect(g).connect(saida)
  o.start(t); o.stop(t + dur + 0.1)
}

function chiado(t, dur, { tipo = 'highpass', f = 7000, vol = 0.05, q = 1 } = {}) {
  const s = ctx.createBufferSource(); s.buffer = ruido
  const fl = ctx.createBiquadFilter(); fl.type = tipo; fl.frequency.value = f; fl.Q.value = q
  const g = ctx.createGain()
  env(g, t, vol, 0.002, dur, 0.02)
  s.connect(fl).connect(g).connect(saida)
  s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05)
}

const PERC = {
  bumbo: (t) => osc(t, 140, 0.16, { tipo: 'sine', vol: 0.5, ataque: 0.002, para: 45 }),
  caixa: (t) => { chiado(t, 0.12, { tipo: 'bandpass', f: 1900, vol: 0.18, q: 0.7 }); osc(t, 210, 0.08, { tipo: 'triangle', vol: 0.12, ataque: 0.002, para: 150 }) },
  chimbal: (t) => chiado(t, 0.03, { f: 8000, vol: 0.05 }),
  aberto: (t) => chiado(t, 0.16, { f: 7000, vol: 0.05 }),
  triangulo: (t) => { osc(t, 4200, 0.12, { tipo: 'sine', vol: 0.025, ataque: 0.002 }); osc(t, 6100, 0.1, { tipo: 'sine', vol: 0.015, ataque: 0.002 }) },
  surdo: (t) => osc(t, 95, 0.32, { tipo: 'sine', vol: 0.45, ataque: 0.003, para: 55 }),
  surdoMudo: (t) => osc(t, 90, 0.08, { tipo: 'sine', vol: 0.22, ataque: 0.003, para: 60 }),
  tamborim: (t) => { chiado(t, 0.05, { tipo: 'bandpass', f: 3800, vol: 0.12, q: 2 }); osc(t, 920, 0.04, { tipo: 'triangle', vol: 0.05, ataque: 0.001 }) },
  ganza: (t) => chiado(t, 0.04, { f: 6000, vol: 0.022 }),
}

const LEAD = {
  sanfona: (t, f, dur) => { osc(t, f, dur, { tipo: 'square', vol: 0.05, corte: 2600, vib: 4 }); osc(t, f * 1.004, dur, { tipo: 'sawtooth', vol: 0.025, corte: 2200 }) },
  quadrada: (t, f, dur) => osc(t, f, dur * 0.8, { tipo: 'square', vol: 0.045, corte: 3800 }),
  metal: (t, f, dur) => { osc(t, f, dur, { tipo: 'sawtooth', vol: 0.05, corte: 2400, ataque: 0.02 }); osc(t, f * 2, dur, { tipo: 'sawtooth', vol: 0.012, corte: 3000, ataque: 0.02 }) },
}

// notas do acorde (tríade) a partir da fundamental
function triade(T, bar, raiz) {
  const terça = T.menor?.includes(bar % T.acordes.length) ? 3 : 4
  return [raiz, raiz + terça, raiz + 7, raiz + 12]
}

class Musica {
  constructor(nome) {
    this.T = TRILHAS[nome]
    this.nome = nome
    this.passo = 0
    this.prox = ctx.currentTime + 0.08
    this.sd = 60 / this.T.bpm / 4
    this.timer = setInterval(() => this.agendar(), 25)
    saida.gain.cancelScheduledValues(ctx.currentTime)
    saida.gain.setValueAtTime(saida.gain.value, ctx.currentTime)
    saida.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.6)
  }

  agendar() {
    const T = this.T
    if (this.prox < ctx.currentTime - 0.2) this.prox = ctx.currentTime + 0.05 // aba voltou do segundo plano
    while (this.prox < ctx.currentTime + 0.15) {
      const total = T.acordes.length * 16
      const s = this.passo % 16, bar = Math.floor(this.passo / 16) % T.acordes.length
      const t = this.prox
      const raiz = midi(T.acordes[bar])
      // bateria
      for (const [peca, passos] of Object.entries(T.bateria)) if (passos.includes(s)) PERC[peca](t)
      // baixo
      for (const [p, iv, d] of T.baixo) if (p === s) osc(t, hz(raiz + iv), this.sd * d, { tipo: this.nome === 'pong' ? 'sine' : 'triangle', vol: 0.16, corte: 900 })
      // melodia (ou arpejo do acorde quando o compasso não tem melodia)
      const m = T.melodia[bar]
      if (m) for (const [p, n, d] of m) { if (p === s) LEAD[T.lead](t, hz(n), this.sd * d) }
      else if (T.arpejo) { const tri = triade(T, bar, raiz + 24); LEAD[T.lead](t, hz(tri[T.arpejo[s]]), this.sd) }
      // acordes curtos dos metais (samba)
      if (T.acordesNoLead?.includes(s)) for (const n of triade(T, bar, raiz + 12).slice(0, 3)) osc(t, hz(n), this.sd * 0.9, { tipo: 'sawtooth', vol: 0.014, corte: 1800 })
      this.passo = (this.passo + 1) % total
      this.prox += this.sd
    }
  }

  parar() {
    clearInterval(this.timer)
    const t = ctx.currentTime
    saida.gain.cancelScheduledValues(t)
    saida.gain.setValueAtTime(saida.gain.value, t)
    saida.gain.linearRampToValueAtTime(0, t + 0.3)
  }
}

let tocando = null
const somLigado = () => { try { return localStorage.getItem('sua-coxinha:jogo:som') !== 'off' } catch { return true } }

function trilha(nome) {
  if (tocando?.nome === nome) return
  tocando?.parar()
  tocando = null
  if (!nome || !audio() || ctx.state !== 'running') return
  tocando = new Musica(nome)
}

/* ======================= observa a página ======================= */

function atualizar() {
  const jogo = document.querySelector('.jogo')
  const tipo = tipoDoJogo(jogo)
  if (jogo) colocarOutdoors(jogo, tipo)
  const jogando = jogo?.dataset.estado === 'jogando' && !document.hidden && somLigado()
  trilha(jogando ? tipo : null)
}

// as mudanças chegam a cada quadro durante a partida: confere no máximo uma vez por quadro
let marcado = false
const logo = () => { if (!marcado) { marcado = true; requestAnimationFrame(() => { marcado = false; atualizar() }) } }
new MutationObserver(logo).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-estado', 'aria-pressed'] })
document.addEventListener('visibilitychange', atualizar)
// o botão de som do jogo grava no localStorage depois do clique; e o áudio só destrava num gesto
setInterval(atualizar, 400)
atualizar()
// para testes: /fliperama/?debug expõe qual trilha está tocando
if (location.search.includes('debug')) window.__trilha = () => (tocando ? `${tocando.nome}:${ctx.state}` : null)
