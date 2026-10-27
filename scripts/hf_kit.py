"""HyperFrames Shorts kit: parameterised scene templates + timed elements in the #201 pilot look (used by scripts/hf_build.py).

An episode chooses per scene (opener = "hf_open", scenes = scenes[i]["hf"]):
    {"tpl": "<template>", ...template params, "els": [{"el": "<element>", ...element params}, ...]}

Times ("at", "out", ...) are specs, resolved against the Whisper word timings of THIS scene:
    "copper"  first spoken word starting with "copper"   "green#2"  the 2nd one   "less-0.08" / "by+0.15" offsets
    "cta"     start of the CTA segment                     "end-0.45" scene end      1.2 (a number) = seconds from the scene start
    "62800"   a spoken number as written in "cap" ($62,800 → "62800"); strings are always words
Media "src" = a photos id (video ids → assets/<id>.mp4, else .jpg; derived images like front_brown too).
Labels are [place, KIND] → "Place · <b>Kind</b>" chips (KIND: Real photo / Real footage / Graphic / Simulation …) or a plain string.

Templates (background + entrance):
    split   compare hook: two images A|B with a divider, wipes on words, optional paint overlay
    photo   full-bleed photo or footage (ken burns / settle / punch / drift), label chip, optional paint overlay
    card    colour-flood ground + framed media card with its label (chips can sit inside: "in": "card")
    plain   dark ground only (graphics scenes: bars, counters)
Elements:
    title (kicker + big line; "items" roll like a slot machine), counter, ruler, bars, timeline (year counter + bar),
    chip, stamp, sub, glass (verdict card with check + quote), stack (labelled layers), ab (end card A or B + comment ask), loop
"""
import json, re

W_, H_ = 1080, 1920
J = json.dumps
norm = lambda s: re.sub(r'[^a-z0-9]', '', str(s).lower())

THEME = {'cu': '#E08A4E', 'vg': '#7FD3BF', 'capcu': '#F0A066', 'capvg': '#8FE3CE', 'chipvg': '#8FD9C6', 'chipcu': '#E8A06A',
         'p0': '#C9773F'}  # vg also tints the progress bar end

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

# every element class the kit uses (one stylesheet per scene; HyperFrames scopes it to the scene)
KIT_CSS = """
  .photo { position: absolute; height: auto; }
  .divider { position: absolute; width: 4px; background: #F4EEE3; box-shadow: 0 0 24px rgba(244,238,227,.75); }
  .knob { position: absolute; left: -22px; width: 48px; height: 48px; border-radius: 50%; background: #F4EEE3; box-shadow: 0 6px 20px rgba(0,0,0,.4); }
  .paint { position: absolute; left: 0; top: 0; width: 100%; height: 100%;
    background: repeating-linear-gradient(90deg, #9A9893 0 22px, #A9A7A2 22px 38px, #92908B 38px 60px); clip-path: inset(0 0 100% 0); }
  .unit { font-size: 120px; color: #E08A4E; }
  .ruler { position: absolute; height: 60px; border-left: 4px solid #F4EEE3; border-right: 4px solid #F4EEE3; border-bottom: 4px solid #F4EEE3; }
  .ticks { position: absolute; inset: 30px 0 0 0; background: repeating-linear-gradient(90deg, rgba(244,238,227,.75) 0 3px, transparent 3px 90px); }
  .sliver { position: absolute; left: 0; bottom: 0; height: 52px; transform-origin: 0 50%; }
  .rl { position: absolute; top: 72px; font: 800 30px Inter, sans-serif; letter-spacing: .08em; color: #F4EEE3; }
  .rl0 { left: -10px; } .rl1 { right: -20px; }
  .bar { position: absolute; left: 90px; right: 90px; height: 18px; border-radius: 9px; background: rgba(244,238,227,.14); overflow: hidden; }
  .fill2 { position: absolute; inset: 0; transform-origin: 0 50%; transform: scaleX(0); }
  .ticklabels { position: absolute; left: 90px; right: 90px; display: flex; justify-content: space-between; font: 800 30px Inter, sans-serif; color: rgba(244,238,227,.8); letter-spacing: .06em; }
  .agent { background: rgba(9,12,11,.78); }
  .done { border-color: #7FD3BF; }
  .sub { position: absolute; left: 0; right: 0; text-align: center; font: 800 36px Inter, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #F4EEE3; }
  .myth { border-color: #FF5A4E; }
  .myth b { color: #FF7A6E; }
  .stamp { position: absolute; padding: 14px 34px 6px; font-family: "League Gothic", sans-serif; line-height: 1;
    text-transform: uppercase; border: 10px solid currentColor; border-radius: 22px; opacity: 0; background: rgba(10,6,6,.25); }
  .glass { position: absolute; left: 40px; right: 40px; padding: 34px 40px 36px; border-radius: 30px; background: rgba(10,16,15,.80);
    border: 1.5px solid rgba(127,211,191,.45); box-shadow: 0 30px 80px rgba(0,0,0,.5); opacity: 0; }
  .eyebrow { font: 900 30px Inter, sans-serif; letter-spacing: .2em; text-transform: uppercase; color: #7FD3BF; }
  .verdict { margin-top: 18px; font-family: "League Gothic", sans-serif; font-size: 112px; line-height: .95; text-transform: uppercase; color: #F4EEE3; }
  .check { display: inline-block; width: 92px; height: 92px; border-radius: 50%; background: #5FB8A5; color: #0A0E0D; text-align: center;
    font: 900 70px/92px Inter, sans-serif; vertical-align: 8px; margin-right: 10px; }
  .check.no { background: #FF5A4E; }
  .quote { margin-top: 20px; font: 400 italic 36px/1.3 "EB Garamond", serif; color: rgba(244,238,227,.88); }
  .stack { position: absolute; }
  .layer { height: 92px; margin-bottom: 10px; border-radius: 16px; display: flex; align-items: center; padding-left: 28px;
    font: 900 34px Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; opacity: 0; box-shadow: 0 16px 40px rgba(0,0,0,.45); }
  .l1 { background: linear-gradient(90deg, #3E9C89, #7FD3BF); color: #06201B; }
  .l2 { background: linear-gradient(90deg, #9C4E22, #E89A5E); color: #2A1205; }
  .l3 { background: linear-gradient(90deg, #77756F, #A9A7A2); color: #1A1A18; }
  .tile { position: absolute; width: 470px; height: 560px; border-radius: 30px; overflow: hidden; box-shadow: 0 30px 70px rgba(0,0,0,.6); }
  .tile img, .tile video { position: absolute; }
  .tb { left: 40px; border: 6px solid #E08A4E; } .tg { left: 570px; border: 6px solid #7FD3BF; }
  .tl { position: absolute; left: 0; right: 0; top: 18px; text-align: center; font-family: "League Gothic", sans-serif; font-size: 110px; text-transform: uppercase; color: #F4EEE3; text-shadow: 0 6px 24px rgba(0,0,0,.7); }
  .tsub { position: absolute; left: 0; right: 0; top: 128px; text-align: center; font: 800 26px Inter, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: rgba(244,238,227,.92); text-shadow: 0 2px 10px rgba(0,0,0,.8); }
  .ask { position: absolute; left: 40px; width: 790px; text-align: center; padding: 22px 0 20px; border-radius: 999px; background: #F4EEE3; color: #0A0E0D;
    font: 900 44px Inter, sans-serif; letter-spacing: .1em; text-transform: uppercase; opacity: 0; }
  .bars { position: absolute; left: 60px; width: 790px; }
  .brow { position: relative; height: 128px; margin-bottom: 22px; }
  .blab { font: 900 30px Inter, sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #F4EEE3; white-space: nowrap; }
  .btrack { position: absolute; left: 0; right: 0; top: 46px; height: 64px; border-radius: 14px; background: rgba(244,238,227,.10); }
  .bfill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 14px; transform-origin: 0 50%; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
  .bval { position: absolute; top: 46px; height: 64px; display: flex; align-items: center; padding-left: 18px; font-family: "League Gothic", sans-serif;
    font-size: 64px; color: #F4EEE3; text-shadow: 0 4px 16px rgba(0,0,0,.6); white-space: nowrap; }
"""

LEAD = {'whoosh': 0.0}


def theme_css(css, theme):
    for k, v in (theme or {}).items():
        if k in THEME and v: css = css.replace(THEME[k], v)
    return css


def label_html(lab):
    if isinstance(lab, str): return lab
    return f'{lab[0]} · <b>{lab[1]}</b>' if lab[0] else f'<b>{lab[1]}</b>'


class Scene:
    """one scene: resolves time specs, collects markup / css / gsap lines / sfx cues"""

    def __init__(self, B, k, cfg):
        self.B, self.k, self.cfg = B, k, cfg
        self.D = B.host_end(k) - B.host_start(k)
        self.p = cfg.get('id') or f's{k}'
        self.body, self.js, self.css, self.cues = [], [], [], []
        self.label_id = None

    def t(self, spec, default=None):
        if spec is None:
            if default is None: raise ValueError('time spec missing')
            return default
        if isinstance(spec, (int, float)): return float(spec)
        m = re.match(r'^\s*(.+?)\s*([+-]\s*\d*\.?\d+)?\s*$', str(spec))
        key, off = m.group(1), float((m.group(2) or '0').replace(' ', ''))
        if key == 'end': return round(self.D + off, 3)
        if key == 'cta': return round(self.B.cta_start() - self.B.host_start(self.k) + off, 3)
        nth = 1
        if '#' in key: key, nth = key.split('#'); nth = int(nth)
        return round(self.B.wt(self.k, key, nth) + off, 3)

    def src(self, sid): return self.B.asset(sid)
    def is_video(self, sid): return self.B.asset(sid).endswith('.mp4')

    def media(self, sid, cls='fill', style='', vdur=None, eid=None):
        eid = eid or f'{self.p}-m{len(self.body)}'
        if self.is_video(sid):
            ln = self.B.clip_len(sid)
            d = min(vdur if vdur is not None else self.D, ln - 0.1)
            return f'<video id="{eid}" class="clip {cls}" src="{self.src(sid)}" muted playsinline data-start="0" data-duration="{d:.2f}"{style}></video>'
        return f'<img id="{eid}" class="{cls}" src="{self.src(sid)}" alt=""{style} />'

    def add(self, html, js='', cues=()):
        self.body.append(html); self.js.append(js); self.cues += list(cues)


# ------------------------------------------------------------------ entrances
def enter(S, kind, sel):
    if kind == 'whip':
        S.js.append(f'      tl.fromTo("{sel}", {{ x: 320, filter: "blur(16px)" }}, {{ x: 0, filter: "blur(0px)", duration: 0.34, ease: "expo.out" }}, 0);\n')
    elif kind == 'vwhip':
        S.js.append(f'      tl.fromTo("{sel}", {{ y: -360, filter: "blur(16px)" }}, {{ y: 0, filter: "blur(0px)", duration: 0.36, ease: "expo.out" }}, 0);\n')
    elif kind == 'zoom':
        S.js.append(f'      tl.fromTo("{sel}", {{ scale: 1.35, opacity: 0, filter: "blur(14px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.42, ease: "expo.out" }}, 0);\n')
    elif kind == 'iris':
        S.js.append(f'      tl.fromTo("{sel}", {{ clipPath: "circle(0% at 50% 45%)" }}, {{ clipPath: "circle(110% at 50% 45%)", duration: 0.5, ease: "power2.inOut" }}, 0);\n')
    elif kind == 'flood':
        S.js.append(f'      tl.fromTo("#{S.p}-flood", {{ clipPath: "circle(0% at 50% 55%)" }}, {{ clipPath: "circle(120% at 50% 55%)", duration: 0.5, ease: "power2.inOut" }}, 0);\n'
                    f'      tl.fromTo("{sel}", {{ scale: 1.18, opacity: 0, filter: "blur(10px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }}, 0.12);\n')
    else:
        return
    S.cues.append((0.0, 'whoosh', S.cfg.get('whoosh', 0.7)))


def paint_overlay(S, P, cam_id):
    """GRAPHIC paint stroke that rolls down over the media (label swap: the media label goes, 'Paint · Graphic' comes)"""
    at = S.t(P['at'])
    op = P.get('opacity', 0.93)
    html = f'<div id="{S.p}-paint" class="paint" style="opacity:{op}"></div>'
    lab = P.get('label', ['Paint stroke', 'Graphic'])
    S.body.append(f'      <div id="{S.p}-plab" class="chip" style="left:{P.get("x", 40)}px; top:{P.get("y", S.cfg.get("labelY", 610))}px; opacity:0">{label_html(lab)}</div>')
    js = f'      tl.to("#{S.p}-paint", {{ clipPath: "inset(0 0 {P.get("to", "0%")} 0)", duration: {P.get("dur", 0.9)}, ease: "power2.inOut" }}, {at:.3f});\n'
    if P.get('hide', S.label_id):
        js += f'      tl.to("#{P.get("hide", S.label_id)}", {{ opacity: 0, duration: 0.15 }}, {at:.3f});\n'
    js += f'      tl.to("#{S.p}-plab", {{ opacity: 1, duration: 0.25 }}, {at + P.get("lab_dt", 0.15):.3f});\n'
    S.js.append(js); S.cues.append((at + P.get('sfx_dt', 0.05), 'paper', 0.9))
    return html


# ------------------------------------------------------------------ templates
def tpl_split(S, c):
    """hook: A | B (e.g. then | now, myth | fact), divider; wipes [{to: A|B, at, dur}] move the divider on the words"""
    g = c.get('img', {'w': 1700, 'x': -310, 'y': 0}); w, half = g['w'], g['w'] // 2
    cy = c.get('chipY', 610)
    S.label_id = f'{S.p}-chipB'
    paint = paint_overlay(S, c['paint'], 'cam') if c.get('paint') else ''
    gA, gB = c.get('imgA', g), c.get('imgB', g)     # two different photos: own geometry each (the split line stays at x 540)
    S.css.append(f"""
  #{S.p}-A {{ width: {gA['w']}px; left: {gA['x']}px; top: {gA['y']}px; }}
  #{S.p}-B {{ width: {gB['w']}px; left: {gB['x']}px; top: {gB['y']}px; }}""" if 'imgA' in c or 'imgB' in c else f"""
  #{S.p}-A, #{S.p}-B {{ width: {w}px; left: {g['x']}px; top: {g['y']}px; }}""")
    S.css.append(f"""
  #{S.p}-B {{ clip-path: inset(0 0 0 {540 - gB['x']}px); }}
  #{S.p}-div {{ top: {c.get('divTop', 560)}px; height: {c.get('divH', 1360)}px; left: 538px; }}
  #{S.p}-div .knob {{ top: {c.get('knob', 330)}px; }}""")
    S.body.insert(0, f"""    <div id="{S.p}-stage" class="stage">
      <div id="{S.p}-cam" class="stage">
        <img id="{S.p}-A" class="photo" src="{S.src(c['a'])}" alt="" />
        <img id="{S.p}-B" class="photo" src="{S.src(c['b'])}" alt="" />
        {paint}
      </div>
      <div id="{S.p}-div" class="divider"><div class="knob"></div></div>
      <div class="scrim-top"></div>
      <div class="scrim-bot"></div>
      <div id="{S.p}-chipA" class="chip cu" style="left:40px; top:{cy}px">{label_html(c['labelA'])}</div>
      <div id="{S.p}-chipB" class="chip" style="right:40px; top:{cy}px">{label_html(c['labelB'])}</div>""")
    z = c.get('zoom', [1.0, 1.07])
    js = f'      tl.fromTo("#{S.p}-cam", {{ scale: {z[0]}, transformOrigin: "{c.get("origin", "50% 40%")}" }}, {{ scale: {z[1]}, duration: D, ease: "none" }}, 0);\n'
    for i, wp in enumerate(c.get('wipes', [])):
        at, dur = S.t(wp['at']), wp.get('dur', 0.6)
        clip, dx = (f'inset(0 0 0 {gB["w"]}px)', 542) if wp['to'] == 'A' else ('inset(0 0 0 0px)', -545)
        lose, win = ('B', 'A') if wp['to'] == 'A' else ('A', 'B')
        if i == 0:
            js += f'      tl.fromTo("#{S.p}-B", {{ clipPath: "inset(0 0 0 {540 - gB["x"]}px)" }}, {{ clipPath: "{clip}", duration: {dur}, ease: "power2.inOut" }}, {at:.3f});\n'
            js += f'      tl.fromTo("#{S.p}-div", {{ x: 0 }}, {{ x: {dx}, duration: {dur}, ease: "power2.inOut" }}, {at:.3f});\n'
        else:
            js += f'      tl.to("#{S.p}-B", {{ clipPath: "{clip}", duration: {dur}, ease: "power2.inOut" }}, {at:.3f});\n'
            js += f'      tl.to("#{S.p}-div", {{ x: {dx}, duration: {dur}, ease: "power2.inOut" }}, {at:.3f});\n'
        js += f'      tl.to("#{S.p}-chip{lose}", {{ opacity: 0, duration: 0.2 }}, {at + wp.get('hide_dt', 0.1):.3f});\n'
        if i: js += f'      tl.to("#{S.p}-chip{win}", {{ opacity: 1, duration: 0.25 }}, {at + 0.55:.3f});\n'
        S.cues.append((at, wp.get('sfx', 'swish' if i == 0 else 'whoosh'), wp.get('gain', 0.6 if i == 0 else 0.7)))
    S.js.insert(0, js)
    S.tail = '    </div>'


def tpl_photo(S, c):
    """full-bleed photo / footage; zoom [a,b] over the scene, or settle {from, until} (+ punch {at, scale}); drift y"""
    sid = c['src']; ly = c.get('labelY', 1030)
    S.label_id = f'{S.p}-lab'
    if c.get('img'):
        g = c['img']; m = S.media(sid, 'photo', f' style="position:absolute; width:{g["w"]}px; left:{g["x"]}px; top:{g["y"]}px"', c.get('vdur') and S.t(c['vdur']), f'{S.p}-img')
    else:
        m = S.media(sid, 'fill', f' style="object-position: {c.get("pos", "50% 50%")}"', S.t(c['vdur']) if c.get('vdur') else None, f'{S.p}-img')
    paint = paint_overlay(S, c['paint'], 'cam') if c.get('paint') else ''
    lab = c.get('label')
    labh = f'\n      <div id="{S.p}-lab" class="chip" style="left:{c.get("labelX", 40)}px; top:{ly}px">{label_html(lab)}</div>' if lab else ''
    S.body.insert(0, f"""    <div id="{S.p}-stage" class="stage">
      <div id="{S.p}-cam" class="stage">
        {m}
        {paint}
      </div>
      <div class="scrim-top"></div><div class="scrim-bot"></div>{labh}""")
    js = ''
    enter(S, c.get('enter', 'whip'), f'#{S.p}-stage')
    if c.get('zoom'):
        z = c['zoom']; js += f'      tl.fromTo("#{S.p}-img", {{ scale: {z[0]} }}, {{ scale: {z[1]}, duration: D, ease: "none" }}, 0);\n'
    if c.get('settle'):
        st = c['settle']; js += (f'      tl.fromTo("#{S.p}-img", {{ scale: {st["from"]} }}, {{ scale: 1.0, duration: Math.max(0.3, {S.t(st["until"]):.3f}), '
                                 f'ease: "power2.out" }}, 0);\n')
    if c.get('punch'):
        pu = c['punch']; at = S.t(pu['at'])
        js += f'      tl.to("#{S.p}-img", {{ scale: {pu.get("scale", 1.16)}, duration: 0.5, ease: "expo.out" }}, {at:.3f});\n'
        S.cues.append((at, 'thump', 0.6))
    if c.get('drift'):
        js += f'      tl.fromTo("#{S.p}-cam", {{ y: 0 }}, {{ y: {c["drift"]}, duration: D, ease: "none" }}, 0);\n'
    S.js.append(js)
    S.tail = '    </div>'


def tpl_card(S, c):
    """colour flood ground + framed media card {x,y,w,h} with its label chip (top-left inside the card)"""
    g = c.get('box', {'x': 60, 'y': 620, 'w': 960, 'h': 540})
    bg = c.get('flood', 'radial-gradient(120% 70% at 50% 45%, #163A33 0%, #0A1513 55%, #070B0A 100%)')
    S.card_open = f"""      <div id="{S.p}-card" class="card" style="left:{g['x']}px; top:{g['y']}px; width:{g['w']}px; height:{g['h']}px">
        {S.media(c['src'], 'fill', f' style="object-position: {c.get("pos", "50% 50%")}"' if not S.is_video(c['src']) else '', S.t(c['vdur']) if c.get('vdur') else None, f'{S.p}-img')}
        <div class="chip" style="left:22px; top:22px">{label_html(c['label'])}</div>"""
    S.body.insert(0, f"""    <div id="{S.p}-flood" class="stage" style="background: {bg}"></div>
    <div id="{S.p}-stage" class="stage">""")
    enter(S, c.get('enter', 'flood'), f'#{S.p}-stage')
    if c.get('zoom') and not S.is_video(c['src']):
        z = c['zoom']; S.js.append(f'      tl.fromTo("#{S.p}-img", {{ scale: {z[0]} }}, {{ scale: {z[1]}, duration: D, ease: "none" }}, 0);\n')
    S.tail = '    </div>'


def tpl_plain(S, c):
    bg = c.get('flood', 'radial-gradient(120% 70% at 50% 40%, #16201E 0%, #0A0E0D 60%, #070908 100%)')
    S.body.insert(0, f"""    <div id="{S.p}-flood" class="stage" style="background: {bg}"></div>
    <div id="{S.p}-stage" class="stage">""")
    enter(S, c.get('enter', 'zoom'), f'#{S.p}-stage')
    S.tail = '    </div>'


TEMPLATES = dict(split=tpl_split, photo=tpl_photo, card=tpl_card, plain=tpl_plain)


# ------------------------------------------------------------------ elements
def el_title(S, e, i):
    """kicker + big line. items: [{kicker, text, c, size, at, kat, out}] — the first shows at frame 0 when it has no "at";
    fx: blur (fade-in) | pop (scale) | roll (slot machine, default for items after the first); out_fx: cut | up | roll"""
    items = e.get('items') or [e]
    top = e.get('top', 262); ktop = e.get('ktop', top - 56)
    html, js, cues = [], '', []
    for j, it in enumerate(items):
        q = f'{S.p}-t{i}_{j}'
        vis0 = j == 0 and it.get('at') is None
        if it.get('kicker'):
            khid = j > 0 or it.get('kat') is not None
            html.append(f'      <div id="{q}k" class="kicker" style="top:{ktop}px{"; opacity:0" if khid else ""}">{it["kicker"]}</div>')
        if it.get('text'):
            html.append(f'      <div id="{q}" class="big{(" " + it["c"]) if it.get("c") else ""}" style="top:{top}px; font-size:{it.get("size", e.get("size", 236))}px{("; letter-spacing:" + e["ls"]) if e.get("ls") else ""}'
                        f'{"" if vis0 else "; opacity:0"}">{it["text"]}</div>')
        fx = it.get('fx', e.get('fx', 'roll' if j else 'blur'))
        if it.get('kicker') and it.get('kat', it.get('at')) is not None and (j or it.get('kat') is not None):
            js += f'      tl.fromTo("#{q}k", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {S.t(it.get("kat", it.get("at"))):.3f});\n'
        if it.get('text') and it.get('at') is not None:
            at = S.t(it['at'])
            if fx == 'roll':
                js += f'      tl.fromTo("#{q}", {{ yPercent: 60, opacity: 0, filter: "blur(8px)" }}, {{ yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.32, ease: "expo.out" }}, {at:.3f});\n'
            elif fx == 'pop':
                js += f'      tl.fromTo("#{q}", {{ opacity: 0, scale: 1.4 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.out" }}, {at:.3f});\n'
                cues.append((at + 0.05, 'thump', 0.7))
            else:
                js += f'      tl.fromTo("#{q}", {{ opacity: 0, filter: "blur(10px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: {it.get("dur", 0.18)}, ease: "power4.out" }}, {at:.3f});\n'
        if it.get('sfx'): cues.append((S.t(it.get('kat', it.get('at', 0))), it['sfx'], it.get('gain', 0.5)))
        out = it.get('out')
        if out is None and j + 1 < len(items): out = items[j + 1].get('out_prev')
        if out is not None:
            o = S.t(out); ofx = it.get('out_fx', e.get('out_fx', 'roll'))
            ids = [f'#{q}'] if it.get('text') else []
            if ofx == 'cut':
                js += f'      tl.set({J(ids + ([f"#{q}k"] if it.get("kicker") else []))}, {{ opacity: 0 }}, {o:.3f});\n'
            else:
                if it.get('text'):
                    js += (f'      tl.to("#{q}", {{ yPercent: -60, opacity: 0, filter: "blur(8px)", duration: 0.22, ease: "power3.in" }}, {o:.3f});\n' if ofx == 'roll' else
                           f'      tl.to("#{q}", {{ opacity: 0, y: -40, filter: "blur(8px)", duration: 0.2, ease: "power3.in" }}, {o:.3f});\n')
                if it.get('kicker'):
                    js += f'      tl.to("#{q}k", {{ opacity: 0, duration: 0.15 }}, {o + it.get("kout_dt", 0):.3f});\n'
    S.add('\n'.join(html), js, cues)


def fmt_js(e):
    step, dec = e.get('step'), e.get('dec', 0)
    v = f'Math.round(n.v / {step}) * {step}' if step else 'n.v'
    s = f'({v}).toFixed({dec})' if dec else f'Math.round({v}).toString()'
    if e.get('comma', True) and not dec: s += '.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",")'
    return f'{J(e.get("prefix", ""))} + {s}'


def fmt_py(e, v):
    dec = e.get('dec', 0)
    if dec: return f'{e.get("prefix", "")}{v:.{dec}f}'
    return f'{e.get("prefix", "")}{int(round(v)):,}' if e.get('comma', True) else f'{e.get("prefix", "")}{int(round(v))}'


def el_counter(S, e, i):
    """big number that counts from→to on a word. show = when kicker + number appear (cut); grow = fade/scale in while counting"""
    q = f'{S.p}-n{i}'; top = e.get('top', 262); at = S.t(e['at'])
    if e.get('show') is None and not e.get('grow'): e = dict(e, show=round(at - 0.08, 3))   # hidden until its word
    unit = f'<span class="unit">{e["unit"]}</span>' if e.get('unit') else ''
    hide = e.get('show') is not None or e.get('grow')
    html = ''
    if e.get('kicker'):
        html += f'      <div id="{q}k" class="kicker" style="top:{e.get("ktop", top - 56)}px{"; opacity:0" if hide else ""}">{e["kicker"]}</div>\n'
    html += (f'      <div id="{q}w" class="big{(" " + e["c"]) if e.get("c") else ""}" style="top:{top}px; font-size:{e.get("size", 250)}px{"; opacity:0" if hide else ""}">'
             f'<span id="{q}">{fmt_py(e, e.get("from", 0))}</span>{unit}</div>')
    dur = e.get('dur', 0.7); ease = e.get('ease', 'power3.out')
    js = ''
    if e.get('show') is not None:
        js += f'      tl.set({J([f"#{q}w"] + ([f"#{q}k"] if e.get("kicker") else []))}, {{ opacity: 1 }}, {S.t(e["show"]):.3f});\n'
    js += (f'      {{ const n = {{ v: {e.get("from", 0)} }};\n'
           f'        tl.fromTo(n, {{ v: {e.get("from", 0)} }}, {{ v: {e["to"]}, duration: {dur}, ease: "{ease}", onUpdate: () => {{ document.getElementById("{q}").textContent = {fmt_js(e)}; }} }}, {at:.3f}); }}\n')
    if e.get('grow'):
        js += f'      tl.fromTo("#{q}w", {{ scale: 0.9, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: {dur}, ease: "{ease}" }}, {at:.3f});\n'
        if e.get('kicker'): js += f'      tl.fromTo("#{q}k", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.25 }}, {at:.3f});\n'
    if e.get('out') is not None:
        js += f'      tl.to({J([f"#{q}w"] + ([f"#{q}k"] if e.get("kicker") else []))}, {{ opacity: 0, y: -30, duration: 0.2, ease: "power3.in" }}, {S.t(e["out"]):.3f});\n'
    n = e.get('ticks', 8); gap = e.get('tick_gap', 0.05)
    cues = [(at + e.get('tick_dt', 0) + gap * k, 'tick', e.get('tick_gain', 0.5)) for k in range(n)]
    if e.get('end_sfx'): cues.append((at + e.get('end_dt', dur - 0.1), e['end_sfx'], 0.6))
    S.add(html, js, cues)


def el_ruler(S, e, i):
    """ruler 0..max with a coloured sliver (thickness / length at true scale)"""
    q = f'{S.p}-r{i}'; at = S.t(e['at'])
    grad = e.get('grad', 'linear-gradient(90deg,#9C4E22,#E89A5E,#B8622E)'); glow = e.get('glow', 'rgba(232,154,94,.6)')
    html = f"""      <div id="{q}" class="ruler" style="left:{e.get('x', 90)}px; width:{e.get('w', 900)}px; top:{e.get('top', 505)}px">
        <div class="ticks"></div>
        <div id="{q}s" class="sliver" style="width:{e.get('sw', 846)}px; background: {grad}; box-shadow: 0 0 30px {glow};"></div>
        <div class="rl rl0">{e.get('l0', '0')}</div><div class="rl rl1">{e.get('l1', '')}</div>
      </div>"""
    js = f'      tl.fromTo("#{q}", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }}, {at:.3f});\n'
    if e.get('fill_at') is not None:
        js += f'      tl.fromTo("#{q}s", {{ scaleX: {e.get("fill_from", 1)} }}, {{ scaleX: {e.get("fill", 1)}, duration: 0.7, ease: "power3.out" }}, {S.t(e["fill_at"]):.3f});\n'
    S.add(html, js)


def el_bars(S, e, i):
    """comparison bars GRAPHIC: rows [{label, value, show, c (css colour or gradient), at}] scaled to the largest value"""
    q = f'{S.p}-b{i}'; rows = e['rows']; mx = e.get('max', max(r['value'] for r in rows))
    html = [f'      <div id="{q}" class="bars" style="top:{e.get("top", 470)}px">']
    js, cues = '', []
    for j, r in enumerate(rows):
        f = max(0.02, r['value'] / mx); col = r.get('c', '#E08A4E')
        html.append(f'        <div id="{q}r{j}" class="brow"><div class="blab">{r["label"]}</div><div class="btrack"></div>'
                    f'<div id="{q}f{j}" class="bfill" style="top:46px; height:64px; width:{f * 100:.2f}%; background:{col}"></div>'
                    f'<div id="{q}v{j}" class="bval" style="left:{min(f, 0.72) * 100:.2f}%">{r.get("show", r["value"])}</div></div>')
        at = S.t(r['at'])
        js += (f'      tl.fromTo("#{q}r{j}", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }}, {at - 0.05:.3f});\n'
               f'      tl.fromTo("#{q}f{j}", {{ scaleX: 0 }}, {{ scaleX: 1, duration: {r.get("dur", 0.6)}, ease: "power3.out" }}, {at:.3f});\n'
               f'      tl.fromTo("#{q}v{j}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {at + 0.3:.3f});\n')
        cues.append((at, r.get('sfx', 'pop'), 0.5))
    html.append('      </div>')
    if e.get('label'):
        html.append(f'      <div id="{q}l" class="chip" style="left:{e.get("labelX", 60)}px; top:{e.get("labelY", 420)}px">{label_html(e["label"])}</div>')
        js += f'      tl.fromTo("#{q}l", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {S.t(rows[0]["at"]):.3f});\n'
    if e.get('out') is not None:
        js += f'      tl.to({J([f"#{q}"] + ([f"#{q}l"] if e.get("label") else []))}, {{ opacity: 0, duration: 0.2 }}, {S.t(e["out"]):.3f});\n'
    S.add('\n'.join(html), js, cues)


def el_timeline(S, e, i):
    """year (or any value) counter over a progress bar: steps [{to, fill, at, until|dur, ease}], tick labels [{t, ml}]"""
    q = f'{S.p}-y{i}'; top = e.get('top', 250)
    labs = ''.join(f'<span{f" style=\"margin-left:{lb[1]}px\"" if isinstance(lb, list) and len(lb) > 1 else ""}>{lb[0] if isinstance(lb, list) else lb}</span>' for lb in e.get('labels', []))
    c0, c1 = e.get('colors', ['#E08A4E', '#7FD3BF'])
    html = f"""      <div class="kicker" style="top:{e.get('ktop', top - 54)}px">{e.get('kicker', 'The year')}</div>
      <div id="{q}" class="big" style="top:{top}px; font-size:{e.get('size', 260)}px; color:{c0}">{e['from']}</div>
      <div class="bar" style="top:{e.get('barTop', 500)}px"><div id="{q}f" class="fill2" style="background: {e.get('grad', 'linear-gradient(90deg, #C9773F 0%, #A98A4C 50%, #5FB8A5 100%)')}"></div></div>
      <div class="ticklabels" style="top:{e.get('barTop', 500) + 30}px">{labs}</div>"""
    js = (f'      const y{i} = {{ v: {e["from"]} }};\n'
          f'      const upd{i} = () => {{ document.getElementById("{q}").textContent = Math.round(y{i}.v); }};\n')
    cues = []
    for j, st in enumerate(e['steps']):
        at = S.t(st['at'])
        dur = f'Math.max(0.6, {S.t(st["until"]) - at:.3f})' if st.get('until') is not None else st.get('dur', 0.6)
        ease = st.get('ease', 'power1.inOut' if j == 0 else 'power3.out')
        if j == 0:
            js += f'      tl.fromTo(y{i}, {{ v: {e["from"]} }}, {{ v: {st["to"]}, duration: {dur}, ease: "{ease}", onUpdate: upd{i} }}, {at:.3f});\n'
            js += f'      tl.fromTo("#{q}f", {{ scaleX: 0 }}, {{ scaleX: {st["fill"]}, duration: {dur}, ease: "{ease}" }}, {at:.3f});\n'
        else:
            js += f'      tl.to(y{i}, {{ v: {st["to"]}, duration: {dur}, ease: "{ease}", onUpdate: upd{i} }}, {at:.3f});\n'
            js += f'      tl.to("#{q}f", {{ scaleX: {st["fill"]}, duration: {dur}, ease: "{ease}" }}, {at:.3f});\n'
            cues += [(at + 0.15 * k, 'tick', 0.5) for k in range(3)]
    a0 = S.t(e['steps'][0]['at'])
    if e.get('color_until') is not None:
        js += f'      tl.fromTo("#{q}", {{ color: "{c0}" }}, {{ color: "{c1}", duration: {S.t(e["color_until"]) - a0:.3f}, ease: "power1.inOut" }}, {a0:.3f});\n'
    S.add(html, js, cues)


def el_chip(S, e, i):
    """label / tag chip: text or [text, KIND]; fx rise | slide | stamp | fade; "in": "card" puts it inside the media card"""
    q = e.get('id') and f'{S.p}-{e["id"]}' or f'{S.p}-c{i}'
    pos = f'right:{e["right"]}px' if 'right' in e else f'left:{e.get("x", 40)}px'
    vis = e.get('at') is None
    html = f'      <div id="{q}" class="chip{(" " + e["cls"]) if e.get("cls") else ""}" style="{pos}; top:{e.get("y", 700)}px{"" if vis else "; opacity:0"}">{label_html(e["text"])}</div>'
    js, cues = '', []
    if not vis:
        at = S.t(e['at']); fx = e.get('fx', 'rise')
        if fx == 'rise':
            js += f'      tl.fromTo("#{q}", {{ opacity: 0, y: 24, filter: "blur(6px)" }}, {{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.2, ease: "power3.out" }}, {at:.3f});\n'
        elif fx == 'slide':
            js += f'      tl.fromTo("#{q}", {{ opacity: 0, x: -30 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }}, {at:.3f});\n'
        elif fx == 'stamp':
            js += f'      tl.fromTo("#{q}", {{ opacity: 0, scale: 1.25 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, {at:.3f});\n'
        else:
            js += f'      tl.fromTo("#{q}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {at:.3f});\n'
        if e.get('sfx', 'pop'): cues.append((at + e.get('sfx_dt', 0.05), e.get('sfx', 'pop'), e.get('gain', 0.4)))
    if e.get('out') is not None:
        js += f'      tl.to("#{q}", {{ opacity: 0, duration: {e.get("out_dur", 0.15)} }}, {S.t(e["out"]):.3f});\n'
    if e.get('in') == 'card':
        S.card_els = getattr(S, 'card_els', []) + [html.replace('      <div', '        <div', 1)]; S.add('', js, cues)
    else:
        S.add(html, js, cues)


def el_stamp(S, e, i):
    q = f'{S.p}-st{i}'; at = S.t(e['at']); col = e.get('color', '#FF5A4E')
    html = (f'      <div id="{q}" class="stamp" style="left:{e.get("x", 150)}px; top:{e.get("y", 860)}px; font-size:{e.get("size", 150)}px; color:{col}; '
            f'transform: rotate({e.get("rot", -9)}deg)">{e["text"]}</div>')
    js = f'      tl.fromTo("#{q}", {{ opacity: 0, scale: 1.7 }}, {{ opacity: 1, scale: 1, duration: 0.22, ease: "power4.in" }}, {at:.3f});\n'
    S.add(html, js, [(at + 0.22, 'stamp', 1.0)])


def el_sub(S, e, i):
    q = f'{S.p}-sub{i}'
    vis = e.get('at') is None
    html = f'      <div id="{q}" class="sub" style="top:{e.get("top", 500)}px{"" if vis else "; opacity:0"}">{e["text"]}</div>'
    js = '' if vis else f'      tl.fromTo("#{q}", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3 }}, {S.t(e["at"]):.3f});\n'
    if e.get('out') is not None: js += f'      tl.to("#{q}", {{ opacity: 0, duration: 0.2 }}, {S.t(e["out"]):.3f});\n'
    S.add(html, js)


def el_glass(S, e, i):
    """verdict card: eyebrow (who says it), line (html, with an optional ✓ / ✗ check on check_at), quote"""
    q = f'{S.p}-g{i}'; at = S.t(e['at'])
    chk = ''
    if e.get('check_at') is not None:
        chk = f'<span id="{q}c" class="check{" no" if e.get("no") else ""}">{"&#10007;" if e.get("no") else "&#10003;"}</span> '
    quote = f'\n        <div class="quote">{e["quote"]}</div>' if e.get('quote') else ''
    html = f"""      <div id="{q}" class="glass" style="top:{e.get('top', 470)}px">
        <div class="eyebrow">{e['eyebrow']}</div>
        <div class="verdict">{chk}{e['line']}</div>{quote}
      </div>"""
    js = f'      tl.fromTo("#{q}", {{ opacity: 0, y: 60 }}, {{ opacity: 1, y: {-e.get("lift", 180)}, duration: 0.45, ease: "expo.out" }}, {at:.3f});\n'
    cues = [(at + 0.05, 'swish', 0.5)]
    if e.get('check_at') is not None:
        ca = S.t(e['check_at'])
        js += f'      tl.fromTo("#{q}c", {{ scale: 0, rotate: -40 }}, {{ scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" }}, {ca:.3f});\n'
        cues.append((ca + 0.05, 'wrong' if e.get('no') else 'ding', 0.8))
    if e.get('out') is not None: js += f'      tl.to("#{q}", {{ opacity: 0, duration: 0.2 }}, {S.t(e["out"]):.3f});\n'
    S.add(html, js, cues)


def el_stack(S, e, i):
    """labelled layers (cross-section, ranking): layers listed top→bottom [{text, cls l1|l2|l3 or bg/fg, at, fx slide|drop}]"""
    q = f'{S.p}-k{i}'
    html = [f'      <div class="stack" style="left:{e.get("x", 60)}px; width:{e.get("w", 780)}px; top:{e.get("top", 470)}px">']
    js, cues = '', []
    for j, L in enumerate(e['layers']):
        sty = f' style="background: {L["bg"]}; color: {L.get("fg", "#0A0E0D")}"' if L.get('bg') else ''
        html.append(f'        <div id="{q}l{j}" class="layer {L.get("cls", "")}"{sty}><span>{L["text"]}</span></div>')
    html.append('      </div>')
    for j, L in sorted(enumerate(e['layers']), key=lambda x: S.t(x[1]['at'])):
        at = S.t(L['at'])
        if L.get('fx', 'slide') == 'drop':
            js += f'      tl.fromTo("#{q}l{j}", {{ opacity: 0, y: -140, scale: 1.08 }}, {{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }}, {at:.3f});\n'
            cues.append((at + 0.05, 'land', 0.8))
        else:
            js += f'      tl.fromTo("#{q}l{j}", {{ opacity: 0, x: -60 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }}, {at:.3f});\n'
            cues.append((at + L.get('sfx_dt', 0), 'pop', 0.5))
    if e.get('label'):
        html.append(f'      <div class="chip" id="{q}g" style="left:40px; top:{e.get("labelY", 820)}px; opacity:0">{label_html(e["label"])}</div>')
        js += f'      tl.fromTo("#{q}g", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2 }}, {S.t(e["label_at"]):.3f});\n'
    S.add('\n'.join(html), js, cues)


def el_ab(S, e, i):
    """end card: kicker question + "A or B" title + two image tiles + the one comment ask. a/b: {src, label, sub, img {w,x,y}, pulse}"""
    q = f'{S.p}-ab'; at = S.t(e.get('at', 'cta-0.2'))
    def tile(side, t, cls):
        g = t.get('img', {'w': 1400, 'x': -470, 'y': -150})
        if t.get('src'):
            m = S.media(t['src'], '', f' style="width:{g["w"]}px; left:{g["x"]}px; top:{g["y"]}px"', None, f'{q}{side}m')
        else:                            # GRAPHIC tile: gradient + a big glyph (label the tile "graphic" in "sub")
            m = (f'<div style="position:absolute; inset:0; background:{t.get("bg", "linear-gradient(160deg,#1C2B33,#0A0E0D)")}"></div>'
                 f'<div style="position:absolute; left:0; right:0; top:200px; text-align:center; font-family:\'League Gothic\', sans-serif; '
                 f'font-size:{t.get("glyphSize", 260)}px; line-height:1; color:{t.get("glyphColor", "#F4EEE3")}">{t.get("glyph", "?")}</div>')
        sub = f'<div class="tsub">{t["sub"]}</div>' if t.get('sub') else ''
        return f'        <div id="{q}{side}" class="tile {cls}" style="top:{e.get("tileTop", 470)}px">{m}<div class="tl">{t["label"]}</div>{sub}</div>'
    html = f"""      <div id="{q}" class="stage" style="opacity:0; background: #0A0E0D">
        <div class="kicker" style="top:{e.get('ktop', 200)}px">{e['q']}</div>
        <div class="big" style="top:{e.get('top', 256)}px; font-size:{e.get('size', 190)}px">{e['title']}</div>
{tile('A', e['a'], 'tb')}
{tile('B', e['b'], 'tg')}
        <div id="{q}ask" class="ask" style="top:{e.get('askTop', 1060)}px">{e.get('ask', 'Comment your pick')}</div>
      </div>"""
    t0 = S.t(e.get('tiles_at', 'cta'))
    js = (f'      tl.to("#{q}", {{ opacity: 1, duration: 0.25, ease: "power2.out" }}, {at:.3f});\n'
          f'      tl.fromTo("#{q}A", {{ opacity: 0, x: -80, rotate: -4 }}, {{ opacity: 1, x: 0, rotate: 0, duration: 0.45, ease: "back.out(1.3)" }}, {t0 - 0.1:.3f});\n'
          f'      tl.fromTo("#{q}B", {{ opacity: 0, x: 80, rotate: 4 }}, {{ opacity: 1, x: 0, rotate: 0, duration: 0.45, ease: "back.out(1.3)" }}, {t0:.3f});\n')
    if e['a'].get('pulse') is not None and e['b'].get('pulse') is not None:
        pa, pb = S.t(e['a']['pulse']), S.t(e['b']['pulse'])
        js += (f'      tl.to("#{q}A", {{ scale: 1.05, duration: 0.25, ease: "power3.out" }}, {pa:.3f});\n'
               f'      tl.to("#{q}A", {{ scale: 1.0, duration: 0.25, ease: "power3.out" }}, {pb:.3f});\n'
               f'      tl.to("#{q}B", {{ scale: 1.05, duration: 0.25, ease: "power3.out" }}, {pb:.3f});\n')
    ask = S.t(e.get('ask_at', 'comment-0.1'))
    js += f'      tl.fromTo("#{q}ask", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }}, {ask:.3f});\n'
    S.add(html, js, [(t0 - 0.1, 'pop', 0.6), (t0, 'pop', 0.6), (ask + 0.1, 'click', 0.6)])


def el_loop(S, e, i):
    """the last frames cross-fade into frame 1 (opener look + first title) so the replay lands"""
    o = S.B.open_cfg(); q = f'{S.p}-loop'
    if o['tpl'] == 'split':
        g = o.get('img', {'w': 1700, 'x': -310, 'y': 0}); gA, gB = o.get('imgA', g), o.get('imgB', g)
        st = lambda g: f'position:absolute; width:{g["w"]}px; left:{g["x"]}px; top:{g["y"]}px'
        media = (f'        <img src="{S.src(o["a"])}" alt="" style="{st(gA)}" />\n'
                 f'        <img src="{S.src(o["b"])}" alt="" style="{st(gB)}; clip-path: inset(0 0 0 {540 - gB["x"]}px)" />')
    elif o.get('img'):
        g = o['img']
        media = f'        <img src="{S.B.first_frame(o["src"]) if S.is_video(o["src"]) else S.src(o["src"])}" alt="" style="position:absolute; width:{g["w"]}px; left:{g["x"]}px; top:{g["y"]}px" />'
    else:
        media = '        ' + S.media(o['src'], 'fill', f' style="object-position: {o.get("pos", "50% 50%")}"', None, f'{q}m') if not S.is_video(o['src']) else \
                f'        <img src="{S.B.first_frame(o["src"])}" alt="" class="fill" style="object-position: {o.get("pos", "50% 50%")}" />'
    t = next((x for x in o.get('els', []) if x['el'] == 'title'), None)
    tit = ''
    if t:
        it = (t.get('items') or [t])[0]; top = t.get('top', 262)
        if it.get('kicker'): tit += f'\n        <div class="kicker" style="top:{t.get("ktop", top - 56)}px">{it["kicker"]}</div>'
        tit += f'\n        <div class="big{(" " + it["c"]) if it.get("c") else ""}" style="top:{top}px; font-size:{it.get("size", t.get("size", 236))}px">{it["text"]}</div>'
    html = f"""      <div id="{q}" class="stage" style="opacity:0">
{media}
        <div class="scrim-top"></div>{tit}
      </div>"""
    js = f'      tl.to("#{q}", {{ opacity: 1, duration: 0.4, ease: "power1.inOut" }}, {S.t(e.get("at", "end-0.45")):.3f});\n'
    S.add(html, js)


ELEMENTS = dict(title=el_title, counter=el_counter, ruler=el_ruler, bars=el_bars, timeline=el_timeline, chip=el_chip, stamp=el_stamp,
                sub=el_sub, glass=el_glass, stack=el_stack, ab=el_ab, loop=el_loop)


def build_scene(B, k, cfg):
    """→ body, js, css, cues for one scene (same contract as the pilot's hand-written scene functions)"""
    S = Scene(B, k, cfg)
    S.tail = ''
    TEMPLATES[cfg['tpl']](S, cfg)
    head_body, head_js = list(S.body), list(S.js)
    S.body, S.js = [], []
    for i, e in enumerate(cfg.get('els', [])):
        ELEMENTS[e['el']](S, e, i)
    els_html = [b for b in S.body if b]
    if hasattr(S, 'card_open'):
        card = S.card_open + ''.join('\n' + c for c in getattr(S, 'card_els', [])) + '\n      </div>'
        els_html.append(card)
    body = '\n'.join(head_body + els_html + ([S.tail] if S.tail else []))
    js = f'\n      const D = {S.D:.3f};\n' + ''.join(head_js) + ''.join(S.js)
    css = KIT_CSS + ''.join(S.css)
    return '\n' + body, js, css, S.cues
