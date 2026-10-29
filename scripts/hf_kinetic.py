"""KINETIC style for HyperFrames Shorts (opt in per episode: "hf": {"style": "kinetic"}) — used by scripts/hf_build.py.

The whole look is DERIVED from the episode data, no per-episode hand work:
  * the spoken words (Whisper timings) are cut into beats of 1-3 words (~1 s each). In every beat ONE hero word (or a
    starred pair) slams in huge (League Gothic, all caps, fitted to the frame width) exactly on its spoken word; the other
    words of the beat sit small above / below it, each appearing on its own word -> the kinetic type IS the caption.
    Hero = numbers > *starred* cap words > hf.caps words > long content words (stopwords never).
  * the episode's real media stay the ground of every scene (scene hf src / split a,b / footage clips / ab end-card photos,
    with their honest [place, KIND] label chip). Beats cut between grounds: dimmed photo behind the type, black ground
    with the photo seen THROUGH the giant letters, bright punch-in with a live counter over the photo (numbers).
  * hero effects rotate deterministically: slam (z-push), stretch/squash, RGB-split glitch, depth echoes receding,
    accent shape (triangle / starburst) behind the word. Beats leave on a zoom-through (scale-up, same Z sign as the
    next entry); scenes cut on a zoom-through seam with a light-flare burst; the opener holds the episode "hook" as a
    frame-1 title (each hook word pulses when spoken); the CTA types the question with a cursor and slams the two
    answers (with their photos) on the spoken words.
  * optional episode overrides in "hf": {"kinetic": {"accent": "#FF4A1C", "ink": "#F5F1EA", "ground": "#0B0A0A",
    "every": [list of fx to rotate], "max_words": 3}}; per scene: scenes[i]["hf"]["kinetic"] = {"media": [ids]}.
Same contract as the kit: one composition per scene, paused GSAP timelines, SFX cues returned for score_cine.mjs.
"""
import html as _html, json, math, re

W_, H_ = 1080, 1920
J = json.dumps
norm = lambda s: re.sub(r'[^a-z0-9]', '', str(s).lower())

# League Gothic advance widths (em), measured from the font HyperFrames bundles (fontTools) -> deterministic fitting
LG = {'A': .389, 'B': .364, 'C': .358, 'D': .372, 'E': .327, 'F': .301, 'G': .363, 'H': .38, 'I': .188, 'J': .212, 'K': .375,
      'L': .295, 'M': .484, 'N': .395, 'O': .358, 'P': .352, 'Q': .358, 'R': .357, 'S': .338, 'T': .332, 'U': .368, 'V': .362,
      'W': .512, 'X': .374, 'Y': .358, 'Z': .316, '0': .354, '1': .24, '2': .363, '3': .352, '4': .351, '5': .342, '6': .342,
      '7': .307, '8': .34, '9': .342, "'": .151, '.': .157, ',': .151, '-': .217, '$': .306, '%': .5, '&': .423, '?': .343,
      '!': .177, ':': .177, ' ': .154}
STOP = set('a an the and or but of to in on at by for from with as is was were be been are it its his her their he she they '
           'we you i this that these those so then than into onto over under up out off not no nor all any some just only '
           'had has have did do does who what which when where why how there here our your my me him them us can could '
           'would should will shall may might must very too also until while each one'.split())
NUMW = {w: i for i, w in enumerate('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen '
                                    'sixteen seventeen eighteen nineteen twenty'.split())}
NUMW.update({'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100})
ROTATE = ['slam', 'stretch', 'depth', 'glitch', 'shape', 'slam', 'stretch', 'glitch']
GROUNDS = {'photo': 0.52, 'black': 0.93, 'mask': 0.93, 'bright': 0.18}

CSS = """
  .kg { position: absolute; inset: 0; overflow: hidden; }
  .kcam { position: absolute; inset: 0; transform-origin: 50% 45%; }
  .kmed { position: absolute; inset: 0; opacity: 0; }
  .kmed img, .kmed video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
  .kdim { position: absolute; inset: 0; background: %GROUND%; opacity: 0.52; }
  .kvig { position: absolute; inset: 0; background: radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%); }
  .klab { position: absolute; left: 40px; top: 150px; font: 700 26px Inter, sans-serif; letter-spacing: .14em; text-transform: uppercase;
    color: %INK%; padding: 9px 16px 8px; border-radius: 999px; background: rgba(8,8,8,.62); border: 1.5px solid rgba(245,241,234,.30);
    white-space: nowrap; opacity: 0; }
  .klab b { color: %ACCENT%; font-weight: 900; }
  .kb { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; opacity: 0; transform-origin: 50% 45%; }
  .ks { position: absolute; left: 60px; width: 960px; text-align: center; font: 900 60px/1.06 Inter, sans-serif; text-transform: uppercase;
    letter-spacing: -.005em; color: %INK%; text-shadow: 0 3px 0 rgba(0,0,0,.55), 0 4px 24px rgba(0,0,0,.9); }
  .ks span { display: inline-block; opacity: 0; margin: 0 .12em; }
  .ks .a { color: %ACCENT%; }
  .khw { position: absolute; left: 0; width: 1080px; }
  .kh { position: absolute; left: 0; top: 0; width: 1080px; text-align: center; font-family: "League Gothic", sans-serif; line-height: .8;
    text-transform: uppercase; letter-spacing: .005em; color: %INK%; white-space: nowrap; opacity: 0; transform-origin: 50% 55%;
    text-shadow: 0 14px 50px rgba(0,0,0,.55); }
  .kh.a { color: %ACCENT%; }
  .kh.mask { color: transparent; -webkit-background-clip: text; background-clip: text; background-size: 1080px auto;
    background-position: 50% 50%; text-shadow: none; -webkit-text-stroke: 3px #0B0A0A; filter: contrast(1.25) drop-shadow(0 12px 30px rgba(0,0,0,.45)); }
  .kh.echo { color: %GROUND%; -webkit-text-stroke: 3px %ACCENT%; text-shadow: none; }
  .kh.gr { color: #FF2E3A; mix-blend-mode: screen; text-shadow: none; }
  .kh.gc { color: #18E3FF; mix-blend-mode: screen; text-shadow: none; }
  .kshape { position: absolute; opacity: 0; transform-origin: 50% 50%; }
  .kflare { position: absolute; left: -460px; top: 380px; width: 2000px; height: 1100px; opacity: 0; mix-blend-mode: screen; pointer-events: none;
    background: radial-gradient(closest-side, rgba(255,236,210,.95) 0%, rgba(255,150,70,.75) 22%, rgba(255,74,28,.35) 48%, rgba(255,74,28,0) 100%); }
  .kstreak { position: absolute; left: -200px; top: 905px; width: 1480px; height: 14px; opacity: 0; mix-blend-mode: screen; border-radius: 7px;
    background: linear-gradient(90deg, rgba(255,120,60,0), rgba(255,240,220,1) 50%, rgba(255,120,60,0)); }
  .ktype { position: absolute; left: 60px; width: 960px; top: 300px; text-align: center; font: 900 70px/1.1 Inter, sans-serif; text-transform: uppercase; color: %INK%; }
  .ktype span { font-size: 0; } .ktype .cur { display: inline-block; width: 8px; height: 70px; margin-left: 8px; background: %ACCENT%; vertical-align: -8px; }
  .kpan { position: absolute; top: 560px; width: 480px; height: 700px; overflow: hidden; border-radius: 26px; opacity: 0;
    box-shadow: 0 30px 90px rgba(0,0,0,.65), 0 0 0 4px %ACCENT%; }
  .kpan img, .kpan video { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
  .kpan .klab { left: 12px; top: 12px; right: 12px; font-size: 18px; letter-spacing: .08em; white-space: normal; line-height: 1.25; border-radius: 14px; opacity: 1; }
  .kname { position: absolute; top: 1150px; width: 540px; text-align: center; font-family: "League Gothic", sans-serif; line-height: .8;
    text-transform: uppercase; color: %INK%; opacity: 0; text-shadow: 0 10px 40px rgba(0,0,0,.9); }
  .kor { position: absolute; left: 470px; top: 840px; width: 140px; height: 140px; border-radius: 50%; background: %ACCENT%; color: #0B0A0A;
    font: 900 54px/140px Inter, sans-serif; text-align: center; opacity: 0; }
  .kask { position: absolute; left: 50px; width: 980px; white-space: nowrap; top: 1360px; text-align: center; padding: 20px 0 18px; border-radius: 999px;
    background: %INK%; color: #0B0A0A; font: 900 40px Inter, sans-serif; letter-spacing: .06em; text-transform: uppercase; opacity: 0; }
"""


def esc(s): return _html.escape(str(s), quote=True)


def lw(text):
    """width of a League Gothic line in em"""
    return sum(LG.get(c, .36) for c in text.upper()) + .005 * len(text)


def fit(lines, maxw=940, maxs=560):
    return int(min([maxs] + [maxw / max(lw(l), .2) for l in lines]))


def label_html(lab):
    if not lab: return ''
    if isinstance(lab, str): return esc(lab)
    return f'{esc(lab[0])} · <b>{esc(lab[1])}</b>' if lab[0] else f'<b>{esc(lab[1])}</b>'


def clean(w):
    return re.sub(r'^[\"“(]+|[\"”),.;:!?]+$', '', w)


def number_of(w):
    """'1869.' -> (prefix, value, suffix, decimals, comma); 'eleven' -> 11; None if not a number"""
    c = clean(w)
    m = re.match(r'^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$', c)
    if m:
        num = m.group(2); v = float(num.replace(',', ''))
        dec = len(num.split('.')[1]) if '.' in num else 0
        return m.group(1), v, m.group(3), dec, ',' in num
    if norm(c) in NUMW: return '', float(NUMW[norm(c)]), '', 0, False
    return None


class Ctx:
    """everything hf_build knows: CAPS, segs, scene_of, starts, SCENES, host_start/host_end, asset(), E, HF, NSC, DUR"""
    def __init__(self, **kw): self.__dict__.update(kw)


# ------------------------------------------------------------------ media per scene (+ honest labels)
def media_pool(C):
    pool = {}
    def put(sid, lab):
        if sid and lab and sid not in pool: pool[sid] = lab
    for _, cfg in C.SCENES:
        put(cfg.get('src'), cfg.get('label'))
        put(cfg.get('a'), cfg.get('labelA')); put(cfg.get('b'), cfg.get('labelB'))
        for cl in cfg.get('clips', []): put(cl.get('src'), cl.get('label'))
        for e in cfg.get('els', []):
            put(e.get('src'), e.get('label'))
    return pool


def scene_media(C, k, cfg, pool, prev):
    ov = (cfg.get('kinetic') or {}).get('media')
    ids = list(ov) if ov else []
    if not ids:
        for key in ('src', 'a', 'b'):
            if cfg.get(key) and isinstance(cfg[key], str): ids.append(cfg[key])
        ids += [cl['src'] for cl in cfg.get('clips', [])] + [f['src'] for f in cfg.get('frames', []) if isinstance(f, dict)]
    ids = [i for i in dict.fromkeys(ids) if C.exists(i) and pool.get(i)]
    if not ids:                                     # graphics-only scene: borrow a labelled photo not on screen right before
        cand = [i for i in pool if C.exists(i) and i not in prev] or [i for i in pool if C.exists(i)]
        ids = cand[k % len(cand):][:1] if cand else []
    return [(i, pool[i]) for i in ids]


# ------------------------------------------------------------------ beats from the words
def beats_for(C, words, maxw=3):
    """words [{w,k,s,e,acc}] -> beats [{words, hero (indices), start}]"""
    chunks, cur = [], []
    for j, w in enumerate(words):
        cur.append(j)
        nxt = words[j + 1] if j + 1 < len(words) else None
        if (nxt is None or re.search(r'[.!?:;]$', w['w']) or len(cur) >= maxw or (re.search(r',$', w['w']) and len(cur) >= 1)
                or nxt['s'] - w['e'] > 0.3):
            chunks.append(cur); cur = []
    # tiny all-stopword chunks merge forward (no beat shorter than ~0.45 s without a real word)
    out = []
    for ch in chunks:
        if out and len(out[-1]) + len(ch) <= maxw + 1 and (all(norm(words[x]['w']) in STOP for x in out[-1])
                                                          or words[ch[0]]['s'] - words[out[-1][0]]['s'] < 0.45):
            out[-1] = out[-1] + ch
        else:
            out.append(ch)
    beats = []
    for ch in out:
        def score(x):
            w = words[x]; n = norm(w['w'])
            if not n: return -9
            s = 0
            if number_of(w['w']): s += 5
            if w['k']: s += 3
            if w.get('acc') == 'rd': s += 3
            elif w.get('acc'): s += 2
            if n in STOP: s -= 3
            if len(n) >= 5: s += 1
            return s + len(n) * 0.01
        h = max(ch, key=score)
        hero = [h]
        if words[h]['k'] and not number_of(words[h]['w']):     # starred pair ("John Roebling", "the bends" stays one)
            for nb in (h + 1, h - 1):
                if nb in ch and words[nb]['k'] and not number_of(words[nb]['w']) and norm(words[nb]['w']) not in STOP \
                        and not re.search(r'[,.:;!?]$', words[min(h, nb)]['w']) \
                        and len(clean(words[h]['w']) + clean(words[nb]['w'])) <= 16:
                    hero = sorted([h, nb]); break
        beats.append(dict(words=ch, hero=hero, start=words[ch[0]]['s']))
    return beats


def shape_svg(kind, size, color):
    if kind == 'tri':
        pts = '50,4 97,92 3,92'
    else:                                            # starburst, 14 points
        n, pts = 14, []
        for i in range(2 * n):
            r = 48 if i % 2 == 0 else 30; a = math.pi * i / n - math.pi / 2
            pts.append(f'{50 + r * math.cos(a):.1f},{50 + r * math.sin(a):.1f}')
        pts = ' '.join(pts)
    return f'<svg viewBox="0 0 100 100" width="{size}" height="{size}"><polygon points="{pts}" fill="{color}"/></svg>'


# ------------------------------------------------------------------ one scene
class KScene:
    def __init__(self, C, k, name, cfg, media, opt):
        self.C, self.k, self.name, self.cfg, self.media, self.o = C, k, name, cfg, media, opt
        self.h0 = C.host_start(k); self.D = C.host_end(k) - self.h0
        self.cut = (C.host_start(k + 1) - self.h0) if k + 1 < C.NSC else None
        self.p = f'k{k}'
        self.body, self.js, self.cues = [], [], []
        self.ground_state = []                       # (t, media index, dim, label on)

    def L(self, t): return round(t - self.h0, 3)

    def set_ground(self, t, mi, mode):
        self.ground_state.append((max(0.0, t), mi, mode))

    # ---------------------------------------------------- ground (media + dim + label), camera push across the scene
    def ground(self):
        ms = self.media
        st = {}
        for t, mi, mode in sorted(self.ground_state, key=lambda x: x[0]): st[round(t, 3)] = (mi % len(ms) if ms else 0, mode)
        st = sorted(st.items())
        if not st or st[0][0] > 0: st.insert(0, (0.0, (st[0][1][0] if st else 0, 'photo')))
        st[0] = (0.0, st[0][1])
        mi0, mode0 = st[0][1]
        h = [f'    <div id="{self.p}-g" class="kg"><div id="{self.p}-cam" class="kcam">']
        for i, (sid, lab) in enumerate(ms):
            if self.C.is_video(sid):
                d = max(0.1, min(self.D, self.C.clip_len(sid) - 0.1))
                m = (f'<img src="{self.C.first_frame(sid)}" alt="" />'
                     f'<video id="{self.p}-v{i}" class="clip" src="{self.C.asset(sid)}" muted playsinline data-start="0" data-duration="{d:.2f}"></video>')
            else:
                m = f'<img id="{self.p}-i{i}" src="{self.C.asset(sid)}" alt="" style="object-position: {esc(self.pos(sid))}" />'
            h.append(f'      <div id="{self.p}-m{i}" class="kmed" style="opacity:{1 if i == mi0 else 0}">{m}</div>')
        h.append(f'    </div><div id="{self.p}-dim" class="kdim" style="opacity:{GROUNDS.get(mode0, .52)}"></div><div class="kvig"></div>'
                 f'<div id="{self.p}-fl0" class="kdim" style="background:{self.o["accent"]}; opacity:{1 if mode0 == "mask" else 0}"></div>')
        for i, (sid, lab) in enumerate(ms):
            h.append(f'    <div id="{self.p}-l{i}" class="klab" style="opacity:{1 if (i == mi0 and mode0 != "black") else 0}">{label_html(lab)}</div>')
        h.append('    </div>')
        js = f'      tl.fromTo("#{self.p}-cam", {{ scale: 1.0 }}, {{ scale: 1.12, duration: {self.D:.3f}, ease: "none" }}, 0);\n'
        cur, lab_cur, dim_cur, punched = mi0, (mi0 if mode0 != 'black' else None), GROUNDS.get(mode0, .52), None
        for n, (t, (mi, mode)) in enumerate(st):
            if n:
                if punched is not None:
                    js += f'      tl.set("#{self.p}-m{punched}", {{ scale: 1.0 }}, {t:.3f});\n'; punched = None
                if ms and cur != mi:
                    js += f'      tl.set("#{self.p}-m{cur}", {{ opacity: 0 }}, {t:.3f});\n      tl.set("#{self.p}-m{mi}", {{ opacity: 1 }}, {t:.3f});\n'
                    cur = mi
                dim = GROUNDS.get(mode, .52)
                if dim != dim_cur:
                    js += f'      tl.set("#{self.p}-dim", {{ opacity: {dim} }}, {t:.3f});\n'; dim_cur = dim
                if (mode == 'mask') != (st[n - 1][1][1] == 'mask'):
                    js += f'      tl.set("#{self.p}-fl0", {{ opacity: {1 if mode == "mask" else 0} }}, {t:.3f});\n'
                lab = mi if (ms and mode != 'black') else None
                if lab != lab_cur:
                    if lab_cur is not None: js += f'      tl.set("#{self.p}-l{lab_cur}", {{ opacity: 0 }}, {t:.3f});\n'
                    if lab is not None: js += f'      tl.set("#{self.p}-l{lab}", {{ opacity: 1 }}, {t:.3f});\n'
                    lab_cur = lab
            if mode == 'bright' and ms:
                js += f'      tl.fromTo("#{self.p}-m{mi}", {{ scale: 1.0 }}, {{ scale: 1.22, duration: 0.6, ease: "expo.out", immediateRender: false }}, {t:.3f});\n'
                punched = mi
        return '\n'.join(h), js

    def pos(self, sid):
        if sid == self.cfg.get('src') and self.cfg.get('pos'): return self.cfg['pos']
        return '50% 40%'

    def photo_url(self, mi):
        if not self.media: return None
        sid = self.media[mi % len(self.media)][0]
        return self.C.first_frame(sid) if self.C.is_video(sid) else self.C.asset(sid)

    # ---------------------------------------------------- a beat
    def beat(self, b, j, words, t_end, fx, mi, last):
        q = f'{self.p}-b{j}'
        ws = [words[x] for x in b['words']]
        hero = [words[x] for x in b['hero']]
        pre = [words[x] for x in b['words'] if x < b['hero'][0]]
        post = [words[x] for x in b['words'] if x > b['hero'][-1]]
        num = number_of(hero[0]['w']) if len(hero) == 1 else None
        if num: fx = 'count'
        if fx == 'depth' and pre and post: fx = 'stretch'
        if fx == 'mask' and not self.media: fx = 'slam'
        htxt = [clean(w['w']).upper() for w in hero]
        if num:
            pfx, v, sfx_, dec, comma = num
            disp = f'{pfx}{v:,.{dec}f}' if comma else f'{pfx}{v:.{dec}f}'
            if norm(hero[0]['w']) in NUMW: disp = str(int(v))
            lines = [(disp + sfx_.upper())]
        else:
            one = ' '.join(htxt)
            lines = [one] if len(htxt) == 1 or fit([one]) >= 300 else htxt
        size = fit(lines, 940, 560 if len(lines) == 1 else 430)
        hh = round(size * .8 * len(lines))
        sm_lines = lambda ws_: 0 if not ws_ else max(1, math.ceil(sum(len(clean(w['w'])) + 1 for w in ws_) * 60 * .66 / 940))
        ph, qh = sm_lines(pre) * 64, sm_lines(post) * 64
        gap = 26
        total = ph + (gap if ph else 0) + hh + (gap if qh else 0) + qh
        top = max(280, round(880 - total / 2))
        y_pre, y_hero = top, top + ph + (gap if ph else 0)
        y_post = y_hero + hh + gap
        t0 = self.L(b['start']) - 0.05
        th = max(t0, self.L(hero[0]['s']) - 0.03)
        accent = (j % 2 == 1) or hero[0].get('acc') == 'rd' or bool(num)
        mode = {'mask': 'black', 'count': 'bright', 'depth': 'black', 'shape': 'black'}.get(fx, 'photo')
        if fx == 'mask' and th > t0 + 0.05:      # the flood + photo-in-letters arrive WITH the hero word, not before
            self.set_ground(t0, mi, 'photo'); self.set_ground(th, mi, 'mask')
        else:
            self.set_ground(t0, mi, 'mask' if fx == 'mask' else mode)
        h, js, cues = [], '', []

        def small(ws_, y, tag):
            if not ws_: return
            spans = ''.join(f'<span id="{q}{tag}{n}"' + (' class="a"' if w['k'] and mode != 'bright' else '') + f'>{esc(clean(w["w"]))}</span>' for n, w in enumerate(ws_))
            h.append(f'      <div class="ks" style="top:{y}px">{spans}</div>')
            nonlocal js
            for n, w in enumerate(ws_):
                at = max(t0, self.L(w['s']) - 0.04)
                js += f'      tl.fromTo("#{q}{tag}{n}", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.1, ease: "power3.out" }}, {at:.3f});\n'
        small(pre, y_pre, 'p')
        inner = '<br>'.join(esc(l) for l in lines)
        if num:
            inner = f'{esc(pfx)}<span id="{q}n">0</span>{esc(sfx_.upper())}'
        hw = [f'      <div class="khw" style="top:{y_hero}px; height:{hh}px">']
        if fx == 'shape':
            sz = int(hh * 1.35 + 60); kind = 'tri' if j % 2 else 'star'
            hw.append(f'        <div id="{q}s" class="kshape" style="left:{(W_ - sz) // 2}px; top:{(hh - sz) // 2 + (12 if kind == "tri" else 0)}px">'
                      f'{shape_svg(kind, sz, self.o["accent"])}</div>')
        if fx == 'depth':
            for e_ in (2, 1):
                hw.append(f'        <div id="{q}e{e_}" data-layout-allow-overlap class="kh echo" style="font-size:{size}px">{inner if not num else esc(lines[0])}</div>')
        if fx == 'glitch':
            hw.append(f'        <div id="{q}gr" data-layout-allow-overlap class="kh gr" style="font-size:{size}px">{inner}</div>')
            hw.append(f'        <div id="{q}gc" data-layout-allow-overlap class="kh gc" style="font-size:{size}px">{inner}</div>')
        cls = 'kh' + (' mask' if fx == 'mask' else ' a' if accent and fx != 'shape' else '')
        sty = f'font-size:{size}px'
        if fx == 'mask':
            sty += f"; background-image: url('{self.photo_url(mi)}')"
        hw.append(f'        <div id="{q}h" class="{cls}" style="{sty}">{inner}</div>')
        hw.append('      </div>')
        h.append('\n'.join(hw))
        small(post, y_post, 'q')
        # beat container: visible on the beat, zoom-through exit into the next beat
        js += f'      tl.set("#{q}", {{ opacity: 1 }}, {t0:.3f});\n'
        js += f'      tl.fromTo("#{q}", {{ scale: 0.9 }}, {{ scale: 1, duration: 0.2, ease: "power4.out" }}, {t0:.3f});\n'
        ex = t_end if last else max(t0 + 0.21, t_end - 0.15)
        if ex - (t0 + 0.21) > 0.25:
            js += f'      tl.to("#{q}", {{ scale: 1.045, duration: {ex - (t0 + 0.21) - 0.01:.3f}, ease: "none" }}, {t0 + 0.21:.3f});\n'
        if not last:
            js += (f'      tl.to("#{q}", {{ scale: 1.34, opacity: 0, filter: "blur(10px)", duration: {max(0.06, t_end - ex):.3f}, ease: "power4.in" }}, {ex:.3f});\n'
                   f'      tl.set("#{q}", {{ opacity: 0, filter: "blur(0px)" }}, {t_end:.3f});\n')
        H = f'#{q}h'
        if fx == 'stretch':
            js += (f'      tl.set("{H}", {{ opacity: 1 }}, {th:.3f});\n'
                   f'      tl.fromTo("{H}", {{ scaleY: 2.1, scaleX: 0.62, transformOrigin: "50% 100%" }}, {{ scaleY: 1, scaleX: 1, duration: 0.22, ease: "power4.out" }}, {th:.3f});\n')
            cues.append((th, 'thump', 0.55))
        else:
            js += f'      tl.fromTo("{H}", {{ opacity: 0, scale: 0.55, filter: "blur(14px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.17, ease: "back.out(1.6)" }}, {th:.3f});\n'
            cues.append((th, 'stamp' if fx in ('shape', 'glitch') else 'thump', 0.5))
        if fx == 'glitch':
            seq = [(0, 22, -16, 1), (.04, -14, 12, 1), (.08, 9, -6, .9), (.12, -4, 3, .6), (.17, 0, 0, 0)]
            for dt, a, c, o in seq:
                js += (f'      tl.set("#{q}gr", {{ x: {a}, y: {round(a / 3)}, opacity: {o} }}, {th + dt:.3f});\n'
                       f'      tl.set("#{q}gc", {{ x: {c}, y: {round(-c / 3)}, opacity: {o} }}, {th + dt:.3f});\n')
            js += (f'      tl.set("{H}", {{ clipPath: "inset(0 0 52% 0)", x: 14 }}, {th + 0.05:.3f});\n'
                   f'      tl.set("{H}", {{ clipPath: "inset(0 0 0% 0)", x: 0 }}, {th + 0.1:.3f});\n')
            cues.append((th + 0.02, 'zap', 0.35))
        if fx == 'depth':
            dirn = -1 if not pre else 1
            for e_, (sc, op) in {1: (0.74, 0.6), 2: (0.52, 0.32)}.items():
                dy = dirn * hh * (0.62 if e_ == 1 else 1.05)
                js += (f'      tl.fromTo("#{q}e{e_}", {{ opacity: 0, y: 0, scale: 1 }}, {{ opacity: {op}, y: {dy:.0f}, scale: {sc}, duration: 0.3, ease: "power4.out" }}, {th + 0.05 * e_:.3f});\n')
        if fx == 'shape':
            js += f'      tl.fromTo("#{q}s", {{ opacity: 1, scale: 0, rotation: -40 }}, {{ scale: 1, rotation: 0, duration: 0.24, ease: "back.out(1.7)" }}, {th:.3f});\n'
            js += f'      tl.to("#{q}s", {{ rotation: 12, duration: {max(0.3, t_end - th - 0.25):.3f}, ease: "none" }}, {th + 0.24:.3f});\n'
        if num:
            v0 = (v - 12) if (1000 <= v <= 2100 and dec == 0 and not comma) else 0
            dur = 0.5 if v0 else 0.65
            fmt = f'n.v.toFixed({dec})' if dec else ('Math.round(n.v).toString().replace(/\\B(?=(\\d{{3}})+(?!\\d))/g, ",")' if comma else 'Math.round(n.v).toString()')
            js += (f'      {{ const n = {{ v: {v0} }}; tl.fromTo(n, {{ v: {v0} }}, {{ v: {v}, duration: {dur}, ease: "power3.out", '
                   f'onUpdate: () => {{ document.getElementById("{q}n").textContent = {fmt}; }} }}, {th:.3f}); }}\n')
            js += f'      tl.set("#{q}n", {{ textContent: {J(disp[len(pfx):])} }}, {th + dur + 0.01:.3f});\n'
            cues += [(th + 0.05 * n, 'tick', 0.45) for n in range(7)]
        self.body.append(f'    <div id="{q}" class="kb">\n' + '\n'.join(h) + '\n    </div>')
        self.js.append(js); self.cues += cues

    # ---------------------------------------------------- opener hook card (frame-1 title over the photo)
    def hook(self, lines, words, t_end):
        q = f'{self.p}-hook'
        l1, l2 = (lines + [''])[:2]
        s1, s2 = fit([l1], 940, 250), fit([l2], 940, 330) if l2 else 0
        h1, h2 = round(s1 * .8), round(s2 * .8)
        top = round(860 - (h1 + 30 + h2) / 2)
        spans = lambda txt, tag: ' '.join(f'<span id="{q}{tag}{n}" style="display:inline-block">{esc(w)}</span>' for n, w in enumerate(txt.split()))
        h = (f'    <div id="{q}" class="kb" style="opacity:1">\n'
             f'      <div class="khw" style="top:{top}px; height:{h1}px"><div id="{q}1" class="kh" style="font-size:{s1}px; opacity:1">{spans(l1, "a")}</div></div>\n'
             + (f'      <div class="khw" style="top:{top + h1 + 30}px; height:{h2}px"><div id="{q}2" class="kh a" style="font-size:{s2}px; opacity:1">{spans(l2, "b")}</div></div>\n' if l2 else '')
             + '    </div>')
        js = f'      tl.fromTo("#{q}1", {{ x: -60 }}, {{ x: 0, duration: 0.5, ease: "power4.out" }}, 0);\n'
        if l2: js += f'      tl.fromTo("#{q}2", {{ scale: 1.08 }}, {{ scale: 1, duration: 0.5, ease: "power4.out" }}, 0);\n'
        # pulse each hook word as it is spoken
        targets = [(f'#{q}a{n}', norm(w)) for n, w in enumerate(l1.split())] + [(f'#{q}b{n}', norm(w)) for n, w in enumerate(l2.split())]
        used = set(); last = None
        for w in words:
            for sel, nw in targets:
                if sel not in used and nw and norm(w['w']) == nw:
                    used.add(sel); at = self.L(w['s']) - 0.03; last = at
                    if self.media:   # every hook word also punches the camera in on the photo
                        js += f'      tl.to("#{self.p}-m0", {{ scale: {1 + 0.035 * len(used):.3f}, duration: 0.25, ease: "expo.out" }}, {at:.3f});\n'
                    a_, b_ = (self.o['accent'], self.o['ink']) if sel.startswith(f'#{q}a') else (self.o['ink'], self.o['accent'])
                    js += f'      tl.fromTo("{sel}", {{ scale: 1.16, color: "{a_}" }}, {{ scale: 1, color: "{b_}", duration: 0.28, ease: "power3.out", immediateRender: false }}, {at:.3f});\n'
                    break
        if last is not None: self.cues.append((last, 'thump', 0.6))
        js += (f'      tl.to("#{q}", {{ scale: 1.34, opacity: 0, filter: "blur(10px)", duration: 0.15, ease: "power4.in" }}, {t_end - 0.15:.3f});\n'
               f'      tl.set("#{q}", {{ opacity: 0 }}, {t_end:.3f});\n') if t_end is not None else ''
        self.set_ground(0.0, 0, 'photo')
        l2w = {norm(x) for x in l2.split()}
        if len(self.media) > 1 and l2w:          # split hooks (then | now): hard cut to the 2nd photo on the 2nd hook line
            hit = [w for w in words if norm(w['w']) in l2w]
            if hit: self.set_ground(self.L(hit[0]['s']) - 0.03, 1, 'photo')
        self.body.append(h); self.js.append(js)

    # ---------------------------------------------------- CTA: typed question + A / B slam with their photos
    def cta(self, seg_words, cta, ab):
        q = f'{self.p}-cta'
        t0 = self.L(seg_words[0]['s']) - 0.05
        qtxt = cta.get('q', 'Which one?').upper()
        chars = ''.join(f'<span id="{q}c{n}">{esc(c)}</span>' for n, c in enumerate(qtxt))
        self.set_ground(t0, 0, 'black')
        h = [f'    <div id="{q}" class="kb" style="opacity:1">',
             f'      <div class="ktype">{chars}<span id="{q}cur" class="cur"></span></div>']
        js = ''
        type_d = min(0.9, 0.035 * len(qtxt))
        for n in range(len(qtxt)):
            js += f'      tl.set("#{q}c{n}", {{ fontSize: 70 }}, {t0 + type_d * n / max(1, len(qtxt)):.3f});\n'
        tt = t0
        while tt < self.D:
            js += f'      tl.set("#{q}cur", {{ opacity: 0 }}, {tt + 0.27:.3f});\n      tl.set("#{q}cur", {{ opacity: 1 }}, {tt + 0.54:.3f});\n'; tt += 0.54
        js += f'      tl.set("#{q}cur", {{ opacity: 0 }}, 0);\n      tl.set("#{q}cur", {{ opacity: 1 }}, {t0:.3f});\n'
        self.cues += [(t0 + 0.08 * n, 'type', 0.35) for n in range(int(type_d / 0.08))]
        names = [cta.get('a', 'A'), cta.get('b', 'B')]
        times = []
        for side, nm in enumerate(names):
            hits = [w for w in seg_words if norm(w['w']) == norm(nm)]
            times.append([self.L(w['s']) - 0.03 for w in hits])
        for side, nm in enumerate(names):
            x = 40 if side == 0 else 560
            src = ab[side] if side < len(ab) else None
            if src:
                sid, lab = src
                m = (f'<img src="{self.C.first_frame(sid)}" alt="" />' if self.C.is_video(sid) else
                     f'<img src="{self.C.asset(sid)}" alt="" style="object-position: 50% 25%" />')
                h.append(f'      <div id="{q}p{side}" class="kpan" style="left:{x}px">{m}<div class="klab">{label_html(lab)}</div></div>')
            s = fit([nm.upper()], 470, 230)
            h.append(f'      <div id="{q}n{side}" class="kname{" a" if side else ""}" style="left:{0 if side == 0 else 540}px; font-size:{s}px; '
                     f'{"color:" + self.o["accent"] if side else ""}">{esc(nm.upper())}</div>')
            ts = times[side] or [t0 + 0.9 + side * 0.6]
            at = max(t0 + type_d * 0.5, ts[0])
            if src:                      # both photos waiting (dimmed) under the question, each lights up on its spoken name
                pre_t = t0 + type_d + 0.05 + 0.08 * side
                if pre_t < at - 0.2:
                    js += f'      tl.fromTo("#{q}p{side}", {{ opacity: 0, scale: 0.86, y: 40 }}, {{ opacity: 0.38, scale: 0.94, y: 0, duration: 0.3, ease: "power4.out" }}, {pre_t:.3f});\n'
                    js += f'      tl.to("#{q}p{side}", {{ opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.5)" }}, {at:.3f});\n'
                else:
                    js += f'      tl.fromTo("#{q}p{side}", {{ opacity: 0, scale: 0.7, y: 40 }}, {{ opacity: 1, scale: 1, y: 0, duration: 0.24, ease: "back.out(1.5)" }}, {at:.3f});\n'
            js += f'      tl.fromTo("#{q}n{side}", {{ opacity: 0, scale: 0.5, filter: "blur(12px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.18, ease: "back.out(1.6)" }}, {at + 0.04:.3f});\n'
            self.cues.append((at, 'stamp', 0.6))
            for t2 in ts[1:]:
                js += f'      tl.fromTo("#{q}n{side}", {{ scale: 1.22 }}, {{ scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }}, {t2:.3f});\n'
                if src: js += f'      tl.fromTo("#{q}p{side}", {{ scale: 1.06 }}, {{ scale: 1, duration: 0.3, ease: "power3.out", immediateRender: false }}, {t2:.3f});\n'
                self.cues.append((t2, 'pop', 0.45))
        tb = max(times[1][:1] or [t0 + 1.5])
        h.append(f'      <div id="{q}or" class="kor">OR</div>')
        h.append(f'      <div id="{q}ask" class="kask">Comment {esc(names[0])} or {esc(names[1])}</div>')
        js += f'      tl.fromTo("#{q}or", {{ opacity: 0, scale: 0 }}, {{ opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)" }}, {tb - 0.15:.3f});\n'
        ta = (times[0][1] - 0.2) if len(times[0]) > 1 else tb + 0.6
        js += f'      tl.fromTo("#{q}ask", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.25, ease: "power4.out" }}, {ta:.3f});\n'
        js += f'      tl.fromTo("#{q}", {{ scale: 1 }}, {{ scale: 1.06, duration: {max(0.5, self.D - t0):.3f}, ease: "none" }}, {t0:.3f});\n'
        self.body.append('\n'.join(h) + '\n    </div>'); self.js.append(js)

    # ---------------------------------------------------- seams: zoom-through in, zoom-through out, flare burst at the cut
    def html(self):
        gh, gjs = self.ground()
        inner = gh + '\n' + '\n'.join(self.body)
        sj = ''
        if self.k:
            sj += (f'      tl.fromTo("#{self.p}-seam", {{ scale: 0.84, filter: "blur(14px)" }}, {{ scale: 1, filter: "blur(0px)", duration: 0.32, ease: "power4.out" }}, 0);\n'
                   f'      tl.fromTo("#{self.p}-fl", {{ opacity: 1, scale: 0.25 }}, {{ opacity: 0, scale: 2.4, duration: 0.42, ease: "power2.out" }}, 0);\n'
                   f'      tl.fromTo("#{self.p}-st", {{ opacity: 1, scaleX: 0.1 }}, {{ opacity: 0, scaleX: 1.6, duration: 0.32, ease: "power3.out" }}, 0);\n')
        if self.cut is not None:
            C = self.cut
            sj += (f'      tl.to("#{self.p}-seam", {{ scale: 1.22, filter: "blur(14px)", duration: 0.22, ease: "power4.in" }}, {C - 0.22:.3f});\n'
                   f'      tl.set("#{self.p}-seam", {{ opacity: 0 }}, {C:.3f});\n')
            self.cues.append((C - 0.14, 'whoosh', 0.6))
        body = (f'\n    <div id="{self.p}-seam" class="kg">\n{inner}\n    </div>\n'
                f'    <div id="{self.p}-fl" class="kflare"></div><div id="{self.p}-st" class="kstreak"></div>')
        js = ''.join(self.js) + gjs + sj
        css = CSS.replace('%GROUND%', self.o['ground']).replace('%INK%', self.o['ink']).replace('%ACCENT%', self.o['accent'])
        return body, js, css, self.cues


def build(C):
    """-> [(name, body, js, css, cues)] for every scene (opener + scenes)"""
    HF = C.HF; ko = HF.get('kinetic', {})
    opt = dict(accent=ko.get('accent', '#FF4A1C'), ink=ko.get('ink', '#F5F1EA'), ground=ko.get('ground', '#0B0A0A'))
    rot = ko.get('every', ROTATE); maxw = ko.get('max_words', 3)
    caps = HF.get('caps', {})
    def acc(t):
        n = norm(t)
        for cls in ('rd', 'cu', 'vg'):
            if any(n.startswith(norm(x)) for x in caps.get(cls, [])): return cls
        return None
    pool = media_pool(C)
    ab = []
    for _, cfg in C.SCENES:
        for e in cfg.get('els', []):
            if e.get('el') == 'ab':
                for side in ('a', 'b'):
                    sid = (e.get(side) or {}).get('src')
                    if sid and C.exists(sid) and pool.get(sid): ab.append((sid, pool[sid]))
    out, prev = [], set()
    nbeat = 0
    for k, (name, cfg) in enumerate(C.SCENES):
        media = scene_media(C, k, cfg, pool, prev); prev = {m[0] for m in media}
        S = KScene(C, k, name, cfg, media, opt)
        segi = [i for i in range(len(C.segs)) if C.scene_of[i] == k]
        cta_i = [i for i in segi if C.segs[i].get('cta')]
        hook_i = segi[:1] if (k == 0 and C.E.get('hook')) else []
        words = [dict(w, acc=acc(w['w'])) for i in segi if i not in cta_i and i not in hook_i for w in C.CAPS[i]]
        bts = beats_for(C, words, maxw)
        first_t = S.L(words[0]['s']) - 0.05 if words else None
        if hook_i:
            hw = C.CAPS[hook_i[0]]
            S.hook(list(C.E['hook']), hw, first_t if first_t is not None else (S.L(C.CAPS[cta_i[0]][0]['s']) - 0.05 if cta_i else None))
        cta_t = S.L(C.CAPS[cta_i[0]][0]['s']) - 0.05 if cta_i else None
        mi = 0
        for j, b in enumerate(bts):
            t_end = S.L(bts[j + 1]['start']) - 0.05 if j + 1 < len(bts) else (cta_t if cta_t is not None else None)
            last = t_end is None
            if last: t_end = S.cut if S.cut is not None else S.D
            fx = 'mask' if (j == 0 and not hook_i and media) else rot[nbeat % len(rot)]
            if j and media and len(media) > 1: mi += 1
            S.beat(b, j, words, t_end, fx, mi, last)
            nbeat += 1
        if cta_i:
            cw = [w for i in cta_i for w in C.CAPS[i]]
            S.cta(cw, C.E.get('cta', {}), ab)
        out.append((name,) + S.html())
    return out
