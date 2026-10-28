# python3 sheet.py <dir> [cols] → <dir>/sheet.jpg contact sheet of f_*.jpg
import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 6
fs = sorted(glob.glob(f'{d}/f_*.jpg'))
ims = [Image.open(f).convert('RGB').resize((324, 576)) for f in fs]
rows = (len(ims) + cols - 1) // cols
c = Image.new('RGB', (cols * 328, rows * 600), (30, 30, 30)); g = ImageDraw.Draw(c)
for i, im in enumerate(ims):
    x, y = (i % cols) * 328, (i // cols) * 600; c.paste(im, (x, y + 22)); g.text((x + 4, y + 4), os.path.basename(fs[i]), fill='white')
c.save(f'{d}/sheet.jpg', quality=85); print(f'{d}/sheet.jpg', len(ims))
