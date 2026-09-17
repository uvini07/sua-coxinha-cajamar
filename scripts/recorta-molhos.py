"""Recorta as garrafas dos molhos (fundo preto) em PNG/WebP com transparencia.

A silhueta e montada linha a linha: em cada linha da foto pegamos o primeiro e o
ultimo pixel claro e preenchemos o meio. Isso resolve a tampa preta, que se
confunde com o fundo em qualquer limiar de brilho.
"""
import cv2
import numpy as np
from PIL import Image

ORIGENS = {
    'moderado': 'molho_cremoso_moderado.jpeg',
    'goiabinha': 'molho_goiabinha.jpeg',
    'suave': 'molho_cremoso.jpeg',
    'alho': 'molho_alho.jpeg',
}


def silhueta(arquivo):
    im = cv2.imread(arquivo)
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    h, w = g.shape
    claro = cv2.morphologyEx((g > 22).astype(np.uint8), cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))

    esq = np.full(h, np.nan)
    dir_ = np.full(h, np.nan)
    for y in range(h):
        xs = np.flatnonzero(claro[y])
        if len(xs) >= 40 and xs[-1] - xs[0] > 60:
            esq[y], dir_[y] = xs[0], xs[-1]

    # Fica só com o bloco de linhas da garrafa. Falhas curtas (a tampa escura,
    # que quase não tem pixel claro) são costuradas antes de escolher o bloco.
    val = (~np.isnan(esq)).astype(np.uint8)
    val = cv2.morphologyEx(val.reshape(-1, 1), cv2.MORPH_CLOSE, np.ones((81, 1), np.uint8)).ravel().astype(bool)
    melhor, atual = (0, 0), None
    for y in range(h):
        if val[y] and atual is None:
            atual = y
        elif not val[y] and atual is not None:
            if y - atual > melhor[1] - melhor[0]:
                melhor = (atual, y)
            atual = None
    if atual is not None and h - atual > melhor[1] - melhor[0]:
        melhor = (atual, h)
    y0, y1 = melhor

    # Linhas sem borda detectada (tampa) herdam a borda das vizinhas
    conhecidas = np.flatnonzero(~np.isnan(esq))
    if len(conhecidas):
        esq = np.interp(np.arange(h), conhecidas, esq[conhecidas])
        dir_ = np.interp(np.arange(h), conhecidas, dir_[conhecidas])
    esq[:y0] = np.nan
    esq[y1:] = np.nan
    dir_[:y0] = np.nan
    dir_[y1:] = np.nan

    def suavizar(v):
        s = v.copy()
        for y in range(y0, y1):
            janela = v[max(y0, y - 11) : min(y1, y + 12)]
            janela = janela[~np.isnan(janela)]
            if len(janela):
                s[y] = np.median(janela)
        return s

    esq, dir_ = suavizar(esq), suavizar(dir_)

    m = np.zeros((h, w), np.uint8)
    for y in range(y0, y1):
        if not np.isnan(esq[y]) and dir_[y] > esq[y]:
            m[y, int(esq[y]) : int(dir_[y]) + 1] = 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    m = cv2.GaussianBlur(m, (7, 7), 0)

    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = m
    out = Image.fromarray(cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA))
    return out.crop(out.getbbox())


for nome, arquivo in ORIGENS.items():
    garrafa = silhueta(arquivo)
    garrafa.thumbnail((620, 1400), Image.LANCZOS)
    garrafa.save(f'public/assets/molhos/{nome}.webp', quality=88, method=6)
    print(nome, garrafa.size)
