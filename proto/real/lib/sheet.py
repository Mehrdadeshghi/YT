#!/usr/bin/env python3
"""Contact sheet of generated stills by id prefix: python sheet.py GEN_DIR PREFIX OUT.jpg  (skips depth maps)"""
import glob, os, sys
from PIL import Image, ImageDraw
src, pre, out = sys.argv[1:4]
fs = sorted(f for f in glob.glob(f'{src}/{pre}*.png') if not f.endswith('_depth.png'))
cols = min(9, len(fs)); rows = -(-len(fs) // cols)
c = Image.new('RGB', (cols * 220, rows * 400), 'black'); d = ImageDraw.Draw(c)
for i, f in enumerate(fs):
    x, y = (i % cols) * 220, (i // cols) * 400
    c.paste(Image.open(f).convert('RGB').resize((216, 378)), (x, y + 20)); d.text((x + 4, y + 4), os.path.basename(f), fill='white')
c.save(out, quality=85); print(out, len(fs))
