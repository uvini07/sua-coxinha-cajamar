import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import gotaSvg from '../../assets/gota.svg?raw'
import '../../styles/paginas/mapa-lojas.css'

// MAPA DAS LOJAS — Leaflet + OpenStreetMap (gratuito, sem chave).
// Cada loja é a gota da coxinha. Lojas muito próximas (as 5 de Jundiaí, vistas
// de longe) viram um círculo com o número, que abre ao tocar.
// Este arquivo é carregado à parte: quem só usa a lista não baixa o Leaflet.

const gota = gotaSvg.trim().replace('<svg ', '<svg aria-hidden="true" focusable="false" ')

const icone = (ativa) =>
  L.divIcon({
    className: '',
    html: `<span class="pin-coxinha${ativa ? ' pin-coxinha--ativa' : ''}">${gota}</span>`,
    iconSize: ativa ? [46, 56] : [34, 42],
    iconAnchor: ativa ? [23, 54] : [17, 40],
  })

const iconeGrupo = (grupo) =>
  L.divIcon({
    className: '',
    html: `<span class="pin-grupo">${grupo.getChildCount()}</span>`,
    iconSize: [44, 44],
  })

const iconeVoce = L.divIcon({ className: '', html: '<span class="pin-voce" aria-hidden="true"></span>', iconSize: [20, 20] })

// Enquadra o que interessa, deixando espaço embaixo para o cartão da loja.
function enquadrar(mapa, pontos) {
  if (!pontos.length) return
  if (pontos.length === 1) {
    mapa.setView(pontos[0], 14, { animate: true })
    return
  }
  mapa.fitBounds(L.latLngBounds(pontos), { paddingTopLeft: [28, 28], paddingBottomRight: [28, 120], maxZoom: 14, animate: true })
}

export default function MapaLojas({ lojas, selecionada, posicao, foco, onSelecionar }) {
  const elemento = useRef(null)
  const mapa = useRef(null)
  const grupo = useRef(null)
  const marcadores = useRef(new Map())
  const voce = useRef(null)
  const aoSelecionar = useRef(onSelecionar)
  aoSelecionar.current = onSelecionar

  // Cria o mapa uma vez.
  useEffect(() => {
    const m = L.map(elemento.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false, // a rolagem da página não pode ficar presa no mapa
      tap: true,
    })
    L.control.zoom({ position: 'topright' }).addTo(m)
    // Mapa padrão do OpenStreetMap: gratuito e sem chave (o da CARTO passou a exigir chave).
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(m)
    m.setView([-23.3, -46.7], 7)
    m.on('click', () => aoSelecionar.current(null))
    grupo.current = L.markerClusterGroup({
      iconCreateFunction: iconeGrupo,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 36,
    }).addTo(m)
    mapa.current = m
    return () => {
      m.remove()
      mapa.current = null
    }
  }, [])

  // Marcadores das lojas visíveis (muda com o filtro de cidade).
  useEffect(() => {
    const g = grupo.current
    g.clearLayers()
    marcadores.current.clear()
    lojas.forEach((loja) => {
      const marcador = L.marker(loja.coords, { icon: icone(false), title: loja.nome, keyboard: true, riseOnHover: true })
      marcador.on('click', (e) => {
        L.DomEvent.stopPropagation(e)
        aoSelecionar.current(loja.slug)
      })
      marcadores.current.set(loja.slug, marcador)
      g.addLayer(marcador)
    })
  }, [lojas])

  // Enquadramento: o pedido vem de fora (filtro, localização, "ver no mapa").
  useEffect(() => {
    const m = mapa.current
    if (!m || !foco) return
    // O mapa pode ter acabado de aparecer (troca de aba no celular): recalcula o tamanho antes.
    m.invalidateSize()
    enquadrar(m, foco.pontos)
  }, [foco])

  // Loja selecionada: gota maior, por cima das outras, e o grupo se abre se preciso.
  useEffect(() => {
    marcadores.current.forEach((marcador, slug) => {
      const ativa = slug === selecionada
      marcador.setIcon(icone(ativa))
      marcador.setZIndexOffset(ativa ? 1000 : 0)
    })
    const marcador = marcadores.current.get(selecionada)
    if (marcador && mapa.current) {
      grupo.current.zoomToShowLayer(marcador, () => mapa.current.panTo(marcador.getLatLng(), { animate: true }))
    }
  }, [selecionada, lojas])

  // Onde a pessoa está (só depois que ela tocar em "Usar minha localização").
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    voce.current?.remove()
    voce.current = posicao ? L.marker(posicao, { icon: iconeVoce, interactive: false, keyboard: false }).addTo(m) : null
  }, [posicao])

  return <div ref={elemento} className="mapa-lojas" role="region" aria-label="Mapa com as lojas Sua Coxinha" />
}
