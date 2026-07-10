"""Regenerate public/og-refaktor.webp, the 1200x630 social card.

Rename the output and the `image` default in Layout.astro whenever the card
changes: Facebook, LinkedIn and WhatsApp cache og:image by URL, and some never
re-scrape a URL they have already seen.

Needs fonttools, cairosvg and Pillow. Reads the variable font from assets/,
which sits outside public/ so it never ships to dist.
"""

from io import BytesIO

import cairosvg
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = "/home/techxero/Sites/RefactorME"
FONT_TTF = f"{ROOT}/assets/SchibstedGrotesk-var.ttf"
LOGO_SVG = f"{ROOT}/public/favicon.svg"
OUT = f"{ROOT}/public/og-refaktor.webp"

W, H = 1200, 630
BASE = (11, 17, 29)
LIFT = (22, 35, 61)
WHITE = (242, 246, 252)
MUTED = (170, 180, 198)
DIM = (107, 118, 137)
BLUE = (79, 140, 255)
CYAN = (63, 198, 216)


def font(wght, size):
    f = instantiateVariableFont(TTFont(FONT_TTF), {"wght": wght})
    buf = BytesIO()
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


def run(d, xy, s, f, fill):
    """Draw a text run and return the x it ends at, so runs chain without guessing."""
    d.text(xy, s, font=f, fill=fill)
    return xy[0] + d.textlength(s, font=f)


# Diagonal slate gradient, lit toward the top left like the site's panels.
img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    for x in range(W):
        t = x / W * 0.45 + (1 - y / H) * 0.55
        px[x, y] = tuple(int(BASE[i] + (LIFT[i] - BASE[i]) * t) for i in range(3))

# Cyan bloom low and right, echoing the hero's lit preview panel.
glow = Image.new("RGB", (W, H), (0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([700, 300, 1360, 900], fill=(10, 46, 52))
glow = glow.filter(ImageFilter.GaussianBlur(150))
img = Image.blend(img, glow, 0.55)

d = ImageDraw.Draw(img)

mark_px = 96
mark = Image.open(BytesIO(cairosvg.svg2png(
    url=LOGO_SVG, output_width=mark_px, output_height=mark_px)))
img.paste(mark, (72, 58), mark)

f_word = font(800, 40)
x = run(d, (188, 62), "refaktor", f_word, WHITE)
run(d, (x, 62), ".me", f_word, CYAN)
d.text((190, 114), "WEBSITE REBUILDS, DONE RIGHT", font=font(600, 13), fill=DIM)

f_h = font(800, 78)
d.text((72, 232), "Your website is", font=f_h, fill=WHITE)
x = run(d, (72, 328), "calling for ", f_h, BLUE)
run(d, (x, 328), "a refactor.", f_h, CYAN)

f_sub = font(500, 26)
d.text((72, 456), "Hobby pages, single-product sites, and family-run shops.", font=f_sub, fill=MUTED)
d.text((72, 494), "Faster, cleaner, happy on a phone.", font=f_sub, fill=MUTED)

x = run(d, (72, 556), "refaktor.me", font(600, 22), CYAN)
d.text((x + 18, 556), "From €150", font=font(500, 22), fill=DIM)

img.save(OUT, "WEBP", quality=88, method=6)
print("wrote", OUT, img.size)
