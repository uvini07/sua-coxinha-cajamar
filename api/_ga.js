// CONSULTAS AO GOOGLE ANALYTICS 4 (Data API) — usadas por api/relatorio.js.
// Arquivo com "_" na frente: a Vercel não o publica como rota.

// Eventos que o site envia (src/analytics/ga.js no repositório do site).
const ACOES = [
  'pedido_ifood',
  'pedido_food99',
  'abrir_whatsapp',
  'pedido_whatsapp',
  'contato_mapa',
  'contato_whatsapp',
  'contato_telefone',
  'contato_instagram',
]
const PEDIDOS = ['pedido_ifood', 'pedido_food99', 'pedido_whatsapp']

const numero = (v) => Number(v ?? 0) || 0

// "todas" = as lojas cadastradas no app (deixa de fora a página de escolha, "rede").
const filtroLoja = (loja, todas) =>
  loja === 'todas'
    ? { filter: { fieldName: 'customEvent:loja', inListFilter: { values: todas } } }
    : { filter: { fieldName: 'customEvent:loja', stringFilter: { matchType: 'EXACT', value: loja } } }

const e = (...exprs) => (exprs.length === 1 ? exprs[0] : { andGroup: { expressions: exprs } })

const filtroEventos = (nomes) => ({
  filter: { fieldName: 'eventName', inListFilter: { values: nomes } },
})

const linhas = (resp) =>
  (resp?.rows || []).map((r) => ({
    d: (r.dimensionValues || []).map((v) => v.value),
    m: (r.metricValues || []).map((v) => numero(v.value)),
  }))

export async function consultar(cliente, propriedade, loja, todas, dias) {
  const property = `properties/${propriedade}`
  const atual = { startDate: `${dias}daysAgo`, endDate: 'today', name: 'atual' }
  const anterior = { startDate: `${dias * 2}daysAgo`, endDate: `${dias + 1}daysAgo`, name: 'anterior' }
  const doSite = filtroLoja(loja, todas)

  const [[lote]] = await Promise.all([
    cliente.batchRunReports({
      property,
      requests: [
        // 0. Resumo, período atual x anterior
        {
          dateRanges: [atual, anterior],
          metrics: [
            { name: 'activeUsers' },
            { name: 'newUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'engagementRate' },
            { name: 'averageSessionDuration' },
          ],
          dimensionFilter: doSite,
        },
        // 1. Ações (cliques nos botões de pedido e contato), atual x anterior
        {
          dateRanges: [atual, anterior],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }, { name: 'eventValue' }],
          dimensionFilter: e(doSite, filtroEventos(ACOES)),
        },
        // 2. Dia a dia
        {
          dateRanges: [atual],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
          dimensionFilter: doSite,
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
        // 3. De onde vêm (Google, Instagram, direto...)
        {
          dateRanges: [atual],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'activeUsers' }],
          dimensionFilter: doSite,
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
          limit: 6,
        },
        // 4. Aparelho
        {
          dateRanges: [atual],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
          dimensionFilter: doSite,
          orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        },
      ],
    }),
  ])

  const [rResumo, rAcoes, rDia, rOrigem, rAparelho] = lote.reports
  const [rCidade, rPedidosDia, rItens] = await Promise.all([
    cliente
      .runReport({
        property,
        dateRanges: [atual],
        dimensions: [{ name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
        dimensionFilter: doSite,
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 6,
      })
      .then((r) => r[0]),
    cliente
      .runReport({
        property,
        dateRanges: [atual],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: e(doSite, filtroEventos(PEDIDOS)),
      })
      .then((r) => r[0]),
    // Produtos mais clicados. Só funciona com a dimensão "item" cadastrada no GA4;
    // sem ela, o painel apenas esconde este quadro.
    cliente
      .runReport({
        property,
        dateRanges: [atual],
        dimensions: [{ name: 'customEvent:item' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: e(doSite, filtroEventos(['pedido_ifood', 'pedido_food99', 'abrir_whatsapp'])),
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 8,
      })
      .then((r) => r[0])
      .catch(() => null),
  ])

  // Com dois períodos o GA4 acrescenta a dimensão dateRange no fim de cada linha.
  const porPeriodo = (resp) => {
    const out = { atual: [], anterior: [] }
    linhas(resp).forEach((l) => out[l.d[l.d.length - 1]]?.push(l))
    return out
  }

  const resumo = porPeriodo(rResumo)
  const montarResumo = (l) => {
    const m = l?.m || []
    return {
      visitantes: m[0] || 0,
      novos: m[1] || 0,
      sessoes: m[2] || 0,
      visualizacoes: m[3] || 0,
      engajamento: m[4] || 0,
      duracaoMedia: m[5] || 0,
    }
  }

  const acoes = porPeriodo(rAcoes)
  const montarAcoes = (ls) => {
    const out = Object.fromEntries(ACOES.map((a) => [a, 0]))
    let valorWhatsapp = 0
    ls.forEach((l) => {
      out[l.d[0]] = l.m[0]
      if (l.d[0] === 'pedido_whatsapp') valorWhatsapp = l.m[1]
    })
    return { ...out, valorWhatsapp }
  }

  const pedidosPorDia = Object.fromEntries(linhas(rPedidosDia).map((l) => [l.d[0], l.m[0]]))
  const formatarData = (yyyymmdd) => `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
  const lista = (resp) => linhas(resp).map((l) => ({ nome: l.d[0], valor: l.m[0] }))

  return {
    resumo: { atual: montarResumo(resumo.atual[0]), anterior: montarResumo(resumo.anterior[0]) },
    acoes: { atual: montarAcoes(acoes.atual), anterior: montarAcoes(acoes.anterior) },
    diario: linhas(rDia).map((l) => ({
      data: formatarData(l.d[0]),
      visitantes: l.m[0],
      visualizacoes: l.m[1],
      pedidos: pedidosPorDia[l.d[0]] || 0,
    })),
    origens: lista(rOrigem),
    aparelhos: lista(rAparelho),
    cidades: lista(rCidade).filter((c) => c.nome !== '(not set)'),
    itens: rItens ? lista(rItens).filter((i) => i.nome && i.nome !== '(not set)') : null,
  }
}
