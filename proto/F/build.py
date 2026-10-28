#!/usr/bin/env python3
"""Prototype F — RANKING COUNTDOWN 5 → 1 (silent, 9:16): the 5 tallest buildings on Earth.

Facts (English Wikipedia "List of tallest buildings", table "Tallest buildings in the world", checked 28 Oct 2026; height to architectural top):
  1 Burj Khalifa, Dubai, 828 m (2,717 ft), 2010 · 2 Merdeka 118 (Merdeka Maybank Tower), Kuala Lumpur, 678.9 m (2,227 ft), 2024 ·
  3 Shanghai Tower, 632 m (2,073 ft), 2015 · 4 Makkah Royal Clock Tower, Mecca, 601 m (1,972 ft), 2012 · 5 Ping An Finance Centre, Shenzhen, 599.1 m (1,966 ft), 2017.
  ft = m × 3.28084 rounded. #1 − #2 = 490 ft.
"""
import os, sys
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
GOLD = '#F6C760'

E = [  # rank, name lines, place · year, ft, media, commons title, tower x fraction, top / base y fractions
    dict(rank=5, name=['Ping An', 'Finance Centre'], sub='Shenzhen · 2017', ft=1966, media='b5', title='File:Pingan International Finance Center2020.jpg', x=.53, top=.06, base=.80),
    dict(rank=4, name=['Makkah Royal', 'Clock Tower'], sub='Mecca · 2012', ft=1972, media='b4', title='File:Abraj-al-Bait-Towers.JPG', x=.52, top=.07, base=.75),
    dict(rank=3, name=['Shanghai', 'Tower'], sub='Shanghai · 2015', ft=2073, media='b3', title='File:Shanghai - Shanghai Tower - 0003(cropped).jpg', x=.53, top=.05, base=.80),
    dict(rank=2, name=['Merdeka 118'], sub='Kuala Lumpur · 2024', ft=2227, media='b2', title='File:Merdeka Tower 20241022 - full 2.jpg', x=.50, top=.07, base=.78),
    dict(rank=1, name=['Burj Khalifa'], sub='Dubai · 2010', ft=2717, media='b1', title='File:Burj Khalifa and surrounding buildings during sunset.jpg', x=.20, top=.20, base=.85),
]
T_INTRO, ED, ED1 = 1.5, 2.4, 4.9
STARTS = [T_INTRO + i * ED for i in range(5)]
DUR = STARTS[4] + ED1
CH = dict(x0=60, w=130, gap=47.5, base=1300, hmax=300)          # the skyline chart (persistent carrier)


def prep():
    os.makedirs(A, exist_ok=True)
    for e in E:
        src = fetch(e['media'], e['title'], 2400)
        dst = f'{A}/{e["media"]}.jpg'
        if not os.path.exists(dst):
            im = Image.open(src).convert('RGB'); im.thumbnail((2000, 3200)); im.save(dst, quality=90)
        e['size'] = Image.open(dst).size


def tower_cam(e, dur, push=1.32, settle=1.12):
    """tilt up the tower: base → top, a slight pull while climbing (the camera keeps the source covering the frame)"""
    iw, ih = e['size']; cover = max(W / iw, H / ih)
    def key(t, s, yf, ease='io2'):
        cx = min(max(e['x'] * iw, 540 / s), iw - 540 / s)
        cy = min(max(yf * ih, 960 / s), ih - 960 / s)
        return dict(t=t, cx=round(cx, 1), cy=round(cy, 1), s=round(s, 4), fx=540, fy=960, e=ease)
    return [key(0, cover * push, e['base']), key(dur, cover * settle, e['top'] + 0.1)]


ENTRY_CSS = """
  .scrimT { position: absolute; left: 0; right: 0; top: 0; height: 760px; background: linear-gradient(180deg, rgba(5,6,9,.9) 0%, rgba(5,6,9,.6) 50%, rgba(5,6,9,0) 100%); }
  .scrimB { position: absolute; left: 0; right: 0; bottom: 0; height: 1120px; background: linear-gradient(0deg, rgba(5,6,9,.98) 0%, rgba(5,6,9,.9) 46%, rgba(5,6,9,0) 100%); }
  .rk { position: absolute; left: 50px; top: 300px; font-size: 300px; color: %GOLD%; text-shadow: 0 10px 40px rgba(0,0,0,.6); }
  .rk .w, .nm .w, .sb .w { opacity: 0; }
  .nm { position: absolute; left: 60px; top: 580px; font: 900 64px/1.02 Inter, sans-serif; letter-spacing: -.01em; text-transform: uppercase; color: #F5F1E8;
    text-shadow: 0 4px 24px rgba(0,0,0,.8); }
  .sb { position: absolute; left: 62px; font: 800 30px Inter, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: rgba(245,241,232,.82);
    text-shadow: 0 2px 14px rgba(0,0,0,.9); }
  .ht { position: absolute; left: 50px; top: 838px; font-size: 200px; color: #F5F1E8; white-space: nowrap; opacity: 0; text-shadow: 0 10px 40px rgba(0,0,0,.6); }
  .ht small { font-size: 110px; color: %GOLD%; }
""".replace('%GOLD%', GOLD)


def entry_scene(e, dur):
    p = f'e{e["rank"]}'; iw, ih = e['size']
    words = lambda s: ' '.join(f'<span class="w">{w}</span>' for w in s.split())
    nm = '<br>'.join(words(l) for l in e['name'])
    sub_top = 580 + 66 * len(e['name']) + 14
    cam = tower_cam(e, dur)
    one = e['rank'] == 1
    t_cnt0, t_cnt1 = (0.75, 2.45) if one else (0.25, 1.45)
    body = f"""
    <div id="{p}-cam" class="stage" style="background:#111"><img id="{p}-ph" class="ph" src="assets/{e['media']}.jpg" alt="" style="width:{iw}px; height:{ih}px" /></div>
    <div class="scrimT"></div><div class="scrimB"></div>
    <div class="tag" style="top:206px; left:auto; right:60px">Real photo</div>
    <div id="{p}-rk" class="rk gothic"><span class="w">#{e['rank']}</span></div>
    <div id="{p}-nm" class="nm">{nm}</div>
    <div id="{p}-sb" class="sb" style="top:{sub_top}px">{words(e['sub'])}</div>
    <div id="{p}-ht" class="ht gothic"><span id="{p}-v">0</span> <small>FT</small></div>"""
    if one:
        body += f"""
    <div id="e1-gap" class="gp">+490 FT vs #2</div>
    <div id="e1-cta" class="cta">Which one would you climb?</div>"""
    js = EASE_JS + f"""
      const ph = document.getElementById("{p}-ph"), CAM = {J(cam)};
      function render(t) {{ applyCam(ph, camAt(CAM, t));
        const u = EZ.io2(clamp((t - {t_cnt0}) / {t_cnt1 - t_cnt0}, 0, 1)), v = Math.round({e['ft']} * u).toLocaleString("en-US");
        const el = document.getElementById("{p}-v"); if (el.textContent !== v) el.textContent = v; }}
      // waterfall entry: rank (heavy, travels further) → name words → place/year
      const seq = [...document.querySelectorAll("#{p}-rk .w"), ...document.querySelectorAll("#{p}-nm .w"), ...document.querySelectorAll("#{p}-sb .w")];
      let at = {0.55 if one else 0.02}, gap = 0.06;
      seq.forEach((w, i) => {{ tl.set(w, {{ opacity: 1 }}, at);
        tl.fromTo(w, {{ y: i === 0 ? 90 : 50 }}, {{ y: 0, duration: i === 0 ? 0.22 : 0.16, ease: "power4.out" }}, at); at += gap; gap *= 0.86; }});
      tl.set("#{p}-ht", {{ opacity: 1 }}, {t_cnt0 - 0.05});
      tl.fromTo("#{p}-ht", {{ y: 60 }}, {{ y: 0, duration: 0.22, ease: "power4.out" }}, {t_cnt0 - 0.05});
      tl.fromTo("#{p}-ht", {{ scale: 1 }}, {{ scale: {1.12 if one else 1.06}, duration: 0.1, ease: "power2.out", immediateRender: false, transformOrigin: "0% 60%" }}, {t_cnt1});
      tl.to("#{p}-ht", {{ scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, {t_cnt1 + 0.11});
"""
    if one:
        js += """
      tl.set("#e1-gap", { opacity: 1 }, 2.6); tl.fromTo("#e1-gap", { x: 120 }, { x: 0, duration: 0.24, ease: "power4.out" }, 2.6);
      tl.set("#e1-cta", { opacity: 1 }, 3.05); tl.fromTo("#e1-cta", { y: 60 }, { y: 0, duration: 0.24, ease: "power4.out" }, 3.05);
"""
    js += f"""
      const st = {{ t: 0 }};
      tl.fromTo(st, {{ t: 0 }}, {{ t: {dur:.3f}, duration: {dur:.3f}, ease: "none", onUpdate: () => render(st.t) }}, 0);
      render(0);
"""
    css = ENTRY_CSS + ("""
  .cta { position: absolute; left: 60px; width: 840px; top: 724px; text-align: center; padding: 18px 0 16px; border-radius: 999px; background: %GOLD%;
    color: #140F04; font: 900 42px Inter, sans-serif; letter-spacing: .08em; text-transform: uppercase; opacity: 0; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
  .gp { position: absolute; left: 590px; top: 856px; padding: 12px 22px 10px; border-radius: 16px; border: 3px solid %GOLD%; background: rgba(5,6,9,.75);
    font: 400 60px "League Gothic", sans-serif; color: %GOLD%; white-space: nowrap; opacity: 0; }
""".replace('%GOLD%', GOLD) if one else '')
    return scene(p, css, body, js, dur)


INTRO_CSS = """
  #root { background: #05060A; }
  .ib { position: absolute; left: -6%; top: -6%; width: 112%; height: 112%; object-fit: cover; filter: blur(26px) brightness(.38); }
  .ik { position: absolute; left: 0; right: 0; top: 330px; text-align: center; font: 900 42px Inter, sans-serif; letter-spacing: .2em; color: %GOLD%; text-transform: uppercase; }
  .it { position: absolute; left: 20px; right: 20px; top: 400px; text-align: center; font-size: 200px; color: #F5F1E8; text-shadow: 0 10px 40px rgba(0,0,0,.6); }
  .ik .w, .it .w { margin: 0 .05em; }
""".replace('%GOLD%', GOLD)


def intro_scene(dur):
    body = f"""
    <img class="ib" src="assets/b2.jpg" alt="" />
    <div id="i-k" class="ik"><span class="w">#1</span> <span class="w">isn't</span> <span class="w">even</span> <span class="w">close</span></div>
    <div id="i-t" class="it gothic"><span class="w">The</span> <span class="w">5</span> <span class="w">tallest</span><br><span class="w">buildings</span><br><span class="w">on</span> <span class="w">Earth</span></div>"""
    # frame 0 is composed (the hook); the title leaves word by word into the first entry (waterfall cut LEFT)
    js = f"""
      const ws = [...document.querySelectorAll("#i-t .w"), ...document.querySelectorAll("#i-k .w")];
      ws.forEach((w, j) => {{ const out = {dur - 0.05} - 0.34 - 0.2 + j * 0.022;
        tl.to(w, {{ x: -230, duration: 0.34, ease: "power4.in" }}, out); tl.to(w, {{ opacity: 0, duration: 0.18, ease: "none" }}, out + 0.1); }});
      tl.fromTo("#i-k", {{ scale: 1 }}, {{ scale: 1.08, duration: 0.12, ease: "power2.out" }}, 0.55);
      tl.to("#i-k", {{ scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, 0.67);
"""
    return scene('intro', INTRO_CSS, body, js, dur)


CHART_CSS = """
  #root { background: transparent; pointer-events: none; }
  .bar { position: absolute; width: %W%px; bottom: %B%px; height: 0; border-radius: 16px 16px 4px 4px; background: linear-gradient(180deg, #8D96A8, #4B5263);
    box-shadow: 0 14px 36px rgba(0,0,0,.5); }
  .bar.on { background: linear-gradient(180deg, %GOLD%, #B8862F); }
  .ghost { position: absolute; width: %W%px; border: 4px dashed rgba(246,199,96,.75); border-radius: 16px 16px 4px 4px; background: rgba(246,199,96,.06); }
  .q { position: absolute; left: 0; right: 0; top: 30px; text-align: center; font: 400 110px "League Gothic", sans-serif; color: %GOLD%; }
  .bl { position: absolute; width: %W%px; text-align: center; font: 900 30px Inter, sans-serif; color: #0B0D12; letter-spacing: .04em; }
  .bv { position: absolute; width: 170px; text-align: center; font: 400 44px "League Gothic", sans-serif; color: #F5F1E8; opacity: 0; text-shadow: 0 3px 12px rgba(0,0,0,.8); }
  .base { position: absolute; left: 40px; width: 880px; height: 4px; border-radius: 2px; background: rgba(245,241,232,.35); }
  .gap { position: absolute; opacity: 0; }
  .gl { position: absolute; left: 0; top: 0; width: 26px; height: 100%; border: 4px solid %GOLD%; border-left: none; border-radius: 0 10px 10px 0; }
  .gt { position: absolute; left: -246px; top: 50%; margin-top: -32px; width: 230px; text-align: right; font: 400 64px "League Gothic", sans-serif; color: %GOLD%; white-space: nowrap;
    text-shadow: 0 3px 14px rgba(0,0,0,.9); }
""".replace('%W%', str(CH['w'])).replace('%B%', str(1920 - CH['base'])).replace('%GOLD%', GOLD)


def chart_scene():
    """persistent skyline chart: one bar per entry (heights relative to #1), the #1 slot is a dashed '?' from frame 0"""
    hmax, base = CH['hmax'], CH['base']
    hpx = {e['rank']: round(hmax * e['ft'] / 2717) for e in E}
    xs = {e['rank']: round(CH['x0'] + i * (CH['w'] + CH['gap'])) for i, e in enumerate(E)}
    body = f'\n    <div class="base" style="top:{base}px"></div>'
    body += f'\n    <div id="c-ghost" class="ghost" style="left:{xs[1]}px; top:{base - hmax}px; height:{hmax}px"><div id="c-q" class="q">?</div></div>'
    for e in E:
        r = e['rank']
        body += f'\n    <div id="c-b{r}" class="bar" style="left:{xs[r]}px"><div class="bl" style="bottom:12px">#{r}</div></div>'
        body += f'\n    <div id="c-v{r}" class="bv" style="left:{xs[r] - 20}px; top:{base - hpx[r] - 54}px">{e["ft"]:,}</div>'
    js = ''
    for i, e in enumerate(E):
        r = e['rank']; t0 = STARTS[i]
        c0, c1 = ((t0 + 0.75, t0 + 2.45) if r == 1 else (t0 + 0.25, t0 + 1.45))
        js += f'      tl.fromTo("#c-b{r}", {{ height: 0 }}, {{ height: {hpx[r]}, duration: {c1 - c0:.2f}, ease: "power2.inOut" }}, {c0:.2f});\n'
        js += f'      tl.set("#c-b{r}", {{ backgroundImage: "linear-gradient(180deg, {GOLD}, #B8862F)" }}, {c0:.2f});\n'
        nxt = STARTS[i + 1] if i < 4 else None
        if nxt: js += f'      tl.set("#c-b{r}", {{ backgroundImage: "linear-gradient(180deg, #8D96A8, #4B5263)" }}, {nxt:.2f});\n'
        if r == 1: continue
        js += f'      tl.set("#c-v{r}", {{ opacity: 1 }}, {c1:.2f}); tl.fromTo("#c-v{r}", {{ y: 20 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, {c1:.2f});\n'
    s1 = STARTS[4]
    js += f"""
      tl.fromTo("#c-ghost", {{ clipPath: "inset(100% 0 0 0)" }}, {{ clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "power3.out" }}, 0.15);
      tl.fromTo("#c-q", {{ scale: 1.6, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.6)" }}, 0.55);
      tl.to("#c-q", {{ opacity: 0, duration: 0.15, ease: "none" }}, {s1 + 0.7:.2f});
      tl.to("#c-ghost", {{ opacity: 0, duration: 0.25, ease: "none" }}, {s1 + 2.45:.2f});
"""
    return scene('chart', CHART_CSS, body, js, DUR)


HUD_CSS = """
  #root { background: transparent; pointer-events: none; }
  .ser { position: absolute; left: 60px; top: 200px; font: 900 34px Inter, sans-serif; letter-spacing: .16em; color: #F5F1E8; opacity: 0;
    text-shadow: 0 3px 16px rgba(0,0,0,.8); }
  .ser b { color: %GOLD%; }
""".replace('%GOLD%', GOLD)


def build():
    prep()
    files = {'compositions/intro.html': intro_scene(T_INTRO + 0.05)}
    hosts = [('intro', 0, T_INTRO + 0.05, 1)]
    for i, e in enumerate(E):
        d = (ED1 if e['rank'] == 1 else ED) + (0 if e['rank'] == 1 else 0.05)
        files[f'compositions/e{e["rank"]}.html'] = entry_scene(e, d)
        hosts.append((f'e{e["rank"]}', STARTS[i], d, 2 + i))
    files['compositions/chart.html'] = chart_scene()
    hosts.append(('chart', 0, DUR, 10))
    files['index.html'] = index('5 tallest buildings', DUR, hosts, bg='#05060A')
    seams = [dict(id='intro→#5', cut=STARTS[0], technique='cut-the-curve LEFT (title waterfall-cuts out)',
                  exit=dict(selector='#intro', axis='x', dir=-1), entry=dict(selector='#e5', axis='x', dir=-1))]
    for i in range(3):
        a, b = E[i]['rank'], E[i + 1]['rank']
        seams.append(dict(id=f'#{a}→#{b}', cut=STARTS[i + 1], technique='cut-the-curve LEFT',
                          exit=dict(selector=f'#e{a}', axis='x', dir=-1), entry=dict(selector=f'#e{b}', axis='x', dir=-1)))
    seams.append(dict(id='#2→#1', cut=STARTS[4], technique='inverse zoom-through (arrival: the winner lands)',
                      exit=dict(selector='#e2', axis='z', dir=-1), entry=dict(selector='#e1', axis='z', dir=-1)))
    write_project(D, files, dict(fps=30, seams=seams))
    open(os.path.join(D, 'CREDITS.md'), 'w').write('# F ranking — media\n' + credits([e['media'] for e in E]) + '\n')
    print('F built', DUR)


if __name__ == '__main__':
    build()
