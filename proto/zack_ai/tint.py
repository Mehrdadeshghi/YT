#!/usr/bin/env python3
"""'Molasses-ize' a still: SDXL-Lightning draws every wave as white surf, so bright low-saturation pixels
(foam, spray, slush) inside a vertical band are re-coloured to glossy molasses brown, keeping their shading.
    python tint.py SRC.png DST.png Y0 Y1 [strength]      (Y0/Y1 = band as fractions of the height, soft edges)"""
import sys
import numpy as np
from PIL import Image

src, dst, y0, y1 = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
k = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32) / 255
mx, mn = im.max(2), im.min(2); L = im.mean(2); sat = (mx - mn) / (mx + 1e-4)
w = np.clip((L - 0.42) / 0.25, 0, 1) * np.clip((0.38 - sat) / 0.2, 0, 1)          # foam-ness
h = im.shape[0]; yy = np.linspace(0, 1, h)[:, None]
band = np.clip((yy - y0) / 0.06, 0, 1) * np.clip((y1 - yy) / 0.06, 0, 1)
w = (w * band * k)[..., None]
# molasses ramp: deep shadow -> amber highlight, shading from the foam luminance
dark, mid, hi = np.array([0.10, 0.035, 0.0]), np.array([0.42, 0.17, 0.03]), np.array([0.95, 0.70, 0.38])
l = L[..., None]
ramp = np.where(l < 0.75, dark + (mid - dark) * (l / 0.75), mid + (hi - mid) * ((l - 0.75) / 0.25) ** 2)
out = im * (1 - w) + ramp * w
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(dst)
