"""Prepara as fontes da marca para a web: public/assets/fontes/*.woff2.

Satoshi (texto) já vem pronta do pacote original e só é copiada.

Brown Beige (títulos) precisa de conserto: o arquivo entregue no guia de marca
não tem NENHUMA letra acentuada — nem á, nem ç, nem ã. Num site em português
isso apareceria como letra faltando no meio da palavra ("CARD PIO") ou, pior,
com o navegador trocando a fonte só naquela letra. Então aqui os acentos são
desenhados a partir do traço que já existe na própria fonte: a aspa (quoteright)
é uma cunha arredondada com a mesma mão do resto do desenho, e serve de peça
para o agudo, o grave, o circunflexo e a cedilha. Til e trema são desenhados.

Uso:
    python scripts/fonte-marca.py [caminho-do-guia-de-marca]

O guia de marca não fica no repositório (a licença da Brown Beige é do cliente,
veja guia_de_marca/More Info.txt). Só os .woff2 gerados são versionados.
"""

import math
import shutil
import sys
from pathlib import Path

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
GUIA = Path(sys.argv[1]) if len(sys.argv) > 1 else RAIZ / 'guia_de_marca'
DESTINO = RAIZ / 'public' / 'assets' / 'fontes'

BROWN_BEIGE = GUIA / 'Brown Beige.ttf'
SATOSHI = GUIA / 'Satoshi_Complete' / 'Satoshi_Complete' / 'Fonts' / 'WEB' / 'fonts' / 'Satoshi-Variable.woff2'

# Centro e ponta larga da aspa, que é a peça usada para montar os acentos.
PECA_CENTRO = (106.5, 593.5)
PECA_PONTA = (106.5, 716.0)

# Erro máximo, em unidades da fonte (ela tem 1000 por em), ao trocar as curvas
# cúbicas desenhadas aqui pelas quadráticas que o TrueType guarda.
ERRO_CURVA = 0.5

# Altura em que os acentos ficam. As maiúsculas terminam em 720 (743 nas
# redondas) e a fonte sobe até 978, então esta é a faixa livre lá em cima.
ALTURA_ACENTO = 845

# Letra base, acento, código da maiúscula, código da minúscula.
# A fonte é caixa-alta: as minúsculas repetem o desenho das maiúsculas, mas são
# glifos separados e precisam da versão acentuada também.
COMBINACOES = [
    ('A', 'agudo', 0x00C1, 0x00E1),
    ('A', 'grave', 0x00C0, 0x00E0),
    ('A', 'circunflexo', 0x00C2, 0x00E2),
    ('A', 'til', 0x00C3, 0x00E3),
    ('E', 'agudo', 0x00C9, 0x00E9),
    ('E', 'grave', 0x00C8, 0x00E8),
    ('E', 'circunflexo', 0x00CA, 0x00EA),
    ('I', 'agudo', 0x00CD, 0x00ED),
    ('I', 'circunflexo', 0x00CE, 0x00EE),
    ('O', 'agudo', 0x00D3, 0x00F3),
    ('O', 'grave', 0x00D2, 0x00F2),
    ('O', 'circunflexo', 0x00D4, 0x00F4),
    ('O', 'til', 0x00D5, 0x00F5),
    ('U', 'agudo', 0x00DA, 0x00FA),
    ('U', 'trema', 0x00DC, 0x00FC),
    ('C', 'cedilha', 0x00C7, 0x00E7),
    ('N', 'til', 0x00D1, 0x00F1),
]


def abrir_brown_beige():
    if not BROWN_BEIGE.exists():
        raise SystemExit(f'não encontrei a fonte: {BROWN_BEIGE}\npasse o caminho do guia de marca como argumento.')
    return TTFont(BROWN_BEIGE)


def construir_acentos(fonte):
    """Devolve as funções que carimbam cada acento, já presas a esta fonte."""
    glifos = fonte.getGlyphSet()
    tabela = fonte.getBestCmap()

    peca = RecordingPen()
    glifos[tabela[0x2019]].draw(peca)

    def carimbar(caneta, cx, cy, angulo, escala, espelhado=False, ancora=PECA_CENTRO):
        """Copia a aspa da fonte girada e redimensionada.

        `ancora` é o ponto da peça que cai em (cx, cy); `espelhado` reflete o
        resultado no eixo vertical que passa por cx."""
        t = Transform().translate(cx, cy)
        if espelhado:
            t = t.scale(-1, 1)
        t = t.rotate(math.radians(angulo)).scale(escala, escala).translate(-ancora[0], -ancora[1])
        peca.replay(TransformPen(caneta, t))

    def disco(caneta, cx, cy, r):
        k = r * 0.5523  # aproximação de círculo com bézier cúbica
        caneta.moveTo((cx, cy + r))
        caneta.curveTo((cx + k, cy + r), (cx + r, cy + k), (cx + r, cy))
        caneta.curveTo((cx + r, cy - k), (cx + k, cy - r), (cx, cy - r))
        caneta.curveTo((cx - k, cy - r), (cx - r, cy - k), (cx - r, cy))
        caneta.curveTo((cx - r, cy + k), (cx - k, cy + r), (cx, cy + r))
        caneta.closePath()

    def til(caneta, cx, cy):
        """Onda desenhada como fita: a borda de cima e a de baixo da mesma curva."""
        largura, meia = 190, 52

        def p(x, y):
            return (cx + x, cy + y)

        caneta.moveTo(p(-largura, -4 + meia))
        caneta.curveTo(p(-largura + 60, 96 + meia), p(-55, 46 + meia), p(0, 4 + meia))
        caneta.curveTo(p(52, -34 + meia), p(largura - 62, -92 + meia), p(largura, 8 + meia))
        caneta.curveTo(p(largura + 14, 8), p(largura + 14, -8), p(largura, -8 - meia))
        caneta.curveTo(p(largura - 36, -56 - meia), p(54, -2 - meia), p(0, 38 - meia))
        caneta.curveTo(p(-56, 80 - meia), p(-largura + 44, 44 - meia), p(-largura, -28 - meia))
        caneta.curveTo(p(-largura - 15, -28), p(-largura - 15, -10), p(-largura, -4 + meia))
        caneta.closePath()

    return {
        'agudo': lambda caneta, cx: carimbar(caneta, cx, ALTURA_ACENTO, -20, 0.80),
        'grave': lambda caneta, cx: carimbar(caneta, cx, ALTURA_ACENTO, -20, 0.80, espelhado=True),
        # Duas peças com a ponta larga no mesmo vértice: o encontro fica cheio.
        'circunflexo': lambda caneta, cx: (
            carimbar(caneta, cx, 902, 40, 0.62, ancora=PECA_PONTA),
            carimbar(caneta, cx, 902, -40, 0.62, ancora=PECA_PONTA),
        ),
        'til': lambda caneta, cx: til(caneta, cx, 848),
        'trema': lambda caneta, cx: (disco(caneta, cx - 96, 838, 62), disco(caneta, cx + 96, 838, 62)),
        # Desce do próprio traço da letra, por isso a âncora fica acima da linha de base.
        'cedilha': lambda caneta, cx: carimbar(caneta, cx, 10, -22, 0.80, ancora=PECA_PONTA),
    }


def acentuar(fonte):
    glifos = fonte.getGlyphSet()
    tabela = fonte.getBestCmap()
    acentos = construir_acentos(fonte)
    glyf, hmtx = fonte['glyf'], fonte['hmtx']

    novos = 0
    for base, acento, codigo_maiuscula, codigo_minuscula in COMBINACOES:
        for letra, codigo in ((base, codigo_maiuscula), (base.lower(), codigo_minuscula)):
            nome_base = tabela[ord(letra)]
            limites = BoundsPen(glifos)
            glifos[nome_base].draw(limites)
            x0, _, x1, _ = limites.bounds

            # TrueType só guarda curva quadrática. O Cu2QuPen converte as
            # cúbicas do til e do trema; sem ele o arquivo sai com um flag fora
            # do padrão e o navegador recusa a fonte inteira.
            forma = TTGlyphPen(None)
            caneta = Cu2QuPen(forma, ERRO_CURVA)
            glifos[nome_base].draw(caneta)
            acentos[acento](caneta, (x0 + x1) / 2)

            nome = f'{nome_base}.{acento}'
            glyf[nome] = forma.glyph()
            hmtx[nome] = hmtx[nome_base]
            for sub in fonte['cmap'].tables:
                if sub.isUnicode():
                    sub.cmap[codigo] = nome
            novos += 1

    fonte['maxp'].numGlyphs = len(glyf.glyphOrder)
    return novos


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)

    fonte = abrir_brown_beige()
    novos = acentuar(fonte)
    fonte.flavor = 'woff2'
    saida = DESTINO / 'brown-beige.woff2'
    fonte.save(saida)
    print(f'{saida.name}: {novos} glifos acentuados, {saida.stat().st_size // 1024} KB')

    if not SATOSHI.exists():
        raise SystemExit(f'não encontrei a Satoshi: {SATOSHI}')
    shutil.copyfile(SATOSHI, DESTINO / 'satoshi.woff2')
    print(f'satoshi.woff2: {(DESTINO / "satoshi.woff2").stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
