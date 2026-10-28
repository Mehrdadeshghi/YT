#!/usr/bin/env python3
"""2.5D layers from an AI still + its depth map (Depth-Anything-V2-Small output of gen.py).
    python prep.py IMG_DIR OUT_DIR id_seed [id_seed ...]
→ OUT_DIR/<id_seed>_bg.jpg  (foreground removed, hole filled from the nearest background pixels + blurred)
  OUT_DIR/<id_seed>_fg.png  (foreground cut-out, feathered alpha)
Foreground = the nearest depth band (Otsu split of the depth histogram, biased toward 'near')."""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)


def otsu(v):
    h, e = np.histogram(v, 256, (0, 256)); p = h / h.sum(); c = (e[:-1] + e[1:]) / 2
    w = np.cumsum(p); m = np.cumsum(p * c); mt = m[-1]
    s = (mt * w - m) ** 2 / (w * (1 - w) + 1e-9)
    return c[np.argmax(s)]


for key in sys.argv[3:]:
    im = np.asarray(Image.open(f'{src}/{key}.png').convert('RGB')).astype(np.float32)
    d = np.asarray(Image.open(f'{src}/{key}_depth.png').convert('L').resize(im.shape[1::-1])).astype(np.float32)
    thr = otsu(d) + 8                       # depth-anything: bright = near
    m = d > thr
    m = nd.binary_opening(m, iterations=3)
    lab, n = nd.label(m)                    # keep only big blobs (no speckle cut-outs)
    if n:
        sizes = nd.sum(m, lab, range(1, n + 1)); keep = np.isin(lab, 1 + np.nonzero(sizes > 0.01 * m.size)[0]); m = keep
    frac = m.mean()
    alpha = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255
    Image.fromarray(np.dstack([im, alpha * 255]).astype(np.uint8), 'RGBA').save(f'{dst}/{key}_fg.png', optimize=True)
    # background: grow the hole a bit, fill every hole pixel with its nearest known pixel, blur only inside the hole
    hole = nd.binary_dilation(m, iterations=14)
    idx = nd.distance_transform_edt(hole, return_distances=False, return_indices=True)
    fill = im[idx[0], idx[1]]
    blur = np.asarray(Image.fromarray(fill.astype(np.uint8)).filter(ImageFilter.GaussianBlur(18))).astype(np.float32)
    hb = np.asarray(Image.fromarray((hole * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32)[..., None] / 255
    bg = im * (1 - hb) + blur * hb
    Image.fromarray(bg.astype(np.uint8)).save(f'{dst}/{key}_bg.jpg', quality=92)
    print(key, 'fg %.0f%%' % (100 * frac))
