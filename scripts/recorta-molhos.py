"""Recorta as garrafas dos molhos (fotos com fundo preto) em WebP com transparência.

O fundo das fotos é preto puro, então um limiar baixo já separa a garrafa. O
fechamento morfológico costura as partes escuras da tampa, que quase se
confundem com o fundo, e o preenchimento de buracos recupera o miolo do rótulo.
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

LIMIAR = 10
FECHAR = 61


def recorta(arquivo):
    im = cv2.imread(arquivo)
    cinza = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)

    m = (cinza > LIMIAR).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (FECHAR, FECHAR)))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))

    n, lab, stats, _ = cv2.connectedComponentsWithStats(m, 8)
    if n > 1:
        m = np.where(lab == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]), 255, 0).astype(np.uint8)

    # Buracos internos (o logo preto do rótulo) voltam a ser garrafa. A moldura de
    # 1px garante que todo o fundo se conecte, mesmo o que não toca o canto.
    fora = cv2.copyMakeBorder(m, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
    cv2.floodFill(fora, np.zeros((fora.shape[0] + 2, fora.shape[1] + 2), np.uint8), (0, 0), 255)
    m = m | cv2.bitwise_not(fora)[1:-1, 1:-1]
    m = cv2.GaussianBlur(m, (7, 7), 0)

    rgba = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)
    rgba[:, :, 3] = m
    garrafa = Image.fromarray(cv2.cvtColor(rgba, cv2.COLOR_BGRA2RGBA))
    return garrafa.crop(garrafa.getbbox())


if __name__ == '__main__':
    for nome, arquivo in ORIGENS.items():
        garrafa = recorta(arquivo)
        garrafa.thumbnail((620, 1400), Image.LANCZOS)
        garrafa.save(f'public/assets/molhos/{nome}.webp', quality=88, method=6)
        print(nome, garrafa.size)
