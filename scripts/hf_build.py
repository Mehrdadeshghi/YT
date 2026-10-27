#!/usr/bin/env python3
"""HyperFrames pilot (#201): episodes/<ep>.json + episodes/<ep>.voice.json + fetched media → HyperFrames project hf/<ep>/
→ silent render → our score/mix (score_cine.mjs via finish.sh) → DE/ES/FR dubs (dub.py).

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
import numpy as np
from PIL import Image

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
    if os.path.exists(f'{A}/front.jpg'): brown(f'{A}/front.jpg', f'{A}/front_brown.jpg')


def brown(src, dst):
    """COLOR SIMULATION (labelled on screen): the green patina hues of a real photo shifted to fresh-copper brown"""
    a = np.asarray(Image.open(src).convert('RGB').convert('HSV')).astype(np.float32) / 255
    h, s, v = a[..., 0] * 360, a[..., 1], a[..., 2]
    w = np.clip((h - 70) / 20, 0, 1) * np.clip((201 - h) / 8, 0, 1) * np.clip((s - 0.05) / 0.08, 0, 1)
    ns, nv = np.clip(s * 0.9 + 0.38, 0, 0.82), np.clip(v * 0.80, 0, 1)
    out = np.stack([a[..., 0] * (1 - w) + 22 / 360 * w, s * (1 - w) + ns * w, v * (1 - w) + nv * w], -1)
    Image.fromarray((out * 255).astype(np.uint8), 'HSV').convert('RGB').save(dst, quality=92)


# ------------------------------------------------------------------ shared look
COMMON_CSS = """
  #root { position: absolute; inset: 0; overflow: hidden; background: #0A0E0D; font-family: Inter, sans-serif; color: #F4EEE3; }
  .stage { position: absolute; inset: 0; }
  .fill { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
  .scrim-top { position: absolute; left: 0; right: 0; top: 0; height: 760px;
    background: linear-gradient(180deg, rgba(7,10,9,.94) 0%, rgba(7,10,9,.78) 38%, rgba(7,10,9,0) 100%); }
  .scrim-bot { position: absolute; left: 0; right: 0; bottom: 0; height: 980px;
    background: linear-gradient(0deg, rgba(7,10,9,.97) 0%, rgba(7,10,9,.86) 42%, rgba(7,10,9,0) 100%); }
  .chip { position: absolute; font: 700 28px Inter, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #F4EEE3;
    padding: 10px 18px 9px; border-radius: 999px; background: rgba(9,12,11,.66); border: 1.5px solid rgba(244,238,227,.30); white-space: nowrap; }
  .chip b { color: #8FD9C6; font-weight: 900; }
  .chip.cu b { color: #E8A06A; }
  .kicker { position: absolute; left: 0; right: 0; text-align: center; font: 900 40px Inter, sans-serif; letter-spacing: .22em; text-transform: uppercase; color: #F4EEE3; }
  .big { position: absolute; left: 0; right: 0; text-align: center; font-family: "League Gothic", sans-serif; text-transform: uppercase;
    line-height: .86; letter-spacing: .01em; color: #F4EEE3; text-shadow: 0 10px 40px rgba(0,0,0,.45); }
  .cu { color: #E08A4E; } .vg { color: #7FD3BF; } .rd { color: #FF5A4E; }
  .card { position: absolute; border-radius: 28px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 0 1.5px rgba(244,238,227,.16); }
"""

FONT_LINKS = ''


EXIT_SEL = ('.kicker', '.big', '.chip', '.glass', '.ruler', '.sub', '.stamp', '.stack', '.ticklabels', '.bar')


def scene_file(cid, body, script, extra_css='', exit_at=None):
    if exit_at is not None:              # text leaves as the next scene arrives (no two text layers on screen during a transition)
        sel = ', '.join(f'[data-composition-id="{cid}"] {c}' for c in EXIT_SEL)
        script += (f"      tl.to(document.querySelectorAll('{sel}'), {{ opacity: 0, filter: \"blur(6px)\", duration: 0.12, "
                   f"ease: \"power2.in\" }}, {exit_at:.3f});\n")
    return f"""<template>
  <style>{COMMON_CSS}{extra_css}
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


def J(x): return json.dumps(x)


# ------------------------------------------------------------------ scenes (story beats of #201)
def sc_hook(k):
    d = host_end(k) - host_start(k)
    T = dict(brown=wt(k, 'brown'), then=wt(k, 'then'), green=wt(k, 'green'), congress=wt(k, 'congress'), painted=wt(k, 'painted'))
    body = """
    <div id="h-stage" class="stage">
      <div id="h-cam" class="stage">
        <img id="h-brown" class="photo" src="assets/front_brown.jpg" alt="" />
        <img id="h-green" class="photo" src="assets/front.jpg" alt="" />
        <div id="h-paint" class="paint"></div>
      </div>
      <div id="h-divider" class="divider"><div class="knob"></div></div>
      <div class="scrim-top"></div>
      <div class="scrim-bot"></div>
      <div id="h-chipL" class="chip cu" style="left:40px; top:610px">1886 · <b>Color simulation</b></div>
      <div id="h-chipR" class="chip" style="right:40px; top:610px">Today · <b>Real photo</b></div>
      <div id="h-chipP" class="chip" style="left:40px; top:610px; opacity:0">Paint stroke · <b>Graphic</b></div>
      <div class="kicker" style="top:206px"><span id="h-k1">She was</span></div>
      <div class="big" style="top:262px; height:220px; overflow:visible">
        <div id="h-t1" class="line cu" style="font-size:236px">Born brown</div>
        <div id="h-t2" class="line vg" style="font-size:236px; opacity:0">Turned green</div>
        <div id="h-t3" class="line" style="font-size:200px; opacity:0">Paint it over?</div>
      </div>
      <div id="h-k2" class="kicker" style="top:206px; opacity:0">Then she</div>
      <div id="h-k3" class="kicker" style="top:206px; opacity:0">Congress almost voted to</div>
    </div>"""
    css = """
  .photo { position: absolute; width: 1700px; height: auto; left: -310px; top: 0px; }
  #h-green { clip-path: inset(0 0 0 850px); }
  .divider { position: absolute; top: 560px; height: 1360px; left: 538px; width: 4px; background: #F4EEE3; box-shadow: 0 0 24px rgba(244,238,227,.75); }
  .knob { position: absolute; left: -22px; top: 330px; width: 48px; height: 48px; border-radius: 50%; background: #F4EEE3; box-shadow: 0 6px 20px rgba(0,0,0,.4); }
  .line { position: absolute; left: 0; right: 0; }
  .paint { position: absolute; left: 0; top: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(90deg, #9A9893 0 22px, #A9A7A2 22px 38px, #92908B 38px 60px); opacity: .93;
    clip-path: inset(0 0 100% 0); }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      tl.fromTo("#h-cam", {{ scale: 1.0, transformOrigin: "50% 40%" }}, {{ scale: 1.07, duration: D, ease: "none" }}, 0);
      // frame 0 = the hook: split statue (simulated 1886 brown | real green) + title already on screen
      tl.fromTo("#h-green", {{ clipPath: "inset(0 0 0 850px)" }}, {{ clipPath: "inset(0 0 0 1700px)", duration: 0.55, ease: "power2.inOut" }}, T.brown - 0.1);
      tl.fromTo("#h-divider", {{ x: 0 }}, {{ x: 542, duration: 0.55, ease: "power2.inOut" }}, T.brown - 0.1);
      tl.to("#h-chipR", {{ opacity: 0, duration: 0.2 }}, T.brown);
      // colour flood: brown → real green on "green"
      tl.to("#h-green", {{ clipPath: "inset(0 0 0 0px)", duration: 0.7, ease: "power2.inOut" }}, T.green - 0.25);
      tl.to("#h-divider", {{ x: -545, duration: 0.7, ease: "power2.inOut" }}, T.green - 0.25);
      tl.to("#h-chipL", {{ opacity: 0, duration: 0.2 }}, T.green - 0.2);
      tl.to("#h-chipR", {{ opacity: 1, duration: 0.25 }}, T.green + 0.3);
      // title: slot-machine roll  BORN BROWN → TURNED GREEN → PAINT IT OVER?
      tl.to("#h-t1", {{ yPercent: -60, opacity: 0, filter: "blur(8px)", duration: 0.22, ease: "power3.in" }}, T.then);
      tl.to("#h-k1", {{ opacity: 0, duration: 0.15 }}, T.then);
      tl.fromTo("#h-k2", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, T.then + 0.05);
      tl.fromTo("#h-t2", {{ yPercent: 60, opacity: 0, filter: "blur(8px)" }}, {{ yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.32, ease: "expo.out" }}, T.green - 0.12);
      tl.to("#h-t2", {{ yPercent: -60, opacity: 0, filter: "blur(8px)", duration: 0.22, ease: "power3.in" }}, T.congress - 0.1);
      tl.to("#h-k2", {{ opacity: 0, duration: 0.15 }}, T.congress - 0.1);
      tl.fromTo("#h-k3", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, T.congress);
      tl.fromTo("#h-t3", {{ yPercent: 60, opacity: 0, filter: "blur(8px)" }}, {{ yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.32, ease: "expo.out" }}, T.congress + 0.05);
      // the paint roller (GRAPHIC) comes down over the real statue on "painted"
      tl.to("#h-paint", {{ clipPath: "inset(0 0 46% 0)", duration: 0.75, ease: "power2.inOut" }}, T.painted - 0.05);
      tl.to("#h-chipR", {{ opacity: 0, duration: 0.15 }}, T.painted - 0.05);
      tl.to("#h-chipP", {{ opacity: 1, duration: 0.25 }}, T.painted + 0.1);
"""
    cues = [(T['brown'] - 0.1, 'swish', 0.6), (T['green'] - 0.25, 'whoosh', 0.7), (T['congress'], 'swish', 0.5), (T['painted'], 'paper', 0.9)]
    return body, js, css, cues


def sc_copper(k):
    d = host_end(k) - host_start(k)
    T = dict(copper=wt(k, 'copper'), less=wt(k, 'less'), tenth=wt(k, 'tenth'))
    body = """
    <div id="c-stage" class="stage">
      <div id="c-shot1" class="stage">
        <img id="c-head" class="fill" src="assets/head.jpg" alt="" style="object-position: 50% 30%" />
        <div class="scrim-top"></div><div class="scrim-bot"></div>
        <div class="chip" style="left:40px; top:700px">Paris, 1880s · <b>Real photo</b></div>
        <div id="c-k1" class="kicker" style="top:206px">Her skin is</div>
        <div id="c-word" class="big cu" style="top:262px; font-size:250px">Copper</div>
      </div>
      <div id="c-shot2" class="stage" style="opacity:0">
        <div class="kicker" style="top:206px">Thickness</div>
        <div class="big" style="top:262px; font-size:250px"><span id="c-num">0.000</span><span class="unit"> in</span></div>
        <div id="c-ruler" class="ruler">
          <div class="ticks"></div>
          <div id="c-sliver" class="sliver"></div>
          <div class="rl rl0">0</div><div class="rl rl1">1/10 in</div>
        </div>
      </div>
    </div>"""
    css = """
  .unit { font-size: 120px; color: #E08A4E; }
  .ruler { position: absolute; left: 90px; width: 900px; top: 505px; height: 60px; border-left: 4px solid #F4EEE3; border-right: 4px solid #F4EEE3; border-bottom: 4px solid #F4EEE3; }
  .ticks { position: absolute; inset: 30px 0 0 0; background: repeating-linear-gradient(90deg, rgba(244,238,227,.75) 0 3px, transparent 3px 90px); }
  .sliver { position: absolute; left: 0; bottom: 0; height: 52px; width: 846px; background: linear-gradient(90deg,#9C4E22,#E89A5E,#B8622E);
    transform-origin: 0 50%; box-shadow: 0 0 30px rgba(232,154,94,.6); }
  .rl { position: absolute; top: 72px; font: 800 30px Inter, sans-serif; letter-spacing: .08em; color: #F4EEE3; }
  .rl0 { left: -10px; } .rl1 { right: -20px; }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      // entrance: whip from the right (the cut sits on the fastest frame)
      tl.fromTo("#c-stage", {{ x: 320, filter: "blur(16px)" }}, {{ x: 0, filter: "blur(0px)", duration: 0.34, ease: "expo.out" }}, 0);
      tl.fromTo("#c-head", {{ scale: 1.12 }}, {{ scale: 1.0, duration: Math.max(0.3, T.less - 0.12), ease: "power2.out" }}, 0);
      tl.fromTo("#c-word", {{ opacity: 0, filter: "blur(10px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.out" }}, Math.max(0.05, T.copper - 0.08));
      // punch cut to the copper sheet + counter
      tl.set("#c-shot2", {{ opacity: 1 }}, T.less - 0.08);
      tl.set(["#c-k1", "#c-word"], {{ opacity: 0 }}, T.less - 0.07);
      tl.to("#c-head", {{ scale: 1.16, duration: 0.5, ease: "expo.out" }}, T.less - 0.08);
      const n = {{ v: 0 }};
      tl.fromTo(n, {{ v: 0 }}, {{ v: 0.094, duration: 0.7, ease: "power3.out", onUpdate: () => {{ document.getElementById("c-num").textContent = n.v.toFixed(3); }} }}, T.less);
      tl.fromTo("#c-ruler", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }}, T.less);
      tl.fromTo("#c-sliver", {{ scaleX: 1 }}, {{ scaleX: 0.94, duration: 0.7, ease: "power3.out" }}, T.tenth);
"""
    cues = [(0.0, 'whoosh', 0.6), (T['less'] - 0.08, 'thump', 0.6)] + [(T['less'] + 0.05 * i, 'tick', 0.5) for i in range(8)]
    return body, js, css, cues


def sc_patina(k):
    d = host_end(k) - host_start(k)
    T = dict(air=wt(k, 'air'), water=wt(k, 'water'), acid=wt(k, 'acid'), green=wt(k, 'green'), by=wt(k, 'by'), patina=wt(k, 'patina'), completely=wt(k, 'completely'))
    body = """
    <div id="p-flood" class="stage" style="background: radial-gradient(120% 70% at 50% 45%, #163A33 0%, #0A1513 55%, #070B0A 100%)"></div>
    <div id="p-stage" class="stage">
      <div class="kicker" style="top:196px">The year</div>
      <div id="p-year" class="big" style="top:250px; font-size:260px; color:#E08A4E">1886</div>
      <div class="bar"><div id="p-fill" class="fill2"></div></div>
      <div class="ticklabels"><span>1886</span><span>1902</span><span>1906</span></div>
      <div id="p-card" class="card" style="left:40px; top:630px; width:1000px; height:562px">
        <video id="p-clip" class="clip fill" src="assets/drone.mp4" muted playsinline data-start="0" data-duration="%DRONE%"></video>
        <div class="chip" style="left:22px; top:22px">Drone · <b>Real footage</b></div>
        <div id="p-c1" class="chip agent" style="left:22px; top:86px">Air</div>
        <div id="p-c2" class="chip agent" style="left:140px; top:86px">Water</div>
        <div id="p-c3" class="chip agent" style="left:300px; top:86px">Acid pollution</div>
        <div id="p-stamp" class="chip done" style="left:22px; top:86px; opacity:0">1906 · <b>Fully covered</b></div>
      </div>
    </div>"""
    body = body.replace('%DRONE%', f'{min(d, 6.9):.2f}')
    css = """
  .bar { position: absolute; left: 90px; right: 90px; top: 500px; height: 18px; border-radius: 9px; background: rgba(244,238,227,.14); overflow: hidden; }
  .fill2 { position: absolute; inset: 0; background: linear-gradient(90deg, #C9773F 0%, #A98A4C 50%, #5FB8A5 100%); transform-origin: 0 50%; transform: scaleX(0); }
  .ticklabels { position: absolute; left: 90px; right: 90px; top: 530px; display: flex; justify-content: space-between; font: 800 30px Inter, sans-serif; color: rgba(244,238,227,.8); letter-spacing: .06em; }
  .ticklabels span:nth-child(2) { margin-left: 420px; }
  .agent { background: rgba(9,12,11,.78); }
  .done { border-color: #7FD3BF; }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      // entrance: colour flood — the green ground opens from the centre, the stage zooms through
      tl.fromTo("#p-flood", {{ clipPath: "circle(0% at 50% 55%)" }}, {{ clipPath: "circle(120% at 50% 55%)", duration: 0.5, ease: "power2.inOut" }}, 0);
      tl.fromTo("#p-stage", {{ scale: 1.18, opacity: 0, filter: "blur(10px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }}, 0.12);
      ["#p-c1", "#p-c2", "#p-c3"].forEach((id, i) => tl.fromTo(id, {{ opacity: 0, y: 24, filter: "blur(6px)" }},
        {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, ease: "power3.out" }}, [T.air, T.water, T.acid][i] - 0.05));
      // years tick 1886 → 1902 → 1906 while the bar turns from copper to verdigris
      const y = {{ v: 1886 }};
      const upd = () => {{ document.getElementById("p-year").textContent = Math.round(y.v); }};
      tl.fromTo(y, {{ v: 1886 }}, {{ v: 1902, duration: Math.max(0.6, T.by - T.green), ease: "power1.inOut", onUpdate: upd }}, T.green - 0.2);
      tl.to(y, {{ v: 1906, duration: 0.6, ease: "power3.out", onUpdate: upd }}, T.by + 0.15);
      tl.fromTo("#p-fill", {{ scaleX: 0 }}, {{ scaleX: 0.8, duration: Math.max(0.6, T.by - T.green), ease: "power1.inOut" }}, T.green - 0.2);
      tl.to("#p-fill", {{ scaleX: 1, duration: 0.6, ease: "power3.out" }}, T.by + 0.15);
      tl.fromTo("#p-year", {{ color: "#E08A4E" }}, {{ color: "#7FD3BF", duration: T.by - T.green + 0.8, ease: "power1.inOut" }}, T.green - 0.2);
      tl.to(["#p-c1", "#p-c2", "#p-c3"], {{ opacity: 0, duration: 0.15 }}, T.patina - 0.1);
      tl.fromTo("#p-stamp", {{ opacity: 0, scale: 1.25 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, T.completely);
"""
    cues = [(0.0, 'whoosh', 0.7), (T['air'], 'pop', 0.4), (T['water'], 'pop', 0.4), (T['acid'], 'pop', 0.4),
            (T['by'] + 0.15, 'tick', 0.5), (T['by'] + 0.3, 'tick', 0.5), (T['by'] + 0.45, 'tick', 0.5), (T['completely'], 'ding', 0.6)]
    return body, js, css, cues


def sc_money(k):
    d = host_end(k) - host_start(k)
    T = dict(corrosion=wt(k, 'corrosion'), approved=wt(k, 'approved'), money=wt(k, '62800'), repairs=wt(k, 'repairs'), paint=wt(k, 'paint'), inside=wt(k, 'inside'))
    body = """
    <div id="m-stage" class="stage">
      <div id="m-cam" class="stage">
        <img id="m-photo" src="assets/front.jpg" alt="" style="position:absolute; width:2500px; left:-710px; top:-150px" />
        <div id="m-paint" class="paint"></div>
      </div>
      <div class="scrim-top"></div><div class="scrim-bot"></div>
      <div class="chip" style="left:40px; top:640px" id="m-lab1">Real photo</div>
      <div class="chip" style="left:40px; top:640px; opacity:0" id="m-lab2">Paint · <b>Graphic</b></div>
      <div class="kicker" style="top:196px">U.S. Congress, 1906</div>
      <div id="m-amount" class="big" style="top:250px; font-size:250px; opacity:0">$0</div>
      <div id="m-sub" class="sub">For repairs + paint · inside and out</div>
      <div id="m-myth" class="chip myth" style="left:40px; top:720px">Mistaken for <b>corrosion</b></div>
      <div id="m-stamp" class="stamp">Paint her?</div>
    </div>"""
    css = """
  .paint { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, #9A9893 0 22px, #A9A7A2 22px 38px, #92908B 38px 60px); opacity: .94; clip-path: inset(0 0 100% 0); }
  .sub { position: absolute; left: 0; right: 0; top: 500px; text-align: center; font: 800 36px Inter, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #F4EEE3; }
  .myth { border-color: #FF5A4E; }
  .myth b { color: #FF7A6E; }
  .stamp { position: absolute; left: 150px; top: 860px; padding: 14px 34px 6px; font-family: "League Gothic", sans-serif; font-size: 150px; line-height: 1;
    text-transform: uppercase; color: #FF5A4E; border: 10px solid #FF5A4E; border-radius: 22px; transform: rotate(-9deg); opacity: 0; background: rgba(10,6,6,.25); }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      // entrance: zoom through — the next world comes in large and settles
      tl.fromTo("#m-stage", {{ scale: 1.35, opacity: 0, filter: "blur(14px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.42, ease: "expo.out" }}, 0);
      tl.fromTo("#m-cam", {{ y: 0 }}, {{ y: -60, duration: D, ease: "none" }}, 0);
      tl.fromTo("#m-myth", {{ opacity: 0, x: -30 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }}, T.corrosion - 0.05);
      const m = {{ v: 0 }};
      const f = () => {{ const v = Math.round(m.v / 100) * 100; document.getElementById("m-amount").textContent = "$" + v.toString().replace(/\\B(?=(\\d{{3}})+(?!\\d))/g, ","); }};
      tl.fromTo(m, {{ v: 0 }}, {{ v: 62800, duration: 1.3, ease: "power3.out", onUpdate: f }}, T.money - 0.1);
      tl.fromTo("#m-amount", {{ scale: 0.9, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 1.3, ease: "power3.out" }}, T.money - 0.1);
      tl.fromTo("#m-sub", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, T.repairs - 0.1);
      tl.to("#m-myth", {{ opacity: 0, duration: 0.2 }}, T.paint - 0.2);
      // the paint comes down on "paint her", the stamp lands
      tl.to("#m-paint", {{ clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power2.inOut" }}, T.paint - 0.1);
      tl.to("#m-lab1", {{ opacity: 0, duration: 0.15 }}, T.paint - 0.1);
      tl.to("#m-lab2", {{ opacity: 1, duration: 0.2 }}, T.paint);
      tl.fromTo("#m-stamp", {{ opacity: 0, scale: 1.7 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.in" }}, T.inside - 0.1);
"""
    cues = [(0.0, 'whoosh', 0.7), (T['corrosion'], 'wrong', 0.6)] + [(T['money'] - 0.1 + 0.07 * i, 'tick', 0.45) for i in range(12)] + \
           [(T['money'] + 1.1, 'coin', 0.6), (T['paint'] - 0.1, 'paper', 0.9), (T['inside'] + 0.12, 'stamp', 1.0)]
    return body, js, css, cues


def sc_verdict(k):
    d = host_end(k) - host_start(k)
    T = dict(protested=wt(k, 'protested'), army=wt(k, 'army'), green=wt(k, 'green'), protects=wt(k, 'protects'))
    body = """
    <div id="v-stage" class="stage">
      <img id="v-photo" class="fill" src="assets/torch.jpg" alt="" style="object-position: 50% 40%" />
      <div class="scrim-top"></div><div class="scrim-bot"></div>
      <div class="chip" style="left:40px; top:1030px">Statue's torch hand · <b>Real photo</b></div>
      <div id="v-protest" class="big" style="top:230px; font-size:210px">Public <span class="rd">protest</span></div>
      <div id="v-card" class="glass">
        <div class="eyebrow">U.S. Army Corps of Engineers</div>
        <div class="verdict"><span id="v-check" class="check">&#10003;</span> The patina <span class="vg">protects</span> the copper</div>
        <div class="quote">&ldquo;…softened the outlines of the Statue and made it beautiful.&rdquo;</div>
      </div>
    </div>"""
    css = """
  .glass { position: absolute; left: 40px; right: 40px; top: 470px; padding: 34px 40px 36px; border-radius: 30px; background: rgba(10,16,15,.80);
    border: 1.5px solid rgba(127,211,191,.45); box-shadow: 0 30px 80px rgba(0,0,0,.5); opacity: 0; }
  .eyebrow { font: 900 30px Inter, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #7FD3BF; }
  .verdict { margin-top: 18px; font-family: "League Gothic", sans-serif; font-size: 112px; line-height: .95; text-transform: uppercase; color: #F4EEE3; }
  .check { display: inline-block; width: 92px; height: 92px; border-radius: 50%; background: #5FB8A5; color: #0A0E0D; text-align: center;
    font: 900 70px/92px Inter, sans-serif; vertical-align: 8px; margin-right: 10px; }
  .quote { margin-top: 20px; font: 400 italic 36px/1.3 "EB Garamond", serif; color: rgba(244,238,227,.88); }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      // entrance: vertical whip
      tl.fromTo("#v-stage", {{ y: -360, filter: "blur(16px)" }}, {{ y: 0, filter: "blur(0px)", duration: 0.36, ease: "expo.out" }}, 0);
      tl.fromTo("#v-photo", {{ scale: 1.0 }}, {{ scale: 1.08, duration: D, ease: "none" }}, 0);
      tl.fromTo("#v-protest", {{ opacity: 0, scale: 1.4 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.out" }}, T.protested - 0.15);
      tl.to("#v-protest", {{ opacity: 0, y: -40, filter: "blur(8px)", duration: 0.2, ease: "power3.in" }}, T.army - 0.1);
      tl.fromTo("#v-card", {{ opacity: 0, y: 60 }}, {{ opacity: 1, y: -180, duration: 0.45, ease: "expo.out" }}, T.army - 0.05);
      tl.fromTo("#v-check", {{ scale: 0, rotate: -40 }}, {{ scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" }}, T.protects - 0.05);
"""
    cues = [(0.0, 'whoosh', 0.7), (T['protested'] - 0.1, 'thump', 0.7), (T['army'], 'swish', 0.5), (T['protects'], 'ding', 0.8)]
    return body, js, css, cues


def sc_armor(k):
    d = host_end(k) - host_start(k)
    ctai = [i for i, s in enumerate(segs) if s.get('cta')][0]
    T = dict(inside=wt(k, 'inside'), green=wt(k, 'green'), armor=wt(k, 'armor'), cta=round(starts[ctai] - host_start(k), 3),
             brown2=wt(k, 'brown', 1), green2=wt(k, 'green', 2), comment=wt(k, 'comment'))
    body = """
    <div id="a-stage" class="stage">
      <div id="a-part1" class="stage">
        <video id="a-clip" class="clip fill" src="assets/boat2.mp4" muted playsinline data-start="0" data-duration="%BOAT%"></video>
        <div class="scrim-top"></div><div class="scrim-bot"></div>
        <div class="chip" style="left:40px; top:1060px">From the ferry · <b>Real footage</b></div>
        <div id="a-title" class="big vg" style="top:220px; font-size:230px; opacity:0">Her armor</div>
        <div class="stack">
          <div id="a-l1" class="layer l1"><span>Patina · protective layer</span></div>
          <div id="a-l2" class="layer l2"><span>Copper skin · 0.094 in</span></div>
          <div id="a-l3" class="layer l3"><span>Paint · inside only</span></div>
        </div>
        <div class="chip" id="a-glab" style="left:40px; top:820px; opacity:0">Cross-section · <b>Graphic</b></div>
      </div>
      <div id="a-part2" class="stage" style="opacity:0; background: #0A0E0D">
        <div class="kicker" style="top:200px">Which Lady Liberty?</div>
        <div class="big" style="top:256px; font-size:190px"><span class="cu">Brown</span> or <span class="vg">green</span></div>
        <div id="a-tb" class="tile tb"><img src="assets/front_brown.jpg" alt="" /><div class="tl">Brown</div><div class="tsub">simulation</div></div>
        <div id="a-tg" class="tile tg"><img src="assets/front.jpg" alt="" /><div class="tl">Green</div><div class="tsub">real photo</div></div>
        <div id="a-ask" class="ask">Comment your pick</div>
      </div>
      <div id="a-loop" class="stage" style="opacity:0">
        <img src="assets/front_brown.jpg" alt="" class="lp" />
        <img src="assets/front.jpg" alt="" class="lp" style="clip-path: inset(0 0 0 850px)" />
        <div class="scrim-top"></div>
        <div class="kicker" style="top:206px">She was</div>
        <div class="big cu" style="top:262px; font-size:236px">Born brown</div>
      </div>
    </div>"""
    body = body.replace('%BOAT%', f'{min(T["cta"] + 0.5, 4.9):.2f}')
    css = """
  .stack { position: absolute; left: 60px; width: 780px; top: 470px; }
  .layer { height: 92px; margin-bottom: 10px; border-radius: 16px; display: flex; align-items: center; padding-left: 28px;
    font: 900 34px Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; opacity: 0; box-shadow: 0 16px 40px rgba(0,0,0,.45); }
  .l1 { background: linear-gradient(90deg, #3E9C89, #7FD3BF); color: #06201B; }
  .l2 { background: linear-gradient(90deg, #9C4E22, #E89A5E); color: #2A1205; }
  .l3 { background: linear-gradient(90deg, #77756F, #A9A7A2); color: #1A1A18; }
  .tile { position: absolute; top: 470px; width: 470px; height: 560px; border-radius: 30px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,.6); }
  .tile img { position: absolute; width: 1400px; left: -470px; top: -150px; }
  .tb { left: 40px; border: 6px solid #E08A4E; } .tg { left: 570px; border: 6px solid #7FD3BF; }
  .tl { position: absolute; left: 0; right: 0; top: 18px; text-align: center; font-family: "League Gothic", sans-serif; font-size: 110px; text-transform: uppercase; color: #F4EEE3; text-shadow: 0 6px 24px rgba(0,0,0,.7); }
  .tsub { position: absolute; left: 0; right: 0; top: 128px; text-align: center; font: 800 26px Inter, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: rgba(244,238,227,.92); text-shadow: 0 2px 10px rgba(0,0,0,.8); }
  .ask { position: absolute; left: 40px; width: 790px; top: 1060px; text-align: center; padding: 22px 0 20px; border-radius: 999px; background: #F4EEE3; color: #0A0E0D;
    font: 900 44px Inter, sans-serif; letter-spacing: .1em; text-transform: uppercase; opacity: 0; }
  .lp { position: absolute; width: 1700px; left: -310px; top: 0px; }
"""
    js = f"""
      const T = {J(T)}, D = {d:.3f};
      // entrance: iris opens from the statue
      tl.fromTo("#a-stage", {{ clipPath: "circle(0% at 50% 45%)" }}, {{ clipPath: "circle(110% at 50% 45%)", duration: 0.5, ease: "power2.inOut" }}, 0);
      tl.fromTo("#a-l3", {{ opacity: 0, x: -60 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }}, T.inside - 0.2);
      tl.fromTo("#a-l2", {{ opacity: 0, x: -60 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }}, T.inside - 0.05);
      tl.fromTo("#a-glab", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, T.inside);
      tl.fromTo("#a-l1", {{ opacity: 0, y: -140, scale: 1.08 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }}, T.green - 0.05);
      tl.fromTo("#a-title", {{ opacity: 0, filter: "blur(10px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.out" }}, T.armor - 0.1);
      // the one ask: brown or green (mirrors the hook's split)
      tl.to("#a-part2", {{ opacity: 1, duration: 0.25, ease: "power2.out" }}, T.cta - 0.2);
      tl.fromTo("#a-tb", {{ opacity: 0, x: -80, rotate: -4 }}, {{ opacity: 1, x: 0, rotate: 0, duration: 0.45, ease: "back.out(1.3)" }}, T.cta - 0.1);
      tl.fromTo("#a-tg", {{ opacity: 0, x: 80, rotate: 4 }}, {{ opacity: 1, x: 0, rotate: 0, duration: 0.45, ease: "back.out(1.3)" }}, T.cta);
      tl.to("#a-tb", {{ scale: 1.05, duration: 0.25, ease: "power3.out" }}, T.brown2);
      tl.to("#a-tb", {{ scale: 1.0, duration: 0.25, ease: "power3.out" }}, T.green2 - 0.05);
      tl.to("#a-tg", {{ scale: 1.05, duration: 0.25, ease: "power3.out" }}, T.green2 - 0.05);
      tl.fromTo("#a-ask", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }}, T.comment - 0.1);
      // loop: the last frames cross into frame 1 of the video
      tl.to("#a-loop", {{ opacity: 1, duration: 0.4, ease: "power1.inOut" }}, D - 0.45);
"""
    cues = [(0.0, 'whoosh', 0.7), (T['inside'] - 0.2, 'pop', 0.5), (T['inside'], 'pop', 0.5), (T['green'], 'land', 0.8),
            (T['cta'] - 0.1, 'pop', 0.6), (T['cta'], 'pop', 0.6), (T['comment'], 'click', 0.6)]
    return body, js, css, cues


SCENES = [('hook', sc_hook), ('copper', sc_copper), ('patina', sc_patina), ('money', sc_money), ('verdict', sc_verdict), ('armor', sc_armor)]
assert len(SCENES) == NSC


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
    def acc(t):
        n = norm(t)
        if any(n.startswith(x) for x in ('brown', 'copper')): return 'cu'
        if any(n.startswith(x) for x in ('green', 'patina', 'protect', 'armor', 'layer')): return 'vg'
        if any(n.startswith(x) for x in ('corrosion', 'paint', 'protest', 'acid')): return 'rd'
        return 'gd'
    html = []
    for gi, g in enumerate(G):
        spans = ''.join(f'<span id="cw-{gi}-{wi}" class="cw{(" k " + acc(w["t"])) if w["k"] else ""}">{w["t"]}</span> ' for wi, w in enumerate(g['w']))
        html.append(f'      <div id="cg-{gi}" class="cg">{spans.strip()}</div>')
    timing = [dict(s=g['s'], e=g['e'], w=[w['s'] for w in g['w']]) for g in G]
    css = """
  #root { position: absolute; inset: 0; pointer-events: none; }
  .cg { position: absolute; left: 50px; width: 800px; bottom: 600px; text-align: center; font: 900 66px/1.08 Inter, sans-serif; color: #F4EEE3;
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
    return scene_file('captions', '\n'.join(html), js, css.replace('#root {', '#root {', 1)).replace(COMMON_CSS, '')


def build():
    prep_media()
    os.makedirs(f'{PRJ}/compositions', exist_ok=True)
    hosts, cues = [], []
    for k, (name, fn) in enumerate(SCENES):
        body, js, css, sc_cues = fn(k)
        nxt = host_start(k + 1) - host_start(k) - 0.02 if k + 1 < NSC else None
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
    open(f'{PRJ}/index.html', 'w').write(index)
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
        open(f'dist/wiki_roulette_{EP}.md', 'w').write(text + f'\n\n_Rendered with HyperFrames {HF_VERSION} (pilot)._\n')
