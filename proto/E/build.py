#!/usr/bin/env python3
"""Prototype E — MAP / GLOBE STORY (silent, 9:16): Mount St. Helens, 18 May 1980 — where the ash went.

Facts (English Wikipedia "1980 eruption of Mount St. Helens", checked 28 Oct 2026):
  8:32 am PDT, May 18, 1980; eruption column rose 80,000 feet (24 km; 15 mi); ash in 11 U.S. states;
  by 9:45 am it had reached Yakima, 90 mi away; by 11:45 over Spokane; Spokane "plunged into darkness by noon";
  western Yellowstone by 10:15 pm; seen on the ground in Denver the next day; ash fall reported as far as Minnesota and Oklahoma;
  "some of the ash drifted around the globe within about two weeks".
Map: "1980 Mount st helens ash distribution.svg" (public domain, USGS data) — its state outlines + ash-fall zones are redrawn here.
Globe: Natural Earth II shaded relief (public domain), repo assets/earth/world.jpg.
"""
import os, re, sys, shutil
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
REPO = os.path.dirname(os.path.dirname(D))
VOLC = (-122.18, 46.20)

# scene windows (master clock)
T_GLOBE, T_PHOTO, T_MAP, T_GLOBE2, DUR = 0.0, 3.0, 6.3, 14.4, 18.0


def prep():
    os.makedirs(A, exist_ok=True)
    src = fetch('msh_erupt', 'File:MSH80 eruption mount st helens 05-18-80.jpg', 2400)
    if not os.path.exists(f'{A}/erupt.jpg'):
        Image.open(src).convert('RGB').save(f'{A}/erupt.jpg', quality=90)
    fetch('ashmapsvg', 'File:1980 Mount st helens ash distribution.svg', 0)
    if not os.path.exists(f'{A}/world.jpg'):
        w = os.path.join(REPO, 'assets/earth/world.jpg')
        if not os.path.exists(w): w = '/home/meshg/sandbox/wikiroullete/assets/earth/world.jpg'
        shutil.copy(w, f'{A}/world.jpg')


# ---------------------------------------------------------------- the USGS map (SVG units, 883.85 x 569.144)
def path_bbox(d):
    toks = re.findall(r'[MmLlHhVvCcSsQqTtZz]|-?\d*\.?\d+(?:e-?\d+)?', d)
    x = y = sx = sy = 0; xs, ys = [], []; i = 0; cmd = None
    nargs = dict(M=2, L=2, H=1, V=1, C=6, S=4, Q=4, T=2, Z=0)
    while i < len(toks):
        if re.match(r'[A-Za-z]', toks[i]): cmd = toks[i]; i += 1
        if cmd in 'Zz': x, y = sx, sy; continue
        n = nargs[cmd.upper()]; a = [float(v) for v in toks[i:i + n]]; i += n; rel = cmd.islower()
        if cmd.upper() == 'H': x = x + a[0] if rel else a[0]
        elif cmd.upper() == 'V': y = y + a[0] if rel else a[0]
        else:
            nx, ny = a[-2], a[-1]
            x, y = (x + nx, y + ny) if rel else (nx, ny)
        if cmd.upper() == 'M': sx, sy = x, y; cmd = 'l' if rel else 'L'
        xs.append(x); ys.append(y)
    return min(xs), min(ys), max(xs), max(ys)


def usgs_map():
    s = open(os.path.join(MEDIA, 'ashmapsvg.svg')).read()
    l1 = s[s.index('id="Layer_1"'):s.index('id="Layer_2"')]
    states = re.findall(r'<path id="(\w\w)"[^>]*?d="([^"]+)"', l1, re.S)
    l2 = s[s.index('id="Layer_2"'):s.index('id="Layer_3"')]
    ash = re.findall(r'<path opacity="0.8" fill="(#\w+)" d="([^"]+)"', l2, re.S)
    bb = {k: path_bbox(d) for k, d in states}
    def at(st, fx, fy):
        x0, y0, x1, y1 = bb[st]; return [round(x0 + (x1 - x0) * fx, 1), round(y0 + (y1 - y0) * fy, 1)]
    # point positions: the map's own markers (volcano triangle, Yakima/Spokane dots) + lon/lat fractions inside a state's box
    pts = dict(volc=[69.3, 54.5], yakima=[98.2, 67.5], spokane=[144.1, 31.9],
               yellowstone=at('WY', (-110.6 + 111.05) / 7, (45 - 44.6) / 4), denver=at('CO', (-104.99 + 109.05) / 7, (41 - 39.74) / 4))
    return states, ash, pts


MAP_CSS = """
  #root { background: #070A10; }
  .mapw { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
  .mapw svg { position: absolute; left: 0; top: 0; overflow: visible; }
  .st { fill: #131A26; stroke: rgba(245,241,232,.42); stroke-width: .55; stroke-linejoin: round; }
  .pin { position: absolute; left: 0; top: 0; width: 0; height: 0; opacity: 0; }
  .dot { position: absolute; left: -13px; top: -13px; width: 26px; height: 26px; border-radius: 50%; background: #FFF4DE; border: 5px solid #FF5B2E;
    box-shadow: 0 0 0 8px rgba(255,91,46,.25), 0 6px 18px rgba(0,0,0,.6); }
  .plab { position: absolute; left: 24px; top: -22px; font: 900 34px Inter, sans-serif; letter-spacing: .06em; color: #FFF4DE; white-space: nowrap;
    text-shadow: 0 2px 0 #000, 0 4px 18px rgba(0,0,0,.9); }
  .vt { position: absolute; left: -20px; top: -34px; width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent;
    border-bottom: 34px solid #FF3B1F; filter: drop-shadow(0 4px 10px rgba(0,0,0,.7)); }
  .shock { position: absolute; left: -10px; top: -10px; width: 20px; height: 20px; border-radius: 50%; border: 5px solid #FF6A3D; opacity: 0; }
  .scrimB { position: absolute; left: 0; right: 0; bottom: 0; height: 900px; background: linear-gradient(0deg, rgba(5,7,11,.98) 0%, rgba(5,7,11,.92) 45%, rgba(5,7,11,0) 100%); }
  .scrimT { position: absolute; left: 0; right: 0; top: 0; height: 520px; background: linear-gradient(180deg, rgba(5,7,11,.92), rgba(5,7,11,0)); }
  .head { position: absolute; left: 40px; right: 40px; top: 1110px; text-align: center; }
  .hl { font-family: "League Gothic", sans-serif; font-size: 150px; line-height: .9; text-transform: uppercase; color: #F5F1E8; white-space: nowrap; }
  .hs { margin-top: 10px; font: 900 36px Inter, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #FFB547; white-space: nowrap; }
  .beat { position: absolute; left: 0; right: 0; top: 0; }
  .beat .w { opacity: 0; margin: 0 .06em; }
  .big11 { color: #FFB547; }
"""


def map_scene():
    states, ash, P = usgs_map()
    D_ = T_GLOBE2 - T_MAP + 0.05
    st = '\n'.join(f'        <path id="m-{k}" class="st" d="{" ".join(d.split())}" />' for k, d in states)
    col = {'#FFFF00': ('#FFC24A', .62), '#FFB300': ('#FF8A2A', .85), '#DF1800': ('#FF3B1F', .95)}
    ash_p = '\n'.join(f'          <path d="{" ".join(d.split())}" fill="{col[c][0]}" fill-opacity="{col[c][1]}" />' for c, d in ash)
    # ash front radius (SVG units from the volcano) — keyed to the documented times
    dist = lambda k: ((P[k][0] - P['volc'][0]) ** 2 + (P[k][1] - P['volc'][1]) ** 2) ** .5
    beats = [  # local time, headline, sub, pin key, front radius at that moment
        (0.55, 'Yakima', '90 miles away · 9:45 AM', 'yakima', dist('yakima') + 6),
        (1.95, 'Spokane', 'dark as night by noon', 'spokane', dist('spokane') + 8),
        (3.35, 'Yellowstone', 'the same night', 'yellowstone', dist('yellowstone') + 10),
        (4.75, 'Denver', 'ash on the ground next day', 'denver', dist('denver') + 12),
    ]
    R = [dict(t=0, r=4), dict(t=0.55, r=beats[0][4], e='o3')] + [dict(t=b[0], r=b[4], e='io2') for b in beats[1:]] + \
        [dict(t=6.4, r=520, e='io2')]
    v = P['volc']
    cam = [dict(t=0, cx=v[0] + 6, cy=v[1] + 4, s=10.5, fx=430, fy=800),
           dict(t=0.55, cx=v[0] + 10, cy=v[1] + 4, s=9.0, fx=430, fy=800, e='o3'),
           dict(t=1.95, cx=110, cy=48, s=6.2, fx=470, fy=760),
           dict(t=3.35, cx=150, cy=95, s=3.6, fx=470, fy=760),
           dict(t=4.75, cx=210, cy=150, s=2.4, fx=500, fy=760),
           dict(t=6.2, cx=442, cy=284, s=1.1, fx=540, fy=770, e='io3')]
    pins = ''.join(f'''
    <div id="m-p-{k}" class="pin" data-layout-allow-occlusion><div class="dot"></div><div class="plab" data-layout-allow-occlusion>{lab}</div></div>''' for k, lab in
                   [('yakima', 'YAKIMA'), ('spokane', 'SPOKANE'), ('yellowstone', 'YELLOWSTONE'), ('denver', 'DENVER')])
    words = lambda s: ' '.join(f'<span class="w">{w}</span>' for w in s.split())
    bhtml = ''.join(f'''
      <div id="m-b{i}" class="beat"><div class="hl">{words(b[1])}</div><div class="hs">{words(b[2])}</div></div>''' for i, b in enumerate(beats))
    bhtml += f'''
      <div id="m-b{len(beats)}" class="beat"><div class="hl"><span class="w">ash</span> <span class="w">in</span> <span class="w big11"><span id="m-n">0</span></span> <span class="w">states</span></div>
        <div class="hs">{words('as far as Minnesota and Oklahoma')}</div></div>'''
    body = f"""
    <div id="m-wrap" class="mapw">
      <svg width="884" height="570" viewBox="0 0 883.85 569.144">
        <defs><radialGradient id="m-soft"><stop offset="0.8" stop-color="#fff" /><stop offset="1" stop-color="#000" /></radialGradient>
          <mask id="m-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1400" height="1000"><circle id="m-front" cx="{v[0]}" cy="{v[1]}" r="4" fill="url(#m-soft)" /></mask></defs>
{st}
        <g mask="url(#m-mask)">
{ash_p}
        </g>
      </svg>
    </div>
    <div id="m-v" class="pin" style="opacity:1"><div id="m-shock" class="shock"></div><div class="vt"></div></div>{pins}
    <div class="scrimT"></div><div class="scrimB"></div>
    <div id="m-tag" class="tag" style="top:206px; left:auto; right:60px">Graphic · USGS data</div>
    <div class="head">{bhtml}
    </div>"""
    js = EASE_JS + f"""
      const wrap = document.getElementById("m-wrap"), front = document.getElementById("m-front");
      const CAM = {J(cam)}, RF = {J(R)}, P = {J(P)};
      const pinEls = {{ v: "volc", yakima: "yakima", spokane: "spokane", yellowstone: "yellowstone", denver: "denver" }};
      function render(t) {{
        const c = camAt(CAM, t); applyCam(wrap, c);
        front.setAttribute("r", kf(RF, t, "r").toFixed(2));
        for (const [id, k] of Object.entries(pinEls)) {{
          const q = toFrame(c, P[k][0], P[k][1]), el = document.getElementById(id === "v" ? "m-v" : "m-p-" + id);
          el.style.transform = `translate(${{q[0].toFixed(1)}}px, ${{q[1].toFixed(1)}}px)`;
        }}
        const n = document.getElementById("m-n"), nv = String(Math.round(clamp((t - 5.95) / 1.1, 0, 1) * 11)); if (n.textContent !== nv) n.textContent = nv;
      }}
      // the eruption shock ring on entry
      tl.fromTo("#m-shock", {{ scale: 1, opacity: 1 }}, {{ scale: 9, opacity: 0, duration: 0.9, ease: "power2.out" }}, 0.0);
      // pins: pop exactly when the ash front reaches them
      const BT = {J([b[0] for b in beats])}, BK = {J([b[3] for b in beats])};
      BK.forEach((k, i) => {{
        tl.set("#m-p-" + k, {{ opacity: 1 }}, BT[i] - 0.05);
        tl.fromTo("#m-p-" + k + " .dot", {{ scale: 2.2 }}, {{ scale: 1, duration: 0.35, ease: "back.out(1.7)" }}, BT[i] - 0.05);
        tl.fromTo("#m-p-" + k + " .plab", {{ x: 40, opacity: 0 }}, {{ x: 0, opacity: 1, duration: 0.25, ease: "power4.out" }}, BT[i]);
      }});
      // headline beats: waterfall entry, then a waterfall cut to the LEFT into the next beat
      const starts = BT.concat([5.95]);
      starts.forEach((at, i) => {{
        const ws = document.querySelectorAll("#m-b" + i + " .w");
        ws.forEach((w, j) => {{
          const ti = at + 0.05 * (1 - Math.pow(0.84, j)) / 0.16;
          if (i === 0) {{ tl.set(w, {{ opacity: 1 }}, ti); tl.fromTo(w, {{ y: 60 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, ti); }}
          else tl.fromTo(w, {{ x: 230, opacity: 0.35 }}, {{ x: 0, opacity: 1, duration: 0.3, ease: "power4.out", immediateRender: false }}, ti);
          if (i < starts.length - 1) {{
            const out = starts[i + 1] - 0.34 + j * 0.022;
            tl.to(w, {{ x: -230, duration: 0.34, ease: "power4.in" }}, out);
            tl.to(w, {{ opacity: 0, duration: 0.18, ease: "none" }}, out);
          }}
        }});
        if (i > 0) tl.set(ws, {{ x: 230, opacity: 0 }}, 0);
      }});
      tl.fromTo("#m-n", {{ scale: 1 }}, {{ scale: 1.15, duration: 0.1, ease: "power2.out" }}, 7.05);
      tl.to("#m-n", {{ scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, 7.15);
      const st = {{ t: 0 }};
      tl.fromTo(st, {{ t: 0 }}, {{ t: {D_:.3f}, duration: {D_:.3f}, ease: "none", onUpdate: () => render(st.t) }}, 0);
      render(0);
"""
    return scene('map', MAP_CSS, body, js, D_)


# ---------------------------------------------------------------- globe (per-pixel orthographic, Natural Earth II relief)
GLOBE_JS = r"""
      const cv = document.getElementById("%P%-cv"), ctx = cv.getContext("2d"), im = document.getElementById("%P%-tex");
      const GW = cv.width, GH = cv.height, K = %KEYS%, PIN = %PIN%, BAND = %BAND%;
      let tex = null, TW = 0, TH = 0, img = null;
      const RAD = Math.PI / 180;
      function load() { if (tex) return true; if (!im.complete || !im.naturalWidth) return false;
        const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext("2d");
        x.drawImage(im, 0, 0); tex = x.getImageData(0, 0, c.width, c.height).data; TW = c.width; TH = c.height; img = ctx.createImageData(GW, GH); return true; }
      function gcam(t) { let a = K[0];
        if (t <= K[0].t) return a;
        for (let i = 1; i < K.length; i++) { const b = K[i]; if (t > b.t) { a = b; continue; }
          const u = EZ[b.e || 'io3']((t - a.t) / (b.t - a.t)); let dl = b.lon - a.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
          return { lon: a.lon + dl * u, lat: a.lat + (b.lat - a.lat) * u, r: Math.exp(Math.log(a.r) + (Math.log(b.r) - Math.log(a.r)) * u),
                   cx: a.cx + (b.cx - a.cx) * u, cy: a.cy + (b.cy - a.cy) * u, sw: (a.sw || 0) + ((b.sw || 0) - (a.sw || 0)) * u }; }
        return K[K.length - 1]; }
      function proj(c, lon, lat) { const l0 = c.lon * RAD, p0 = c.lat * RAD, l = lon * RAD, p = lat * RAD;
        const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
        return [c.cx + c.r * Math.cos(p) * Math.sin(l - l0), c.cy - c.r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0)), cosc]; }
      function draw(t) {
        if (!load()) return; const c = gcam(t), d = img.data; d.fill(0);
        const l0 = c.lon * RAD, p0 = c.lat * RAD, sp = Math.sin(p0), cp = Math.cos(p0);
        const Lx = -0.42, Ly = 0.48, Lz = 0.77;
        const x0 = Math.max(0, Math.floor(c.cx - c.r)), x1 = Math.min(GW, Math.ceil(c.cx + c.r)), y0 = Math.max(0, Math.floor(c.cy - c.r)), y1 = Math.min(GH, Math.ceil(c.cy + c.r));
        const sw = c.sw || 0, b0 = BAND ? BAND.lat0 : 0, b1 = BAND ? BAND.lat1 : 0, bs = BAND ? BAND.lon : 0;
        for (let py = y0; py < y1; py++) { const y = (c.cy - py) / c.r;
          for (let px = x0; px < x1; px++) { const x = (px - c.cx) / c.r, rr = x * x + y * y; if (rr >= 1) continue;
            const z = Math.sqrt(1 - rr), lat = Math.asin(y * cp + z * sp), lon = l0 + Math.atan2(x, z * cp - y * sp);
            let u = ((lon / RAD + 180) / 360) % 1; if (u < 0) u += 1; const v = (90 - lat / RAD) / 180;
            const fx = u * TW - 0.5, fy = Math.min(TH - 1.001, Math.max(0, v * TH - 0.5)), ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy;
            const i00 = (iy * TW + ((ix % TW) + TW) % TW) * 4, i10 = (iy * TW + (((ix + 1) % TW) + TW) % TW) * 4, i01 = i00 + TW * 4, i11 = i10 + TW * 4;
            const sh = 0.38 + 0.72 * Math.max(0, x * Lx + y * Ly + z * Lz), rim = Math.pow(1 - z, 3) * 0.85, o = (py * GW + px) * 4;
            let R = 0, G = 0, B = 0;
            for (let k = 0; k < 3; k++) { const s = (tex[i00 + k] * (1 - ax) + tex[i10 + k] * ax) * (1 - ay) + (tex[i01 + k] * (1 - ax) + tex[i11 + k] * ax) * ay;
              if (k === 0) R = s; else if (k === 1) G = s; else B = s; }
            if (sw > 0) { const la = lat / RAD; let dl = lon / RAD - bs; dl = ((dl % 360) + 360) % 360;
              if (la > b0 && la < b1 && dl < sw) { const e = Math.min(1, Math.min(la - b0, b1 - la) / 4) * 0.62 * Math.min(1, (sw - dl) / 25 + 0.35);
                R = R * (1 - e) + 255 * e; G = G * (1 - e) + 170 * e; B = B * (1 - e) + 60 * e; } }
            d[o] = Math.min(255, R * sh + 70 * rim); d[o + 1] = Math.min(255, G * sh + 130 * rim); d[o + 2] = Math.min(255, B * sh + 255 * rim); d[o + 3] = 255; } }
        ctx.clearRect(0, 0, GW, GH);
        const g = ctx.createRadialGradient(c.cx, c.cy, c.r * 0.98, c.cx, c.cy, c.r * 1.14); g.addColorStop(0, "rgba(110,170,255,.42)"); g.addColorStop(1, "rgba(110,170,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r * 1.14, 0, 7); ctx.fill();
        const tmp = document.createElement("canvas"); tmp.width = GW; tmp.height = GH; tmp.getContext("2d").putImageData(img, 0, 0); ctx.drawImage(tmp, 0, 0);
        if (PIN && t >= PIN.at) { const q = proj(c, PIN.lon, PIN.lat); if (q[2] > 0.05) { const u = Math.min(1, (t - PIN.at) / 0.35), s = 1 + 1.2 * (1 - u) * (1 - u);
          ctx.globalAlpha = u; ctx.fillStyle = "rgba(255,91,46,.3)"; ctx.beginPath(); ctx.arc(q[0], q[1], 30 * s, 0, 7); ctx.fill();
          ctx.fillStyle = "#FFF4DE"; ctx.beginPath(); ctx.arc(q[0], q[1], 13 * s, 0, 7); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = "#FF5B2E"; ctx.stroke();
          ctx.font = "900 36px Inter, sans-serif"; ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.lineWidth = 9; ctx.strokeStyle = "rgba(0,0,0,.75)";
          const lab = PIN.text, tx = q[0] + 34, ty = q[1]; ctx.strokeText(lab, tx, ty); ctx.fillStyle = "#FFF4DE"; ctx.fillText(lab, tx, ty); ctx.globalAlpha = 1; } }
      }
      const gst = { t: 0 };
      window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
      window.__hf.buildReady["%P%"] = new Promise((res) => { if (im.complete && im.naturalWidth) res(); else { im.onload = () => res(); im.onerror = () => res(); } }).then(() => draw(gst.t));
"""

GLOBE_CSS = """
  #root { background: radial-gradient(120% 80% at 50% 45%, #0B1630 0%, #04060C 70%); }
  .stars { position: absolute; inset: 0; }
  .cv { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
  .scrimB { position: absolute; left: 0; right: 0; bottom: 0; height: 760px; background: linear-gradient(0deg, rgba(4,6,12,.96) 0%, rgba(4,6,12,.85) 40%, rgba(4,6,12,0) 100%); }
  .head { position: absolute; left: 30px; right: 30px; top: 1010px; text-align: center; }
  .hl { font-family: "League Gothic", sans-serif; font-size: 136px; line-height: .9; text-transform: uppercase; color: #F5F1E8; }
  .hl .w { opacity: 0; margin: 0 .06em; }
  .acc { color: #FFB547; }
  .cta { position: absolute; left: 190px; width: 700px; top: 1262px; text-align: center; padding: 12px 0 10px; border-radius: 999px; background: #FFB547;
    color: #120C04; font: 900 36px Inter, sans-serif; letter-spacing: .14em; text-transform: uppercase; opacity: 0; }
"""


def stars(seed=7):
    import random
    rnd = random.Random(seed)
    return ', '.join(f'radial-gradient({rnd.choice([1, 1, 1.5, 2])}px {rnd.choice([1, 1, 1.5, 2])}px at {rnd.uniform(0, 100):.1f}% {rnd.uniform(0, 100):.1f}%, '
                     f'rgba(255,255,255,{rnd.uniform(.3, .9):.2f}), transparent)' for _ in range(90))


def globe_scene(p, dur, keys, pin, band, lines, tag, extra_js=''):
    words = lambda s: ' '.join(f'<span class="w{" acc" if w.startswith("*") else ""}">{w.strip("*")}</span>' for w in s.split())
    heads = ''.join(f'<div id="{p}-h{i}" class="hl" style="position:absolute; left:0; right:0; top:0">{"<br>".join(words(x) for x in L)}</div>'
                    for i, (at, L) in enumerate(lines))
    body = f"""
    <div class="stars" style="background:{stars()}"></div>
    <img id="{p}-tex" src="assets/world.jpg" alt="" style="position:absolute; width:2px; height:1px; opacity:0" />
    <canvas id="{p}-cv" class="cv" width="1080" height="1920"></canvas>
    <div class="scrimB"></div>
    <div class="tag" style="top:206px; left:auto; right:60px">{tag}</div>
    <div class="head">{heads}</div>{'<div id="' + p + '-cta" class="cta">Comment yes or no</div>' if extra_js else ''}"""
    js = EASE_JS + GLOBE_JS.replace('%P%', p).replace('%KEYS%', J(keys)).replace('%PIN%', J(pin)).replace('%BAND%', J(band)) + f"""
      const LT = {J([at for at, _ in lines])};
      LT.forEach((at, i) => {{
        const ws = document.querySelectorAll("#{p}-h" + i + " .w");
        ws.forEach((w, j) => {{
          const ti = at + 0.05 * (1 - Math.pow(0.84, j)) / 0.16;
          if (i === 0 && at <= 0.01) tl.set(w, {{ opacity: 1 }}, 0);               // frame 0 = the hook, already composed
          else if (i === 0) {{ tl.set(w, {{ opacity: 1 }}, ti); tl.fromTo(w, {{ y: 70 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, ti); }}
          else tl.fromTo(w, {{ x: 230, opacity: 0.35 }}, {{ x: 0, opacity: 1, duration: 0.3, ease: "power4.out", immediateRender: false }}, ti);
          if (i < LT.length - 1) {{ const out = LT[i + 1] - 0.34 + j * 0.022;
            tl.to(w, {{ x: -230, duration: 0.34, ease: "power4.in" }}, out); tl.to(w, {{ opacity: 0, duration: 0.18, ease: "none" }}, out); }}
        }});
        if (i > 0) tl.set(ws, {{ x: 230, opacity: 0 }}, 0);
      }});
{extra_js}
      tl.fromTo(gst, {{ t: 0 }}, {{ t: {dur:.3f}, duration: {dur:.3f}, ease: "none", onUpdate: () => draw(gst.t) }}, 0);
"""
    return scene(p, GLOBE_CSS, body, js, dur)


PHOTO_CSS = """
  #root { background: #08090B; }
  .scrimB { position: absolute; left: 0; right: 0; bottom: 0; height: 940px; background: linear-gradient(0deg, rgba(5,6,8,.98) 0%, rgba(5,6,8,.93) 50%, rgba(5,6,8,0) 100%); }
  .scrimT { position: absolute; left: 0; right: 0; top: 0; height: 520px; background: linear-gradient(180deg, rgba(5,6,8,.85), rgba(5,6,8,0)); }
  .eb { position: absolute; left: 0; right: 0; top: 1104px; text-align: center; font: 900 40px Inter, sans-serif; letter-spacing: .18em; color: #F5F1E8; opacity: 0; }
  .num { position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font-size: 190px; color: #FFB547; opacity: 0; white-space: nowrap; }
  .num small { font-size: 120px; color: #F5F1E8; }
"""


def photo_scene():
    dur = T_MAP - T_PHOTO + 0.05
    cam = [dict(t=0, cx=1497, cy=2700, s=0.56, fx=540, fy=760), dict(t=dur - 0.1, cx=1497, cy=1650, s=0.47, fx=540, fy=760, e='io2')]
    body = """
    <div id="p-cam" class="stage" style="background:#1B1D22"><img id="p-ph" class="ph" src="assets/erupt.jpg" alt="" style="width:2994px; height:4500px" /></div>
    <div class="scrimT"></div><div class="scrimB"></div>
    <div class="tag" style="top:206px; left:auto; right:60px">Real photo · USGS</div>
    <div id="p-eb" class="eb">ASH COLUMN</div>
    <div id="p-num" class="num gothic"><span id="p-v">0</span> <small>FT HIGH</small></div>"""
    js = EASE_JS + f"""
      const ph = document.getElementById("p-ph"), CAM = {J(cam)};
      function render(t) {{ applyCam(ph, camAt(CAM, t));
        const v = Math.round(80000 * EZ.io2(clamp((t - 0.35) / 2.3, 0, 1)) / 1000) * 1000, s = v.toLocaleString("en-US");
        const el = document.getElementById("p-v"); if (el.textContent !== s) el.textContent = s; }}
      tl.set("#p-eb", {{ opacity: 1 }}, 0.25); tl.fromTo("#p-eb", {{ y: 50 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, 0.25);
      tl.set("#p-num", {{ opacity: 1 }}, 0.35); tl.fromTo("#p-num", {{ y: 80 }}, {{ y: 0, duration: 0.24, ease: "power4.out" }}, 0.35);
      tl.fromTo("#p-num", {{ scale: 1 }}, {{ scale: 1.08, duration: 0.1, ease: "power2.out", immediateRender: false }}, 2.65);
      tl.to("#p-num", {{ scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, 2.76);
      const st = {{ t: 0 }};
      tl.fromTo(st, {{ t: 0 }}, {{ t: {dur:.3f}, duration: {dur:.3f}, ease: "none", onUpdate: () => render(st.t) }}, 0);
      render(0);
"""
    return scene('photo', PHOTO_CSS, body, js, dur)


HUD_CSS = """
  #root { background: transparent; pointer-events: none; }
  .hd { position: absolute; left: 60px; top: 192px; height: 46px; overflow: hidden; font: 900 38px/46px Inter, sans-serif; letter-spacing: .16em; color: #F5F1E8;
    text-shadow: 0 3px 16px rgba(0,0,0,.8); width: 900px; }
  .hc { position: absolute; left: 54px; top: 236px; height: 128px; overflow: hidden; width: 900px; }
  .roll { position: absolute; left: 0; top: 0; white-space: nowrap; }
  .hc .roll { font-family: "League Gothic", sans-serif; font-size: 128px; line-height: 128px; color: #FFB547; text-shadow: 0 6px 26px rgba(0,0,0,.7); }
"""

HUD_STATES = [  # (master time, date line, clock line)
    (0.0, 'MAY 18, 1980', '8:32 AM'),
    (T_MAP + 0.55, 'MAY 18, 1980', '9:45 AM'),
    (T_MAP + 1.95, 'MAY 18, 1980', '11:45 AM'),
    (T_MAP + 3.35, 'MAY 18, 1980', '10:15 PM'),
    (T_MAP + 4.75, 'MAY 19, 1980', 'NEXT DAY'),
    (T_GLOBE2 + 1.0, 'WITHIN ABOUT', '2 WEEKS'),
]


def hud():
    dl, cl = [], []
    for i, (at, d, c) in enumerate(HUD_STATES):
        dl.append(f'<div id="h-d{i}" class="roll" data-layout-allow-overlap>{d}</div>'); cl.append(f'<div id="h-c{i}" class="roll" data-layout-allow-overlap>{c}</div>')
    body = f"""
    <div class="hd">{''.join(dl)}</div>
    <div class="hc">{''.join(cl)}</div>"""
    js = ''
    for i, (at, d, c) in enumerate(HUD_STATES):
        for kind, txt, hgt in (('c', c, 128), ('d', d, 46)):
            if kind == 'd' and i and HUD_STATES[i - 1][1] == d:
                js += f'      tl.set("#h-d{i}", {{ opacity: 0 }}, 0);\n'; continue
            if i == 0: js += f'      tl.set("#h-{kind}0", {{ y: 0, opacity: 1 }}, 0);\n'
            else:
                js += f'      tl.fromTo("#h-{kind}{i}", {{ y: {hgt}, opacity: 1 }}, {{ y: 0, duration: 0.3, ease: "power4.out", immediateRender: false }}, {at:.3f});\n'
                js += f'      tl.set("#h-{kind}{i}", {{ y: {hgt} }}, 0);\n'
            # the previous visible line of the same kind rolls up and out
            nxt = next((HUD_STATES[j][0] for j in range(i + 1, len(HUD_STATES))
                        if kind == 'c' or HUD_STATES[j][1] != HUD_STATES[j - 1][1]), None)
            if nxt is not None:
                js += f'      tl.to("#h-{kind}{i}", {{ y: {-hgt}, duration: 0.26, ease: "power3.in" }}, {nxt - 0.26:.3f});\n'
    return scene('hud', HUD_CSS, body, js, DUR)


def build():
    prep()
    files = {}
    # globe 1: Atlantic view → dive onto the volcano; the push accelerates into the zoom-through seam
    g1 = T_PHOTO - T_GLOBE + 0.05
    keys1 = [dict(t=0, lon=-78, lat=28, r=470, cx=540, cy=800),
             dict(t=2.35, lon=VOLC[0], lat=VOLC[1], r=2300, cx=540, cy=760, e='io3'),
             dict(t=g1, lon=VOLC[0], lat=VOLC[1], r=3600, cx=540, cy=760, e='i3')]
    files['compositions/globe.html'] = globe_scene('globe', g1, keys1, dict(lon=VOLC[0], lat=VOLC[1], at=1.55, text='MOUNT ST. HELENS'), None,
                                                    [(0.0, ['The day a', '*mountain *exploded'])], 'Graphic · Natural Earth')
    files['compositions/photo.html'] = photo_scene()
    files['compositions/map.html'] = map_scene()
    # globe 2: arrives oversized (pull), then turns east while the ash band wraps the planet
    g2 = DUR - T_GLOBE2
    keys2 = [dict(t=0, lon=-112, lat=40, r=620, cx=540, cy=860, sw=0),
             dict(t=0.6, lon=-112, lat=40, r=580, cx=540, cy=860, sw=40, e='o3'),
             dict(t=2.5, lon=40, lat=42, r=540, cx=540, cy=860, sw=362, e='io2'),
             dict(t=g2, lon=70, lat=42, r=540, cx=540, cy=860, sw=362, e='o3')]
    cta = '''
      tl.set("#globe2-cta", { opacity: 1 }, 2.25); tl.fromTo("#globe2-cta", { y: 60 }, { y: 0, duration: 0.22, ease: "power4.out" }, 2.25);'''
    files['compositions/globe2.html'] = globe_scene('globe2', g2, keys2, None, dict(lat0=36, lat1=56, lon=VOLC[0]),
                                                     [(0.25, ['Ash circled', 'the *globe']), (1.75, ['Would you live', 'near a *volcano?'])],
                                                     'Graphic · illustrative', cta)
    files['compositions/hud.html'] = hud()
    files['index.html'] = index('Where the ash went', DUR, [
        ('globe', T_GLOBE, g1, 1), ('photo', T_PHOTO, T_MAP - T_PHOTO + 0.05, 2), ('map', T_MAP, T_GLOBE2 - T_MAP + 0.05, 3),
        ('globe2', T_GLOBE2, g2, 4), ('hud', 0, DUR, 10)], bg='#04060C')
    ledger = dict(fps=30, seams=[
        dict(id='globe→photo', cut=T_PHOTO, technique='zoom-through (push deeper)', exit=dict(selector='#globe', axis='z', dir=1),
             entry=dict(selector='#photo', axis='z', dir=1)),
        dict(id='photo→map', cut=T_MAP, technique='zoom-through (push deeper)', exit=dict(selector='#photo', axis='z', dir=1),
             entry=dict(selector='#map', axis='z', dir=1)),
        dict(id='map→globe2', cut=T_GLOBE2, technique='inverse zoom-through (arrival: the whole planet)',
             exit=dict(selector='#map', axis='z', dir=-1), entry=dict(selector='#globe2', axis='z', dir=-1)),
    ])
    write_project(D, files, ledger)
    open(os.path.join(D, 'CREDITS.md'), 'w').write('# E map — media\n' + credits(['msh_erupt', 'ashmapsvg']) +
                                                    '\n- Globe texture: Natural Earth II shaded relief (public domain), repo assets/earth/world.jpg\n')
    print('E built', DUR)


if __name__ == '__main__':
    build()
