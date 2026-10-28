#!/usr/bin/env python3
"""Zack-D-style prototype 1 — AI stills (SDXL-Lightning) animated in HyperFrames.

    .venv/bin/python proto/zack_ai/build.py      → proto/zack_ai/index.html + ledger.json (+ assets/ layers, fonts)

Inputs (gitignored, in proto/zack_ai/assets/): gen/<id>_<seed>.png + _depth.png (workflow zack-images),
vo.wav + vo.words.json (voice.py). Layers come from prep.py (depth split → bg.jpg + fg.png).

Grammar (motion-doctrine): one current = LEFT (camera whips left across every ordinary cut, mirrored power4 in/out,
hard cut, no dissolve); Z push = going deeper (into the tank, into the syrup); Z pull = arrival (decades later).
Inside every shot the camera never rests: slow push/pan on the rig + extra parallax on the depth foreground.
Captions: tiny centred white 1-3 word groups from the Whisper word timings. No title cards, no labels — only
scale bars drawn into the scene."""
import json, os, random, re, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
A = os.path.join(HERE, 'assets')
W, H = 1080, 1920
J = json.dumps
WORDS = json.load(open(f'{A}/vo.words.json'))


def t(word, k=1):
    """start of the k-th spoken occurrence of word (case/punctuation-insensitive)"""
    n = 0
    for w in WORDS:
        if re.sub(r'[^a-z-]', '', w['w'].lower()) == word.lower():
            n += 1
            if n == k: return w['s']
    raise KeyError(word)


END = WORDS[-1]['e'] + 0.75

# ---------------------------------------------------------------- shot list
# img: <shot>_<seed>; move: rig camera path; seam: how this shot is ENTERED (left / push / pull); fx: overlays
SHOTS = [
    dict(img='s16_29', at=0.0, move=('push', 1.10, 1.22, 0, 0, 0, -40), fx=[]),
    dict(img='s16_11', at=t('and') - 0.04, move=('push', 1.18, 1.26, 0, 0, 0, 0), fx=['shake']),
    dict(img='s01_11', at=t('rivets') - 0.04, move=('push', 1.12, 1.30, 0, 0, 0, 0), fx=['rivets']),
    dict(img='s02_11', at=t('steel') - 0.1, move=('tilt', 1.16, 1.20, 0, 0, 120, -120), fx=['scale50']),
    dict(img='s15_11', at=t('splits') - 0.04, seam='push', move=('push', 1.12, 1.26, 0, 0, 0, 30), fx=['shake']),
    dict(img='s03_11', at=t('two') - 0.06, move=('pan', 1.20, 1.26, 60, -60, 0, 0), fx=['drops']),
    dict(img='s04_11', at=t('brown') - 0.1, move=('tilt', 1.14, 1.20, 0, 0, 90, -90), fx=['scale25']),
    dict(img='s05_11', at=t('rolls') - 0.04, move=('push', 1.10, 1.34, 0, 0, 0, 0), fx=['speed']),
    dict(img='s13_11', at=t('it') - 0.04, move=('pan', 1.18, 1.24, 70, -70, 0, 0), fx=['drops']),
    dict(img='s06_11', at=t('knocks') - 0.04, move=('push', 1.14, 1.26, 0, 0, 0, 0), fx=['shake']),
    dict(img='s08_11', at=t('then') - 0.04, seam='push', move=('push', 1.10, 1.28, 0, 0, 0, 0), fx=['frost']),
    dict(img='s09_11', at=t('and', 4) - 0.04, move=('push', 1.14, 1.24, 0, 0, 0, 0), fx=['frost']),
    dict(img='s10_11', at=t('the', 7) - 0.04, move=('pan', 1.18, 1.24, -60, 60, 0, 0), fx=['frost']),
    dict(img='s11_11', at=t('rescuers') - 0.04, move=('push', 1.12, 1.24, 0, 0, 0, 0), fx=[]),
    dict(img='s12_11', at=t('twenty', 2) - 0.04, move=('pullback', 1.30, 1.16, 0, 0, 0, 0), fx=[]),
    dict(img='s14_11', at=t('and', 5) - 0.04, seam='pull', move=('push', 1.14, 1.26, 0, 0, 0, 0), fx=['smell']),
    dict(img='s14_29', at=t('the', 8) - 0.04, move=('pan', 1.18, 1.24, 60, -60, 0, 0), fx=['smell']),
    dict(img='s07_11', at=t('could') - 0.04, move=('push', 1.12, 1.24, 0, 0, 0, 0), fx=['drops']),
]
for i, s in enumerate(SHOTS):
    s['end'] = SHOTS[i + 1]['at'] if i + 1 < len(SHOTS) else END
    s.setdefault('seam', 'left')

# ---------------------------------------------------------------- captions: 1-3 words, break on punctuation, digits for numbers
PHRASES = [(['nineteen', 'nineteen'], '1919'), (['two', 'point', 'three', 'million'], '2.3 million'), (['fifty'], '50'),
           (['twenty-five'], '25'), (['thirty-five'], '35'), (['twenty-one'], '21')]


def caption_groups():
    toks = []
    for w in WORDS:                      # merge Whisper's hyphen fragments ("twenty" + "-five")
        if w['w'].startswith('-') and toks: toks[-1]['w'] += w['w']; toks[-1]['e'] = w['e']
        else: toks.append(dict(w))
    key = lambda w: re.sub(r'[^a-z-]', '', w['w'].lower())
    out, i = [], 0
    while i < len(toks):
        for ph, rep in PHRASES:
            if [key(x) for x in toks[i:i + len(ph)]] == ph:
                last = toks[i + len(ph) - 1]
                out.append(dict(w=rep + re.sub(r'^.*?([.,?!]*)$', r'\1', last['w']), s=toks[i]['s'], e=last['e'], num=1)); i += len(ph); break
        else:
            out.append(toks[i]); i += 1
    phrases, cur = [], []                 # phrases end at punctuation, then balanced chunks of <= 3 words / ~20 chars
    for w in out:
        cur.append(w)
        if re.search(r'[.,?!]$', w['w']): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    groups = []
    for p in phrases:
        n = max(-(-len(p) // 3), -(-len(' '.join(x['w'] for x in p)) // 20))
        n = min(n, len(p)); base, extra = divmod(len(p), n); k = 0
        for j in range(n):
            m = base + (1 if j < extra else 0); groups.append(p[k:k + m]); k += m
    return [dict(s=g[0]['s'], e=g[-1]['e'], txt=' '.join(x['w'] for x in g).rstrip(',.')) for g in groups]


# ---------------------------------------------------------------- overlays (seeded, deterministic)
def fx_html(i, s):
    rnd = random.Random(1000 + i); h = []; js = []
    a, b = s['at'], s['end']
    for f in s['fx']:
        if f == 'rivets':          # machine-gun rivets flying at the camera
            for k in range(12):
                tt = t('rivets') + 0.05 + k * 0.12
                if tt > b - 0.15: break
                x0, y0 = 300 + rnd.random() * 480, 700 + rnd.random() * 600
                ang = rnd.uniform(0, 6.283); dist = rnd.uniform(500, 900)
                import math
                x1, y1 = x0 + math.cos(ang) * dist, y0 + math.sin(ang) * dist
                h.append(f'<div id="rv{i}_{k}" class="rivet" style="left:{x0:.0f}px; top:{y0:.0f}px"></div>')
                js.append(f'tl.fromTo("#rv{i}_{k}", {{opacity: 1, scale: 0.4, x: 0, y: 0}}, {{scale: 4.2, x: {x1 - x0:.0f}, y: {y1 - y0:.0f}, duration: 0.32, ease: "power2.in", immediateRender: false}}, {tt:.3f});')
                js.append(f'tl.set("#rv{i}_{k}", {{opacity: 0}}, {tt + 0.32:.3f});')
        if f == 'drops':           # molasses blobs flung through the frame
            for k in range(14):
                tt = a + 0.05 + rnd.random() * max(0.2, (b - a) - 0.7)
                x0 = rnd.uniform(-60, 1080); y0 = rnd.uniform(1300, 1900); sz = rnd.uniform(26, 90)
                dx, dy = rnd.uniform(-260, 260), -rnd.uniform(700, 1300)
                h.append(f'<div id="dr{i}_{k}" class="drop" style="left:{x0:.0f}px; top:{y0:.0f}px; width:{sz:.0f}px; height:{sz * 1.15:.0f}px"></div>')
                js.append(f'tl.fromTo("#dr{i}_{k}", {{opacity: 1, x: 0, y: 0, rotation: 0}}, {{x: {dx:.0f}, y: {dy:.0f}, rotation: {rnd.uniform(-90, 90):.0f}, duration: 0.9, ease: "power1.out", immediateRender: false}}, {tt:.3f});')
                js.append(f'tl.to("#dr{i}_{k}", {{y: {dy + 500:.0f}, duration: 0.6, ease: "power2.in"}}, {tt + 0.9:.3f});')
        if f == 'speed':           # radial speed streaks rushing past the lens
            for k in range(26):
                ang = rnd.uniform(0, 360); tt = a + rnd.random() * max(0.2, (b - a) - 0.5)
                h.append(f'<div id="sp{i}_{k}" class="streak" style="transform: rotate({ang:.0f}deg)"><i id="spi{i}_{k}"></i></div>')
                js.append(f'tl.fromTo("#spi{i}_{k}", {{x: 140, opacity: 0.0, scaleX: 0.3}}, {{x: 900, opacity: 0.85, scaleX: 1.6, duration: 0.42, ease: "power2.in", immediateRender: false}}, {tt:.3f});')
                js.append(f'tl.set("#spi{i}_{k}", {{opacity: 0}}, {tt + 0.42:.3f});')
        if f == 'frost':           # cold: ice crystals drifting + frosty vignette creeping in
            h.append(f'<div id="fr{i}" class="frost"></div>')
            js.append(f'tl.fromTo("#fr{i}", {{opacity: 0}}, {{opacity: 1, duration: {b - a:.2f}, ease: "none", immediateRender: false}}, {a:.3f});')
            for k in range(30):
                x0, y0 = rnd.uniform(0, 1080), rnd.uniform(0, 1920); sz = rnd.uniform(4, 12)
                h.append(f'<div id="fz{i}_{k}" class="flake" style="left:{x0:.0f}px; top:{y0:.0f}px; width:{sz:.0f}px; height:{sz:.0f}px"></div>')
                js.append(f'tl.fromTo("#fz{i}_{k}", {{x: 0, y: 0}}, {{x: {rnd.uniform(-120, 120):.0f}, y: {rnd.uniform(80, 260):.0f}, duration: {b - a:.2f}, ease: "none", immediateRender: false}}, {a:.3f});')
        if f == 'smell':           # golden smell waves rising off the street
            for k in range(3):
                x = 250 + k * 260
                h.append(f'<svg id="sm{i}_{k}" class="smell" style="left:{x}px" viewBox="0 0 120 900"><path pathLength="1" d="M60 900 C 0 780, 120 690, 60 570 S 0 360, 60 240 S 120 60, 60 0"/></svg>')
                js.append(f'tl.fromTo("#sm{i}_{k} path", {{strokeDashoffset: 1}}, {{strokeDashoffset: 0, duration: 1.3, ease: "power2.out", immediateRender: false}}, {a + 0.25 + k * 0.22:.3f});')
                js.append(f'tl.fromTo("#sm{i}_{k}", {{y: 120}}, {{y: -160, duration: {b - a - 0.2:.2f}, ease: "none", immediateRender: false}}, {a + 0.2:.3f});')
        if f.startswith('scale'):  # scale bar drawn into the scene (grows with the narration)
            ft = f[5:]; g = SCALEBAR[s['img'].split('_')[0]]
            x, y0, y1 = g
            h.append(f'<div id="sb{i}" class="sbar" style="left:{x}px; top:{y1}px; height:{y0 - y1}px"><b></b><em id="sbl{i}">{ft} ft</em></div>')
            tw = t('fifty') if ft == '50' else t('twenty')
            js.append(f'tl.fromTo("#sb{i}", {{scaleY: 0}}, {{scaleY: 1, duration: 0.5, ease: "power3.out", immediateRender: false}}, {tw - 0.1:.3f});')
            js.append(f'tl.fromTo("#sbl{i}", {{opacity: 0, x: -14}}, {{opacity: 1, x: 0, duration: 0.2, ease: "power3.out", immediateRender: false}}, {tw + 0.25:.3f});')
        if f == 'shake':
            pass
    return '\n'.join('          ' + x for x in h), js


# scale bars in IMAGE pixels of the 1080x1920 frame (x, bottom y, top y) — set after looking at the stills
SCALEBAR = json.load(open(f'{HERE}/scalebars.json')) if os.path.exists(f'{HERE}/scalebars.json') else {
    's02': [880, 1560, 420], 's04': [860, 1500, 380]}


def shake_js(sel, a, b, amp, seed):
    rnd = random.Random(seed); out = []; tt = a; k = 0
    while tt < b - 0.05:
        fall = 1 - 0.5 * (tt - a) / max(0.01, b - a)
        out.append(f'tl.to("{sel}", {{x: {rnd.uniform(-amp, amp) * fall:.1f}, y: {rnd.uniform(-amp, amp) * fall:.1f}, rotation: {rnd.uniform(-0.6, 0.6) * fall:.2f}, duration: 0.05, ease: "sine.inOut"}}, {tt:.3f});')
        tt += 0.05; k += 1
    out.append(f'tl.to("{sel}", {{x: 0, y: 0, rotation: 0, duration: 0.08}}, {tt:.3f});')
    return out


# ---------------------------------------------------------------- build
def main():
    os.makedirs(f'{A}/layers', exist_ok=True); os.makedirs(f'{A}/fonts', exist_ok=True)
    need = [s['img'] for s in SHOTS if not os.path.exists(f'{A}/layers/{s["img"]}_fg.png')]
    if need:
        subprocess.run([f'{REPO}/.venv/bin/python', f'{HERE}/prep.py', f'{A}/gen', f'{A}/layers', *sorted(set(need))], check=True)
    for f in ('Inter-800.woff2', 'Inter-800-ext.woff2'):
        shutil.copy(f'{REPO}/fonts/{f}', f'{A}/fonts/{f}')

    shots_html, js = [], []
    ledger = []
    D = 0.3; TRAV = 130
    for i, s in enumerate(SHOTS):
        a, b = s['at'], s['end']; key = s['img']
        fxh, fxj = fx_html(i, s)
        shots_html.append(f'''      <div id="sh{i}" class="clip shot" data-start="{a:.3f}" data-duration="{b - a:.3f}" data-track-index="{1 + i % 2}" data-track-kind="graphics" style="z-index:{1 + i % 2}">
        <div id="c{i}" class="cam"><div id="k{i}" class="shk"><div id="r{i}" class="rig">
          <img id="b{i}" class="bg" src="assets/layers/{key}_bg.jpg" alt="" />
          <img id="f{i}" class="fg" src="assets/layers/{key}_fg.png" alt="" />
{fxh}
        </div></div></div>
      </div>''')
        mv, s0, s1, x0, x1, y0, y1 = s['move']
        js.append(f'// shot {i} {key} [{a:.2f}–{b:.2f}] {mv}, enter {s["seam"]}')
        js.append(f'tl.fromTo("#r{i}", {{scale: {s0}, x: {x0}, y: {y0}}}, {{scale: {s1}, x: {x1}, y: {y1}, duration: {b - a:.3f}, ease: "none"}}, {a:.3f});')
        # depth parallax: the near layer travels further than the far one
        fs = 1.045 if mv != 'pullback' else 0.95
        js.append(f'tl.fromTo("#f{i}", {{scale: 1, x: 0, y: 0}}, {{scale: {fs}, x: {(x1 - x0) * 0.35:.0f}, y: {(y1 - y0) * 0.35 + 18:.0f}, duration: {b - a:.3f}, ease: "none"}}, {a:.3f});')
        # entry (matched to the previous exit)
        if i > 0:
            if s['seam'] == 'left':
                js.append(f'tl.fromTo("#c{i}", {{x: {TRAV}, scale: 1, filter: "blur(9px)"}}, {{x: 0, filter: "blur(0px)", duration: {D}, ease: "power4.out", immediateRender: false}}, {a:.3f});')
            elif s['seam'] == 'push':
                js.append(f'tl.fromTo("#c{i}", {{x: 0, scale: 0.84, filter: "blur(18px)"}}, {{scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out", immediateRender: false}}, {a:.3f});')
            else:
                js.append(f'tl.fromTo("#c{i}", {{x: 0, scale: 1.25, filter: "blur(18px)"}}, {{scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out", immediateRender: false}}, {a:.3f});')
            prev = SHOTS[i - 1]
            ax = {'left': 'x', 'push': 'z', 'pull': 'z'}[s['seam']]; dr = {'left': -1, 'push': 1, 'pull': -1}[s['seam']]
            ledger.append(dict(id=f'{prev["img"]}→{key}', cut=round(a, 3), technique={'left': 'cut-the-curve LEFT (camera whip)', 'push': 'zoom-through (deeper)', 'pull': 'inverse zoom-through (arrival)'}[s['seam']],
                               exit=dict(selector=f'#c{i - 1}', axis=ax, dir=dr), entry=dict(selector=f'#c{i}', axis=ax, dir=dr)))
        # exit (matched to the next entry)
        if i + 1 < len(SHOTS):
            nx = SHOTS[i + 1]['seam']
            if nx == 'left':
                js.append(f'tl.to("#c{i}", {{x: {-TRAV}, filter: "blur(9px)", duration: {D}, ease: "power4.in"}}, {b - D:.3f});')
            elif nx == 'push':
                js.append(f'tl.to("#c{i}", {{scale: 1.2, filter: "blur(18px)", duration: 0.21, ease: "power3.in"}}, {b - 0.21:.3f});')
            else:
                js.append(f'tl.to("#c{i}", {{scale: 0.86, filter: "blur(18px)", duration: 0.21, ease: "power3.in"}}, {b - 0.21:.3f});')
        if 'shake' in s['fx']:
            js += shake_js(f'#k{i}', a, min(b, a + 1.6), 16, 77 + i)
        if 'rivets' in s['fx'] or 'scale50' in s['fx']:
            js += shake_js(f'#k{i}', a + 0.05, b - 0.3, 7, 91 + i)
        js += fxj

    caps = caption_groups()
    cap_html = []
    for j, g in enumerate(caps):
        nxt = caps[j + 1]['s'] if j + 1 < len(caps) else END
        off = min(nxt, g['e'] + 0.5)
        cap_html.append(f'        <div id="cp{j}" class="cap">{g["txt"]}</div>')
        js.append(f'tl.set("#cp{j}", {{opacity: 1}}, {g["s"]:.3f}); tl.fromTo("#cp{j}", {{scale: 0.86}}, {{scale: 1, duration: 0.12, ease: "back.out(1.6)", immediateRender: false}}, {g["s"]:.3f}); tl.set("#cp{j}", {{opacity: 0}}, {off:.3f});')

    html = f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <title>Molasses flood (Zack-style AI probe)</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face {{ font-family: "Inter"; font-weight: 800; src: url("assets/fonts/Inter-800.woff2") format("woff2"); }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: {W}px; height: {H}px; overflow: hidden; background: #000; }}
      #main {{ position: relative; width: {W}px; height: {H}px; overflow: hidden; background: #000; }}
      .shot {{ position: absolute; inset: 0; overflow: hidden; background: #000; }}
      .cam, .shk, .rig {{ position: absolute; inset: 0; transform-origin: 50% 50%; }}
      .bg, .fg {{ position: absolute; left: -5px; top: -1px; width: 1091px; height: 1922px; object-fit: cover; }}
      .fg {{ transform-origin: 50% 85%; }}
      .rivet {{ position: absolute; width: 26px; height: 26px; margin: -13px; border-radius: 50%; opacity: 0;
        background: radial-gradient(circle at 35% 30%, #fff 0, #b9bcc2 22%, #4b4f57 70%, #1d1f24 100%); box-shadow: 0 0 12px rgba(255,190,90,.7); }}
      .drop {{ position: absolute; border-radius: 50% 50% 46% 54% / 58% 58% 42% 42%; opacity: 0;
        background: radial-gradient(circle at 34% 28%, rgba(255,214,150,.95) 0, #8a4512 18%, #3a1604 62%, #1a0700 100%); box-shadow: 0 8px 18px rgba(0,0,0,.45); }}
      .streak {{ position: absolute; left: 540px; top: 960px; width: 0; height: 0; }}
      .streak i {{ position: absolute; left: 0; top: -2px; width: 220px; height: 4px; border-radius: 4px; opacity: 0; transform-origin: 0 50%;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.9)); }}
      .frost {{ position: absolute; inset: 0; opacity: 0; background: radial-gradient(ellipse at 50% 45%, rgba(200,230,255,0) 45%, rgba(210,235,255,.42) 85%, rgba(235,248,255,.7) 100%); }}
      .flake {{ position: absolute; border-radius: 50%; background: rgba(240,250,255,.85); box-shadow: 0 0 8px rgba(220,240,255,.9); }}
      .smell {{ position: absolute; top: 520px; width: 120px; height: 900px; overflow: visible; }}
      .smell path {{ fill: none; stroke: rgba(255,214,120,.85); stroke-width: 9; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1;
        filter: drop-shadow(0 0 10px rgba(255,190,60,.9)); }}
      .sbar {{ position: absolute; width: 0; transform-origin: 50% 100%; }}
      .sbar b {{ position: absolute; left: -3px; top: 0; bottom: 0; width: 6px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,.6); }}
      .sbar b::before, .sbar b::after {{ content: ""; position: absolute; left: -15px; width: 36px; height: 6px; background: #fff; }}
      .sbar b::before {{ top: 0; }} .sbar b::after {{ bottom: 0; }}
      .sbar em {{ position: absolute; left: -190px; top: 46%; width: 160px; text-align: right; font: 800 46px Inter, sans-serif; font-style: normal; color: #fff;
        text-shadow: 0 0 6px #000, 0 3px 12px rgba(0,0,0,.8); white-space: nowrap; opacity: 0; }}
      #caps {{ position: absolute; inset: 0; z-index: 50; pointer-events: none; }}
      .cap {{ position: absolute; left: 90px; right: 90px; top: 1180px; text-align: center; opacity: 0; transform-origin: 50% 50%;
        font: 800 66px/1.1 Inter, sans-serif; color: #fff; letter-spacing: -0.01em;
        text-shadow: 0 0 3px #000, 0 0 3px #000, 0 2px 4px #000, 0 4px 18px rgba(0,0,0,.75); }}
    </style>
  </head>
  <body>
    <div id="main" data-composition-id="main" data-start="0" data-duration="{END:.2f}" data-width="{W}" data-height="{H}" data-fps="30">
{chr(10).join(shots_html)}
      <div id="caps" class="clip" data-start="0" data-duration="{END:.2f}" data-track-index="5" data-track-kind="captions">
{chr(10).join(cap_html)}
      </div>
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
{chr(10).join('      ' + x for x in js)}
      tl.set({{}}, {{}}, {END:.2f});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
    open(f'{HERE}/index.html', 'w').write(html)
    json.dump(dict(fps=30, seams=ledger), open(f'{HERE}/ledger.json', 'w'), indent=1, ensure_ascii=False)
    open(f'{HERE}/hyperframes.json', 'w').write('{"name": "zack_ai"}')
    # sound cues for mix.py (whoosh on every whip cut, impacts on visible actions)
    cues = dict(end=END, whoosh=[s['at'] for s in SHOTS[1:] if s['seam'] == 'left'], zoom=[s['at'] for s in SHOTS[1:] if s['seam'] != 'left'],
                rivets=[t('rivets') + 0.05 + k * 0.12 for k in range(12) if t('rivets') + 0.05 + k * 0.12 < SHOTS[3]['at'] - 0.15],
                rumble=[t('and') - 0.1, t('splits') + 0.3], boom=[t('splits')], roar=[t('brown') - 0.1, t('it') - 0.1],
                hits=[t('truck'), t('knocks') + 0.15], freeze=[t('cold')])
    json.dump(cues, open(f'{A}/cues.json', 'w'), indent=1)
    print('shots', len(SHOTS), 'captions', len(caps), 'end %.2f' % END)
    for s in SHOTS: print(f"  {s['img']:8s} {s['at']:6.2f}–{s['end']:6.2f} ({s['end'] - s['at']:.2f}s) {s['seam']}")
    print(' | '.join(g['txt'] for g in caps))


if __name__ == '__main__':
    main()
