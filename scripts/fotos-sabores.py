"""Converte as fotos dos sabores (PNG) para o formato do site (WebP).

Uso: coloque os arquivos .png em public/assets/sabores/ com os nomes do LEIA-ME.txt
e rode:  npm run fotos
"""
import os
from PIL import Image

PASTA = os.path.join('public', 'assets', 'sabores')
LARGURA_MAX = 1200

for arquivo in sorted(os.listdir(PASTA)):
    if not arquivo.lower().endswith('.png'):
        continue
    caminho = os.path.join(PASTA, arquivo)
    imagem = Image.open(caminho).convert('RGBA')

    # corta o vazio em volta do produto, para todas as fotos ficarem do mesmo tamanho na tela
    caixa = imagem.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
    if caixa:
        imagem = imagem.crop(caixa)
    imagem.thumbnail((LARGURA_MAX, LARGURA_MAX), Image.LANCZOS)

    destino = os.path.join(PASTA, os.path.splitext(arquivo)[0] + '.webp')
    imagem.save(destino, 'WEBP', quality=88, method=6)
    print(f'{arquivo} -> {os.path.basename(destino)}  {imagem.size[0]}x{imagem.size[1]}  {os.path.getsize(destino) // 1024} KB')
