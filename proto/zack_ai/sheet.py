#!/usr/bin/env python3
"""Contact sheet of generated stills: python sheet.py OUT.jpg img1.png img2.png ..."""
import os, sys
from PIL import Image, ImageDraw
fs = sys.argv[2:]
cols = min(11, len(fs)); rows = -(-len(fs) // cols)
c = Image.new('RGB', (cols * 200, rows * 370), 'black'); d = ImageDraw.Draw(c)
for i, f in enumerate(fs):
    x, y = (i % cols) * 200, (i // cols) * 370
    c.paste(Image.open(f).convert('RGB').resize((200, 350)), (x, y + 20)); d.text((x + 4, y + 4), os.path.basename(f), fill='white')
c.save(sys.argv[1], quality=85)
