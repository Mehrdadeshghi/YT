#!/usr/bin/env python3
"""Shared builder for the realistic prototypes (proto/real/<n>/film.py → proto/real/<n>/index.html).

    .venv/bin/python proto/real/lib/build.py 1

A film.py defines: TITLE, LOOK (prep.py grade), HOOK (≤6 on-screen words, visible at frame 0), PHRASES (caption numerals),
SHOTS (list of dicts) and OVERLAYS (list of dicts), CUES (sound), all timed on the VO's Whisper words via t('word', k).

Shot dict: src = 'ai:<id_seed>' | 'photo:<media path>' | 'video:<media path>', at (s), move=(kind, s0, s1, x0, x1, y0, y1),
seam = how the shot is ENTERED: 'left' (cut-the-curve, the current) | 'push' (zoom-through: deeper) | 'pull' (inverse zoom:
arrival) | 'flash' (push through a white flash: light/impact), label = honest source tag, shake = (amp, dur), focus = x (0-1)
for photos/videos, vstart = seconds into a video clip.

Graphic language ("documentary premium"): graded plates with depth-of-field, film grain + vignette + halation added in post
(post.sh, ffmpeg), mono HUD readouts with measured tick scales, thin 2 px rules, one red tension accent, map inserts,
honest source tags top-left, tiny 1-3 word captions."""
import importlib.util, json, math, os, random, re, shutil, subprocess, sys

LIB = os.path.dirname(os.path.abspath(__file__))
REAL = os.path.dirname(LIB)
REPO = os.path.dirname(os.path.dirname(REAL))
MEDIA = f'{REAL}/media'
W, H = 1080, 1920
PY = f'{REPO}/.venv/bin/python'
N = sys.argv[1]
D = f'{REAL}/{N}'; A = f'{D}/assets'
WORDS = json.load(open(f'{A}/vo.words.json'))


def key(w): return re.sub(r'[^a-z0-9-]', '', w.lower())


def t(word, k=1):
    """start of the k-th spoken occurrence of word"""
    n = 0
    for w in WORDS:
        if key(w['w']) == word.lower():
            n += 1
            if n == k: return w['s']
    raise KeyError(f'{word} #{k}')


def te(word, k=1):
    n = 0
    for w in WORDS:
        if key(w['w']) == word.lower():
            n += 1
            if n == k: return w['e']
    raise KeyError(f'{word} #{k}')


END = WORDS[-1]['e'] + 1.0
spec = importlib.util.spec_from_file_location('film', f'{D}/film.py'); F = importlib.util.module_from_spec(spec)
F.t, F.te, F.END = t, te, END
spec.loader.exec_module(F)
SHOTS, OV = F.SHOTS, F.OVERLAYS
for i, s in enumerate(SHOTS):
    s['end'] = SHOTS[i + 1]['at'] if i + 1 < len(SHOTS) else END
    s.setdefault('seam', 'left'); s.setdefault('label', '')


# ---------------------------------------------------------------- media prep
def prep_media():
    os.makedirs(f'{A}/layers', exist_ok=True); os.makedirs(f'{A}/clips', exist_ok=True); os.makedirs(f'{A}/fonts', exist_ok=True)
    for f in ('Inter-800.woff2', 'Inter-600.woff2', 'Mono-500.woff2', 'Serif-700.woff2'):
        shutil.copy(f'{REPO}/fonts/{f}', f'{A}/fonts/{f}')
    for dst, src in getattr(F, 'COPY', {}).items():
        shutil.copy(f'{MEDIA}/{src}', f'{A}/{dst}')
    for s in SHOTS:
        kind, src = s['src'].split(':', 1)
        if kind == 'ai':
            out = f'{A}/layers/{src}'
            if not os.path.exists(out + '_bg.jpg'):
                subprocess.run([PY, f'{LIB}/prep.py', 'ai', s.get('look', F.LOOK), f'{A}/gen/{src}.png', f'{A}/gen/{src}_depth.png', out], check=True)
            s['bg'], s['fg'] = f'assets/layers/{src}_bg.jpg', f'assets/layers/{src}_fg.png'
        elif kind == 'photo':
            name = re.sub(r'[^a-z0-9]+', '_', src.lower())
            out = f'{A}/layers/ph_{name}.jpg'
            hh = int(H * s.get('zoom', 1.0))
            if not os.path.exists(out):
                subprocess.run([PY, f'{LIB}/prep.py', 'photo', s.get('look', F.LOOK), f'{MEDIA}/{src}', out, str(hh)], check=True)
            from PIL import Image
            iw, ih = Image.open(out).size
            if iw < W:   # portrait narrower than the frame → scale up to cover
                sc = W / iw; iw, ih = W, round(ih * sc)
            s['img'], s['iw'], s['ih'] = f'assets/layers/ph_{name}.jpg', iw, ih
        else:   # video: trim + cover-crop to 1080x1920 at 30 fps, silent
            name = re.sub(r'[^a-z0-9]+', '_', src.lower()) + f"_{int(s.get('vstart', 0) * 100)}"
            out = f'{A}/clips/{name}.mp4'
            dur = s['end'] - s['at'] + 0.2
            fx = s.get('focus', 0.5)
            if not os.path.exists(out):
                vf = (f"scale=-2:{H}:flags=lanczos,crop={W}:{H}:'max(0,min(iw-{W},iw*{fx}-{W}/2))':0," if s.get('portrait') is None else '') + 'fps=30,format=yuv420p'
                if s.get('portrait'): vf = f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},fps=30,format=yuv420p'
                if s.get('vspeed'): vf = f"setpts={1 / s['vspeed']:.4f}*PTS," + vf
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(s.get('vstart', 0)), '-i', f'{MEDIA}/{src}', '-t', f'{dur:.2f}', '-an',
                                '-vf', vf, '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-g', '15', out], check=True)
            s['clip'] = f'assets/clips/{name}.mp4'


# ---------------------------------------------------------------- shots
def shot_html(i, s):
    a, b = s['at'], s['end']; kind = s['src'].split(':')[0]
    lab = ''
    if s['label']:
        real = s['label'].startswith('REAL')
        lab = f'<div class="tag{" real" if real else ""}"><i></i>{s["label"]}</div>'
    if kind == 'ai':
        inner = f'<img id="b{i}" class="bg" src="{s["bg"]}" alt="" /><img id="f{i}" class="fg" src="{s["fg"]}" alt="" />'
    elif kind == 'photo':
        iw, ih = s['iw'], s['ih']; fx = s.get('focus', 0.5)
        left = min(0, max(W - iw, W / 2 - fx * iw)); top = (H - ih) / 2
        inner = f'<img id="b{i}" class="ph" src="{s["img"]}" alt="" style="width:{iw}px;height:{ih}px;left:{left:.0f}px;top:{top:.0f}px" />'
    else:
        inner = (f'<video id="v{i}" class="clip vid" src="{s["clip"]}" muted playsinline data-start="{a:.3f}" data-duration="{b - a:.3f}" '
                 f'data-track-index="{20 + i}"></video>')
    cls = 'clip shot' if kind != 'video' else 'shot vshot'
    timing = f'data-start="{a:.3f}" data-duration="{b - a:.3f}" data-track-index="{1 + i % 2}" data-track-kind="graphics"' if kind != 'video' else ''
    return f'''      <div id="sh{i}" class="{cls}" {timing} style="z-index:{1 + i % 2}">
        <div id="c{i}" class="cam"><div id="k{i}" class="shk"><div id="r{i}" class="rig">{inner}</div></div></div>
        {lab}
      </div>'''


def shake_js(sel, a, b, amp, seed):
    rnd = random.Random(seed); out = []; tt = a
    while tt < b - 0.05:
        fall = 1 - 0.7 * (tt - a) / max(0.01, b - a)
        out.append(f'tl.to("{sel}", {{x: {rnd.uniform(-amp, amp) * fall:.1f}, y: {rnd.uniform(-amp, amp) * fall:.1f}, rotation: {rnd.uniform(-0.5, 0.5) * fall:.2f}, duration: 0.05, ease: "sine.inOut"}}, {tt:.3f});')
        tt += 0.05
    out.append(f'tl.to("{sel}", {{x: 0, y: 0, rotation: 0, duration: 0.08}}, {tt:.3f});')
    return out


def shots_js():
    js, ledger = [], []
    TR, DUR = 130, 0.3
    for i, s in enumerate(SHOTS):
        a, b = s['at'], s['end']; kind = s['src'].split(':')[0]
        mv, s0, s1, x0, x1, y0, y1 = s['move']
        js.append(f'// shot {i} {s["src"]} [{a:.2f}-{b:.2f}] {mv}, enter {s["seam"]}')
        if kind == 'video':
            js.append(f'tl.set("#sh{i}", {{opacity: 1}}, {a:.3f}); tl.set("#sh{i}", {{opacity: 0}}, {b:.3f});')
        js.append(f'tl.fromTo("#r{i}", {{scale: {s0}, x: {x0}, y: {y0}}}, {{scale: {s1}, x: {x1}, y: {y1}, duration: {b - a:.3f}, ease: "none"}}, {a:.3f});')
        if kind == 'ai':   # depth parallax: near layer travels further
            js.append(f'tl.fromTo("#f{i}", {{scale: 1, x: 0, y: 0}}, {{scale: {1.05 if s1 >= s0 else 0.96}, x: {(x1 - x0) * 0.4:.0f}, y: {(y1 - y0) * 0.4 + 14:.0f}, duration: {b - a:.3f}, ease: "none"}}, {a:.3f});')
        if i > 0:
            sm = s['seam']
            if sm == 'left':
                js.append(f'tl.fromTo("#c{i}", {{x: {TR}, scale: 1, filter: "blur(9px)"}}, {{x: 0, filter: "blur(0px)", duration: {DUR}, ease: "power4.out", immediateRender: false}}, {a:.3f});')
            elif sm in ('push', 'flash'):
                js.append(f'tl.fromTo("#c{i}", {{x: 0, scale: 0.84, filter: "blur(18px)"}}, {{scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out", immediateRender: false}}, {a:.3f});')
            else:
                js.append(f'tl.fromTo("#c{i}", {{x: 0, scale: 1.25, filter: "blur(18px)"}}, {{scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out", immediateRender: false}}, {a:.3f});')
            ax = 'x' if sm == 'left' else 'z'; dr = {'left': -1, 'push': 1, 'flash': 1, 'pull': -1}[sm]
            ledger.append(dict(id=f'{SHOTS[i - 1]["src"]}→{s["src"]}', cut=round(a, 3),
                               technique={'left': 'cut-the-curve LEFT', 'push': 'zoom-through', 'flash': 'zoom-through + light flash', 'pull': 'inverse zoom-through (arrival)'}[sm],
                               exit=dict(selector=f'#c{i - 1}', axis=ax, dir=dr), entry=dict(selector=f'#c{i}', axis=ax, dir=dr)))
        if i + 1 < len(SHOTS):
            nx = SHOTS[i + 1]['seam']
            if nx == 'left':
                js.append(f'tl.to("#c{i}", {{x: {-TR}, filter: "blur(9px)", duration: {DUR}, ease: "power4.in"}}, {b - DUR:.3f});')
            elif nx in ('push', 'flash'):
                js.append(f'tl.to("#c{i}", {{scale: 1.2, filter: "blur(18px)", duration: 0.21, ease: "power3.in"}}, {b - 0.21:.3f});')
            else:
                js.append(f'tl.to("#c{i}", {{scale: 0.86, filter: "blur(18px)", duration: 0.21, ease: "power3.in"}}, {b - 0.21:.3f});')
        if s.get('shake'):
            amp, du = s['shake']; js += shake_js(f'#k{i}', a, min(b, a + du), amp, 70 + i)
    return js, ledger


# ---------------------------------------------------------------- captions (1-3 words)
def caption_groups():
    toks = []
    for w in WORDS:
        if w['w'].startswith('-') and toks: toks[-1]['w'] += w['w']; toks[-1]['e'] = w['e']
        else: toks.append(dict(w))
    out, i = [], 0
    while i < len(toks):
        for ph, rep in F.PHRASES:
            if [key(x['w']) for x in toks[i:i + len(ph)]] == ph:
                last = toks[i + len(ph) - 1]
                out.append(dict(w=rep + re.sub(r'^.*?([.,?!]*)$', r'\1', last['w']), s=toks[i]['s'], e=last['e'], num=1)); i += len(ph); break
        else:
            out.append(toks[i]); i += 1
    phrases, cur = [], []
    for w in out:
        cur.append(w)
        if re.search(r'[.,?!]$', w['w']): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    groups = []
    for p in phrases:
        n = max(-(-len(p) // 3), -(-len(' '.join(x['w'] for x in p)) // 18)); n = min(n, len(p)); base, extra = divmod(len(p), n); k = 0
        for j in range(n):
            m = base + (1 if j < extra else 0); groups.append(p[k:k + m]); k += m
    res = []
    for g in groups:
        txt = ' '.join(f'<b>{x["w"].rstrip(",.")}</b>' if x.get('num') else x['w'] for x in g).rstrip(',.')
        res.append(dict(s=g[0]['s'], e=g[-1]['e'], txt=txt))
    return res


# ---------------------------------------------------------------- overlays (the graphic language)
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;')


def ov_html_js(j, o):
    """returns (html, js). Every overlay is its own timed clip on a graphics track above the shots."""
    a, b = o['at'], o['end']; ty = o['type']; oid = f'ov{j}'; h, js = [], []
    wrap = lambda inner, cls='': f'      <div id="{oid}" class="clip ov {cls}" data-start="{a:.3f}" data-duration="{b - a:.3f}" data-track-index="{40 + j}" data-track-kind="graphics" style="z-index:{30 + j}">\n{inner}\n      </div>'
    x, y = o.get('x', 60), o.get('y', 300)
    if ty == 'hook':   # the ≤6-word line visible at frame 0
        words = o['text'].split()
        spans = ' '.join(f'<span id="{oid}w{k}" class="hw">{esc(w)}</span>' for k, w in enumerate(words))
        h.append(wrap(f'        <div class="hook" style="top:{y}px"><div id="{oid}bar" class="hbar"></div><div class="htxt">{spans}</div></div>'))
        js.append(f'tl.fromTo("#{oid}bar", {{scaleX: 0.35}}, {{scaleX: 1, duration: 0.5, ease: "power4.out"}}, {a:.3f});')
        js.append(f'tl.to("#{oid} .hook", {{x: -130, opacity: 0, duration: 0.3, ease: "power4.in"}}, {b - 0.3:.3f});')
    elif ty == 'stamp':   # documentary date-line, typed on
        txt = o['text']; n = len(txt)
        chars = ''.join(f'<span id="{oid}c{k}" class="ch">{esc(c) if c != " " else "&nbsp;"}</span>' for k, c in enumerate(txt))
        h.append(wrap(f'        <div class="stamp" style="left:{x}px;top:{y}px"><i class="dot"></i>{chars}</div>'))
        for k in range(n): js.append(f'tl.set("#{oid}c{k}", {{opacity: 1}}, {a + 0.02 + k * 0.022:.3f});')
        js.append(f'tl.to("#{oid} .stamp", {{x: -60, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'counter':   # mono readout: LABEL / big number counting a→b, measured tick rule
        lab, v0, v1, unit, fmt = o['label'], o['v0'], o['v1'], o.get('unit', ''), o.get('fmt', '{:,.0f}')
        dur = o.get('dur', b - a - 0.3); red = ' red' if o.get('red') else ''
        ticks = ''.join(f'<i style="left:{k * 24}px;height:{18 if k % 5 == 0 else 9}px"></i>' for k in range(16))
        h.append(wrap(f'        <div class="ctr{red}" style="left:{x}px;top:{y}px"><div class="clab">{esc(lab)}</div><div class="cnum"><span id="{oid}n">{fmt.format(v0)}</span><em>{esc(unit)}</em></div><div class="cticks">{ticks}<b id="{oid}p"></b></div></div>'))
        js.append(f'tl.fromTo("#{oid} .ctr", {{y: 40, opacity: 0}}, {{y: 0, opacity: 1, duration: 0.3, ease: "power4.out"}}, {a:.3f});')
        js.append(f'(function(){{ const o = {{v: {v0}}}, el = document.querySelector("#{oid}n"); tl.to(o, {{v: {v1}, duration: {dur:.2f}, ease: "{o.get("ease", "power2.out")}", onUpdate: () => {{ el.textContent = {js_fmt(fmt, "o.v")}; }}}}, {a + 0.1:.3f}); }})();')
        js.append(f'tl.fromTo("#{oid}p", {{x: 0}}, {{x: 360, duration: {dur:.2f}, ease: "{o.get("ease", "power2.out")}"}}, {a + 0.1:.3f});')
        js.append(f'tl.to("#{oid} .ctr", {{x: -60, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'callout':   # dot on the subject + leader line + mono label box
        px, py, tx, ty_ = o['px'], o['py'], o['tx'], o['ty']
        L = math.hypot(tx - px, ty_ - py); ang = math.degrees(math.atan2(ty_ - py, tx - px))
        h.append(wrap(f'        <div id="{oid}d" class="cdot" style="left:{px}px;top:{py}px"></div>'
                      f'<div id="{oid}l" class="cline" style="left:{px}px;top:{py}px;width:{L:.0f}px;transform:rotate({ang:.1f}deg)"></div>'
                      f'<div id="{oid}t" class="ctxt{" red" if o.get("red") else ""}" style="left:{tx + (0 if tx >= px else -o.get("w", 360))}px;top:{ty_ - 34}px;width:{o.get("w", 360)}px;text-align:{"left" if tx >= px else "right"}"><small>{esc(o.get("small", ""))}</small>{esc(o["text"])}</div>'))
        js.append(f'tl.fromTo("#{oid}d", {{scale: 0}}, {{scale: 1, duration: 0.25, ease: "back.out(1.6)"}}, {a:.3f});')
        js.append(f'tl.fromTo("#{oid}l", {{scaleX: 0}}, {{scaleX: 1, duration: 0.3, ease: "power4.out"}}, {a + 0.1:.3f});')
        js.append(f'tl.fromTo("#{oid}t", {{opacity: 0, y: 14}}, {{opacity: 1, y: 0, duration: 0.25, ease: "power4.out"}}, {a + 0.3:.3f});')
    elif ty == 'measure':   # dimension line with end ticks + label (scale of a thing)
        x0, y0, x1, y1 = o['p0'] + o['p1']
        L = math.hypot(x1 - x0, y1 - y0); ang = math.degrees(math.atan2(y1 - y0, x1 - x0))
        h.append(wrap(f'        <div id="{oid}m" class="meas" style="left:{x0}px;top:{y0}px;width:{L:.0f}px;transform:rotate({ang:.1f}deg)"><i></i><i></i></div>'
                      f'<div id="{oid}t" class="mlab" style="left:{o.get("lx", (x0 + x1) / 2 - 160):.0f}px;top:{o.get("ly", (y0 + y1) / 2 - 80):.0f}px">{esc(o["text"])}</div>'))
        js.append(f'tl.fromTo("#{oid}m", {{scaleX: 0}}, {{scaleX: 1, duration: 0.45, ease: "power4.out"}}, {a:.3f});')
        js.append(f'tl.fromTo("#{oid}t", {{opacity: 0, x: -20}}, {{opacity: 1, x: 0, duration: 0.25, ease: "power4.out"}}, {a + 0.3:.3f});')
    elif ty == 'gauge':   # vertical measured scale (altitude / depth) with a moving pointer
        v0, v1, lo, hi = o['v0'], o['v1'], o['lo'], o['hi']; hh = o.get('h', 760)
        pos = lambda v: hh * (1 - (v - lo) / (hi - lo))
        marks = ''.join(f'<i style="top:{pos(v):.0f}px" class="{"maj" if k % 2 == 0 else ""}"></i>' + (f'<em style="top:{pos(v) - 14:.0f}px">{v:,.0f}</em>' if k % 2 == 0 else '')
                        for k, v in enumerate(range(lo, hi + 1, o['step'])))
        h.append(wrap(f'        <div class="gauge" style="left:{x}px;top:{y}px;height:{hh}px"><div class="glab">{esc(o["label"])}</div>{marks}<b id="{oid}p" style="top:{pos(v0):.0f}px"><span id="{oid}n">{v0:,.0f}</span></b></div>'))
        js.append(f'tl.fromTo("#{oid} .gauge", {{x: 50, opacity: 0}}, {{x: 0, opacity: 1, duration: 0.3, ease: "power4.out"}}, {a:.3f});')
        d = o.get('dur', b - a - 0.4)
        js.append(f'tl.to("#{oid}p", {{y: {pos(v1) - pos(v0):.0f}, duration: {d:.2f}, ease: "{o.get("ease", "power2.inOut")}"}}, {a + o.get("delay", 0.2):.3f});')
        js.append(f'(function(){{ const q = {{v: {v0}}}, el = document.querySelector("#{oid}n"); tl.to(q, {{v: {v1}, duration: {d:.2f}, ease: "{o.get("ease", "power2.inOut")}", onUpdate: () => {{ el.textContent = Math.round(q.v).toLocaleString("en-US"); }}}}, {a + o.get("delay", 0.2):.3f}); }})();')
        js.append(f'tl.to("#{oid} .gauge", {{x: -50, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'map':   # inset map: outline + target dot + coordinates
        h.append(wrap(f'        <div class="map" style="left:{x}px;top:{y}px"><svg viewBox="0 0 360 420" width="360" height="420"><path id="{oid}path" class="land" pathLength="1" d="{o["path"]}"/>'
                      f'<circle id="{oid}ring" class="ring" cx="{o["dot"][0]}" cy="{o["dot"][1]}" r="16"/><circle class="tdot" cx="{o["dot"][0]}" cy="{o["dot"][1]}" r="7"/></svg>'
                      f'<div class="mapl">{esc(o["text"])}</div><div class="mapc">{esc(o["coord"])}</div></div>'))
        js.append(f'tl.fromTo("#{oid} .map", {{x: 60, opacity: 0}}, {{x: 0, opacity: 1, duration: 0.35, ease: "power4.out"}}, {a:.3f});')
        js.append(f'tl.fromTo("#{oid}path", {{strokeDashoffset: 1}}, {{strokeDashoffset: 0, duration: 0.9, ease: "power2.out"}}, {a:.3f});')
        js.append(f'tl.fromTo("#{oid}ring", {{scale: 0.3, opacity: 1, transformOrigin: "50% 50%"}}, {{scale: 2.6, opacity: 0, duration: 0.8, ease: "power2.out"}}, {a + 0.6:.3f});')
        js.append(f'tl.to("#{oid} .map", {{x: -60, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'flash':   # light: white frame that decays (lightning / blast)
        h.append(wrap(f'        <div id="{oid}f" class="flash" style="background:{o.get("color", "#fff")}"></div>'))
        for k, (tt, pk) in enumerate(o.get('hits', [(a, 1.0)])):
            js.append(f'tl.fromTo("#{oid}f", {{opacity: {pk}}}, {{opacity: 0, duration: {o.get("decay", 0.35)}, ease: "power2.out", immediateRender: false}}, {tt:.3f});')
    elif ty == 'note':   # the real note, traced (public domain svg), on paper, wiped on
        h.append(wrap(f'        <div class="note" style="top:{y}px"><img id="{oid}i" src="{o["src"]}" alt="" /><div class="nlab">{esc(o["text"])}</div></div>'))
        js.append(f'tl.fromTo("#{oid} .note", {{y: 120, rotation: -6, opacity: 0}}, {{y: 0, rotation: -2, opacity: 1, duration: 0.45, ease: "power4.out"}}, {a:.3f});')
        js.append(f'tl.fromTo("#{oid}i", {{clipPath: "inset(0 100% 0 0)"}}, {{clipPath: "inset(0 0% 0 0)", duration: {o.get("wipe", 1.2)}, ease: "none"}}, {a + 0.25:.3f});')
        js.append(f'tl.to("#{oid} .note", {{x: -140, opacity: 0, duration: 0.3, ease: "power4.in"}}, {b - 0.3:.3f});')
    elif ty == 'bars':   # measured comparison bars (value labels in mono, one red)
        rows = o['rows']; mx = max(r[1] for r in rows)
        inner = ''.join(f'<div class="brow"><div class="blab">{esc(r[0])}</div><div class="btrack"><b id="{oid}b{k}" class="{"red" if r[3] else ""}" style="width:{760 * r[1] / mx:.0f}px"></b></div><div class="bval">{esc(r[2])}</div></div>' for k, r in enumerate(rows))
        h.append(wrap(f'        <div class="bars" style="top:{y}px">{inner}</div>'))
        js.append(f'tl.fromTo("#{oid} .bars", {{y: 40, opacity: 0}}, {{y: 0, opacity: 1, duration: 0.3, ease: "power4.out"}}, {a:.3f});')
        for k, r in enumerate(rows):
            js.append(f'tl.fromTo("#{oid}b{k}", {{scaleX: 0}}, {{scaleX: 1, duration: 0.7, ease: "power4.out"}}, {r[4]:.3f});')
        js.append(f'tl.to("#{oid} .bars", {{x: -60, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'charges':   # + / − charge markers popping in on cue (cloud electrification)
        for k, (cx, cy, sg, tt) in enumerate(o['pts']):
            h.append(f'<div id="{oid}q{k}" class="q {"pos" if sg > 0 else "neg"}" style="left:{cx}px;top:{cy}px">{"+" if sg > 0 else "−"}</div>')
            js.append(f'tl.fromTo("#{oid}q{k}", {{scale: 0, opacity: 0}}, {{scale: 1, opacity: 1, duration: 0.18, ease: "back.out(1.7)"}}, {tt:.3f});')
        h = [wrap('        ' + ''.join(h))]
    elif ty == 'path':   # a drawn path in jumps (stepped leader) with step markers
        pts = o['pts']; d = 'M' + ' L'.join(f'{px},{py}' for px, py in pts)
        marks = ''.join(f'<circle id="{oid}s{k}" class="smark" cx="{px}" cy="{py}" r="9"/>' for k, (px, py) in enumerate(pts[1:]))
        h.append(wrap(f'        <svg class="pth" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><path id="{oid}p" class="{o.get("cls", "leader")}" pathLength="1" d="{d}"/>{marks}</svg>'
                      + (f'<div id="{oid}t" class="mlab" style="left:{o["lx"]}px;top:{o["ly"]}px">{esc(o["text"])}</div>' if o.get('text') else '')))
        n = len(pts) - 1; step = o.get('step', 0.22)
        for k in range(n):   # jump, pause, jump (the stepped leader is not a smooth stroke)
            js.append(f'tl.to("#{oid}p", {{strokeDashoffset: {1 - (k + 1) / n:.4f}, duration: 0.06, ease: "power2.out"}}, {a + k * step:.3f});')
            js.append(f'tl.fromTo("#{oid}s{k}", {{scale: 0, transformOrigin: "50% 50%"}}, {{scale: 1, duration: 0.12, ease: "back.out(1.7)"}}, {a + k * step + 0.05:.3f});')
        js.insert(0, f'tl.set("#{oid}p", {{strokeDashoffset: 1}}, 0);')
        if o.get('text'): js.append(f'tl.fromTo("#{oid}t", {{opacity: 0, x: -20}}, {{opacity: 1, x: 0, duration: 0.25, ease: "power4.out"}}, {a + 0.2:.3f});')
    elif ty == 'timer':   # countdown readout (real seconds, never faked)
        n0 = o['from']; red = ' red'
        h.append(wrap(f'        <div class="timer" style="left:{x}px;top:{y}px"><div class="clab">{esc(o["label"])}</div><div class="tnum" id="{oid}n">00:{n0:02d}</div><div class="tsub">{esc(o.get("sub", ""))}</div></div>'))
        js.append(f'tl.fromTo("#{oid} .timer", {{scale: 1.25, opacity: 0}}, {{scale: 1, opacity: 1, duration: 0.35, ease: "expo.out"}}, {a:.3f});')
        k = 1
        while a + k < b - 0.1:
            js.append(f'tl.call(() => {{ document.querySelector("#{oid}n").textContent = "00:{n0 - k:02d}"; }}, null, {a + k:.3f});')
            k += 1
        js.append(f'tl.call(() => {{ document.querySelector("#{oid}n").textContent = "00:{n0:02d}"; }}, null, {a + 0.001:.3f});')
        js.append(f'tl.to("#{oid} .timer", {{x: -60, opacity: 0, duration: 0.25, ease: "power4.in"}}, {b - 0.25:.3f});')
    elif ty == 'frame':   # focus brackets around a subject + label
        x0, y0, x1, y1 = o['box']
        corners = ''.join(f'<i class="{c}"></i>' for c in ('tl', 'tr', 'bl', 'br'))
        h.append(wrap(f'        <div id="{oid}b" class="brk" style="left:{x0}px;top:{y0}px;width:{x1 - x0}px;height:{y1 - y0}px">{corners}<span>{esc(o["text"])}</span></div>'))
        js.append(f'tl.fromTo("#{oid}b", {{scale: 1.35, opacity: 0}}, {{scale: 1, opacity: 1, duration: 0.4, ease: "expo.out"}}, {a:.3f});')
    else:
        raise ValueError(ty)
    return '\n'.join(h), js


def js_fmt(fmt, v):
    if fmt == '{:,.0f}': return f'Math.round({v}).toLocaleString("en-US")'
    if fmt == '{:.1f}': return f'({v}).toFixed(1)'
    if fmt == '{:.2f}': return f'({v}).toFixed(2)'
    return f'Math.round({v})'


CSS = '''
      @font-face { font-family: "Inter"; font-weight: 800; src: url("assets/fonts/Inter-800.woff2") format("woff2"); }
      @font-face { font-family: "Inter"; font-weight: 600; src: url("assets/fonts/Inter-600.woff2") format("woff2"); }
      @font-face { font-family: "Mono"; font-weight: 500; src: url("assets/fonts/Mono-500.woff2") format("woff2"); }
      :root { --ink: #f3efe6; --red: #ff3b2f; --dim: rgba(243,239,230,.62); --rule: rgba(243,239,230,.78); }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #000; }
      #main { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: #050505; }
      .shot { position: absolute; inset: 0; overflow: hidden; background: #000; }
      .vshot { opacity: 0; }
      .cam, .shk, .rig { position: absolute; inset: 0; transform-origin: 50% 50%; }
      .bg, .fg { position: absolute; left: -5px; top: -3px; width: 1090px; height: 1926px; }
      .fg { transform-origin: 50% 85%; }
      .ph { position: absolute; }
      .vid { position: absolute; inset: 0; width: 1080px; height: 1920px; object-fit: cover; }
      .tag { position: absolute; left: 56px; top: 150px; z-index: 5; font: 500 25px/1 Mono, monospace; letter-spacing: .16em; color: var(--ink);
        padding: 10px 14px 9px 36px; background: rgba(0,0,0,.42); border: 1px solid rgba(243,239,230,.35); }
      .tag i { position: absolute; left: 13px; top: 15px; width: 11px; height: 11px; border-radius: 50%; background: var(--red); }
      .tag.real i { background: #ffd23f; }
      .ov { position: absolute; inset: 0; pointer-events: none; }
      .hook { position: absolute; left: 60px; right: 60px; }
      .hbar { width: 120px; height: 8px; background: var(--red); margin-bottom: 26px; transform-origin: 0 50%; }
      .htxt { font: 800 84px/1.02 Inter, sans-serif; color: var(--ink); letter-spacing: -0.02em; text-transform: uppercase;
        text-shadow: 0 2px 6px rgba(0,0,0,.55), 0 10px 40px rgba(0,0,0,.55); }
      .stamp { position: absolute; font: 500 30px/1 Mono, monospace; letter-spacing: .08em; color: var(--ink); white-space: nowrap;
        padding: 14px 18px 12px 44px; background: rgba(0,0,0,.5); border-left: 4px solid var(--red); }
      .stamp .dot { position: absolute; left: 16px; top: 18px; width: 13px; height: 13px; border-radius: 50%; background: var(--red); }
      .stamp .ch { opacity: 0; }
      .ctr { position: absolute; width: 640px; color: var(--ink); }
      .clab { font: 500 24px/1 Mono, monospace; letter-spacing: .2em; color: var(--dim); margin-bottom: 10px; }
      .cnum { font: 500 92px/1 Mono, monospace; letter-spacing: -0.02em; text-shadow: 0 4px 24px rgba(0,0,0,.6); white-space: nowrap; }
      .cnum em { font-style: normal; font-size: 38px; margin-left: 12px; color: var(--dim); }
      .ctr.red .cnum { color: var(--red); }
      .cticks { position: relative; height: 22px; margin-top: 12px; border-top: 2px solid var(--rule); width: 362px; }
      .cticks i { position: absolute; top: 0; width: 2px; background: var(--rule); }
      .cticks b { position: absolute; top: -9px; left: -7px; width: 14px; height: 14px; background: var(--red); transform: rotate(45deg); }
      .cdot { position: absolute; width: 22px; height: 22px; margin: -11px; border-radius: 50%; border: 3px solid var(--ink); background: rgba(255,59,47,.9); }
      .cline { position: absolute; height: 2px; background: var(--ink); transform-origin: 0 50%; }
      .cline { transform-origin: 0 50%; }
      .ctxt { position: absolute; font: 600 44px/1.1 Inter, sans-serif; color: var(--ink); text-shadow: 0 2px 12px rgba(0,0,0,.8); }
      .ctxt small { display: block; font: 500 22px/1 Mono, monospace; letter-spacing: .18em; color: var(--dim); margin-bottom: 8px; }
      .ctxt.red { color: #ff6a5f; }
      .meas { position: absolute; height: 5px; margin-top: -2px; background: var(--red); transform-origin: 0 50%; box-shadow: 0 0 8px rgba(0,0,0,.7); }
      .meas i { position: absolute; top: -16px; width: 5px; height: 36px; background: var(--red); }
      .meas i:first-child { left: 0; } .meas i:last-child { right: 0; }
      .mlab { position: absolute; width: 440px; text-align: left; font: 500 40px/1 Mono, monospace; color: var(--ink); text-shadow: 0 2px 12px rgba(0,0,0,.85); }
      .gauge { position: absolute; width: 230px; border-right: 2px solid var(--rule); }
      .gauge .glab { position: absolute; top: -48px; right: 0; font: 500 22px/1 Mono, monospace; letter-spacing: .2em; color: var(--dim); white-space: nowrap; }
      .gauge i { position: absolute; right: 0; width: 16px; height: 2px; background: var(--rule); }
      .gauge i.maj { width: 34px; }
      .gauge em { position: absolute; right: 46px; font: 500 24px/1 Mono, monospace; font-style: normal; color: var(--dim); }
      .gauge b { position: absolute; right: -14px; width: 0; height: 0; }
      .gauge b::before { content: ""; position: absolute; right: 0; top: -12px; border: 12px solid transparent; border-right: 18px solid var(--red); }
      .gauge b span { position: absolute; right: 26px; top: -27px; padding: 8px 10px; background: var(--red); color: #fff; font: 500 34px/1 Mono, monospace; white-space: nowrap; }
      .map { position: absolute; width: 360px; padding: 0; background: rgba(5,8,10,.62); border: 1px solid rgba(243,239,230,.35); }
      .map .land { fill: rgba(243,239,230,.10); stroke: var(--ink); stroke-width: 2; stroke-dasharray: 1; vector-effect: non-scaling-stroke; }
      .map .tdot { fill: var(--red); } .map .ring { fill: none; stroke: var(--red); stroke-width: 3; }
      .mapl { padding: 12px 16px 4px; font: 600 30px/1.1 Inter, sans-serif; color: var(--ink); }
      .mapc { padding: 0 16px 14px; font: 500 22px/1 Mono, monospace; letter-spacing: .08em; color: var(--dim); }
      .flash { position: absolute; inset: 0; opacity: 0; mix-blend-mode: screen; }
      .note { position: absolute; left: 90px; width: 900px; padding: 34px 30px 26px; background: #efe7d6; box-shadow: 0 30px 80px rgba(0,0,0,.7); }
      .note img { width: 840px; display: block; filter: contrast(1.3); }
      .nlab { margin-top: 18px; font: 500 22px/1 Mono, monospace; letter-spacing: .18em; color: #6b5b45; }
      .bars { position: absolute; left: 60px; right: 60px; padding: 26px 26px 10px; background: rgba(0,0,0,.55); border-top: 4px solid var(--red); }
      .brow { margin-bottom: 20px; }
      .blab { font: 500 26px/1 Mono, monospace; letter-spacing: .14em; color: var(--dim); margin-bottom: 10px; }
      .btrack { height: 34px; }
      .btrack b { display: block; height: 34px; background: var(--ink); transform-origin: 0 50%; }
      .btrack b.red { background: var(--red); }
      .bval { font: 500 52px/1.2 Mono, monospace; color: var(--ink); margin-top: 6px; }
      .q { position: absolute; width: 64px; height: 64px; margin: -32px; border-radius: 50%; font: 800 50px/60px Inter, sans-serif; text-align: center;
        color: #fff; border: 3px solid #fff; }
      .q.pos { background: rgba(255,59,47,.85); } .q.neg { background: rgba(40,110,255,.85); }
      .pth { position: absolute; left: 0; top: 0; overflow: visible; }
      .pth path { fill: none; stroke-dasharray: 1; stroke-dashoffset: 1; stroke-linejoin: round; stroke-linecap: round; }
      .pth .leader { stroke: rgba(200,190,255,.95); stroke-width: 6; filter: drop-shadow(0 0 10px rgba(170,150,255,1)) drop-shadow(0 0 26px rgba(150,120,255,.9)); }
      .pth .streamer { stroke: rgba(160,220,255,.95); stroke-width: 6; filter: drop-shadow(0 0 10px rgba(140,210,255,1)); }
      .pth .smark { fill: none; stroke: var(--ink); stroke-width: 3; }
      .timer { position: absolute; width: 520px; color: var(--ink); }
      .tnum { font: 500 150px/1 Mono, monospace; color: var(--red); letter-spacing: -0.03em; text-shadow: 0 6px 30px rgba(0,0,0,.6); }
      .tsub { white-space: pre-line; font: 500 24px/1.3 Mono, monospace; letter-spacing: .1em; color: var(--dim); margin-top: 8px; }
      .brk { position: absolute; }
      .brk i { position: absolute; width: 46px; height: 46px; border: 0 solid var(--ink); }
      .brk .tl { left: 0; top: 0; border-left-width: 3px; border-top-width: 3px; } .brk .tr { right: 0; top: 0; border-right-width: 3px; border-top-width: 3px; }
      .brk .bl { left: 0; bottom: 0; border-left-width: 3px; border-bottom-width: 3px; } .brk .br { right: 0; bottom: 0; border-right-width: 3px; border-bottom-width: 3px; }
      .brk span { position: absolute; left: 0; top: -44px; font: 500 26px/1 Mono, monospace; letter-spacing: .14em; color: var(--ink); background: var(--red); padding: 6px 10px; white-space: nowrap; }
      #scrim { position: absolute; inset: 0; pointer-events: none; }
      .sct { position: absolute; left: 0; right: 0; top: 0; height: 760px; background: linear-gradient(rgba(0,0,0,.62), rgba(0,0,0,.34) 45%, rgba(0,0,0,0)); }
      .scb { position: absolute; left: 0; right: 0; top: 1120px; height: 340px; background: radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,.42), rgba(0,0,0,0)); }
      #caps { position: absolute; inset: 0; z-index: 90; pointer-events: none; }
      .cap { position: absolute; left: 80px; right: 80px; top: 1236px; text-align: center; opacity: 0; transform-origin: 50% 50%;
        font: 800 60px/1.1 Inter, sans-serif; color: #fff; letter-spacing: -0.01em;
        text-shadow: 0 0 3px #000, 0 0 3px #000, 0 2px 4px #000, 0 4px 18px rgba(0,0,0,.75); }
      .cap b { color: #ffd23f; font-weight: 800; }
'''


def main():
    prep_media()
    html_shots = [shot_html(i, s) for i, s in enumerate(SHOTS)]
    js, ledger = shots_js()
    ov_h = []
    for j, o in enumerate(OV):
        hh, jj = ov_html_js(j, o); ov_h.append(hh); js += jj
    caps = caption_groups(); cap_h = []
    for j, g in enumerate(caps):
        if g['s'] < getattr(F, 'CAP_FROM', 0): continue
        nxt = caps[j + 1]['s'] if j + 1 < len(caps) else END
        off = min(nxt, g['e'] + 0.45)
        cap_h.append(f'        <div id="cp{j}" class="cap">{g["txt"]}</div>')
        js.append(f'tl.set("#cp{j}", {{opacity: 1}}, {g["s"]:.3f}); tl.fromTo("#cp{j}", {{scale: 0.88}}, {{scale: 1, duration: 0.12, ease: "back.out(1.6)", immediateRender: false}}, {g["s"]:.3f}); tl.set("#cp{j}", {{opacity: 0}}, {off:.3f});')
    html = f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <title>{F.TITLE}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>{CSS}{getattr(F, 'CSS', '')}
    </style>
  </head>
  <body>
    <div id="main" data-composition-id="main" data-start="0" data-duration="{END:.2f}" data-width="{W}" data-height="{H}" data-fps="30">
{chr(10).join(html_shots)}
      <div id="scrim" class="clip" data-start="0" data-duration="{END:.2f}" data-track-index="29" data-track-kind="graphics" style="z-index:25"><div class="sct"></div><div class="scb"></div></div>
{chr(10).join(ov_h)}
      <div id="caps" class="clip" data-start="0" data-duration="{END:.2f}" data-track-index="90" data-track-kind="captions">
{chr(10).join(cap_h)}
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
    open(f'{D}/index.html', 'w').write(html)
    json.dump(dict(fps=30, seams=ledger), open(f'{D}/ledger.json', 'w'), indent=1, ensure_ascii=False)
    open(f'{D}/hyperframes.json', 'w').write(json.dumps({'name': f'real_{N}'}))
    cues = dict(end=END, cuts=[(s['at'], s['seam']) for s in SHOTS[1:]], fx=F.CUES, music=getattr(F, 'MUSIC', {}))
    json.dump(cues, open(f'{A}/cues.json', 'w'), indent=1)
    print('shots', len(SHOTS), 'overlays', len(OV), 'captions', len(cap_h), 'end %.2f' % END)
    for s in SHOTS: print(f"  {s['src'][:34]:34s} {s['at']:6.2f}–{s['end']:6.2f} ({s['end'] - s['at']:.2f}s) {s['seam']}")


if __name__ == '__main__':
    main()
