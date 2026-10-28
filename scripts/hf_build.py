#!/usr/bin/env python3
"""HyperFrames Shorts (default engine since pilot #201): episodes/<ep>.json + episodes/<ep>.voice.json + fetched media →
HyperFrames project hf/<ep>/ → silent render → our score/mix (score_cine.mjs via finish.sh) → DE/ES/FR dubs (dub.py).

An episode is DATA: "hf_open" (opener) and scenes[i]["hf"] pick a template + timed elements from scripts/hf_kit.py
(see its docstring); episode-wide "hf": {"theme": {...colours}, "caps": {"cu": [...], "vg": [...], "rd": [...]}, "derive": [...]}.

    python3 scripts/hf_build.py 201                 # write hf/201/ + out/ep201/cues.json only
    python3 scripts/hf_build.py 201 --render        # + hyperframes render → out/ep201/silent.mp4
    python3 scripts/hf_build.py 201 --render --finish   # + finish.sh (mix, -14 LUFS, upload copy) + dub.py → dist/

The visuals are HTML + GSAP (HyperFrames contract: paused timelines, seekable, one scene per sub-composition).
Timing comes from the Whisper word timestamps in voice.json: every caption word, title roll, counter and stamp is
placed on the word that triggers it. Audio is NOT rendered by HyperFrames: render.mjs-style cues.json is written so
score_cine.mjs builds music + SFX + voice exactly like the cine.html pipeline (and dub.py can refit the DE/ES/FR lines).

HyperFrames CLI pinned to 0.8.149 (env HF_BIN overrides the binary). Always run with telemetry off:
HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1 HYPERFRAMES_SKIP_SKILLS=1.
"""
import json, os, re, shutil, subprocess, sys, glob, difflib
from types import SimpleNamespace
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hf_kit as kit

HF_VERSION = '0.8.149'
EP = sys.argv[1].zfill(3)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
E = json.load(open(f'episodes/{EP}.json'))
V = json.load(open(f'episodes/{EP}.voice.json'))
PRJ = f'hf/{EP}'
OUT = f'out/ep{EP}'
W_, H_ = 1080, 1920
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())

# ------------------------------------------------------------------ timing: segments placed back to back
segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
clips = list(V['open']) + [c for sc in V['scenes'] for c in sc]
assert len(segs) == len(clips), (len(segs), len(clips))
scene_of = [0] * len(E.get('vo_open', [])) + [j + 1 for j, sc in enumerate(E['scenes']) for _ in sc.get('vo', [])]
t, starts = 0.12, []
for i, (s, c) in enumerate(zip(segs, clips)):
    if i:
        t += 0.32 if scene_of[i] != scene_of[i - 1] else (0.45 if s.get('cta') else 0.22)
    starts.append(round(t, 3)); t += c['dur']
DUR = round(t + 1.1, 2)
NSC = 1 + len(E['scenes'])
bounds = [0.0] + [round(starts[scene_of.index(k)] - 0.12, 3) for k in range(1, NSC)] + [DUR]


def cap_words(seg, clip, t0):
    """caption tokens (from 'cap', *starred* = keyword) with absolute times, matched to the spoken words"""
    cap = seg.get('cap', seg['text'])
    toks = [(re.sub(r'\*', '', w), '*' in w) for w in cap.split()]
    words = clip.get('words') or []
    if not words:                                   # no Whisper: spread evenly
        n = len(toks); return [dict(w=w, k=k, s=t0 + clip['dur'] * i / n, e=t0 + clip['dur'] * (i + 1) / n) for i, (w, k) in enumerate(toks)]
    a, b = [norm(w) for w, _ in toks], [norm(w['w']) for w in words]
    out = [None] * len(toks)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'equal':
            for k in range(i2 - i1): out[i1 + k] = (words[j1 + k]['t0'], words[j1 + k]['t1'])
        elif op == 'replace' or (op == 'delete' and j1 < len(words)):
            j2 = max(j2, j1 + 1); s0, s1 = words[j1]['t0'], words[min(j2, len(words)) - 1]['t1']
            for k in range(i2 - i1): out[i1 + k] = (s0 + (s1 - s0) * k / (i2 - i1), s0 + (s1 - s0) * (k + 1) / (i2 - i1))
    for k in range(len(out)):                       # leftovers: neighbour time
        if out[k] is None: out[k] = out[k - 1] if k else (0, 0.2)
    return [dict(w=w, k=kk, s=round(t0 + s, 3), e=round(t0 + e, 3)) for (w, kk), (s, e) in zip(toks, out)]


CAPS = [cap_words(s, c, st) for s, c, st in zip(segs, clips, starts)]


def wt(scene, key, nth=1, default=None):
    """local time (seconds from the scene host start) of the nth spoken word starting with key in this scene"""
    host = host_start(scene); n = 0
    for i, ws in enumerate(CAPS):
        if scene_of[i] != scene: continue
        for w in ws:
            if norm(w['w']).startswith(norm(key)):
                n += 1
                if n == nth: return round(w['s'] - host, 3)
    if default is None: raise KeyError(f'{key} not spoken in scene {scene}')
    return default


def host_start(k): return max(0.0, bounds[k] - (0.0 if k == 0 else 0.18))
def host_end(k): return DUR if k == NSC - 1 else bounds[k + 1] + 0.36



# ------------------------------------------------------------------ media → hf/<ep>/assets
def prep_media():
    A = f'{PRJ}/assets'; os.makedirs(A, exist_ok=True)
    for p in E['photos']:
        if p.get('file'):
            src = f'assets/photos/{EP}_{p["id"]}.jpg'
            if os.path.exists(src):
                im = Image.open(src).convert('RGB'); im.thumbnail((2200, 2200)); im.save(f'{A}/{p["id"]}.jpg', quality=90)
        if p.get('video'):
            d = f'assets/clips/{EP}_{p["id"]}'
            if os.path.isdir(d) and not os.path.exists(f'{A}/{p["id"]}.mp4'):
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', f'{d}/%04d.jpg', '-c:v', 'libx264', '-crf', '17',
                                '-g', '30', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', f'{A}/{p["id"]}.mp4'], check=True)
            frames = sorted(glob.glob(f'{d}/*.jpg'))
            if frames and not os.path.exists(f'{A}/{p["id"]}_f0.jpg'): shutil.copy(frames[0], f'{A}/{p["id"]}_f0.jpg')
    for dv in HF.get('derive', []):              # derived images, e.g. {"fn": "brown", "src": "front", "id": "front_brown"}
        if os.path.exists(f'{A}/{dv["src"]}.jpg'): DERIVE[dv['fn']](f'{A}/{dv["src"]}.jpg', f'{A}/{dv["id"]}.jpg', dv)


def brown(src, dst, dv=None):
    """COLOR SIMULATION (labelled on screen): the green patina hues of a real photo shifted to fresh-copper brown"""
    a = np.asarray(Image.open(src).convert('RGB').convert('HSV')).astype(np.float32) / 255
    h, s, v = a[..., 0] * 360, a[..., 1], a[..., 2]
    w = np.clip((h - 70) / 20, 0, 1) * np.clip((201 - h) / 8, 0, 1) * np.clip((s - 0.05) / 0.08, 0, 1)
    ns, nv = np.clip(s * 0.9 + 0.38, 0, 0.82), np.clip(v * 0.80, 0, 1)
    out = np.stack([a[..., 0] * (1 - w) + 22 / 360 * w, s * (1 - w) + ns * w, v * (1 - w) + nv * w], -1)
    Image.fromarray((out * 255).astype(np.uint8), 'HSV').convert('RGB').save(dst, quality=92)


def crop(src, dst, dv):
    """crop box [x0, y0, x1, y1] in fractions of the source (a detail of a real photo: label it like the photo)"""
    im = Image.open(src); w, h = im.size; b = dv['box']
    im.crop((int(b[0] * w), int(b[1] * h), int(b[2] * w), int(b[3] * h))).save(dst, quality=92)


def gray(src, dst, dv=None):
    """black-and-white version of a real photo (still a REAL PHOTO)"""
    Image.open(src).convert('L').convert('RGB').save(dst, quality=92)


def cutout(src, dst, dv):
    """2.5D foreground layer (PNG with alpha) of a REAL PHOTO for the parallax template:
    method "sky": per column, the bright/flat run from the top edge is sky (towers, skylines); "poly": polygon [[x, y] fractions] kept"""
    from PIL import ImageDraw, ImageFilter
    im = Image.open(src).convert('RGB'); w, h = im.size
    if dv.get('method', 'sky') == 'poly':
        m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(x * w, y * h) for x, y in dv['poly']], fill=255)
    else:
        a = np.asarray(im).astype(np.float32); lum = a.mean(-1)
        gy = np.abs(np.diff(lum, axis=0, prepend=lum[:1])); gx = np.abs(np.diff(lum, axis=1, prepend=lum[:, :1]))
        sky = (lum > dv.get('thr', 150)) & (gx + gy < dv.get('flat', 18))
        sky = np.cumprod(sky, axis=0).astype(bool)          # only the run connected to the top edge
        m = Image.fromarray(((~sky) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
    m = m.filter(ImageFilter.GaussianBlur(dv.get('feather', 1.5)))
    out = im.convert('RGBA'); out.putalpha(m); out.save(dst.replace('.jpg', '.png'))


DERIVE = dict(brown=brown, crop=crop, gray=gray, cutout=cutout)


# ------------------------------------------------------------------ scenes from the kit (scripts/hf_kit.py)
J = json.dumps
HF = E.get('hf', {})                        # episode-wide: theme colours, caption accent words, derived images
VIDEO_LEN = {p['id']: p.get('len', 5) * p.get('fps', 30) / 30 for p in E['photos'] if p.get('video')}   # fps 15 = 2x speed
PNG_IDS = {dv['id'] for dv in HF.get('derive', []) if dv['fn'] == 'cutout'}


def asset(sid):
    return f'assets/{sid}.mp4' if sid in VIDEO_LEN else f'assets/{sid}.png' if sid in PNG_IDS else f'assets/{sid}.jpg'


def cta_start():
    return starts[[i for i, s in enumerate(segs) if s.get('cta')][0]]


B = SimpleNamespace(host_start=lambda k: host_start(k), host_end=lambda k: host_end(k), wt=lambda *a: wt(*a), cta_start=cta_start,
                    asset=asset, clip_len=lambda sid: VIDEO_LEN[sid], open_cfg=lambda: E['hf_open'],
                    first_frame=lambda sid: f'assets/{sid}_f0.jpg', motion=bool(HF.get('motion')),
                    seam_next=lambda k: (SCENES[k + 1][1].get('seam', 'left') if HF.get('motion') and k + 1 < NSC else None))
SCENES = [(E['hf_open'].get('name', 'hook'), E['hf_open'])] + [(sc['hf'].get('name') or sc.get('beat') or f's{j + 1}', sc['hf'])
                                                              for j, sc in enumerate(E['scenes'])]
assert len(SCENES) == NSC
COMMON_CSS = kit.theme_css(kit.COMMON_CSS, HF.get('theme'))
EXIT_SEL = ('.kicker', '.big', '.chip', '.glass', '.ruler', '.sub', '.stamp', '.stack', '.ticklabels', '.bar', '.bars')


def scene_file(cid, body, script, extra_css='', exit_at=None):
    if exit_at is not None:              # text leaves as the next scene arrives (no two text layers on screen during a transition)
        sel = ', '.join(f'[data-composition-id="{cid}"] {c}' for c in EXIT_SEL)
        script += (f"      tl.to(document.querySelectorAll('{sel}'), {{ opacity: 0, filter: \"blur(6px)\", duration: 0.12, "
                   f"ease: \"power2.in\" }}, {exit_at:.3f});\n")
    return f"""<template>
  <style>{COMMON_CSS}{kit.theme_css(extra_css, HF.get('theme'))}
  </style>
  <div id="root" data-composition-id="{cid}" data-width="{W_}" data-height="{H_}">
{body}
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
{script}
      window.__timelines["{cid}"] = tl;
    }})();
  </script>
</template>
"""

# ------------------------------------------------------------------ captions (word-synced, from the Whisper timings)
def captions():
    words = [dict(w, seg=i) for i, ws in enumerate(CAPS) for w in ws]
    groups, cur = [], []
    for j, w in enumerate(words):
        cur.append(w)
        nxt = words[j + 1] if j + 1 < len(words) else None
        end = (nxt is None or nxt['seg'] != w['seg'] or re.search(r'[.!?:]$', w['w']) or len(cur) >= 4
               or (nxt['s'] - w['e'] > 0.15 and len(cur) >= 2) or (re.search(r',$', w['w']) and len(cur) >= 2))
        if end: groups.append(cur); cur = []
    G = []
    for gi, g in enumerate(groups):
        s = max(0.05, g[0]['s'] - 0.06)
        nxt = groups[gi + 1][0]['s'] - 0.06 if gi + 1 < len(groups) else DUR - 0.5
        e = min(g[-1]['e'] + 0.45, nxt)
        G.append(dict(s=round(s, 3), e=round(e, 3), w=[dict(t=x['w'], k=x['k'], s=x['s']) for x in g]))
    def acc(t):                          # keyword colour: hf.caps {"cu": [prefixes], "vg": [...], "rd": [...]}, else gold
        n = norm(t)
        for cls in ('cu', 'vg', 'rd'):
            if any(n.startswith(norm(x)) for x in HF.get('caps', {}).get(cls, [])): return cls
        return 'gd'
    html = []
    for gi, g in enumerate(G):
        spans = ''.join(f'<span id="cw-{gi}-{wi}" class="cw{(" k " + acc(w["t"])) if w["k"] else ""}">{w["t"]}</span> ' for wi, w in enumerate(g['w']))
        html.append(f'      <div id="cg-{gi}" class="cg">{spans.strip()}</div>')
    timing = [dict(s=g['s'], e=g['e'], w=[w['s'] for w in g['w']]) for g in G]
    css = """
  #root { position: absolute; inset: 0; pointer-events: none; }
  .cg { position: absolute; left: 50px; width: 800px; bottom: %CAPB%px; text-align: center; font: 900 66px/1.08 Inter, sans-serif; color: #F4EEE3;
    letter-spacing: -.01em; text-shadow: 0 4px 0 rgba(0,0,0,.35), 0 8px 30px rgba(0,0,0,.75); opacity: 0; visibility: hidden; overflow: visible; }
  .cw { display: inline-block; opacity: 0; }
  .k { padding: 0 4px; }
  .k.cu { color: #F0A066; } .k.vg { color: #8FE3CE; } .k.rd { color: #FF7A6E; } .k.gd { color: #F6C760; }
"""
    js = f"""
      const G = {J(timing)};
      G.forEach((g, gi) => {{
        const el = document.getElementById("cg-" + gi);
        tl.set(el, {{ visibility: "visible", opacity: 1 }}, g.s);
        g.w.forEach((ws, wi) => tl.fromTo("#cw-" + gi + "-" + wi, {{ opacity: 0, filter: "blur(6px)", y: 8 }},
          {{ opacity: 1, filter: "blur(0px)", y: 0, duration: 0.13, ease: "power3.out" }}, Math.max(g.s, ws - 0.04)));
        tl.to(el, {{ opacity: 0, duration: 0.12, ease: "power2.in" }}, g.e - 0.12);
        tl.set(el, {{ opacity: 0, visibility: "hidden" }}, g.e);
      }});
"""
    css = css.replace('%CAPB%', str(HF.get('capBottom', 600)))
    return scene_file('captions', '\n'.join(html), js, css).replace(COMMON_CSS, '')


def build():
    prep_media()
    os.makedirs(f'{PRJ}/compositions', exist_ok=True)
    hosts, cues = [], []
    for k, (name, cfg) in enumerate(SCENES):
        body, js, css, sc_cues = kit.build_scene(B, k, cfg)
        nxt = host_start(k + 1) - host_start(k) - 0.02 if k + 1 < NSC and not HF.get('motion') else None
        open(f'{PRJ}/compositions/{name}.html', 'w').write(scene_file(name, body, js, css, nxt))
        s0, s1 = host_start(k), host_end(k)
        hosts.append(f'''      <div id="{name}" data-composition-id="{name}" data-composition-src="compositions/{name}.html" data-start="{s0:.3f}" data-duration="{s1 - s0:.3f}"
        data-track-index="{k % 2 + 1}" data-track-kind="graphics" data-width="{W_}" data-height="{H_}" style="z-index:{k + 1}"></div>''')
        cues += [dict(t=round(s0 + t, 3), type=ty, gain=g) for t, ty, g in sc_cues if 0 <= t < s1 - s0]
    open(f'{PRJ}/compositions/captions.html', 'w').write(captions())
    hosts.append(f'''      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{DUR:.2f}"
        data-track-index="3" data-track-kind="captions" data-width="{W_}" data-height="{H_}" style="z-index:50"></div>''')
    index = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W_}, height={H_}" />
    <title>Wiki Roulette #{EP}: {E['title']}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ width: {W_}px; height: {H_}px; overflow: hidden; background: #0A0E0D; }}
      #main {{ position: relative; width: {W_}px; height: {H_}px; overflow: hidden; background: #0A0E0D; }}
      #progress {{ position: absolute; left: 0; right: 0; top: 0; height: 8px; }}
      #progress-bar {{ position: absolute; left: 0; top: 0; height: 8px; width: 100%; transform-origin: 0 50%; transform: scaleX(0);
        background: linear-gradient(90deg, #C9773F, #7FD3BF); }}
    </style>
  </head>
  <body>
    <div id="main" data-composition-id="main" data-start="0" data-duration="{DUR:.2f}" data-width="{W_}" data-height="{H_}" data-fps="30">
{chr(10).join(hosts)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
    open(f'{PRJ}/index.html', 'w').write(kit.theme_css(index, HF.get('theme')))
    if not os.path.exists(f'{PRJ}/hyperframes.json'):
        json.dump({'name': f'wiki-roulette-{EP}'}, open(f'{PRJ}/hyperframes.json', 'w'))
    # cues.json in render.mjs's format → score_cine.mjs / finish.sh / dub.py work unchanged
    os.makedirs(OUT, exist_ok=True)
    vo = [dict(t=st, type='vo', p=c['file'], gain=1) for st, c in zip(starts, clips)]
    meta = dict(dur=DUR, ep=dict(ep=int(EP), prog=E.get('prog', 0), mood=E.get('mood', 'calm'), openDur=bounds[1], kids=bool(E.get('kids'))),
                cues=sorted(vo + cues, key=lambda c: c['t']), w=W_, h=H_)
    json.dump(meta, open(f'{OUT}/cues.json', 'w'), indent=1)
    print(f'#{EP}: {DUR:.1f} s, scenes at', ', '.join(f'{b:.2f}' for b in bounds[:-1]), f'→ {PRJ}/index.html, {OUT}/cues.json')


def hf(*args):
    env = dict(os.environ, HYPERFRAMES_NO_TELEMETRY='1', DO_NOT_TRACK='1', HYPERFRAMES_SKIP_SKILLS='1')
    binary = os.environ.get('HF_BIN')
    cmd = [binary] if binary else ['npx', '--yes', f'hyperframes@{HF_VERSION}']
    return subprocess.run(cmd + list(args), env=env, check=True)


if __name__ == '__main__':
    build()
    if '--render' in sys.argv:
        import time; t0 = time.time()
        hf('render', PRJ, '--output', os.path.abspath(f'{OUT}/silent.mp4'), '--fps', '30', '--quality', 'delivery')
        print(f'hyperframes render: {time.time() - t0:.0f} s')
    if '--finish' in sys.argv:
        subprocess.run(['./finish.sh', EP], check=True)
        os.makedirs('dist', exist_ok=True); shutil.copy(f'{OUT}/wiki_roulette_{EP}.mp4', 'dist/')
        subprocess.run([sys.executable, 'dub.py', EP], check=False)
        text = open(f'uploads/{EP}.md').read() if os.path.exists(f'uploads/{EP}.md') else f'# Wiki Roulette #{EP}\n'
        cr = json.load(open(f'assets/photos/{EP}.credits.json')) if os.path.exists(f'assets/photos/{EP}.credits.json') else {}
        if cr:
            text += '\n\n**Media credits (fetched files):**\n' + '\n'.join(
                f"- {c['author']}, {c['license']}, via Wikimedia Commons ({c['page']})" for i, c in cr.items() if i in {p['id'] for p in E['photos']})
        open(f'dist/wiki_roulette_{EP}.md', 'w').write(text + f'\n\n_Rendered with HyperFrames {HF_VERSION}._\n')
