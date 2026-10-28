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
        js += f'      tl.to("#{S.p}-chip{lose}", {{ opacity: 0, duration: 0.2 }}, {at + wp.get("hide_dt", 0.1):.3f});\n'
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
    bx = f'left:{e["box_x"]}px; right:auto; width:{e.get("box_w", 500)}px; ' if 'box_x' in e else ''   # optional column (motion v2)
    if e.get('kicker'):
        html += f'      <div id="{q}k" class="kicker" style="{bx}top:{e.get("ktop", top - 56)}px{"; opacity:0" if hide else ""}">{e["kicker"]}</div>\n'
    html += (f'      <div id="{q}w" class="big{(" " + e["c"]) if e.get("c") else ""}" style="{bx}top:{top}px; font-size:{e.get("size", 250)}px{"; opacity:0" if hide else ""}">'
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
    def lab(lb):
        if isinstance(lb, list) and len(lb) > 1: return '<span style="margin-left:%spx">%s</span>' % (lb[1], lb[0])
        return '<span>%s</span>' % (lb[0] if isinstance(lb, list) else lb)
    labs = ''.join(lab(lb) for lb in e.get('labels', []))
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
    motion = getattr(B, 'motion', False)
    if motion and 'enter' not in cfg: cfg = dict(cfg, enter='none')     # v2: the seam does the entering
    S = Scene(B, k, cfg)
    S.tail = ''
    TEMPLATES[cfg['tpl']](S, cfg)
    head_body, head_js = list(S.body), list(S.js)
    S.body, S.js = [], []
    over = None                          # end card / loop must paint above the media card
    for i, e in enumerate(cfg.get('els', [])):
        if e['el'] in ('ab', 'loop') and over is None: over = len([b for b in S.body if b])
        ELEMENTS[e['el']](S, e, i)
    els_html = [b for b in S.body if b]
    if hasattr(S, 'card_open'):
        card = S.card_open + ''.join('\n' + c for c in getattr(S, 'card_els', [])) + '\n      </div>'
        els_html.insert(len(els_html) if over is None else over, card)
    body = '\n'.join(head_body + els_html + ([S.tail] if S.tail else []))
    js = f'\n      const D = {S.D:.3f};\n' + ''.join(head_js) + ''.join(S.js)
    css = KIT_CSS + ''.join(S.css)
    if motion:
        body, js, seam_cues = motion_wrap(S, body, js)
        S.cues += seam_cues; css += MOTION_CSS
    return '\n' + body, js, css, S.cues


# ====================================================================================================================
# MOTION v2 (#212+, owner: "Qualität drastisch verbessern, Motion-Video"): opt in with E['hf']['motion'] = True.
# Follows ~/.claude/skills motion-doctrine / cut-the-curve / seam-craft (vector law, mirrored power4 seams, no idle wobble):
#   seams     every scene enters through a velocity-matched seam set by scene["hf"]["seam"] (the previous scene exits on the
#             same vector, cut mid-motion, 0.3 s each side): left (default = the film's current), up (a reveal rises),
#             push (Z forward: deeper into the same thought), pull (inverse zoom: ARRIVAL / payoff, spend once), cut (dip cut)
#   camera    "cam": [{at, s, x, y, dur, ease}] keyframes = a camera with intent (establish → travel → arrive), never a creep
#   templates footage (REAL FOOTAGE clips with hard cuts on words; fit cover / band / card), parallax (2.5D depth split of a
#             photo: background + cut-out foreground at different depths), map (animated SVG map: camera, route draw-on,
#             travelling carrier dot, pins), flip (stop-motion of archival photos, one per word)
#   elements  globe (3D orthographic globe of a real NASA texture: camera keys, pins, expanding range rings, great-circle arcs),
#             kinetic (waterfall-entry typography, waterfall cut between lines), plus every older element
# ====================================================================================================================
MOTION_CSS = """
  .seam { position: absolute; inset: 0; will-change: transform, opacity; }
  .layer2 { position: absolute; inset: 0; overflow: hidden; }
  .vband { position: absolute; left: 0; overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,.6); }
  .vband video, .vband img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; }
  .vcard { border-radius: 26px; box-shadow: 0 30px 90px rgba(0,0,0,.65), 0 0 0 1.5px rgba(244,238,227,.18); }
  .backdrop { position: absolute; left: -8%; top: -8%; width: 116%; height: 116%; object-fit: cover; filter: blur(34px) brightness(.42) saturate(1.1); }
  .grain { position: absolute; inset: 0; pointer-events: none; opacity: .10; mix-blend-mode: overlay;
    background: repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,.5) 0 1px, transparent 1px 3px); }
  .kin { position: absolute; left: 40px; right: 40px; text-align: center; font-family: "League Gothic", sans-serif; text-transform: uppercase;
    line-height: .9; color: #F4EEE3; text-shadow: 0 10px 40px rgba(0,0,0,.55); }
  .kin .w { display: inline-block; opacity: 0; margin: 0 .09em; will-change: transform; }
  .mapwrap { position: absolute; left: 0; top: 0; transform-origin: 0 0; }
  .pinlab { font: 800 30px Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; }
  .flipcard { position: absolute; overflow: hidden; border-radius: 22px; box-shadow: 0 30px 90px rgba(0,0,0,.6), 0 0 0 1.5px rgba(244,238,227,.2); background: #111; }
  .flipcard img { position: absolute; left: 0; top: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
  .glcanvas { position: absolute; }
"""

SEAM_SFX = {'left': ['whoosh', 'swish'], 'up': ['swish', 'whoosh'], 'push': ['whoosh'], 'pull': ['whoosh'], 'cut': ['click']}


def _seam_exit(sel, kind, C):
    """outgoing side: accelerate out on the incoming seam's vector, gone exactly at the cut C (local seconds)"""
    if kind in ('left', 'up'):
        ax = 'x' if kind == 'left' else 'y'
        return (f'      tl.to("{sel}", {{ {ax}: -230, filter: "blur(8px)", duration: 0.3, ease: "power4.in" }}, {C - 0.3:.3f});\n'
                f'      tl.to("{sel}", {{ opacity: 0, duration: 0.2, ease: "none" }}, {C - 0.2:.3f});\n')
    if kind in ('push', 'pull'):
        s = 1.2 if kind == 'push' else 0.8
        return (f'      tl.to("{sel}", {{ scale: {s}, filter: "blur(18px)", duration: 0.22, ease: "power3.in" }}, {C - 0.22:.3f});\n'
                f'      tl.to("{sel}", {{ opacity: 0.15, duration: 0.2, ease: "none" }}, {C - 0.2:.3f});\n'
                f'      tl.set("{sel}", {{ opacity: 0 }}, {C:.3f});\n')
    if kind == 'cut':                      # dip cut: the frame darkens for 3 frames, then the hard cut
        return (f'      tl.to("{sel}", {{ filter: "brightness(0.55)", duration: 0.1, ease: "none" }}, {C - 0.1:.3f});\n'
                f'      tl.set("{sel}", {{ opacity: 0 }}, {C:.3f});\n')
    return ''


def _seam_entry(sel, kind):
    if kind in ('left', 'up'):
        ax = 'x' if kind == 'left' else 'y'
        return f'      tl.fromTo("{sel}", {{ {ax}: 230, opacity: 0.35, filter: "blur(8px)" }}, {{ {ax}: 0, opacity: 1, filter: "blur(0px)", duration: 0.34, ease: "power4.out" }}, 0);\n'
    if kind == 'push':
        return f'      tl.fromTo("{sel}", {{ scale: 0.9, opacity: 0.15, filter: "blur(18px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }}, 0);\n'
    if kind == 'pull':
        return f'      tl.fromTo("{sel}", {{ scale: 1.25, opacity: 0.15, filter: "blur(18px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }}, 0);\n'
    return ''


def motion_wrap(S, body, js):
    """wrap the whole scene in a seam layer: entry on its own seam, exit on the next scene's seam"""
    B, k = S.B, S.k
    sel = f'#{S.p}-seam'
    kin = S.cfg.get('seam', 'left') if k else 'none'
    js_s = _seam_entry(sel, kin)
    nxt = B.seam_next(k)
    cues = []
    if nxt:
        C = round(B.host_start(k + 1) - B.host_start(k), 3)
        js_s += _seam_exit(sel, nxt, C)
        pool = SEAM_SFX.get(nxt, ['whoosh'])
        cues.append((C - 0.1, pool[k % len(pool)], {'push': 0.75, 'pull': 0.8, 'cut': 0.5}.get(nxt, 0.55)))
        if nxt == 'pull': cues.append((C + 0.05, 'thump', 0.6))
    body = f'\n    <div id="{S.p}-seam" class="seam">{body}\n    </div>'
    return body, js + js_s, cues


def cam_js(S, sel, keys, depth=1.0):
    """camera keyframes on a wrapper: [{at, s, x, y, dur, ease}] — the first key is the opening framing (set at 0);
    depth scales the travel (parallax layers: background < 1 < foreground)"""
    if not keys: return ''
    def st(kf):
        d = {}
        if 's' in kf: d['scale'] = round(1 + (kf['s'] - 1) * depth, 4)
        if 'x' in kf: d['x'] = round(kf['x'] * depth, 1)
        if 'y' in kf: d['y'] = round(kf['y'] * depth, 1)
        if 'r' in kf: d['rotation'] = round(kf['r'] * depth, 2)
        return d
    js = f'      tl.set("{sel}", {J(dict(st(keys[0]), transformOrigin=keys[0].get("o", "50% 50%")))}, 0);\n'
    for kf in keys[1:]:
        at = S.t(kf['at']); dur = kf.get('dur', 0.9)
        if dur == 'end': dur = max(0.3, S.D - at)
        if isinstance(dur, str): dur = max(0.2, S.t(dur) - at)
        js += f'      tl.to("{sel}", {J(dict(st(kf), duration=round(dur, 3), ease=kf.get("ease", "power2.inOut")))}, {at:.3f});\n'
        if kf.get('sfx'): S.cues.append((at, kf['sfx'], kf.get('gain', 0.5)))
    return js


def vtag(S, sid, cls, style, start, dur, eid):
    ln = S.B.clip_len(sid)
    d = max(0.1, min(dur, ln - 0.05))
    return f'<video id="{eid}" class="clip {cls}" src="{S.src(sid)}" muted playsinline data-start="{start:.3f}" data-duration="{d:.2f}"{style}></video>'


def tpl_footage(S, c):
    """REAL FOOTAGE first: clips [{src, at (cut time, first = 0), fit cover|band|card, pos, ar (w/h, band/card), w, y (band centre),
    cam [...], label, flood}] — hard cuts on words between clips (B-roll cut on the sentence), each clip with its own camera"""
    clips = c['clips']; ats = [0.0] + [S.t(cl['at']) for cl in clips[1:]]
    html = [f'    <div id="{S.p}-stage" class="stage">']
    js = ''
    for i, cl in enumerate(clips):
        a0 = ats[i]; a1 = ats[i + 1] if i + 1 < len(ats) else S.D
        q = f'{S.p}-L{i}'; fit = cl.get('fit', 'cover'); sid = cl['src']; isv = S.is_video(sid)
        dur = a1 - a0 + 0.1
        def media(cls, style, eid):
            if isv: return vtag(S, sid, cls, style, a0, dur, eid)
            return f'<img id="{eid}" class="{cls}" src="{S.src(sid)}" alt=""{style} />'
        inner = ''
        pst = ' style="object-position: %s"' % cl.get('pos', '50% 50%')
        if fit == 'cover':
            inner = f'<div id="{q}c" class="stage">{media("fill", pst, q + "m")}</div>'
        else:
            w = cl.get('w', 1080 if fit == 'band' else 980); h = round(w / cl.get('ar', 16 / 9)); x = round((W_ - w) / 2); y = round(cl.get('y', 900) - h / 2)
            bg = (f'<div id="{q}bg" class="stage">{media("backdrop", "", q + "b")}</div>' if fit == 'band' and isv and cl.get('backdrop', True) else
                  f'<div class="stage" style="background: {cl.get("flood", "radial-gradient(120% 70% at 50% 45%, #1A1D1F 0%, #0B0C0D 60%, #060707 100%)")}"></div>')
            cls = 'vband' + (' vcard' if fit == 'card' else '')
            inner = (f'{bg}<div id="{q}c" class="{cls}" style="left:{x}px; top:{y}px; width:{w}px; height:{h}px">'
                     f'{media("", pst, q + "m")}'
                     f'{"<div class=grain></div>" if cl.get("grain") else ""}</div>')
        scrim = '' if cl.get('scrim') is False else '<div class="scrim-top"></div><div class="scrim-bot"></div>'
        lab = cl.get('label')
        labh = f'<div id="{q}lab" class="chip" style="left:{cl.get("labelX", 40)}px; top:{cl.get("labelY", 1030)}px">{label_html(lab)}</div>' if lab else ''
        hid = '' if i == 0 else ' style="opacity:0"'
        html.append(f'      <div id="{q}" class="layer2"{hid}>{inner}{scrim}{labh}</div>')
        if i:
            js += f'      tl.set("#{q}", {{ opacity: 1 }}, {a0:.3f});\n      tl.set("#{S.p}-L{i - 1}", {{ opacity: 0 }}, {a0 + 0.001:.3f});\n'
            if cl.get('sfx', 'thump'): S.cues.append((a0, cl.get('sfx', 'thump'), cl.get('gain', 0.35)))
        js += cam_js(S, f'#{q}c', cl.get('cam'))
    S.body.insert(0, '\n'.join(html))
    S.js.insert(0, js)
    S.label_id = f'{S.p}-L0lab'
    S.tail = '    </div>'


def tpl_parallax(S, c):
    """2.5D depth split of a REAL PHOTO: background = the photo, foreground = a cut-out of it (derive 'cutout', PNG) on the same
    geometry; the camera keys move the layers at different depths (bg 0.35, fg 1.0) — the photo opens up in depth"""
    g = c.get('img', {'w': 1080, 'x': 0, 'y': 0})
    st = f'position:absolute; width:{g["w"]}px; left:{g["x"]}px; top:{g["y"]}px'
    blur = c.get('bgblur', 1.5)
    S.body.insert(0, f"""    <div id="{S.p}-stage" class="stage">
      <div id="{S.p}-bg" class="stage"><img src="{S.src(c['src'])}" alt="" style="{st}; filter: blur({blur}px) brightness({c.get('bgdim', 0.85)})" /></div>
      <div id="{S.p}-fg" class="stage"><img src="{S.src(c['fg'])}" alt="" style="{st}; filter: drop-shadow(0 20px 40px rgba(0,0,0,.55))" /></div>
      <div class="scrim-top"></div><div class="scrim-bot"></div>
      {f'<div id="{S.p}-lab" class="chip" style="left:40px; top:{c.get("labelY", 1030)}px">{label_html(c["label"])}</div>' if c.get('label') else ''}""")
    S.label_id = f'{S.p}-lab'
    S.js.insert(0, cam_js(S, f'#{S.p}-bg', c.get('cam'), c.get('bgdepth', 0.35)) + cam_js(S, f'#{S.p}-fg', c.get('cam'), 1.0))
    S.tail = '    </div>'


def tpl_map(S, c):
    """animated SVG map GRAPHIC (geometry precomputed by scripts/hf_geo.py into c['geo'] = {w, h, d (land path), pts {name: [x, y]}}):
    cam [{at, c: [x, y] or point name, z, dur}], route [{to: name, at, dur}] drawn on with a travelling carrier dot, pins [{p, at, text, dx, dy, anchor}]"""
    G = c['geo']; th = c.get('style', {})
    land, sea, coast, route = th.get('land', '#3A3428'), th.get('sea', '#0E1417'), th.get('coast', '#C9B48A'), th.get('route', '#E0573F')
    P = G['pts']
    def pt(v): return P[v] if isinstance(v, str) else v
    svg = [f'<svg width="{G["w"]}" height="{G["h"]}" viewBox="0 0 {G["w"]} {G["h"]}" style="overflow:visible">',
           f'<path d="{G["d"]}" fill="{land}" stroke="{coast}" stroke-width="{th.get("coastw", 1.6)}" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>']
    for ex in G.get('extra', []):
        svg.append(f'<path d="{ex["d"]}" fill="none" stroke="{ex.get("c", coast)}" stroke-width="{ex.get("sw", 1)}" stroke-dasharray="{ex.get("dash", "none")}" vector-effect="non-scaling-stroke" opacity="{ex.get("op", 0.6)}"/>')
    js = ''
    rts = c.get('route', [])
    prev = pt(c.get('route_from')) if c.get('route_from') else None
    cue = []
    for j, r in enumerate(rts):
        a = prev; b = pt(r['to']); prev = b
        if a is None: continue
        mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
        bend = r.get('bend', 0.18); dx, dy = b[0] - a[0], b[1] - a[1]
        cx, cy = mx - dy * bend, my + dx * bend
        q = f'{S.p}-rt{j}'
        svg.append(f'<path id="{q}" d="M{a[0]:.1f},{a[1]:.1f} Q{cx:.1f},{cy:.1f} {b[0]:.1f},{b[1]:.1f}" fill="none" stroke="{route}" stroke-width="{th.get("routew", 7)}" '
                   f'stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110" vector-effect="non-scaling-stroke"/>')
        at = S.t(r['at']); dur = r.get('dur', 1.0)
        js += f'      tl.to("#{q}", {{ strokeDashoffset: 0, duration: {dur}, ease: "power2.inOut" }}, {at:.3f});\n'
        js += (f'      {{ const p = document.getElementById("{q}"), L = p.getTotalLength() || 1, o = {{ v: 0 }}, dot = document.getElementById("{S.p}-dot");\n'
               f'        tl.fromTo(o, {{ v: 0 }}, {{ v: 1, duration: {dur}, ease: "power2.inOut", onUpdate: () => {{ const q = p.getPointAtLength(o.v * L); dot.setAttribute("cx", q.x); dot.setAttribute("cy", q.y); }} }}, {at:.3f}); }}\n')
        if j == 0 or c.get('route_from') and j == 0:
            js += f'      tl.set("#{S.p}-dot", {{ opacity: 1 }}, {at:.3f});\n'
        cue.append((at, r.get('sfx', 'swish'), r.get('gain', 0.4)))
    for j, pn in enumerate(c.get('pins', [])):
        x, y = pt(pn['p']); q = f'{S.p}-pin{j}'; rr = pn.get('r', 9)
        anchor = pn.get('anchor', 'start')
        svg.append(f'<g id="{q}" style="opacity:0"><circle cx="{x:.1f}" cy="{y:.1f}" r="{rr * 2.4}" fill="{route}" opacity=".25"/><circle cx="{x:.1f}" cy="{y:.1f}" r="{rr}" fill="{th.get("pin", "#F4EEE3")}" stroke="{route}" stroke-width="3"/>'
                   f'<text x="{x + pn.get("dx", 18):.1f}" y="{y + pn.get("dy", 10):.1f}" text-anchor="{anchor}" font-family="Inter, sans-serif" font-weight="900" font-size="{pn.get("size", 26)}" '
                   f'letter-spacing="2" fill="{th.get("label", "#F4EEE3")}" style="text-transform:uppercase; paint-order: stroke" stroke="rgba(0,0,0,.65)" stroke-width="5">{pn.get("text", pn["p"])}</text></g>')
        if pn.get('at') is None:
            js += f'      tl.set("#{q}", {{ opacity: 1 }}, 0);\n'
        else:
            at = S.t(pn['at'])
            js += f'      tl.fromTo("#{q}", {{ opacity: 0, scale: 1.8, transformOrigin: "{x:.1f}px {y:.1f}px" }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, {at:.3f});\n'
            cue.append((at + 0.05, pn.get('sfx', 'pop'), pn.get('gain', 0.5)))
    svg.append(f'<circle id="{S.p}-dot" cx="0" cy="0" r="{th.get("dotr", 11)}" fill="{th.get("dot", "#FFF1D6")}" stroke="{route}" stroke-width="4" style="opacity:0"/>')
    svg.append('</svg>')
    vign = th.get('vignette', 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.65) 100%)')
    S.body.insert(0, f"""    <div id="{S.p}-flood" class="stage" style="background: {sea}"></div>
    <div id="{S.p}-stage" class="stage">
      <div id="{S.p}-map" class="mapwrap">{''.join(svg)}</div>
      <div class="stage" style="background: {vign}; pointer-events:none"></div>
      {f'<div id="{S.p}-lab" class="chip" style="left:40px; top:{c.get("labelY", 1030)}px">{label_html(c["label"])}</div>' if c.get('label') else ''}""")
    S.label_id = f'{S.p}-lab'
    # camera: map coords (x, y) at zoom z sit at the frame point (fx, fy)
    keys = []
    for kf in c['cam']:
        x, y = pt(kf['c']); z = kf.get('z', 1.0); fx, fy = kf.get('f', [540, 760])
        keys.append(dict(kf, s=z, x=round(fx - x * z, 1), y=round(fy - y * z, 1), o='0 0'))
    js0 = f'      tl.set("#{S.p}-map", {{ scale: {keys[0]["s"]}, x: {keys[0]["x"]}, y: {keys[0]["y"]}, transformOrigin: "0 0" }}, 0);\n'
    for kf in keys[1:]:
        at = S.t(kf['at']); dur = kf.get('dur', 1.0)
        js0 += f'      tl.to("#{S.p}-map", {{ scale: {kf["s"]}, x: {kf["x"]}, y: {kf["y"]}, duration: {dur}, ease: "{kf.get("ease", "power2.inOut")}" }}, {at:.3f});\n'
    S.js.insert(0, js0 + js)
    S.cues += cue
    S.tail = '    </div>'


def tpl_flip(S, c):
    """stop-motion of archival photos in a card (frames [{src, at}] hard-cut on words, a shutter click on each) over a ground"""
    g = c.get('box', {'x': 190, 'y': 300, 'w': 700, 'h': 1000})
    bg = c.get('flood', 'radial-gradient(120% 70% at 50% 45%, #2A251D 0%, #13110D 60%, #090807 100%)')
    imgs = ''.join(f'<img id="{S.p}-f{j}" src="{S.src(f["src"])}" alt="" style="object-position: {f.get("pos", "50% 50%")}{"; opacity:1" if j == 0 else ""}" />'
                   for j, f in enumerate(c['frames']))
    lab = c.get('label')
    S.body.insert(0, f"""    <div id="{S.p}-flood" class="stage" style="background: {bg}"></div>
    <div id="{S.p}-stage" class="stage">
      <div id="{S.p}-card" class="flipcard" style="left:{g['x']}px; top:{g['y']}px; width:{g['w']}px; height:{g['h']}px">{imgs}<div class="grain"></div></div>
      {f'<div id="{S.p}-lab" class="chip" style="left:{g["x"] + 22}px; top:{g["y"] + 22}px">{label_html(lab)}</div>' if lab else ''}""")
    S.label_id = f'{S.p}-lab'
    js = ''
    for j, f in enumerate(c['frames'][1:], 1):
        at = S.t(f['at'])
        js += f'      tl.set("#{S.p}-f{j}", {{ opacity: 1 }}, {at:.3f});\n      tl.set("#{S.p}-f{j - 1}", {{ opacity: 0 }}, {at + 0.001:.3f});\n'
        S.cues.append((at, f.get('sfx', 'click'), f.get('gain', 0.5)))
    js += cam_js(S, f'#{S.p}-card', c.get('cam'))
    S.js.insert(0, js)
    S.tail = '    </div>'


def el_kinetic(S, e, i):
    """kinetic typography: lines [{text ('|' = line break, *word* = accent), at, out, c, size, top, fx rise|cut|zoom}];
    rise = waterfall ENTRY from below (binary opacity, weight-scaled travel, accelerating gaps);
    a line whose 'out' meets the next line's 'at' leaves on a waterfall CUT (words ramp left, power4.in) and the next arrives mid-flight"""
    lines = e['lines']; html, js, cues = [], '', []
    for j, L in enumerate(lines):
        q = f'{S.p}-kn{i}_{j}'
        rows = L['text'].split('|'); words = []
        rh = []
        for r in rows:
            ws = []
            for w in r.split():
                acc = w.startswith('*') and w.endswith('*'); w = w.strip('*')
                ws.append(f'<span id="{q}w{len(words)}" class="w{(" " + L.get("ac", "cu")) if acc else ""}">{w}</span>')
                words.append(w)
            rh.append(''.join(ws))
        box = f'left:{L["x"]}px; right:auto; width:{L.get("w", 500)}px; text-align:{L.get("align", "left")}; ' if 'x' in L else ''
        html.append(f'      <div id="{q}" class="kin{(" " + L["c"]) if L.get("c") else ""}" style="{box}top:{L.get("top", e.get("top", 300))}px; font-size:{L.get("size", e.get("size", 190))}px">{"<br>".join(rh)}</div>')
        if L.get('at') is None:            # on screen from frame 0 (the thumbnail / hook line)
            fx = 'static'; at = 0.0; js += f'      tl.set({J([f"#{q}w{n}" for n in range(len(words))])}, {{ opacity: 1 }}, 0);\n'
        else:
            at = S.t(L['at']); fx = L.get('fx', 'cut' if j and lines[j - 1].get('out') is not None and abs(S.t(lines[j - 1]['out']) - at) < 0.25 else 'rise')
        t = at; gap = 0.07 if fx == 'rise' else 0.05
        for n, w in enumerate(words if fx != 'static' else []):
            wid = f'#{q}w{n}'
            heavy = len(w) >= 6; light = len(w) <= 2
            if fx == 'rise':
                off = 70 if heavy else 34 if light else 46; d = 0.19 if heavy else 0.11 if light else 0.15
                js += f'      tl.set("{wid}", {{ opacity: 1 }}, {t:.3f});\n      tl.fromTo("{wid}", {{ y: {off} }}, {{ y: 0, duration: {d}, ease: "power4.out" }}, {t:.3f});\n'
            elif fx == 'zoom':
                js += f'      tl.fromTo("{wid}", {{ opacity: 0.15, scale: 0.75, filter: "blur(10px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }}, {t:.3f});\n'
            else:
                js += f'      tl.fromTo("{wid}", {{ opacity: 0.35, x: 230 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "power4.out" }}, {t:.3f});\n'
            t += gap; gap *= 0.84
        if L.get('sfx', e.get('sfx')): cues.append((at, L.get('sfx', e.get('sfx')), L.get('gain', 0.35)))
        if L.get('stamp'):                 # the last word lands like a hit
            cues.append((t - gap / 0.84 + 0.12, 'thump', 0.6))
        if L.get('out') is not None:
            o = S.t(L['out'])
            for n in range(len(words)):
                ot = o - 0.3 + 0.022 * n
                js += (f'      tl.to("#{q}w{n}", {{ x: -230, duration: 0.34, ease: "power4.in" }}, {ot:.3f});\n'
                       f'      tl.to("#{q}w{n}", {{ opacity: 0, duration: 0.18, ease: "none" }}, {ot + 0.12:.3f});\n')
    S.add('\n'.join(html), js, cues)


GLOBE_JS = r"""
      { const cv = document.getElementById("%ID%"), ctx = cv.getContext("2d"), im = document.getElementById("%ID%t");
        const W = cv.width, H = cv.height, K = %KEYS%, PINS = %PINS%, RINGS = %RINGS%, ARCS = %ARCS%, OPT = %OPT%;
        let tex = null, TW = 0, TH = 0;
        const R = Math.PI / 180, ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        function load() { if (tex) return true; if (!im.complete || !im.naturalWidth) return false;
          const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext("2d");
          x.drawImage(im, 0, 0); tex = x.getImageData(0, 0, c.width, c.height).data; TW = c.width; TH = c.height; return true; }
        function cam(t) { let a = K[0];
          for (let i = 1; i < K.length; i++) { const b = K[i]; if (t <= b.at) break;
            const u = Math.min(1, (t - b.at) / b.dur), e = ease(u); let dl = b.lon - a.lon; if (dl > 180) dl -= 360; if (dl < -180) dl += 360;
            a = { lon: a.lon + dl * e, lat: a.lat + (b.lat - a.lat) * e, r: a.r + (b.r - a.r) * e, cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e }; }
          return a; }
        function proj(c, lon, lat) { const l0 = c.lon * R, p0 = c.lat * R, l = lon * R, p = lat * R;
          const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l - l0);
          return [c.cx + c.r * Math.cos(p) * Math.sin(l - l0), c.cy - c.r * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l - l0)), cosc]; }
        function dest(lon, lat, d, b) { const p1 = lat * R, l1 = lon * R;
          const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
          const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2)); return [l2 / R, p2 / R]; }
        function draw(t) {
          if (!load()) return; const c = cam(t);
          const img = ctx.createImageData(W, H), d = img.data;
          const l0 = c.lon * R, p0 = c.lat * R, sp = Math.sin(p0), cp = Math.cos(p0);
          const Lx = -0.45, Ly = 0.5, Lz = 0.74, night = OPT.night || 0;
          const x0 = Math.max(0, Math.floor(c.cx - c.r)), x1 = Math.min(W, Math.ceil(c.cx + c.r)), y0 = Math.max(0, Math.floor(c.cy - c.r)), y1 = Math.min(H, Math.ceil(c.cy + c.r));
          for (let py = y0; py < y1; py++) { const y = (c.cy - py) / c.r;
            for (let px = x0; px < x1; px++) { const x = (px - c.cx) / c.r, rr = x * x + y * y; if (rr >= 1) continue;
              const z = Math.sqrt(1 - rr), lat = Math.asin(y * cp + z * sp), lon = l0 + Math.atan2(x, z * cp - y * sp);
              let u = ((lon / R + 180) / 360) % 1; if (u < 0) u += 1; const v = (90 - lat / R) / 180;
              const ti = ((Math.min(TH - 1, Math.floor(v * TH)) * TW) + Math.floor(u * TW)) * 4;
              let sh = 0.42 + 0.68 * Math.max(0, x * Lx + y * Ly + z * Lz); if (night) sh *= 1 - night * Math.max(0, Math.min(1, (0.15 - (x * Lx + y * Ly + z * Lz)) * 3));
              const rim = Math.pow(1 - z, 3) * 0.9, o = (py * W + px) * 4;
              d[o] = Math.min(255, tex[ti] * sh + 90 * rim); d[o + 1] = Math.min(255, tex[ti + 1] * sh + 150 * rim); d[o + 2] = Math.min(255, tex[ti + 2] * sh + 255 * rim); d[o + 3] = 255; } }
          ctx.clearRect(0, 0, W, H);
          const g = ctx.createRadialGradient(c.cx, c.cy, c.r * 0.98, c.cx, c.cy, c.r * 1.12); g.addColorStop(0, "rgba(120,180,255,.45)"); g.addColorStop(1, "rgba(120,180,255,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.cx, c.cy, c.r * 1.12, 0, 7); ctx.fill();
          const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H; tmp.getContext("2d").putImageData(img, 0, 0); ctx.drawImage(tmp, 0, 0);
          for (const A of ARCS) { if (t < A.at) continue; const u = ease(Math.min(1, (t - A.at) / A.dur));
            const a1 = A.a, b1 = A.b, n = 64; ctx.strokeStyle = A.c || OPT.accent; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath(); let pen = false;
            const P1 = [Math.cos(a1[1] * R) * Math.cos(a1[0] * R), Math.cos(a1[1] * R) * Math.sin(a1[0] * R), Math.sin(a1[1] * R)], P2 = [Math.cos(b1[1] * R) * Math.cos(b1[0] * R), Math.cos(b1[1] * R) * Math.sin(b1[0] * R), Math.sin(b1[1] * R)];
            const om = Math.acos(Math.max(-1, Math.min(1, P1[0] * P2[0] + P1[1] * P2[1] + P1[2] * P2[2])));
            for (let k = 0; k <= n * u; k++) { const f = k / n, s1 = Math.sin((1 - f) * om) / Math.sin(om), s2 = Math.sin(f * om) / Math.sin(om);
              const X = s1 * P1[0] + s2 * P2[0], Y = s1 * P1[1] + s2 * P2[1], Z = s1 * P1[2] + s2 * P2[2];
              const q = proj(c, Math.atan2(Y, X) / R, Math.asin(Z) / R); if (q[2] < 0) { pen = false; continue; }
              if (pen) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); pen = true; } } ctx.stroke(); }
          for (const G of RINGS) { if (t < G.at) continue; const u = ease(Math.min(1, (t - G.at) / G.dur)), dd = (G.km / 6371) * u;
            ctx.beginPath(); let pen = false, first = null;
            for (let k = 0; k <= 180; k++) { const ll = dest(G.c[0], G.c[1], dd, k / 180 * 2 * Math.PI), q = proj(c, ll[0], ll[1]);
              if (q[2] < 0) { pen = false; continue; } if (pen) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); pen = true; } }
            ctx.fillStyle = G.fill || "rgba(255,200,90,.16)"; ctx.fill(); ctx.strokeStyle = G.c2 || OPT.accent; ctx.lineWidth = 5; ctx.stroke(); }
          ctx.font = "900 30px Inter, sans-serif"; ctx.textBaseline = "middle";
          for (const p of PINS) { if (t < p.at) continue; const q = proj(c, p.lon, p.lat); if (q[2] < 0.05) continue;
            const u = Math.min(1, (t - p.at) / 0.3), s = 1 + 0.8 * (1 - u) * (1 - u);
            ctx.fillStyle = OPT.accent; ctx.globalAlpha = 0.3 * u; ctx.beginPath(); ctx.arc(q[0], q[1], 22 * s, 0, 7); ctx.fill(); ctx.globalAlpha = u;
            ctx.fillStyle = "#FFF4DE"; ctx.beginPath(); ctx.arc(q[0], q[1], 10 * s, 0, 7); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = OPT.accent; ctx.stroke();
            if (p.text) { ctx.lineWidth = 8; ctx.strokeStyle = "rgba(0,0,0,.7)"; ctx.textAlign = p.align || "left"; const tx = q[0] + (p.dx || 24), ty = q[1] + (p.dy || 0);
              ctx.strokeText(p.text.toUpperCase(), tx, ty); ctx.fillStyle = "#F4EEE3"; ctx.fillText(p.text.toUpperCase(), tx, ty); }
            ctx.globalAlpha = 1; } }
        const st = { t: 0 };
        window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
        window.__hf.buildReady["%ID%"] = new Promise((res) => { if (im.complete && im.naturalWidth) res(); else { im.onload = () => res(); im.onerror = () => res(); } }).then(() => draw(st.t));
        tl.fromTo(st, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: () => draw(st.t) }, 0); }
"""


def el_globe(S, e, i):
    """3D globe (orthographic, per-pixel from a real NASA Blue Marble texture `tex`, lambert light + atmosphere rim):
    keys [{at, lon, lat, r (radius px), cx, cy, dur}], pins [{lon, lat, at, text}], rings [{c: [lon, lat], km, at, dur}], arcs [{a, b, at, dur}]"""
    q = f'{S.p}-gl{i}'; box = e.get('box', {'x': 0, 'y': 0, 'w': 1080, 'h': 1920})
    keys = []
    for j, kf in enumerate(e['keys']):
        keys.append(dict(at=0 if j == 0 else S.t(kf['at']), dur=kf.get('dur', 1.2), lon=kf['lon'], lat=kf['lat'], r=kf.get('r', 420),
                         cx=kf.get('cx', box['w'] / 2), cy=kf.get('cy', box['h'] / 2)))
    pins = [dict(p, at=S.t(p['at']) if p.get('at') is not None else 0) for p in e.get('pins', [])]
    rings = [dict(g, at=S.t(g['at'])) for g in e.get('rings', [])]
    arcs = [dict(a, at=S.t(a['at'])) for a in e.get('arcs', [])]
    opt = dict(accent=e.get('accent', '#F2B544'), night=e.get('night', 0))
    html = (f'      <img id="{q}t" src="{S.src(e["tex"])}" alt="" style="position:absolute; width:2px; height:1px; opacity:0" />\n'
            f'      <canvas id="{q}" class="glcanvas" width="{box["w"]}" height="{box["h"]}" style="left:{box["x"]}px; top:{box["y"]}px; width:{box["w"]}px; height:{box["h"]}px"></canvas>')
    if e.get('label'):
        html += f'\n      <div class="chip" style="left:40px; top:{e.get("labelY", 1030)}px">{label_html(e["label"])}</div>'
    js = (GLOBE_JS.replace('%ID%', q).replace('%KEYS%', J(keys)).replace('%PINS%', J(pins)).replace('%RINGS%', J(rings))
          .replace('%ARCS%', J(arcs)).replace('%OPT%', J(opt)))
    cues = [(p['at'] + 0.05, 'pop', 0.5) for p in pins if p['at'] > 0] + [(g['at'], g.get('sfx', 'sonar'), g.get('gain', 0.5)) for g in rings] \
        + [(a['at'], 'swish', 0.4) for a in arcs]
    S.add(html, js, cues)


def el_space(S, e, i):
    """star field ground for the globe (seeded, static — the globe does the moving)"""
    import random
    rnd = random.Random(e.get('seed', 7)); dots = ', '.join(
        f'radial-gradient({rnd.choice([1, 1, 1.5, 2])}px {rnd.choice([1, 1, 1.5, 2])}px at {rnd.uniform(0, 100):.1f}% {rnd.uniform(0, 100):.1f}%, rgba(255,255,255,{rnd.uniform(.3, .9):.2f}), transparent)'
        for _ in range(70))
    S.add(f'      <div class="stage" style="background: {dots}, {e.get("bg", "radial-gradient(120% 80% at 50% 40%, #0B1630 0%, #05080F 70%)")}"></div>')


TEMPLATES.update(footage=tpl_footage, parallax=tpl_parallax, map=tpl_map, flip=tpl_flip)
ELEMENTS.update(kinetic=el_kinetic, globe=el_globe, space=el_space)
