#!/usr/bin/env python3
"""Contact sheet of a rendered video: python3 scripts/hf_frames.py video.mp4 out.jpg t1 t2 … (seconds), 5 per row."""
import subprocess, sys, tempfile, os
from PIL import Image
src, dst, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3:]]
tmp = tempfile.mkdtemp(); ims = []
for i, t in enumerate(ts):
    f = f'{tmp}/{i}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', src, '-frames:v', '1', '-vf', 'scale=324:-1', f], check=True)
    ims.append(Image.open(f))
cols = 5; rows = (len(ims) + cols - 1) // cols
w, h = ims[0].size; sheet = Image.new('RGB', (cols * (w + 6), rows * (h + 6)), 'white')
for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * (w + 6), (i // cols) * (h + 6)))
sheet.save(dst, quality=88)
