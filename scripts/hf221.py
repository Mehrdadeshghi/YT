"""#221 Attack chain: the whole film as ONE composition on one camera ("hf": {"style": "doku", "custom": "hf221"}, called by hf_build.py).
A vertical chain world (rail + six broken links, our own SVG icons) scrolls up past a descending camera; dim REAL PHOTO backdrops cut in the
same direction; doku captions, grain and end card stay. Numbers count with discrete tl.set steps, so every frame is a pure function of time.
Every fact on screen comes from Binance's preliminary report (see scripts/mk221.py); nothing imitates Binance's systems, no logos.
"""
import hf_doku as D
import hf_kinetic as K

A = '#E9A84A'
INK = '#F3ECE0'
FOCUS, HEAD = 240, 640            # screen y of a node's top while it is held / of the rail's amber head
GAP = 1400                        # world distance between nodes
Y0 = 1500                         # world y of node 1
RX = 120                          # rail x
N = 6
esc, norm, fit = K.esc, K.norm, K.fit

ICON = {
 'laptop': '<rect x="18" y="14" width="64" height="46" rx="4"/><path d="M6 72h88l-8-12H14z"/>',
 'box': '<path d="M50 8 88 28v44L50 92 12 72V28z"/><path d="M12 28l38 20 38-20M50 48v44"/>',
 'case': '<rect x="10" y="30" width="80" height="54" rx="6"/><path d="M36 30V18h28v12M10 54h80"/>',
 'chip': '<rect x="26" y="26" width="48" height="48" rx="4"/><path d="M38 26V10M62 26V10M38 90V74M62 90V74M26 38H10M26 62H10M90 38H74M90 62H74"/>',
 'wallet': '<rect x="10" y="24" width="80" height="60" rx="8"/><path d="M90 44H66a10 10 0 0 0 0 20h24M22 24l44-12 6 12"/>',
 'key': '<circle cx="30" cy="50" r="18"/><path d="M48 50h44M78 50v16M64 50v12"/>',
 'pen': '<path d="M14 86l6-22 48-48 16 16-48 48z"/><path d="M58 26l16 16M12 94h76"/>',
 'person': '<circle cx="50" cy="30" r="18"/><path d="M16 90c2-24 18-34 34-34s32 10 34 34"/>',
 'doc': '<path d="M24 8h36l18 18v66H24z"/><path d="M60 8v18h18M36 48h30M36 62h30"/>',
 'bug': '<ellipse cx="50" cy="56" rx="20" ry="28"/><path d="M38 30l-10-12M62 30l10-12M30 50H12M88 50H70M30 70l-14 10M70 70l14 10"/>',
 'target': '<circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="18"/><path d="M50 4v18M50 78v18M4 50h18M78 50h18"/>',
}
def icon(name, size, color=INK, sw=6, extra=''):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 100 100" fill="none" stroke="{color}" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round" {extra}>{ICON[name]}</svg>')

CSS = D.CSS.replace('%ACCENT%', A) + """
  #root { background: #0B0907; }
  .bgd { position: absolute; inset: 0; background: rgba(11,9,7,.5); }
  #pull { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; transform-origin: 0 0; }
  #world { position: absolute; left: 0; top: 0; width: 1080px; }
  .rail { position: absolute; left: 0; top: 0; }
  #fill { position: absolute; left: 118px; width: 4px; background: %A%; transform-origin: 50% 0; box-shadow: 0 0 18px %A%; }
  .node { position: absolute; left: 0; width: 1080px; }
  .lk { position: absolute; left: 30px; top: 0; width: 180px; height: 260px; overflow: visible; }
  .lk path { fill: none; stroke: rgba(243,236,224,.5); stroke-width: 16; stroke-linecap: round; }
  .ab { position: absolute; }
  .nd { left: 230px; top: 20px; font: 400 176px/.86 "League Gothic", sans-serif; color: %A%; white-space: nowrap; text-transform: uppercase; }
  .nl { left: 232px; top: 176px; width: 800px; font: 800 58px/1.05 Inter, sans-serif; color: #F3ECE0; text-transform: uppercase; letter-spacing: -.01em; }
  .hero { left: 830px; top: 6px; }
  .cp { font: 500 33px/1.2 "JetBrains Mono", monospace; letter-spacing: .05em; color: #F3ECE0; padding: 13px 20px 11px; background: rgba(10,8,6,.72);
    border: 2px solid rgba(243,236,224,.45); white-space: nowrap; text-transform: uppercase; }
  .cp.a { background: %A%; color: #0B0907; border-color: %A%; font-weight: 700; }
  .nrow { left: 230px; width: 800px; display: flex; align-items: center; gap: 24px; font: 800 48px/1.05 Inter, sans-serif; color: #F3ECE0; text-transform: uppercase; text-shadow: 0 2px 4px #000, 0 4px 18px rgba(0,0,0,.8); }
  .bdg { width: 110px; height: 110px; border-radius: 50%; border: 5px solid #F3ECE0; background: #0B0907; color: #F3ECE0;
    font: 400 84px/102px "League Gothic", sans-serif; text-align: center; }
  .bdg.on { border-color: %A%; color: #0B0907; background: %A%; }
  .nb { font-family: "League Gothic", sans-serif; line-height: .86; color: %A%; white-space: nowrap; }
  .nb em { font-style: normal; color: #F3ECE0; }
  .sw { width: 800px; height: 104px; background: rgba(10,8,6,.75); border: 2px solid rgba(243,236,224,.45); }
  .sw b { position: absolute; left: 24px; top: 30px; font: 800 44px/1 Inter, sans-serif; color: #F3ECE0; }
  .sw .tr { position: absolute; right: 24px; top: 22px; width: 150px; height: 60px; border-radius: 30px; background: #6E6A62; }
  .sw .kn { position: absolute; left: 96px; top: 6px; width: 48px; height: 48px; border-radius: 50%; background: #F3ECE0; }
  .sw .st { position: absolute; right: 196px; top: 30px; font: 500 40px/1 "JetBrains Mono", monospace; color: #F3ECE0; }
  .flow { fill: none; stroke: %A%; stroke-width: 9; stroke-dasharray: 26 18; stroke-linecap: round; }
  .wire { fill: none; stroke: %A%; stroke-width: 6; }
  .pl { left: 60px; font: 800 44px/1.1 Inter, sans-serif; color: #F3ECE0; text-transform: uppercase; width: 730px; text-shadow: 0 2px 4px #000; }
  .pbar { left: 60px; width: 730px; height: 34px; border: 2px solid rgba(243,236,224,.7); background: rgba(10,8,6,.6); }
  .pbar i { position: absolute; left: 0; top: 0; height: 100%; background: #A9D3E8; transform-origin: 0 50%; }
  .tico { position: absolute; left: 50%; top: 56px; margin-left: -80px; }
""".replace('%A%', A)


class F:
    def __init__(self, C):
        self.C, self.js, self.body, self.cues = C, [], [], []

    def t(self, k, key, nth=1):
        """absolute time of the nth caption word in scene k that starts with key"""
        n = 0
        for i, ws in enumerate(self.C.CAPS):
            if self.C.scene_of[i] != k: continue
            for w in ws:
                if norm(w['w']).startswith(norm(key)):
                    n += 1
                    if n == nth: return w['s']
        raise KeyError(f'{key} not in scene {k}')

    def show(self, sel, t, dy=36, dur=.32, final=1):
        self.js.append(f'      tl.fromTo("{sel}", {{ opacity: 0, y: {dy} }}, {{ opacity: {final}, y: 0, duration: {dur}, ease: "power4.out" }}, {t - .04:.3f});\n')

    def slam(self, sel, t, cue='thump', gain=.7):
        self.js.append(f'      tl.fromTo("{sel}", {{ opacity: 0, scale: 1.32, filter: "blur(10px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: .28, ease: "power4.out" }}, {t - .04:.3f});\n')
        if cue: self.cues.append((t - .04, cue, gain))

    def to(self, sel, t, dur=.25, ease='power2.out', **v):
        props = ', '.join(f'{k}: {v[k]!r}' if isinstance(v[k], str) else f'{k}: {v[k]}' for k in v)
        self.js.append(f'      tl.to("{sel}", {{ {props}, duration: {dur}, ease: "{ease}" }}, {t:.3f});\n')

    def steps(self, sel, t0, dur, fmt, v0, v1):
        """counter as discrete sets (15 per second, power3.out), so any seek lands on the right digits"""
        n = max(2, int(dur * 15))
        for i in range(n + 1):
            p = i / n; v = v0 + (v1 - v0) * (1 - (1 - p) ** 3)
            self.js.append(f'      tl.set("{sel}", {{ textContent: "{fmt(v)}" }}, {t0 + dur * p:.3f});\n')

    def add(self, s): self.body.append(s)


def rail(world_h):
    """chain rail: alternating ring / edge-on links, broken at every node (the node draws its own link)"""
    out = [f'<svg class="rail" width="240" height="{world_h}" viewBox="0 0 240 {world_h}" fill="none">']
    y, odd = 800, False
    tops = [Y0 + i * GAP for i in range(N)]
    while y < world_h - 200:
        odd = not odd
        if any(tp - 110 < y < tp + 240 for tp in tops):
            y += 90; continue
        if odd: out.append(f'<rect x="{RX - 32}" y="{y}" width="64" height="130" rx="32" stroke="rgba(243,236,224,.3)" stroke-width="11"/>')
        else: out.append(f'<rect x="{RX - 7}" y="{y + 4}" width="14" height="122" rx="7" fill="rgba(243,236,224,.3)"/>')
        y += 90
    return ''.join(out) + '</svg>'


def link_svg(i):
    return (f'<svg id="lk{i}" class="lk" viewBox="0 0 180 260"><g id="lk{i}a"><path id="lk{i}p" d="M60 118V70a30 30 0 0 1 60 0v48"/></g>'
            f'<g id="lk{i}b"><path id="lk{i}q" d="M60 142v48a30 30 0 0 0 60 0v-48"/></g></svg>')


def head(i, kicker, date, label, ico):
    return (f'{link_svg(i)}<div id="n{i}c" class="ncon">'
            f'<div id="n{i}d" class="ab nd" style="transform-origin:0 60%">{esc(date)}</div>'
            f'<div id="n{i}l" class="ab nl">{esc(label)}</div><div id="n{i}i" class="ab hero">{icon(ico, 180, A)}</div>')


def tag(pid, kind, place, top, real):
    return (f'<div id="{pid}" class="dtag{" real" if real else ""} sm" style="top:{top}px"><i></i><b>{esc(kind)}</b> · {esc(place)}</div>')


def build(C):
    f = F(C)
    S = [C.CAPS[C.segs.index(next(s for j, s in enumerate(C.segs) if C.scene_of[j] == k))][0]['s'] for k in range(C.NSC)]  # first spoken word per scene
    tops = [Y0 + i * GAP for i in range(N)]
    world_h = tops[-1] + GAP
    pay = S[N + 1]
    cta = next(C.CAPS[i][0]['s'] for i, s in enumerate(C.segs) if s.get('cta'))

    # ---- backdrops: dim real photos, cut up with the camera, one chip each
    shots = [(0, C.SCENES[0][1])] + [(k, C.SCENES[k][1]) for k in range(1, N + 1)]
    bg, chips = [], []
    for k, cfg in shots:
        q = f'b{k}'
        bg.append(f'<div id="{q}" class="dshot" style="opacity:{1 if k == 0 else 0}"><div id="{q}c" class="dcam"><img class="full" src="{C.asset(cfg["src"])}" alt="" '
                  f'style="object-position:{cfg.get("pos", "50% 50%")}"/></div></div>')
        place = cfg['label'][0]
        chips.append(tag(f'{q}t', 'Real photo', place, 206, True))
        t0 = 0 if k == 0 else S[k] - .1
        t1 = S[k + 1] - .1
        f.js.append(f'      tl.fromTo("#{q}c", {{ scale: 1.02 }}, {{ scale: 1.12, duration: {t1 - t0:.3f}, ease: "none" }}, {t0:.3f});\n')
        f.js.append(f'      tl.set("#{q}t", {{ opacity: 0 }}, 0);\n      tl.set("#{q}t", {{ opacity: 1 }}, {t0 + .1:.3f});\n      tl.set("#{q}t", {{ opacity: 0 }}, {t1:.3f});\n')
        if k:
            f.js.append(f'      tl.set("#{q}", {{ opacity: 1 }}, {t0:.3f});\n'
                        f'      tl.fromTo("#{q}", {{ y: 170, filter: "blur(9px)" }}, {{ y: 0, filter: "blur(0px)", duration: .34, ease: "power4.out", immediateRender: false }}, {t0:.3f});\n')
        f.js.append(f'      tl.to("#{q}", {{ y: -170, filter: "blur(9px)", duration: .3, ease: "power4.in" }}, {t1 - .3:.3f});\n      tl.set("#{q}", {{ opacity: 0 }}, {t1:.3f});\n')
        f.cues.append((t1 - .25, 'whoosh', .4))
    f.add('<div id="bg" style="position:absolute;inset:0">' + ''.join(bg) + '</div><div class="dgrade"></div><div class="dwarm"></div><div class="bgd"></div>')

    # ---- camera: slow drift in each hold, burst between nodes, always downward
    holds = [(0.0, S[1] - .6, 0, 60)] + [(S[k] - .02, S[k + 1] - .6, tops[k - 1] - FOCUS - 34, tops[k - 1] - FOCUS + 34) for k in range(1, N + 1)]
    fh = world_h - 800
    f.js.append(f'      tl.set("#world", {{ y: 0 }}, 0);\n      tl.set("#fill", {{ scaleY: 0 }}, 0);\n')
    prev = None
    def cam(t0, dur, y, ease):
        f.js.append(f'      tl.to("#world", {{ y: {-y}, duration: {dur:.3f}, ease: "{ease}" }}, {t0:.3f});\n')
        f.js.append(f'      tl.to("#fill", {{ scaleY: {max(0, y + HEAD - 800) / fh:.5f}, duration: {dur:.3f}, ease: "{ease}" }}, {t0:.3f});\n')
    for h in holds:
        if prev: cam(prev[1], h[0] - prev[1], h[2], 'power3.inOut')
        cam(h[0], h[1] - h[0], h[3], 'none')
        prev = h

    # ---- hook lives at the top of the world and scrolls away with the camera
    hook = C.E['hook']
    size = min(fit([hook[1]], 940, 330), 300)
    f.add('')
    world = [f'<div id="fill" style="top:800px;height:{fh}px"></div>', rail(world_h)]
    world.append(f'<div id="hk" class="dk ncon" style="top:300px"><div id="hkb" class="dbar"></div><div id="hk1" class="dl1" style="font-size:88px">{esc(hook[0])}</div>'
                 f'<div id="hk2" class="dbig" style="font-size:{size}px;margin-top:14px">{esc(hook[1])}</div></div>')
    world.append(f'<div id="hc1" class="ab nb ncon" style="left:230px;top:900px;font-size:150px;opacity:0">THE ATTACK CHAIN</div>'
                 f'<div id="hc2" class="ab cp ncon" style="left:232px;top:1050px;opacity:0">According to Binance</div>')
    t_6 = C.CAPS[0][[j for j, w in enumerate(C.CAPS[0]) if '6.3' in w['w']][0]]['s']
    f.js.append(f'      tl.fromTo("#hkb", {{ scaleX: .35 }}, {{ scaleX: 1, duration: .5, ease: "power4.out" }}, 0);\n      tl.fromTo("#hk1", {{ x: 40 }}, {{ x: 0, duration: .5, ease: "power4.out" }}, 0);\n')
    f.js.append(f'      tl.fromTo("#hk2", {{ scale: 1.3, filter: "blur(10px)", opacity: .4 }}, {{ scale: 1, filter: "blur(0px)", opacity: 1, duration: .3, ease: "power4.out", immediateRender: false }}, {t_6 - .04:.3f});\n')
    f.cues.append((t_6 - .04, 'thump', .75))
    t_a = next(w['s'] for w in C.CAPS[1] if norm(w['w']).startswith('attack'))
    f.show('#hc1', t_a); f.show('#hc2', next(w['s'] for w in C.CAPS[1] if norm(w['w']).startswith('according')))

    # ---- common node entry: link breaks open on the date, date + label land
    def enter(i, k, key='', nth=1):
        t = S[k]
        f.js.append(f'      tl.fromTo("#n{i}d", {{ opacity: 0, scale: 1.2, filter: "blur(8px)" }}, {{ opacity: 1, scale: 1, filter: "blur(0px)", duration: .26, ease: "power4.out" }}, {t - .32:.3f});\n')
        f.show(f'#n{i}l', t - .22, 24); f.show(f'#n{i}i', t - .14, 24)
        f.js.append(f'      tl.to("#lk{i}a", {{ y: -18, rotation: -16, transformOrigin: "60px 118px", duration: .3, ease: "power4.out" }}, {t - .04:.3f});\n'
                    f'      tl.to("#lk{i}b", {{ y: 18, rotation: 14, transformOrigin: "120px 142px", duration: .3, ease: "power4.out" }}, {t - .04:.3f});\n'
                    f'      tl.to(["#lk{i}p", "#lk{i}q"], {{ stroke: "{A}", duration: .2, ease: "power2.out" }}, {t - .04:.3f});\n')
        f.cues.append((t - .04, 'crack', .55))
        return t

    nodes = []
    # 1 June: fake installer
    n = head(1, 'LINK 1 / 6', 'June', 'Fake installer', 'laptop')
    n += (f'<div id="l1lap" class="ab" style="left:230px;top:300px">{icon("laptop", 300)}</div><div id="l1a" class="ab bdg" style="left:430px;top:290px">A</div>'
          f'<div id="l1box" class="ab" style="left:720px;top:300px">{icon("box", 200, A)}</div><div id="l1bt" class="ab cp" style="left:610px;top:520px">Tampered Homebrew</div>'
          f'<div id="l1c" class="ab cp a" style="left:230px;top:618px">Caught: device replaced</div>'
          f'<div id="l1x" class="ab cp" style="left:230px;top:710px">But exposed: the wallet team</div>'
          f'<div id="l1p" class="ab" style="left:230px;top:790px;display:flex;gap:6px">' + ''.join(icon('person', 88, A, 7, f'id="l1p{j}"') for j in range(5)) + '</div></div>')
    nodes.append(n)
    t = enter(1, 1)
    f.show('#l1lap', t + .1); f.show('#l1a', f.t(1, 'engineer'), 24)
    tb = f.t(1, 'tampered')
    f.show('#l1box', tb - .2, -60); f.show('#l1bt', tb)
    tc = f.t(1, 'caught')
    f.to('#l1box', tc - .55, .42, 'power3.in', x=-300, y=40, scale=.5, opacity=.2)
    f.slam('#l1c', tc, 'hit', .5)
    tk = f.t(1, 'hackers')
    f.show('#l1x', tk)
    for j in range(5): f.show(f'#l1p{j}', tk + .35 + .08 * j, 20)

    # 2 September: fake job
    n = head(2, 'LINK 2 / 6', 'September', 'Fake job', 'case')
    rows = [('bdg', 'B', 'A real job site'), ('person', '', '2 interviews, a fake “CEO”'), ('doc', '', 'An “assignment”'), ('bug', '', 'Malware. On his work computer')]
    for j, (ic, tx, lab) in enumerate(rows):
        ico = f'<div class="bdg" style="flex:none">{tx}</div>' if ic == 'bdg' else f'<div style="flex:none;width:110px;text-align:center">{icon(ic, 96, A if ic == "bug" else INK)}</div>'
        n += f'<div id="l2r{j}" class="ab nrow" style="top:{300 + j * 132}px">{ico}<span>{esc(lab)}</span></div>'
    n += '<div id="l2u" class="ab cp a" style="left:364px;top:834px">0-day: not detected</div></div>'
    nodes.append(n)
    enter(2, 2)
    f.show('#l2r0', f.t(2, 'job')); f.show('#l2r1', f.t(2, 'interviews')); f.show('#l2r2', f.t(2, 'assignment')); f.show('#l2r3', f.t(2, 'undetected') - .05)
    f.slam('#l2u', f.t(2, 'malware'), 'hit', .5)

    # 3 Oct 20: internal AI tool
    n = head(3, 'LINK 3 / 6', '20 Oct', 'Internal AI tool', 'chip')
    n += ('<svg class="ab" style="left:230px;top:300px" width="800" height="380" viewBox="0 0 800 380" fill="none">'
          '<path id="l3w0" class="wire" pathLength="1" stroke-dasharray="1" d="M120 190H300"/><path id="l3w1" class="wire" pathLength="1" stroke-dasharray="1" d="M490 170L650 70"/>'
          '<path id="l3w2" class="wire" pathLength="1" stroke-dasharray="1" d="M490 210L650 310"/></svg>'
          '<div id="l3b" class="ab bdg on" style="left:280px;top:435px">B</div>'
          f'<div id="l3c" class="ab" style="left:530px;top:400px">{icon("chip", 180, A)}</div>'
          '<div id="l3a0" class="ab bdg" style="left:880px;top:315px">A</div><div id="l3a1" data-layout-allow-overlap class="ab bdg on" style="left:880px;top:315px">A</div>'
          '<div id="l3k0" class="ab bdg" style="left:880px;top:555px">C</div><div id="l3k1" data-layout-allow-overlap class="ab bdg on" style="left:880px;top:555px">C</div>'
          '<div id="l3s" class="ab cp" style="left:232px;top:700px">Taken over: A and C</div>'
          f'<div id="l3t" class="ab cp a" style="left:232px;top:800px">A holds: container token</div></div>')
    nodes.append(n)
    enter(3, 3)
    tt = f.t(3, 'internal')
    f.show('#l3b', tt - .2, 20); f.show('#l3c', tt, 20)
    f.js.append(f'      tl.fromTo("#l3w0", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: .4, ease: "power2.out" }}, {tt:.3f});\n')
    f.show('#l3a0', tt - .2, 20); f.show('#l3k0', tt - .2, 20)
    to = f.t(3, 'take')
    f.js.append(f'      tl.fromTo("#l3w1", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: .4, ease: "power2.out" }}, {to:.3f});\n'
                f'      tl.fromTo("#l3w2", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: .4, ease: "power2.out" }}, {to + .1:.3f});\n')
    f.slam('#l3a1', to + .35, 'pop', .4); f.slam('#l3k1', to + .45, None); f.show('#l3s', to + .4, 20)
    f.slam('#l3t', f.t(3, 'token'), 'hit', .5)

    # 4 Oct 29: the container
    n = head(4, 'LINK 4 / 6', '29 Oct', 'The container', 'box')
    n += (f'<div id="l4ca" class="ab nrow" style="top:290px"><div style="flex:none;width:100px">{icon("key", 96, A)}</div><span>A’s stolen credentials</span></div>'
          f'<svg class="ab" style="left:270px;top:390px" width="60" height="500" viewBox="0 0 60 500" fill="none"><path id="l4w" class="wire" pathLength="1" stroke-dasharray="1" d="M30 0V470"/></svg>'
          f'<div id="l4bx" class="ab nrow" style="top:470px"><div style="flex:none;width:100px">{icon("box", 96, A)}</div><span>Container + malicious script</span></div>'
          f'<div id="l4t" class="ab cp" style="left:400px;top:618px">17:15–19:56</div>'
          f'<div id="l4sg" class="ab nrow" style="top:730px;color:{A}"><div style="flex:none;width:100px">{icon("pen", 96, A)}</div><span>Wallet signing service</span></div></div>')
    nodes.append(n)
    enter(4, 4)
    tw_ = f.t(4, 'stolen')
    f.show('#l4ca', tw_ - .1)
    td = f.t(4, 'deploy')
    f.js.append(f'      tl.fromTo("#l4w", {{ strokeDashoffset: 1 }}, {{ strokeDashoffset: 0, duration: 1.6, ease: "none" }}, {td - .1:.3f});\n')
    f.show('#l4bx', td); f.show('#l4t', td + .25, 20)
    f.slam('#l4sg', f.t(4, 'signing') - .1, 'hit', .55)

    # 5 the drain
    n = head(5, 'LINK 5 / 6', '20:05 UTC', 'The drain', 'wallet')
    n += ('<svg id="l5fs" class="ab" style="left:230px;top:290px" width="800" height="120" viewBox="0 0 800 120" fill="none"><path id="l5f" class="flow" d="M10 60H790"/></svg>'
          f'<div id="l5v" class="ab nb" style="left:230px;top:400px;font-size:204px">0M XRP</div>'
          f'<div id="l5w" class="ab cp" style="left:232px;top:610px">5 hot wallets, 4 minutes</div>')
    for j, (a, b) in enumerate([('~970,500', 'SOL'), ('44.2M', 'OP'), ('18,270', 'BTC')]):
        n += f'<div id="l5r{j}" class="ab nb" style="left:232px;top:{700 + j * 72}px;font-size:80px">{a} <em>{b}</em></div>'
    n += '</div>'
    nodes.append(n)
    enter(5, 5)
    tn = f.t(5, '233')
    f.show('#l5fs', tn - .1, 0, .2); f.slam('#l5v', tn, 'thump', .75)
    tm = f.t(5, 'minutes')
    f.steps('#l5v', tn, max(.5, tm - tn), lambda v: f'{v:.2f}M XRP', 0, 233.46)
    f.steps('#n5d', tn, max(.5, tm - tn), lambda v: f'20:{int(5 + v):02d} UTC', 0, 4)
    f.show('#l5w', tm - .1, 20)
    f.js.append(f'      tl.fromTo("#l5f", {{ strokeDashoffset: 0 }}, {{ strokeDashoffset: {-60 * (S[6] - tn):.0f}, duration: {S[6] - tn:.3f}, ease: "none" }}, {tn:.3f});\n')
    f.cues += [(tn + .08 * j, 'tick', .3) for j in range(10)]
    f.show('#l5r0', f.t(5, 'solana')); f.show('#l5r1', f.t(5, 'optimism')); f.show('#l5r2', f.t(5, '18270'))

    # 6 the twist
    n = head(6, 'LINK 6 / 6', 'The twist', 'It doesn’t stop', 'key')
    n += ('<div id="l6s" class="ab sw" style="left:230px;top:290px"><b>WITHDRAWALS</b><span id="l6st" class="st">ON</span><div id="l6tr" class="tr"><div id="l6kn" class="kn"></div></div></div>'
          '<svg id="l6fs" class="ab" style="left:230px;top:398px" width="800" height="70" viewBox="0 0 800 70" fill="none"><path id="l6f" class="flow" d="M10 35H790"/></svg>'
          '<div id="l6o" class="ab cp a" style="left:232px;top:466px">Outflow still running</div>'
          f'<div id="l6e" class="ab nb" style="left:232px;top:550px;font-size:120px">EIP-7702</div>'
          f'<div id="l6e2" class="ab cp" style="left:600px;top:566px;font-size:27px;line-height:1.28">Partial rights,<br>on-chain</div>'
          f'<div id="l6m" class="ab nrow" style="top:668px"><div style="display:flex;flex:none">{icon("key", 72, A)}{icon("key", 72, INK)}{icon("key", 72, INK)}</div><span style="font-size:38px">MPC: no single key</span></div>'
          f'<div id="l6z" class="ab cp" style="left:232px;top:758px;font-size:28px;line-height:1.35">Last transfer 23:56 UTC<br>Delegation cleared 00:10 UTC</div></div>')
    nodes.append(n)
    enter(6, 6)
    ts = f.t(6, 'stops')
    f.show('#l6s', S[6] - .25, 20); f.show('#l6fs', S[6] - .2, 0, .2)
    f.js.append(f'      tl.to("#l6kn", {{ x: -86, duration: .2, ease: "power4.out" }}, {ts:.3f});\n      tl.set("#l6st", {{ textContent: "OFF" }}, {ts + .05:.3f});\n'
                f'      tl.to("#l6st", {{ color: "{A}", duration: .1 }}, {ts + .05:.3f});\n')
    f.cues.append((ts, 'click', .8))
    f.js.append(f'      tl.fromTo("#l6f", {{ strokeDashoffset: 0 }}, {{ strokeDashoffset: {-60 * (pay - S[6]):.0f}, duration: {pay - S[6]:.3f}, ease: "none" }}, {S[6]:.3f});\n')
    f.slam('#l6o', f.t(6, 'outflow'), 'hit', .5)
    te = f.t(6, 'eip')
    f.slam('#l6e', te - .05, 'thump', .6); f.show('#l6e2', f.t(6, 'rights') - .1, 20)
    tk = f.t(6, 'mpc')
    f.show('#l6m', tk - .05); f.show('#l6z', f.t(6, 'revoke'), 20)

    for i, nh in enumerate(nodes, 1):
        world.append(f'<div class="node" style="top:{tops[i - 1]}px">{nh}</div>')
    # ---- payoff: the camera pulls back to the whole chain beside the verdict (an arrival; the only pull in the film)
    H_W = world_h
    sc = round(1120 / (H_W - 800), 4)
    f.js.append(f'      tl.to(".ncon", {{ opacity: 0, duration: .25, ease: "power2.in" }}, {pay - .5:.3f});\n')
    f.js.append(f'      tl.to("#pull", {{ scale: {sc}, x: 840, y: {260 - 800 * sc:.0f}, duration: 1.0, ease: "power3.inOut" }}, {pay - .55:.3f});\n')
    f.js.append(f'      tl.to("#world", {{ y: 0, duration: 1.0, ease: "power3.inOut" }}, {pay - .55:.3f});\n'
                f'      tl.to("#fill", {{ scaleY: 1, duration: 1.0, ease: "power3.inOut" }}, {pay - .55:.3f});\n')
    f.cues.append((pay - .5, 'whoosh', .5))
    f.add(f'<div id="pull"><div id="world" style="height:{H_W}px">' + ''.join(world) + '</div></div>')

    # ---- verdict overlay (screen space)
    f.add('<div id="p1k" class="ab dkick" style="left:60px;top:300px;margin:0">Hit, says Binance</div>'
          '<div id="p1" class="ab nb" style="left:60px;top:346px;font-size:240px">$6.34B</div>'
          '<div id="p2bar" class="ab pbar" style="top:570px"><i id="p2f" style="width:45%"></i></div>'
          '<div id="p2" class="ab pl" style="top:622px;color:#A9D3E8;font:400 104px/.9 \'League Gothic\',sans-serif">$2.85B FROZEN</div>'
          '<div id="p3" class="ab pl" style="top:740px">Binance says it absorbs the loss</div>'
          f'<div id="p4" class="ab nb" style="left:60px;top:870px;font-size:96px"><em>FBI:</em> NORTH KOREA</div>'
          f'<div id="p5" class="ab nb" style="left:60px;top:962px;font-size:96px"><em>NORTH KOREA:</em> DENIES IT</div>')
    tp = f.t(7, '634')
    f.slam('#p1', tp, 'thump', .8); f.show('#p1k', tp, 20)
    f.steps('#p1', tp, .8, lambda v: f'${v:.2f}B', 0, 6.34)
    tf = f.t(7, '285')
    f.show('#p2bar', tf - .1, 20)
    f.js.append(f'      tl.fromTo("#p2f", {{ scaleX: 0 }}, {{ scaleX: 1, duration: .7, ease: "power3.out" }}, {tf:.3f});\n')
    f.show('#p2', tf)
    f.show('#p3', f.t(7, 'binance') - .05); f.show('#p4', f.t(7, 'fbi') - .05); f.show('#p5', f.t(7, 'north', 2) - .05)
    f.cues += [(f.t(7, 'fbi') - .05, 'tick', .5), (f.t(7, 'north', 2) - .05, 'tick', .5)]
    for s in ('#p1', '#p1k', '#p2bar', '#p2', '#p3', '#p4', '#p5'):
        f.to(s, cta - .2, .2, 'power2.in', opacity=0)

    # ---- HUD + chips (screen space)
    for i in range(N):
        tks = ''.join(f'<i class="{"on" if j == i else ""}" style="left:{190 * j / (N - 1):.0f}px"></i>' for j in range(N))
        f.add(f'<div id="h{i}" class="dhud" style="opacity:0">{i + 1:02d} / {N:02d}<div class="rule">{tks}</div></div>')
        f.js.append(f'      tl.set("#h{i}", {{ opacity: 1 }}, {S[i + 1]:.3f});\n      tl.set("#h{i}", {{ opacity: 0 }}, {S[i + 2]:.3f});\n')
    f.add(tag('tg', 'Graphic', 'per Binance’s report', 150, False) + ''.join(chips))
    f.js.append('      tl.set("#tg", { opacity: 1 }, 0);\n')

    # ---- end card (doku): two drawn tiles
    q = 'ec'
    cf = C.E['cta']
    f.add(f'<div id="{q}d" class="dacc"></div><div id="{q}" class="dq" style="opacity:0"><div id="{q}k" class="dkick">Your turn</div><div id="{q}q" class="dl1">{esc(cf["q"].upper())}</div></div>')
    f.to(f'#{q}d', cta - .2, .25, 'power2.out', opacity=.72)
    f.js.append(f'      tl.set("#{q}", {{ opacity: 1 }}, {cta - .05:.3f});\n')
    f.show(f'#{q}k', cta - .05, 40, .16); f.show(f'#{q}q', cta + .03, 70, .2)
    cw = [w for i, s in enumerate(C.segs) if s.get('cta') for w in C.CAPS[i]]
    for side, (nm, ic) in enumerate(((cf['a'], 'box'), (cf['b'], 'case'))):
        x = 50 if side == 0 else 490
        sz = min(fit([nm], 380, 150), 150)
        ts_ = [w['s'] for w in cw if norm(w['w']).startswith(norm(nm))]
        f.add(f'<div id="{q}p{side}" class="dtile" style="left:{x}px;background:#15110D"><div class="tico">{icon(ic, 160, A)}</div><div class="src">Graphic</div>'
              f'<div class="nm" style="font-size:{sz}px">{esc(nm)}</div></div>')
        pre = cta + .25 + .06 * side
        f.js.append(f'      tl.fromTo("#{q}p{side}", {{ opacity: 0, y: 60 }}, {{ opacity: .45, y: 0, duration: .2, ease: "power4.out" }}, {pre:.3f});\n')
        at = max(pre + .25, ts_[0] - .04)
        f.to(f'#{q}p{side}', at, .18, opacity=1, borderColor=A)
        f.cues.append((at, 'pop', .5))
    tb_ = [w['s'] for w in cw if norm(w['w']).startswith(norm(cf['b']))][0]
    f.add(f'<div id="{q}or" class="dor">OR</div><div id="{q}ask" class="dask" style="font-size:34px">Comment {esc(cf["a"])} or {esc(cf["b"])}</div>')
    f.show(f'#{q}or', cta + .35, 0, .22); f.show(f'#{q}ask', min(tb_ + .45, C.DUR - .8), 40, .25)
    return '\n'.join(f.body), ''.join(f.js), CSS, f.cues
