#!/usr/bin/env python3
"""
chroma-sprites.py — transforma uma FOLHA de sprites com fundo verde-chroma
nos PNGs transparentes plugáveis do Matemágica (regras de arte do CLAUDE.md:
transparência REAL, 512x512, personagem centralizado, margem ~12%).

Uso:  python3 scripts/chroma-sprites.py <folha.png> <tema> [saida_dir]
Ex.:  python3 scripts/chroma-sprites.py hades-sheet.png hades src/assets/mascotes

O que faz: (1) remove o verde-chroma (com anti-fringe nas bordas), (2) acha as
colunas de cada personagem por projeção de pixels opacos, (3) recorta cada um,
(4) centraliza num quadrado 512x512 com margem. Processamento OFFLINE — nunca
em tempo real no app (isso é proibido pela regra de arte).
"""
import sys
from PIL import Image

def chroma_key(im, tol=90):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    # cor do fundo = moda dos 4 cantos
    corners = [px[0, 0], px[w-1, 0], px[0, h-1], px[w-1, h-1]]
    bg = max(set(corners), key=corners.count)[:3]
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            d = abs(r-bg[0]) + abs(g-bg[1]) + abs(b-bg[2])
            if d < tol:
                px[x, y] = (0, 0, 0, 0)
            elif d < tol * 2:
                # borda: reduz o fringe verde puxando o canal dominante do fundo pra baixo
                fade = (d - tol) / tol
                px[x, y] = (r, min(g, max(r, b)), b, int(a * fade))
    return im

def split_columns(im, n=5, min_width=40, thr=0.05):
    """separa os N personagens por DENSIDADE de pixels por coluna: texto fino e
    pontas de foice ficam abaixo do limiar; personagens grudados são divididos
    no vale de menor densidade."""
    w, h = im.size
    px = im.load()
    dens = [sum(1 for y in range(0, h, 2) if px[x, y][3] > 40) * 2 / h for x in range(w)]
    spans, start = [], None
    for x, d in enumerate(dens + [0.0]):
        if d > thr and start is None:
            start = x
        elif d <= thr and start is not None:
            if x - start >= min_width:
                spans.append((start, x - 1))
            start = None
    # personagens encostados: divide o span mais largo no vale interno até ter N
    while len(spans) < n and spans:
        i = max(range(len(spans)), key=lambda k: spans[k][1] - spans[k][0])
        a, b = spans[i]
        lo, hi = a + (b - a) // 5, b - (b - a) // 5  # só o miolo (evita cortar borda)
        valley = min(range(lo, hi), key=lambda x: dens[x])
        if valley - a < min_width or b - valley < min_width:
            break
        spans[i:i + 1] = [(a, valley - 1), (valley + 1, b)]
        spans.sort()
    return spans

def character_band(im, thr=0.06):
    """acha a FAIXA horizontal dos personagens (a banda mais ALTA de densidade),
    ignorando título e legendas (linhas de texto têm densidade baixa)."""
    w, h = im.size
    px = im.load()
    dens = [sum(1 for x in range(0, w, 2) if px[x, y][3] > 40) * 2 / w for y in range(h)]
    bands, start = [], None
    for y, d in enumerate(dens + [0.0]):
        if d > thr and start is None:
            start = y
        elif d <= thr and start is not None:
            bands.append((start, y - 1))
            start = None
    return max(bands, key=lambda b: b[1] - b[0])

def to_card(sprite, size=512, margin=0.12):
    box = sprite.getbbox()
    sprite = sprite.crop(box)
    inner = int(size * (1 - 2 * margin))
    ratio = min(inner / sprite.width, inner / sprite.height)
    sprite = sprite.resize((max(1, int(sprite.width * ratio)), max(1, int(sprite.height * ratio))), Image.LANCZOS)
    card = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    card.paste(sprite, ((size - sprite.width) // 2, (size - sprite.height) // 2), sprite)
    return card

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    sheet_path, tema = sys.argv[1], sys.argv[2]
    outdir = sys.argv[3] if len(sys.argv) > 3 else "."
    im = chroma_key(Image.open(sheet_path))
    y0, y1 = character_band(im)
    print(f"faixa dos personagens: y {y0}-{y1}")
    banda = im.crop((0, y0, im.width, y1 + 1))
    n = int(sys.argv[4]) if len(sys.argv) > 4 else 5
    spans = split_columns(banda, n=n)
    print(f"personagens encontrados: {len(spans)}")
    nomes = ["ovo", "bebe", "jovem", "heroi", "divino"]
    for i, (x0, x1) in enumerate(spans):
        sprite = banda.crop((x0, 0, x1 + 1, banda.height))
        card = to_card(sprite)
        nome = nomes[i] if i < len(nomes) else str(i + 1)
        out = f"{outdir}/{tema}-{i+1}-{nome}.png"
        card.save(out)
        print("ok", out, card.size)

if __name__ == "__main__":
    main()
