"""Recorta as fotos de produto (fundo amarelo da marca) em WebP com transparência.

O card do cardápio já tem o amarelo da marca atrás da foto e aplica a própria
sombra, então a imagem precisa chegar recortada.

O recorte é mais difícil do que parece: a crosta frita da coxinha tem exatamente
a mesma cor do fundo, só mais escura — e a sombra que a foto já traz é mais
escura que parte da crosta. Nenhum limiar de cor ou de brilho sozinho separa os
dois. O que separa é a textura: a crosta é farelenta, o fundo e a sombra são
lisos. Então um pixel é produto quando a cor foge do amarelo (lata, queijo,
recheio) ou quando está escuro E texturado (a crosta).

Cada foto tem grão e vinheta próprios, então os três limiares saem da moldura da
própria imagem em vez de virem fixos.

Uso: coloque os .png na raiz do projeto e rode  npm run produtos

Só entram aqui as fotos de estúdio, já tiradas sobre o amarelo. `linha_degust.png`
e `coxinha_caixa.png` vieram como foto de celular, em cima de uma mesa, e foram
recortadas e montadas no amarelo numa edição à parte — passá-las de novo por este
recorte comeria o painel amarelo da própria embalagem, que tem a cor do fundo.
"""
import os

import cv2
import numpy as np
from PIL import Image

# arquivo de origem -> nome do asset em public/assets/produtos/
ORIGENS = {
    'combo_pravoce.png': 'coxinha-combo',
    'combo_duplafome.png': 'combo-dupla-fome',
}

DESTINO = os.path.join('public', 'assets', 'produtos')
LARGURA_MAX = 900  # o suficiente para o card, sem deixar a página pesada
MOLDURA = 24       # faixa de borda usada como amostra do fundo


def moldura_de(altura, largura):
    m = np.zeros((altura, largura), bool)
    m[:MOLDURA] = m[-MOLDURA:] = m[:, :MOLDURA] = m[:, -MOLDURA:] = True
    return m


def limite(valores, piso, k=10):
    """Até onde vai o fundo nessa medida.

    Mediana + k desvios absolutos medianos, e não um percentil alto: às vezes a
    moldura pega um pedaço da sombra do produto, e aí o percentil dispara e o
    recorte sai vazio. A mediana e o desvio absoluto aguentam essa sujeira.
    """
    mediana = float(np.median(valores))
    desvio = float(np.median(np.abs(valores - mediana)))
    return max(piso, mediana + k * desvio)


def fundo_suave(luz, moldura):
    """Superfície do brilho do fundo, com a vinheta que escurece as pontas.

    Ajustada só pela moldura e em duas passadas: a segunda ignora os pontos que
    ficaram longe da primeira, que é como a sombra do produto deixa de puxar o
    ajuste para baixo.
    """
    altura, largura = luz.shape
    ys, xs = np.mgrid[0:altura, 0:largura].astype(np.float32)
    xs, ys = xs / largura, ys / altura
    base = np.stack([np.ones_like(xs), xs, ys, xs * xs, ys * ys, xs * ys], -1)

    usar = moldura.copy()
    for _ in range(2):
        coeficientes, *_ = np.linalg.lstsq(base[usar], luz[usar], rcond=None)
        resto = luz[moldura] - (base[moldura] @ coeficientes)
        corte = 3 * max(float(np.median(np.abs(resto - np.median(resto)))), 0.5)
        novo = np.zeros_like(moldura)
        novo[moldura] = np.abs(resto - np.median(resto)) < corte
        if novo.sum() < 500:
            break
        usar = novo
    return base @ coeficientes


def mascara(im, moldura):
    """Onde está o produto, em branco."""
    lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
    luz = lab[:, :, 0]

    # Cor independente de brilho: a sombra do fundo continua amarela, a lata não.
    f = im.astype(np.float32) + 1
    croma = f / f.sum(axis=2, keepdims=True)
    distancia = np.linalg.norm(croma - np.median(croma[moldura], axis=0), axis=2)

    media = cv2.blur(luz, (9, 9))
    textura = np.sqrt(np.maximum(cv2.blur(luz * luz, (9, 9)) - media * media, 0))
    abaixo = fundo_suave(luz, moldura) - luz

    fora_do_amarelo = distancia > limite(distancia[moldura], 0.012)
    escuro = abaixo > limite(abaixo[moldura], 5.0)
    farelento = textura > limite(textura[moldura], 1.0)

    return ((fora_do_amarelo | (escuro & farelento)).astype(np.uint8)) * 255


def limpar(m):
    # A ordem importa. Fechar primeiro com um pincel grosso costura o produto na
    # própria sombra, e aí o preenchimento de buracos adota a sombra como se
    # fosse miolo — sobra uma mancha serrilhada embaixo da foto. Então: tira o
    # grão, escolhe os blocos grandes, fecha os buracos e só no fim alisa a
    # silhueta, com pincel pequeno.
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))

    # Só os blocos grandes, medidos contra o maior deles e não contra o quadro:
    # tira o grão e os restos da sombra que a foto já traz, sem derrubar um
    # segundo produto que esteja solto do primeiro.
    quantos, rotulos, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    inteiros = np.zeros_like(m)
    if quantos > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        minimo = max(areas.max() * 0.15, m.size * 0.002)
        for i in range(1, quantos):
            if stats[i, cv2.CC_STAT_AREA] >= minimo:
                inteiros[rotulos == i] = 255

    # buraco é tudo que o fundo não alcança partindo da borda
    vazio = cv2.bitwise_not(inteiros)
    alcance = vazio.copy()
    cv2.floodFill(alcance, np.zeros((m.shape[0] + 2, m.shape[1] + 2), np.uint8), (0, 0), 0)
    m = cv2.bitwise_or(inteiros, alcance)

    return cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))


def recorta(arquivo, nome):
    original = cv2.imread(arquivo)
    if original is None:
        raise SystemExit(f'não consegui abrir {arquivo}')
    # tira o grão antes de medir: foto granulada faz fundo liso parecer textura
    suave = cv2.bilateralFilter(original, 9, 45, 9)
    m = cv2.GaussianBlur(limpar(mascara(suave, moldura_de(*original.shape[:2]))), (5, 5), 0)

    imagem = Image.fromarray(np.dstack([cv2.cvtColor(original, cv2.COLOR_BGR2RGB), m]), 'RGBA')
    imagem = imagem.crop(imagem.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox())
    imagem.thumbnail((LARGURA_MAX, LARGURA_MAX), Image.LANCZOS)

    saida = os.path.join(DESTINO, nome + '.webp')
    imagem.save(saida, 'WEBP', quality=80, method=6)
    print(f'{arquivo} -> {nome}.webp  {imagem.size[0]}x{imagem.size[1]}  {os.path.getsize(saida) // 1024} KB')


for arquivo, nome in ORIGENS.items():
    recorta(arquivo, nome)
