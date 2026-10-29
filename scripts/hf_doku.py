"""DOKU style for HyperFrames Shorts — "Doku-Kino + Akzente", the Wiki Roulette house look since Oct 29 2026.
Opt in per episode: "hf": {"style": "doku"} (or hf_build.py --style doku). Used by scripts/hf_build.py.

Documentary cinema first (the look of proto/real, release real-1), kinetic type only as a handful of accents:
  * every shot is a REAL photo / footage / painting / graphic LARGE and full-bleed with a slow camera move (push, pull,
    drift left, rise; constant speed, so it is still moving at every cut). Light film grade in CSS (warm, slightly
    desaturated, lifted blacks), film grain + halation + vignette in post (post() on the silent render, ffmpeg).
    Very bright images with white borders (scans, diagrams, objects on white) become an archival PLATE: the image framed on a
    blurred dark copy of itself, instead of a white full-bleed frame.
  * honest source chip top-left in mono ("● REAL PHOTO · Hospital corridor"), a thin scene-index tick HUD top-right.
  * small calm captions low-middle (word-synced: each group appears, each word brightens when spoken; *starred* words in
    pale amber, numbers in amber). No captions during the hook title and the end card (the text is on screen there).
  * cuts: cut-the-curve LEFT between scenes (the current), a zoom-through push into the scene that names the thing,
    rack-focus blur-cuts to a tighter crop of the same photo inside long scenes, cut-the-curve LEFT between two photos.
  * ACCENTS (3-5 per video, nothing else slams): the hook title at frame 1 (re-hit when its 2nd line is spoken), the
    name reveal (the first multi-word *starred* run of scene 1, with its lead-in words as a mono kicker), up to two
    spoken numbers from the caps (counter + measured tick ruler; "9 out of 10" -> 9 / 10) and the payoff line (the last
    starred run of the last line before the CTA, grown to 2-3 words).
  * end card: calm question + the two answer photos (each lights up on its spoken name) + "Comment A or B" pill.
Overrides (optional): "hf": {"doku": {"accent": "#E9A84A", "payoff": "word to slam", "plate": [ids], "noplate": [ids],
"term": false}}; per scene scenes[i]["hf"]["kinetic"]["media"] = [ids] picks the shots (shared with kinetic).
"""
import json, math, os, re, subprocess
from PIL import Image, ImageFilter, ImageStat
import hf_kinetic as K

W_, H_ = 1080, 1920
J = json.dumps
norm = K.norm
esc, fit, clean = K.esc, K.fit, K.clean
STOP = K.STOP
MOVES = ['push', 'driftL', 'pull', 'rise']
TR = 170                                            # cut-the-curve travel (px); the media layer is oversized by 240 px

CSS = """
  .dseam { position: absolute; inset: 0; overflow: hidden; background: #0B0907; }
  .dshot { position: absolute; inset: 0; overflow: hidden; opacity: 0; }
  .dcam { position: absolute; left: -240px; top: -60px; width: 1560px; height: 2040px; transform-origin: 50% 50%; }
  .dcam img.full, .dcam video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover;
    filter: saturate(.8) contrast(1.06) brightness(.94) sepia(.14); }
  .dcam img.blur { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
  .plate { position: absolute; box-shadow: 0 40px 120px rgba(0,0,0,.75), 0 0 0 2px rgba(243,236,224,.22); overflow: hidden; }
  .plate img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.75) contrast(1.04) brightness(.9) sepia(.22); }
  .dgrade { position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(180deg, rgba(12,9,6,.62) 0%, rgba(12,9,6,.18) 18%, rgba(12,9,6,0) 32%, rgba(12,9,6,0) 50%,
      rgba(12,9,6,.42) 63%, rgba(12,9,6,.5) 72%, rgba(12,9,6,.2) 84%, rgba(12,9,6,.55) 100%); }
  .dwarm { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: soft-light;
    background: radial-gradient(90% 60% at 60% 30%, rgba(255,196,120,.32), rgba(255,170,90,0) 70%), linear-gradient(180deg, rgba(40,60,80,0) 50%, rgba(30,50,70,.25)); }
  .dacc { position: absolute; inset: 0; background: #0B0907; opacity: 0; pointer-events: none; }
  .dtag { position: absolute; left: 56px; top: 150px; font: 500 24px/1 "JetBrains Mono", monospace; letter-spacing: .12em; color: #F3ECE0;
    padding: 11px 16px 10px 40px; background: rgba(10,8,6,.5); border: 1px solid rgba(243,236,224,.32); white-space: nowrap; opacity: 0;
    text-transform: uppercase; }
  .dtag.sm { font-size: 20px; }
  .dtag i { position: absolute; left: 15px; top: 50%; margin-top: -6px; width: 12px; height: 12px; border-radius: 50%; background: #9C968C; }
  .dtag.real i { background: %ACCENT%; }
  .dtag b { font-weight: 500; color: #FFFFFF; }
  .dhud { position: absolute; right: 56px; top: 156px; width: 190px; text-align: right; font: 500 22px/1 "JetBrains Mono", monospace;
    letter-spacing: .14em; color: rgba(243,236,224,.78); }
  .dhud .rule { position: relative; height: 16px; margin-top: 12px; border-top: 2px solid rgba(243,236,224,.6); }
  .dhud .rule i { position: absolute; top: 0; width: 2px; height: 9px; background: rgba(243,236,224,.6); }
  .dhud .rule i.on { height: 16px; background: %ACCENT%; width: 4px; margin-left: -1px; }
  .dk { position: absolute; left: 60px; right: 60px; text-align: center; }
  .dbar { width: 120px; height: 7px; background: %ACCENT%; margin: 0 auto 26px; transform-origin: 50% 50%; }
  .dkick { font: 500 30px/1.2 "JetBrains Mono", monospace; letter-spacing: .18em; color: rgba(243,236,224,.86); text-transform: uppercase;
    text-shadow: 0 2px 14px rgba(0,0,0,.8); margin-bottom: 18px; }
  .dl1 { font: 800 84px/1.02 Inter, sans-serif; color: #F3ECE0; letter-spacing: -.02em; text-transform: uppercase;
    text-shadow: 0 2px 6px rgba(0,0,0,.5), 0 10px 40px rgba(0,0,0,.6); }
  .dbig { font-family: "League Gothic", sans-serif; line-height: .84; text-transform: uppercase; color: %ACCENT%; white-space: nowrap;
    letter-spacing: .01em; text-shadow: 0 12px 50px rgba(0,0,0,.6); transform-origin: 50% 60%; }
  .dbig.w { color: #F3ECE0; }
  .dbig span { display: inline-block; }
  .dnum { font-family: "League Gothic", sans-serif; line-height: .84; color: %ACCENT%; white-space: nowrap; text-shadow: 0 12px 50px rgba(0,0,0,.6);
    transform-origin: 50% 60%; }
  .dnum em { font-style: normal; color: #F3ECE0; }
  .druler { position: relative; width: 600px; height: 30px; margin: 26px auto 0; border-top: 2px solid rgba(243,236,224,.8); transform-origin: 0 50%; }
  .druler i { position: absolute; top: 0; width: 2px; background: rgba(243,236,224,.8); }
  .druler b { position: absolute; top: -10px; left: -8px; width: 16px; height: 16px; background: %ACCENT%; transform: rotate(45deg); }
  .druler .fill { position: absolute; left: 0; top: -2px; height: 2px; width: 600px; background: %ACCENT%; transform-origin: 0 50%; }
  .dq { position: absolute; left: 60px; right: 60px; top: 300px; text-align: center; }
  .dq .dkick { margin-bottom: 14px; }
  .dq .dl1 { font-size: 78px; }
  .dtile { position: absolute; top: 560px; width: 420px; height: 400px; overflow: hidden; opacity: 0; box-shadow: 0 30px 90px rgba(0,0,0,.7);
    border: 2px solid rgba(243,236,224,.55); }
  .dtile img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(.8) sepia(.14) brightness(.9); }
  .dtile .shade { position: absolute; left: 0; right: 0; bottom: 0; height: 190px; background: linear-gradient(180deg, rgba(10,8,6,0), rgba(10,8,6,.85)); }
  .dtile .nm { position: absolute; left: 0; right: 0; bottom: 16px; text-align: center; font-family: "League Gothic", sans-serif; line-height: .84;
    text-transform: uppercase; color: #F3ECE0; }
  .dtile .src { position: absolute; left: 12px; top: 12px; font: 500 15px/1.2 "JetBrains Mono", monospace; letter-spacing: .08em; color: #F3ECE0;
    padding: 6px 9px; background: rgba(10,8,6,.6); text-transform: uppercase; }
  .dor { position: absolute; left: 440px; top: 715px; width: 90px; height: 90px; margin-left: -45px; border-radius: 50%; background: #0B0907;
    border: 2px solid %ACCENT%; color: %ACCENT%; font: 500 32px/86px "JetBrains Mono", monospace; text-align: center; opacity: 0; }
  .dask { position: absolute; left: 60px; width: 760px; top: 1000px; text-align: center; padding: 20px 0 18px; background: #F3ECE0; color: #0B0907;
    font: 800 40px Inter, sans-serif; letter-spacing: .05em; text-transform: uppercase; opacity: 0; white-space: nowrap; }
"""

CAP_CSS = """
  #root { position: absolute; inset: 0; pointer-events: none; background: transparent; }
  .dc { position: absolute; left: 70px; width: 840px; top: 1190px; text-align: center; font: 800 58px/1.12 Inter, sans-serif; color: #FFFFFF;
    letter-spacing: -.01em; text-shadow: 0 0 3px #000, 0 0 3px #000, 0 2px 4px #000, 0 4px 18px rgba(0,0,0,.75); opacity: 0; visibility: hidden; }
  .dc span { opacity: .5; }
  .dc .k { color: #F7DDB0; } .dc .n { color: %ACCENT%; }
"""


def kind_of(lab):
    """[place, KIND] -> (KIND upper, place, is_real)"""
    if isinstance(lab, str): return lab.upper(), '', lab.lower().startswith('real')
    place, kind = lab[0], lab[1]
    return kind.upper(), place, kind.lower().startswith('real')


def tag_html(pid, lab):
    kind, place, real = kind_of(lab)
    txt = f'<b>{esc(kind)}</b>' + (f' · {esc(place)}' if place else '')
    n = len(kind) + len(place) + 3
    return f'<div id="{pid}" class="dtag{" real" if real else ""}{" sm" if n > 40 else ""}"><i></i>{txt}</div>'


def is_bright(path):
    """white-bordered / near-white images (scans, diagrams, objects on white) -> plate"""
    try:
        im = Image.open(path).convert('L'); im.thumbnail((200, 200)); w, h = im.size
        b = max(2, int(min(w, h) * .04))
        edges = [im.crop((0, 0, w, b)), im.crop((0, h - b, w, h)), im.crop((0, 0, b, h)), im.crop((w - b, 0, w, h))]
        bright = sum(ImageStat.Stat(e).mean[0] > 215 for e in edges)
        return bright >= 2 or ImageStat.Stat(im).mean[0] > 200
    except Exception:
        return False


def number_info(w):
    if not re.search(r'\d', w['w']): return None
    return K.number_of(w['w'])


class Film:
    def __init__(self, C):
        self.C = C; HF = C.HF; self.o = HF.get('doku', {})
        self.accent = self.o.get('accent', '#E9A84A')
        self.pool = K.media_pool(C)
        self.ab = []
        for _, cfg in C.SCENES:
            for e in cfg.get('els', []):
                if e.get('el') == 'ab':
                    for side in ('a', 'b'):
                        sid = (e.get(side) or {}).get('src')
                        if sid and C.exists(sid) and self.pool.get(sid): self.ab.append((sid, self.pool[sid]))
        self.plate = {}
        for sid in self.pool:
            if C.is_video(sid) or not C.exists(sid): continue
            p = os.path.join(C.prj, C.asset(sid))
            pl = (sid in self.o.get('plate', [])) or (is_bright(p) and sid not in self.o.get('noplate', []))
            if pl:
                im = Image.open(p).convert('RGB'); self.plate[sid] = im.size
                bl = os.path.join(C.prj, 'assets', f'{sid}_dkblur.jpg')
                if not os.path.exists(bl):
                    g = im.copy(); g.thumbnail((540, 540)); g = g.filter(ImageFilter.GaussianBlur(18))
                    g = Image.eval(g, lambda v: int(v * .30)); g.save(bl, quality=88)
        self.nshot = 0
        self.pos = {}                                 # focus of a photo = the 'pos' of any scene that shows it full-bleed
        for _, cfg in C.SCENES:
            if cfg.get('src') and cfg.get('pos'): self.pos.setdefault(cfg['src'], cfg['pos'])
        self.accents = self.plan_accents()

    # ------------------------------------------------------------------ accents (3-5 per film)
    def seg_words(self, i): return self.C.CAPS[i]

    def plan_accents(self):
        C = self.C; acc = []
        cta_i = [i for i, s in enumerate(C.segs) if s.get('cta')]
        body = [i for i in range(len(C.segs)) if i not in cta_i and not (C.scene_of[i] == 0 and C.E.get('hook') and i == 0)]
        # name reveal: first multi-word starred run in scene 1 (the "call it ..." line)
        if self.o.get('term', True) and C.NSC > 1:
            for i in [i for i in body if C.scene_of[i] == 1][:1]:
                ws = self.seg_words(i)
                runs, cur = [], []
                for j, w in enumerate(ws):
                    if w['k'] and not number_info(w): cur.append(j)
                    elif cur: runs.append(cur); cur = []
                    if cur and re.search(r'[.,:;!?]$', w['w']): runs.append(cur); cur = []
                if cur: runs.append(cur)
                runs = [r for r in runs if len(r) >= 2]
                if runs:
                    r = runs[0]
                    lead = [clean(ws[j]['w']) for j in range(max(0, r[0] - 4), r[0])]
                    while len(lead) > 1 and norm(lead[-1]) in ('the', 'a', 'an', 'its'): lead.pop()   # "call it the" -> "call it"
                    lead = [x for x in lead if x]
                    acc.append(dict(kind='term', seg=i, words=[ws[j] for j in r], kicker=' '.join(lead), scene=1))
        # numbers: starred words with digits, max 2; "9 out of 10" pairs
        nums = []
        for i in body:
            ws = self.seg_words(i)
            j = 0
            while j < len(ws):
                w = ws[j]; ni = number_info(w)
                if ni and w['k']:
                    pair = None
                    for gap in (('out', 'of'), ('of',), ('in',)):
                        g = len(gap)
                        if j + g + 1 < len(ws) and tuple(norm(x['w']) for x in ws[j + 1:j + 1 + g]) == gap and number_info(ws[j + 1 + g]):
                            pair = ws[j + 1 + g]; break
                    end = (j + 2 + len(gap)) if pair else j + 1
                    after = []
                    closed = False
                    for x in ws[end:end + 4]:
                        after.append(clean(x['w']))
                        if re.search(r'[.,:;!?]$', x['w']): closed = True; break
                    if not closed:
                        while after and norm(after[-1]) in STOP: after.pop()
                    if not after:
                        before = [clean(x['w']) for x in ws[max(0, j - 4):j]]
                        while before and norm(before[-1]) in STOP: before.pop()
                        while before and norm(before[0]) in STOP: before.pop(0)
                        after = before
                    nums.append(dict(kind='num', seg=i, words=[w] + ([pair] if pair else []), info=ni,
                                     pinfo=number_info(pair) if pair else None, label=' '.join(after), scene=C.scene_of[i]))
                    j = end
                else:
                    j += 1
        acc += nums[:2]
        # payoff: last starred run of the last line before the CTA, grown to 2-3 words
        last = [i for i in body if C.scene_of[i] > 0]
        if last:
            i = last[-1]; ws = self.seg_words(i)
            ov = self.o.get('payoff')
            idx = [j for j, w in enumerate(ws) if (norm(w['w']).startswith(norm(ov)) if ov else (w['k'] and not number_info(w)))]
            if idx:
                e = idx[-1]; s = e
                while s - 1 >= 0 and ws[s - 1]['k'] and not re.search(r'[.,:;!?]$', ws[s - 1]['w']): s -= 1
                run = list(range(s, e + 1))
                k = e
                while len(run) < 3 and k + 1 < len(ws) and not re.search(r'[.,:;!?]$', ws[k]['w']):
                    k += 1; run.append(k)
                k = s
                while len(run) < 2 and k - 1 >= 0 and norm(ws[k - 1]['w']) not in STOP and not re.search(r'[.,:;!?]$', ws[k - 1]['w']):
                    k -= 1; run.insert(0, k)
                if not any(a['kind'] == 'num' and a['seg'] == i and any(x is ws[j] for x in a['words'] for j in run) for a in acc):
                    acc.append(dict(kind='payoff', seg=i, words=[ws[j] for j in run], scene=C.scene_of[i]))
        acc.sort(key=lambda a: a['words'][0]['s'])
        return acc

    # ------------------------------------------------------------------ media of one shot
    def media_html(self, q, sid, k, t0, dur, pos):
        C = self.C
        if C.is_video(sid):
            d = max(0.1, min(dur + 0.4, C.clip_len(sid) - 0.1))
            return (f'<img class="full" src="{C.first_frame(sid)}" alt="" style="object-position:{pos}" />'
                    f'<video id="{q}v" class="clip" src="{C.asset(sid)}" muted playsinline data-start="{t0:.3f}" data-duration="{d:.2f}" '
                    f'style="object-position:{pos}"></video>')
        if sid in self.plate:
            iw, ih = self.plate[sid]
            w = 960; h = round(w * ih / iw)
            if h > 1000: h = 1000; w = round(h * iw / ih)
            x = 780 - w // 2; y = 880 - h // 2            # cam coords: screen centre y ≈ 820, above the captions
            return (f'<img class="blur" src="assets/{sid}_dkblur.jpg" alt="" />'
                    f'<div class="plate" style="left:{x}px; top:{y}px; width:{w}px; height:{h}px"><img src="{C.asset(sid)}" alt="" /></div>')
        return f'<img class="full" src="{C.asset(sid)}" alt="" style="object-position:{pos}" />'


def screen_xy(pos):
    m = re.findall(r'([\d.]+)%', pos or '')
    fx, fy = (float(m[0]) / 100, float(m[1]) / 100) if len(m) >= 2 else (.5, .4)
    return fx, fy


class DScene:
    def __init__(self, F, k, name, cfg, media):
        self.F, self.C, self.k, self.name, self.cfg, self.media = F, F.C, k, name, cfg, media
        C = self.C
        self.h0 = C.host_start(k); self.D = C.host_end(k) - self.h0
        self.cut = (C.host_start(k + 1) - self.h0) if k + 1 < C.NSC else None
        self.p = f'd{k}'
        self.body, self.js, self.cues = [], [], []
        self.borrow = None; self.dims = []; self.cta_delay = 0.0

    def L(self, t): return round(t - self.h0, 3)

    # ---------------------------------------------------- shots
    def plan_shots(self, words, cta_t, hook_cut):
        """[(t0, media index, detail?)]"""
        end = cta_t if cta_t is not None else (self.cut if self.cut is not None else self.D)
        n = len(self.media)
        if self.k == 0:
            sh = [(0.0, 0, False)]
            if n > 1 and hook_cut is not None: sh.append((hook_cut, 1, False))
            return sh
        starts = [self.L(w['s']) - 0.06 for j, w in enumerate(words) if j and re.search(r'[.,:;!?]$', words[j - 1]['w'])]
        if n > 1:
            sh = [(0.0, 0, False)]
            for m in range(1, n):
                target = end * m / n
                cand = [s for s in starts if 1.2 < s < end - 1.2] or [target]
                sh.append((min(cand, key=lambda s: abs(s - target)), m, False))
            return sorted(set(sh))
        sh = [(0.0, 0, False)]
        if end > 5.6 and n == 1 and self.borrow:     # long scene on one photo: cut to a 2nd labelled photo of the episode
            self.media.append(self.borrow)
            cand = [s for s in starts if 2.0 < s < end - 2.0] or [end * 0.5]
            sh.append((min(cand, key=lambda s: abs(s - end * 0.5)), 1, False))
            return sh
        if end > 3.6 and n:                           # one photo: rack-focus detail crops (2 above ~6 s), every ~2.5-3 s a new framing
            parts = 3 if end > 6.0 else 2
            wst = [self.L(w['s']) - 0.06 for w in words]
            for m in range(1, parts):
                target = end * m / parts
                cand = [s for s in starts if abs(s - target) < end / (2 * parts)] or [s for s in wst if abs(s - target) < end / (2 * parts)]
                if cand: sh.append((min(cand, key=lambda s: abs(s - target)), 0, m))
        return sh

    def shots(self, plan):
        F, C = self.F, self.C
        html, js = [], ''
        for n, (t0, mi, det) in enumerate(plan):
            t1 = plan[n + 1][0] if n + 1 < len(plan) else self.D
            sid, lab = self.media[mi]
            pos = (self.cfg.get('pos') if sid == self.cfg.get('src') else None) or self.F.pos.get(sid) or '50% 40%'
            q = f'{self.p}-s{n}'
            html.append(f'    <div id="{q}" class="dshot" style="opacity:{1 if n == 0 else 0}"><div id="{q}c" class="dcam">'
                        f'{F.media_html(q, sid, self.k, t0, t1 - t0, pos)}</div></div>')
            fx, fy = screen_xy(pos)
            if det == 2: fx, fy = 1 - fx, min(0.75, fy + 0.25)
            org = f'{fx * 100:.0f}% {fy * 100:.0f}%'
            L = max(0.5, t1 - t0)
            mv = 'push' if det else MOVES[F.nshot % len(MOVES)]
            F.nshot += 1
            if sid in F.plate and mv in ('driftL', 'rise'): mv = 'push'
            if mv == 'push':
                s0 = {1: 1.3, 2: 1.16}.get(det, 1.0) if det else 1.0; s1 = s0 + min(0.12, 0.034 * L)
                js += f'      tl.fromTo("#{q}c", {{ scale: {s0}, x: 0, y: 0, transformOrigin: "{org}" }}, {{ scale: {s1:.3f}, duration: {L:.3f}, ease: "none" }}, {t0:.3f});\n'
            elif mv == 'pull':
                s1 = 1.02; s0 = s1 + min(0.12, 0.034 * L)
                js += f'      tl.fromTo("#{q}c", {{ scale: {s0:.3f}, x: 0, y: 0, transformOrigin: "{org}" }}, {{ scale: {s1}, duration: {L:.3f}, ease: "none" }}, {t0:.3f});\n'
            elif mv == 'driftL':
                d = min(70, 22 * L)
                js += f'      tl.fromTo("#{q}c", {{ scale: 1.05, x: {d:.0f}, y: 0, transformOrigin: "{org}" }}, {{ x: {-d:.0f}, duration: {L:.3f}, ease: "none" }}, {t0:.3f});\n'
            else:
                d = min(50, 16 * L)
                js += f'      tl.fromTo("#{q}c", {{ scale: 1.06, x: 0, y: {d:.0f}, transformOrigin: "{org}" }}, {{ y: {-d:.0f}, duration: {L:.3f}, ease: "none" }}, {t0:.3f});\n'
            # source chip, one per shot (a detail of the same photo keeps its chip)
            if not det:
                html.append('    ' + tag_html(f'{q}t', lab))
                js += f'      tl.fromTo("#{q}t", {{ opacity: 0, x: -24 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "power4.out" }}, {t0 + (0.12 if n else 0.0):.3f});\n'
                nxt = next((m for m in range(n + 1, len(plan)) if not plan[m][2]), None)
                if nxt is not None:
                    js += f'      tl.set("#{q}t", {{ opacity: 0 }}, {plan[nxt][0]:.3f});\n'
            if n:                                        # in-scene cut
                pq = f'{self.p}-s{n - 1}'
                if det:                                  # rack-focus blur-cut to a tighter crop of the same photo
                    js += (f'      tl.to("#{pq}", {{ filter: "blur(12px)", scale: 1.04, duration: 0.18, ease: "power2.in" }}, {t0 - 0.18:.3f});\n'
                           f'      tl.set("#{pq}", {{ opacity: 0 }}, {t0:.3f});\n'
                           f'      tl.set("#{q}", {{ opacity: 1 }}, {t0:.3f});\n'
                           f'      tl.fromTo("#{q}", {{ filter: "blur(12px)", scale: 1.04 }}, {{ filter: "blur(0px)", scale: 1, duration: 0.26, ease: "power2.out" }}, {t0:.3f});\n')
                    self.cues.append((t0 - 0.1, 'swish', 0.25))
                else:                                    # cut-the-curve LEFT between two photos
                    js += (f'      tl.to("#{pq}", {{ x: {-TR}, filter: "blur(9px)", duration: 0.3, ease: "power4.in" }}, {t0 - 0.3:.3f});\n'
                           f'      tl.set("#{pq}", {{ opacity: 0 }}, {t0:.3f});\n'
                           f'      tl.set("#{q}", {{ opacity: 1 }}, {t0:.3f});\n'
                           f'      tl.fromTo("#{q}", {{ x: {TR}, filter: "blur(9px)" }}, {{ x: 0, filter: "blur(0px)", duration: 0.34, ease: "power4.out" }}, {t0:.3f});\n')
                    self.cues.append((t0 - 0.15, 'swish', 0.4))
        self.body += html; self.js.append(js)

    # ---------------------------------------------------- HUD: scene index ticks
    def hud(self):
        n = self.C.NSC
        ticks = ''.join(f'<i class="{"on" if i == self.k else ""}" style="left:{190 * i / max(1, n - 1):.0f}px"></i>' for i in range(n))
        self.body.append(f'    <div id="{self.p}-hud" class="dhud">{self.k + 1:02d} / {n:02d}<div class="rule">{ticks}</div></div>')
        self.js.append(f'      tl.fromTo("#{self.p}-hud", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, ease: "power2.out" }}, {0.1 if self.k else 0:.3f});\n')

    # ---------------------------------------------------- accents
    def dim(self, t0, t1, level=0.36):
        self.dims.append([t0, t1, level])

    def dim_js(self):
        ds = sorted(self.dims); out = []
        for d in ds:
            if out and d[0] <= out[-1][1] + 0.4: out[-1][1] = max(out[-1][1], d[1]); out[-1][2] = max(out[-1][2], d[2])
            else: out.append(list(d))
        js, lev = '', 0
        for n, (t0, t1, level) in enumerate(out):
            if n and out[n - 1][1] + 0.35 > t0: t0 = out[n - 1][1] + 0.36
            js += f'      tl.to("#{self.p}-acc", {{ opacity: {level}, duration: 0.25, ease: "power2.out" }}, {max(0, t0):.3f});\n'
            if t1 < self.D: js += f'      tl.to("#{self.p}-acc", {{ opacity: 0, duration: 0.35, ease: "power2.inOut" }}, {t1:.3f});\n'
        return js

    def leave(self, sel, t1, last):
        """accent leaves on a zoom-through (grows, blurs, fades) - unless the scene cut takes it"""
        if last: return ''
        return (f'      tl.to("{sel}", {{ scale: 1.15, filter: "blur(10px)", duration: 0.2, ease: "power3.in" }}, {t1 - 0.2:.3f});\n'
                f'      tl.to("{sel}", {{ opacity: 0, duration: 0.2, ease: "none" }}, {t1 - 0.2:.3f});\n')

    def big_lines(self, words):
        txt = [clean(w['w']).upper() for w in words]
        one = ' '.join(txt)
        if fit([one], 940, 330) >= 230 or len(txt) == 1: return [list(range(len(txt)))], [one]
        h = (len(txt) + 1) // 2
        return [list(range(h)), list(range(h, len(txt)))], [' '.join(txt[:h]), ' '.join(txt[h:])]

    def hook(self, lines, words, cut_t):
        q = f'{self.p}-hk'
        l1, l2 = (list(lines) + [''])[:2]
        s1 = min(96, fit([l1], 940, 400) * 0.36)        # Inter 800 ~2.6x wider than League Gothic per em
        s2 = fit([l2], 940, 330) if l2 else 0
        h = (f'    <div id="{q}" class="dk" style="top:300px">\n      <div id="{q}b" class="dbar"></div>\n'
             f'      <div id="{q}1" class="dl1" style="font-size:{s1:.0f}px">{esc(l1)}</div>\n'
             + (f'      <div id="{q}2" class="dbig" style="font-size:{s2}px; margin-top:14px">{esc(l2)}</div>\n' if l2 else '') + '    </div>')
        js = (f'      tl.fromTo("#{q}b", {{ scaleX: 0.35 }}, {{ scaleX: 1, duration: 0.5, ease: "power4.out" }}, 0);\n'
              f'      tl.fromTo("#{q}1", {{ x: 40 }}, {{ x: 0, duration: 0.5, ease: "power4.out" }}, 0);\n')
        l2w = [norm(x) for x in l2.split()]
        hit = next((w for w in words if l2w and norm(w['w']) == l2w[-1]), None) or next((w for w in words if norm(w['w']) in l2w), None)
        if l2 and hit:
            at = self.L(hit['s']) - 0.04
            js += (f'      tl.fromTo("#{q}2", {{ scale: 1.3, filter: "blur(10px)", opacity: 0.4 }}, {{ scale: 1, filter: "blur(0px)", opacity: 1, duration: 0.3, '
                   f'ease: "power4.out", immediateRender: false }}, {at:.3f});\n')
            self.cues.append((at, 'thump', 0.7))
            js += f'      tl.to("#{self.p}-seam", {{ scale: 1.035, duration: 0.3, ease: "expo.out" }}, {at:.3f});\n'
        self.body.append(h); self.js.append(js)

    def term(self, a, t1, last):
        q = f'{self.p}-tm'
        groups, lines = self.big_lines(a['words'])
        size = min(fit(lines, 940, 300), 300)
        rows = []
        for li, (g, l) in enumerate(zip(groups, lines)):
            spans = ' '.join(f'<span id="{q}w{j}">{esc(clean(a["words"][j]["w"]).upper())}</span>' for j in g)
            rows.append(f'      <div class="dbig{" w" if li else ""}" style="font-size:{size}px">{spans}</div>')
        hh = 26 + 7 + (54 if a.get('kicker') else 0) + round(size * .84) * len(lines)
        top = round(760 - hh / 2)
        h = (f'    <div id="{q}" class="dk" style="top:{top}px">\n      <div id="{q}b" class="dbar"></div>\n'
             + (f'      <div id="{q}k" class="dkick">{esc(a["kicker"])}</div>\n' if a.get('kicker') else '') + '\n'.join(rows) + '\n    </div>')
        t0 = self.L(a['words'][0]['s']) - 0.04
        js = f'      tl.set("#{q}", {{ opacity: 1 }}, 0);\n      tl.set("#{q}", {{ opacity: 0 }}, 0);\n      tl.set("#{q}", {{ opacity: 1 }}, {t0 - 0.25:.3f});\n'
        js += f'      tl.fromTo("#{q}b", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.4, ease: "power4.out" }}, {t0 - 0.25:.3f});\n'
        if a.get('kicker'):
            js += f'      tl.fromTo("#{q}k", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power4.out" }}, {t0 - 0.22:.3f});\n'
        for j, w in enumerate(a['words']):
            at = max(t0, self.L(w['s']) - 0.04)
            js += (f'      tl.fromTo("#{q}w{j}", {{ opacity: 0, scale: 1.35, filter: "blur(10px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", '
                   f'duration: 0.26, ease: "power4.out" }}, {at:.3f});\n')
        self.cues.append((t0, 'thump', 0.7))
        js += self.leave(f'#{q}', t1, last)
        self.dim(t0 - 0.25, t1 - 0.3)
        self.body.append(h); self.js.append(js)

    def payoff(self, a, t1, last):
        a = dict(a, kicker=None)
        self.term(a, t1, last)

    def number(self, a, t1, last, n):
        q = f'{self.p}-n{n}'
        pfx, v, sfx, dec, comma = a['info']
        disp = f'{pfx}{v:,.{dec}f}' if comma else f'{pfx}{v:.{dec}f}'
        tail = ''
        if a.get('pinfo'):
            p2 = a['pinfo']; tail = f' / {p2[1]:.0f}'
        size = min(fit([disp + sfx.upper() + tail], 900, 330), 330)
        year = 1000 <= v <= 2100 and dec == 0 and not comma and not sfx
        frac = (v / 100 if sfx.startswith('%') else v / a['pinfo'][1] if a.get('pinfo') and a['pinfo'][1] else None)
        ticks = ''.join(f'<i style="left:{k * 40}px; height:{18 if k % 5 == 0 else 9}px"></i>' for k in range(16))
        ptr = f'<div id="{q}f" class="fill"></div><b id="{q}p"></b>' if frac else ''
        lab = esc(a['label'].upper()) if a.get('label') else ''
        hh = (54 if lab else 0) + round(size * .84) + 56
        top = round(720 - hh / 2)
        h = (f'    <div id="{q}" class="dk" style="top:{top}px">\n'
             + (f'      <div id="{q}k" class="dkick">{lab}</div>\n' if lab else '')
             + f'      <div id="{q}x" class="dnum" style="font-size:{size}px">{esc(pfx)}<span id="{q}v">{esc(disp[len(pfx):])}</span>{esc(sfx.upper())}'
             + (f'<em id="{q}t">{esc(tail)}</em>' if tail else '') + '</div>\n'
             f'      <div id="{q}r" class="druler">{ticks}{ptr}</div>\n    </div>')
        w0 = a['words'][0]
        th = self.L(w0['s']) - 0.04
        v0 = (v - 30) if year else 0
        dur = 0.55
        fmt = (f'n.v.toFixed({dec})' if dec else
               ('Math.round(n.v).toString().replace(/\\B(?=(\\d{{3}})+(?!\\d))/g, ",")' if comma else 'Math.round(n.v).toString()'))
        js = f'      tl.set("#{q}", {{ opacity: 0 }}, 0);\n      tl.set("#{q}", {{ opacity: 1 }}, {th - 0.2:.3f});\n'
        if lab: js += f'      tl.fromTo("#{q}k", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power4.out" }}, {th - 0.2:.3f});\n'
        js += (f'      tl.fromTo("#{q}x", {{ opacity: 0, scale: 1.35, filter: "blur(10px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.26, ease: "power4.out" }}, {th:.3f});\n'
               f'      tl.fromTo("#{q}r", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.5, ease: "power4.out" }}, {th - 0.1:.3f});\n'
               f'      {{ const n = {{ v: {v0} }}; tl.fromTo(n, {{ v: {v0} }}, {{ v: {v}, duration: {dur}, ease: "power3.out", '
               f'onUpdate: () => {{ document.getElementById("{q}v").textContent = {fmt}; }} }}, {th:.3f}); }}\n'
               f'      tl.set("#{q}v", {{ textContent: {J(disp[len(pfx):])} }}, {th + dur + 0.01:.3f});\n'
               f'      tl.set("#{q}v", {{ textContent: {J(str(int(v0)) if not dec else str(v0))} }}, {th - 0.19:.3f});\n')
        if frac:
            js += (f'      tl.fromTo("#{q}p", {{ x: 0 }}, {{ x: {600 * min(1, frac):.0f}, duration: 0.8, ease: "power3.out" }}, {th:.3f});\n'
                   f'      tl.fromTo("#{q}f", {{ scaleX: 0 }}, {{ scaleX: {min(1, frac):.3f}, duration: 0.8, ease: "power3.out" }}, {th:.3f});\n')
        if tail:
            at = self.L(a['words'][1]['s']) - 0.04
            js += f'      tl.fromTo("#{q}t", {{ opacity: 0, x: 30 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "power4.out" }}, {at:.3f});\n'
            js += f'      tl.set("#{q}t", {{ opacity: 0 }}, 0);\n'
        self.cues += [(th, 'thump', 0.6)] + [(th + 0.06 * i, 'tick', 0.35) for i in range(7)]
        js += self.leave(f'#{q}', t1, last)
        self.dim(th - 0.2, t1 - 0.3)
        self.body.append(h); self.js.append(js)

    # ---------------------------------------------------- end card
    def cta(self, seg_words, cta, ab):
        q = f'{self.p}-cta'
        t0 = self.L(seg_words[0]['s']) - 0.08 + self.cta_delay
        self.dim(t0 - 0.2, self.D + 5, 0.62)
        qtxt = cta.get('q', 'Which one?')
        h = [f'    <div id="{q}" class="dq" style="opacity:0"><div id="{q}k" class="dkick">Your turn</div><div id="{q}q" class="dl1">{esc(qtxt.upper())}</div></div>']
        js = (f'      tl.set("#{q}", {{ opacity: 1 }}, {t0:.3f});\n'
              f'      tl.fromTo("#{q}k", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.16, ease: "power4.out" }}, {t0:.3f});\n'
              f'      tl.fromTo("#{q}q", {{ opacity: 0, y: 70 }}, {{ opacity: 1, y: 0, duration: 0.2, ease: "power4.out" }}, {t0 + 0.08:.3f});\n')
        names = [cta.get('a', 'A'), cta.get('b', 'B')]
        times = [[self.L(w['s']) - 0.04 for w in seg_words if norm(w['w']) == norm(nm)] for nm in names]
        for side, nm in enumerate(names):
            x = 50 if side == 0 else 490
            src = ab[side] if side < len(ab) else None
            img = ''
            if src:
                sid, lab = src
                kind, place, _ = kind_of(lab)
                im = self.C.first_frame(sid) if self.C.is_video(sid) else self.C.asset(sid)
                img = f'<img src="{im}" alt="" style="object-position:50% 30%" /><div class="src">{esc(kind)}</div>'
            s = min(fit([nm.upper()], 380, 150), 150)
            h.append(f'    <div id="{q}p{side}" class="dtile" style="left:{x}px">{img}<div class="shade"></div>'
                     f'<div class="nm" style="font-size:{s}px">{esc(nm.upper())}</div></div>')
            ts = times[side] or [t0 + 0.9 + side * 0.6]
            pre = t0 + 0.25 + 0.06 * side
            js += f'      tl.fromTo("#{q}p{side}", {{ opacity: 0, y: 60 }}, {{ opacity: 0.45, y: 0, duration: 0.2, ease: "power4.out" }}, {pre:.3f});\n'
            at = max(pre + 0.25, ts[0])
            js += (f'      tl.to("#{q}p{side}", {{ opacity: 1, borderColor: "{self.F.accent}", duration: 0.18, ease: "power2.out" }}, {at:.3f});\n'
                   f'      tl.fromTo("#{q}p{side} .nm", {{ scale: 1.3, filter: "blur(8px)" }}, {{ scale: 1, filter: "blur(0px)", duration: 0.26, ease: "power4.out", immediateRender: false }}, {at:.3f});\n')
            self.cues.append((at, 'pop', 0.5))
        tb = (times[1][:1] or [t0 + 1.5])[0]
        h.append(f'    <div id="{q}or" class="dor">OR</div>')
        h.append(f'    <div id="{q}ask" class="dask">Comment {esc(names[0])} or {esc(names[1])}</div>')
        js += f'      tl.fromTo("#{q}or", {{ opacity: 0, scale: 1.4 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.out" }}, {t0 + 0.35:.3f});\n'
        ta = min(tb + 0.45, self.D - 0.8)
        js += f'      tl.fromTo("#{q}ask", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.25, ease: "power4.out" }}, {ta:.3f});\n'
        self.cues.append((ta, 'click', 0.4))
        self.body += h; self.js.append(js)

    # ---------------------------------------------------- assemble + seams
    def html(self, seam_in, seam_out):
        sj = ''
        P = f'#{self.p}-seam'
        if self.k:
            if seam_in == 'push':     # zoom-through: deeper into the same thought (the name reveal)
                sj += f'      tl.fromTo("{P}", {{ scale: 0.84, filter: "blur(18px)" }}, {{ scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }}, 0);\n'
            else:                     # cut-the-curve LEFT, the film's current
                sj += f'      tl.fromTo("{P}", {{ x: {TR}, filter: "blur(9px)" }}, {{ x: 0, filter: "blur(0px)", duration: 0.34, ease: "power4.out" }}, 0);\n'
        if self.cut is not None:
            Cc = self.cut
            if seam_out == 'push':
                sj += f'      tl.to("{P}", {{ scale: 1.2, filter: "blur(18px)", duration: 0.21, ease: "power3.in" }}, {Cc - 0.21:.3f});\n'
                self.cues.append((Cc - 0.25, 'whoosh', 0.5))
            else:
                sj += f'      tl.to("{P}", {{ x: {-TR}, filter: "blur(9px)", duration: 0.3, ease: "power4.in" }}, {Cc - 0.3:.3f});\n'
                self.cues.append((Cc - 0.2, 'swish', 0.45))
            sj += f'      tl.set("{P}", {{ opacity: 0 }}, {Cc:.3f});\n'
        grade = f'    <div class="dgrade"></div><div class="dwarm"></div><div id="{self.p}-acc" class="dacc"></div>'
        shots = [b for b in self.body if 'class="dshot"' in b]
        rest = [b for b in self.body if 'class="dshot"' not in b]
        body = f'\n    <div id="{self.p}-seam" class="dseam">\n' + '\n'.join(shots) + '\n' + grade + '\n' + '\n'.join(rest) + '\n    </div>'
        css = CSS.replace('%ACCENT%', self.F.accent)
        return body, ''.join(self.js) + self.dim_js() + sj, css, self.cues


def build(C):
    """-> [(name, body, js, css, cues)] for every scene (opener + scenes)"""
    F = Film(C)
    out, prev = [], set()
    cta_seg = [i for i, s in enumerate(C.segs) if s.get('cta')]
    acc_by_scene = {}
    for a in F.accents: acc_by_scene.setdefault(a['scene'], []).append(a)
    term_scene = next((a['scene'] for a in F.accents if a['kind'] == 'term'), None)
    MED = []
    for k, (name, cfg) in enumerate(C.SCENES):
        MED.append(K.scene_media(C, k, cfg, F.pool, prev)); prev = {m[0] for m in MED[-1]}
    used = {}
    for k, (name, cfg) in enumerate(C.SCENES):
        media = list(MED[k])
        S = DScene(F, k, name, cfg, media)
        near = {m[0] for kk in (k - 1, k, k + 1) if 0 <= kk < len(MED) for m in MED[kk]} | {a[0] for a in F.ab}
        kinds = {kind_of(m[1])[0] for m in MED[k]}
        # borrow only artworks / graphics of the same kind (interchangeable illustrations); real photos keep their own subject
        art = lambda i: C.exists(i) and kind_of(F.pool[i])[0] in kinds and not kind_of(F.pool[i])[2]
        cand = [i for i in F.pool if art(i) and i not in near] or \
               [i for i in F.pool if art(i) and i not in {m[0] for kk in (k - 1, k, k + 1) if 0 <= kk < len(MED) for m in MED[kk]}]
        cand.sort(key=lambda i: used.get(i, 0))
        if cand: S.borrow = (cand[0], F.pool[cand[0]])
        segi = [i for i in range(len(C.segs)) if C.scene_of[i] == k]
        cta_i = [i for i in segi if i in cta_seg]
        hook_i = segi[:1] if (k == 0 and C.E.get('hook')) else []
        words = [w for i in segi if i not in cta_i for w in C.CAPS[i]]
        cta_t = S.L(C.CAPS[cta_i[0]][0]['s']) - 0.08 if cta_i else None
        hook_cut = None
        if hook_i and len(media) > 1:
            l2 = [norm(x) for x in (list(C.E['hook']) + [''])[1].split()]
            hit = [w for w in C.CAPS[hook_i[0]] if norm(w['w']) in l2]
            if hit: hook_cut = S.L(hit[0]['s']) - 0.3
        S.shots(S.plan_shots(words, cta_t, hook_cut))
        for m in S.media: used[m[0]] = used.get(m[0], 0) + 1
        S.hud()
        if hook_i: S.hook(C.E['hook'], C.CAPS[hook_i[0]], S.cut)
        accs = acc_by_scene.get(k, [])
        for n, a in enumerate(accs):
            lastw = a['words'][-1]
            stop = [S.L(accs[n + 1]['words'][0]['s']) - 0.3] if n + 1 < len(accs) else []
            if cta_t is not None: stop.append(cta_t + (0.5 if a['kind'] == 'payoff' else 0))
            if S.cut is not None: stop.append(S.cut)
            t1 = min([S.L(lastw['e']) + 1.5] + stop)
            last = (S.cut is not None and t1 >= S.cut - 0.01)
            if a['kind'] == 'term': S.term(a, t1, last)
            elif a['kind'] == 'num': S.number(a, t1, last, n)
            else: S.payoff(a, t1, last)
        if cta_i:
            if any(a['kind'] == 'payoff' for a in accs): S.cta_delay = 0.5
            S.cta([w for i in cta_i for w in C.CAPS[i]], C.E.get('cta', {}), F.ab)
        seam_in = 'push' if (term_scene is not None and k == term_scene) else 'left'
        seam_out = 'push' if (term_scene is not None and k + 1 == term_scene) else 'left'
        out.append((name,) + S.html(seam_in, seam_out))
    return out


def captions(C, accent='#E9A84A'):
    """(body, js, css) of the caption overlay: 1-3 word groups, low-middle, each word brightens on its spoken time"""
    cta_seg = {i for i, s in enumerate(C.segs) if s.get('cta')}
    skip = set(cta_seg) | ({0} if C.E.get('hook') else set())
    words = [dict(w, seg=i) for i, ws in enumerate(C.CAPS) if i not in skip for w in ws]
    groups, cur = [], []
    for j, w in enumerate(words):
        cur.append(w)
        nxt = words[j + 1] if j + 1 < len(words) else None
        chars = sum(len(x['w']) + 1 for x in cur)
        end = (nxt is None or nxt['seg'] != w['seg'] or re.search(r'[.!?:;,]$', w['w']) or len(cur) >= 3
               or chars + len(nxt['w']) > 20 or nxt['s'] - w['e'] > 0.3)
        if end: groups.append(cur); cur = []
    html, G = [], []
    for gi, g in enumerate(groups):
        s = max(0.05, g[0]['s'] - 0.05)
        nx = groups[gi + 1][0]['s'] - 0.05 if gi + 1 < len(groups) else C.DUR - 0.3
        e = min(g[-1]['e'] + 0.4, nx)
        spans = ' '.join(f'<span id="dc{gi}-{wi}" class="{"n" if re.search(r"[0-9]", w["w"]) else "k" if w["k"] else ""}">{esc(w["w"])}</span>'
                         for wi, w in enumerate(g))
        html.append(f'      <div id="dc{gi}" class="dc">{spans}</div>')
        G.append(dict(s=round(s, 3), e=round(e, 3), w=[round(w['s'], 3) for w in g]))
    js = f"""
      const G = {J(G)};
      G.forEach((g, gi) => {{
        const el = document.getElementById("dc" + gi);
        tl.set(el, {{ visibility: "visible" }}, g.s);
        tl.fromTo(el, {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.14, ease: "power3.out" }}, g.s);
        g.w.forEach((ws, wi) => tl.to("#dc" + gi + "-" + wi, {{ opacity: 1, duration: 0.08, ease: "none" }}, Math.max(g.s, ws - 0.03)));
        tl.to(el, {{ opacity: 0, duration: 0.1, ease: "power2.in" }}, g.e - 0.1);
        tl.set(el, {{ visibility: "hidden" }}, g.e);
      }});
"""
    return '\n'.join(html), js, CAP_CSS.replace('%ACCENT%', accent)


def post(src, dst):
    """film post on the silent render (proto/real/lib/post.sh): highlight halation, fine temporal grain, soft vignette"""
    vf = ("[0:v]format=gbrp,split[a][b];[b]curves=all='0/0 0.75/0 1/1',gblur=sigma=24[g];"
          "[a][g]blend=all_mode=screen:all_opacity=0.18,format=yuv420p,noise=c0s=6:c0f=t+u,vignette=angle=PI/5[v]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-filter_complex', vf, '-map', '[v]', '-c:v', 'libx264', '-crf', '15',
                    '-preset', 'medium', '-pix_fmt', 'yuv420p', dst], check=True)
