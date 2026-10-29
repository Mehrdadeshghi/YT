#!/usr/bin/env python3
"""Real-look plates for proto/real.

AI stills (SDXL-Lightning 768x1344 + Depth-Anything-V2-Small depth):
    prep.py ai GRADE SRC.png DEPTH.png OUT_PREFIX
  → OUT_PREFIX_bg.jpg  1080x1920 (graded; the FAR part gets a depth-dependent lens blur = shallow depth of field)
    OUT_PREFIX_fg.png  near cut-out (feathered alpha) for parallax
Real photos:
    prep.py photo GRADE SRC.jpg OUT.jpg HEIGHT     → graded, resized to HEIGHT px tall (aspect kept, for pans)

GRADE = one of the looks below (film-like: lifted blacks, split-toned shadows/highlights, soft S-curve, gentle desaturation).
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd

W, H = 1080, 1920
LOOKS = {   # shadows tint, highlights tint, saturation, contrast, black lift
    'cabin': dict(sh=(0.92, 1.0, 1.08), hi=(1.04, 1.0, 0.95), sat=0.82, con=1.12, lift=0.035),
    'mine':  dict(sh=(1.05, 0.98, 0.90), hi=(1.08, 0.98, 0.84), sat=0.80, con=1.16, lift=0.03),
    'storm': dict(sh=(0.90, 0.96, 1.12), hi=(0.98, 1.0, 1.06), sat=0.86, con=1.14, lift=0.03),
    'none':  dict(sh=(1, 1, 1), hi=(1, 1, 1), sat=1.0, con=1.0, lift=0.0),
}


def grade(im, look):
    L = LOOKS[look]; x = im.astype(np.float32) / 255
    y = x.mean(2, keepdims=True)
    x = y + (x - y) * L['sat']                                  # desaturate a little
    x = np.clip(0.5 + (x - 0.5) * L['con'], 0, 1)               # contrast
    x = x * x * (3 - 2 * x) * 0.35 + x * 0.65                   # soft S-curve
    lum = x.mean(2, keepdims=True)
    tint = np.array(L['sh']) * (1 - lum) + np.array(L['hi']) * lum   # split tone
    x = np.clip(x * tint, 0, 1)
    x = L['lift'] + x * (1 - L['lift'])                         # lifted (film) blacks
    return (np.clip(x, 0, 1) * 255).astype(np.uint8)


def cover(img, w, h):
    s = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    l, t = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((l, t, l + w, t + h))


def otsu(v):
    h, e = np.histogram(v, 256, (0, 256)); p = h / h.sum(); c = (e[:-1] + e[1:]) / 2
    w = np.cumsum(p); m = np.cumsum(p * c); mt = m[-1]
    s = (mt * w - m) ** 2 / (w * (1 - w) + 1e-9)
    return c[np.argmax(s)]


def ai(look, src, dep, out):
    im = cover(Image.open(src).convert('RGB'), W, H)
    d = np.asarray(cover(Image.open(dep).convert('L'), W, H)).astype(np.float32)
    g = grade(np.asarray(im), look).astype(np.float32)
    # depth of field: blend toward a blurred copy by distance from the near plane (bright = near)
    dn = (d - d.min()) / max(1, d.max() - d.min())
    far = np.clip((0.5 - dn) / 0.45, 0, 1)[..., None] ** 1.5
    blur = np.asarray(Image.fromarray(g.astype(np.uint8)).filter(ImageFilter.GaussianBlur(4.5))).astype(np.float32)
    plate = g * (1 - far) + blur * far
    # foreground cut-out for parallax
    thr = otsu(d) + 8; m = d > thr
    m = nd.binary_opening(m, iterations=3)
    lab, n = nd.label(m)
    if n:
        sizes = nd.sum(m, lab, range(1, n + 1)); m = np.isin(lab, 1 + np.nonzero(sizes > 0.01 * m.size)[0])
    if m.mean() > 0.55: m[:] = False                         # nothing clearly 'near' -> no cut-out
    alpha = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
    Image.fromarray(np.dstack([plate, alpha]).astype(np.uint8), 'RGBA').save(out + '_fg.png', optimize=True)
    hole = nd.binary_dilation(m, iterations=14)
    if hole.any():
        idx = nd.distance_transform_edt(hole, return_distances=False, return_indices=True)
        fill = plate[idx[0], idx[1]]
        fb = np.asarray(Image.fromarray(fill.astype(np.uint8)).filter(ImageFilter.GaussianBlur(18))).astype(np.float32)
        hb = np.asarray(Image.fromarray((hole * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32)[..., None] / 255
        plate = plate * (1 - hb) + fb * hb
    Image.fromarray(plate.astype(np.uint8)).save(out + '_bg.jpg', quality=92)
    print(out, 'fg %.0f%%' % (100 * m.mean()))


def photo(look, src, out, h):
    im = Image.open(src).convert('RGB'); s = h / im.height
    im = im.resize((round(im.width * s), h), Image.LANCZOS)
    Image.fromarray(grade(np.asarray(im), look)).save(out, quality=92)
    print(out, im.size)


if __name__ == '__main__':
    if sys.argv[1] == 'ai': ai(*sys.argv[2:6])
    else: photo(sys.argv[2], sys.argv[3], sys.argv[4], int(sys.argv[5]))
