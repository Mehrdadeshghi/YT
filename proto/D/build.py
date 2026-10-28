#!/usr/bin/env python3
"""Prototype D — QUIZ "Guess it in 3 seconds" (silent, 9:16). Two rounds + comment-your-score end card.

Facts (English Wikipedia, checked 28 Oct 2026):
  Statue of Liberty — dimensions table: "Index finger 8 ft 1 in (2.44 m)".
  Giraffe — "A giraffe's tongue is about 45 cm (18 in) long."
"""
import os, sys
from PIL import Image, ImageOps
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')

ROUNDS = [
    dict(id='r1', media='liberty', title='File:Statue of Liberty frontal 2.jpg', width=0,
         opts=['CHRIST THE REDEEMER', 'STATUE OF LIBERTY', 'LINCOLN MEMORIAL'], right=1,
         ans=['STATUE OF', 'LIBERTY'], eyebrow='Her index finger is', val=8, unit='FT', tail='1 IN',
         # camera keys: crop (quiz) → reveal (pull back) → push onto the detail of the fact
         crop=dict(cx=1700, cy=1430, s=2.7), full=dict(cx=1625, cy=1900, s=0.42), detail=dict(cx=930, cy=760, s=1.25, fx=540, fy=600),
         ring=dict(x=930, y=760, r=95), tag='Real photo', bg='#2F5288'),
    dict(id='r2', media='giraffe', title='File:Giraffa camelopardalis in Duisburg Zoo sticking out tongue.jpg', width=0,
         opts=['LEOPARD', 'CHEETAH', 'GIRAFFE'], right=2,
         ans=['GIRAFFE'], eyebrow='Its tongue is about', val=18, unit='IN', tail='',
         crop=dict(cx=1720, cy=4330, s=1.7), full=dict(cx=1728, cy=2500, s=0.375), detail=dict(cx=2560, cy=3130, s=0.95, fx=540, fy=640),
         ring=dict(x=2560, y=3140, r=215), tag='Real photo', bg='#1E2A12'),
]
RD = 7.5            # round length (seam at the end of each round)
END = 3.0
DUR = 2 * RD + END


def prep():
    os.makedirs(A, exist_ok=True)
    for r in ROUNDS:
        src = fetch(r['media'], r['title'], r['width'])
        dst = os.path.join(A, r['media'] + '.jpg')
        if not os.path.exists(dst):
            im = ImageOps.exif_transpose(Image.open(src)).convert('RGB'); im.save(dst, quality=90)
        r['size'] = Image.open(dst).size


CSS = """
  .scrimT { position: absolute; left: 0; right: 0; top: 0; height: 560px; background: linear-gradient(180deg, rgba(6,8,12,.86), rgba(6,8,12,.45) 55%, rgba(6,8,12,0)); }
  .scrimB { position: absolute; left: 0; right: 0; bottom: 0; height: 1080px; background: linear-gradient(0deg, rgba(6,8,12,.97) 0%, rgba(6,8,12,.9) 40%, rgba(6,8,12,0) 100%); }
  .dial { position: absolute; left: 360px; top: 470px; width: 360px; height: 360px; }
  .dial svg { position: absolute; inset: 0; overflow: visible; }
  .disc { position: absolute; inset: 22px; border-radius: 50%; background: rgba(6,8,12,.62); box-shadow: 0 20px 60px rgba(0,0,0,.45); }
  .num { position: absolute; left: 0; right: 0; top: 46px; text-align: center; font-family: "League Gothic", sans-serif; font-size: 300px; line-height: 1;
    color: #FFD23F; text-shadow: 0 8px 30px rgba(0,0,0,.5); opacity: 0; }
  .opt { position: absolute; left: 60px; width: 840px; height: 94px; border-radius: 26px; background: rgba(12,15,22,.82);
    border: 2px solid rgba(245,241,232,.20); display: flex; align-items: center; opacity: 0; box-shadow: 0 14px 40px rgba(0,0,0,.4); }
  .L { width: 66px; height: 66px; margin: 0 26px 0 14px; border-radius: 50%; background: #FFD23F; color: #0B0D12; text-align: center;
    font: 900 40px/66px Inter, sans-serif; flex: none; }
  .T { font: 900 40px Inter, sans-serif; letter-spacing: .03em; white-space: nowrap; }
  .opt.win { background: #20B865; border-color: #6CF0A6; }
  .opt.win .L { background: #F5F1E8; color: #138A49; }
  .ans { position: absolute; left: 40px; right: 40px; top: 890px; text-align: center; font-size: 132px; color: #F5F1E8; text-shadow: 0 10px 40px rgba(0,0,0,.6); }
  .ans .w { opacity: 0; margin: 0 .08em; }
  .fact { position: absolute; left: 60px; right: 60px; top: 1138px; text-align: center; }
  .eb { font: 900 34px Inter, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: rgba(245,241,232,.86); opacity: 0; }
  .val { margin-top: 4px; font-size: 136px; color: #FFD23F; opacity: 0; }
  .callout { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; overflow: visible; pointer-events: none; }
"""


def round_scene(r, k):
    p = r['id']; iw, ih = r['size']
    c0, cf, cd = r['crop'], r['full'], r['detail']
    # camera: crop (with a step push on each count) → hold → pull back to full (arrival) → push to the fact's detail
    cam = [dict(t=0, fx=540, fy=650, **c0)]
    for i, tt in enumerate([1.0, 2.0]):
        cam.append(dict(t=tt + 0.35, fx=540, fy=650, cx=c0['cx'], cy=c0['cy'], s=c0['s'] * (1.07 ** (i + 1)), e='o3'))
    cam.append(dict(t=3.5, fx=540, fy=650, cx=c0['cx'], cy=c0['cy'], s=c0['s'] * 1.07 ** 2, e='lin'))
    cam.append(dict(t=4.6, fx=540, fy=960, e='o4', **cf))
    cam.append(dict(t=5.0, fx=540, fy=960, e='lin', **cf))
    cam.append(dict(t=6.05, e='io3', **cd))
    blur = [dict(t=0, b=26), dict(t=1.0, b=26), dict(t=1.25, b=17, e='o3'), dict(t=2.0, b=17), dict(t=2.25, b=9, e='o3'),
            dict(t=3.4, b=9), dict(t=3.75, b=0, e='o3')]
    opts = ''.join(f'''
    <div id="{p}-o{i}" class="opt{' win' if False else ''}" style="top:{1010 + i * 108}px"><span id="{p}-L{i}" class="L">{'ABC'[i]}</span><span class="T">{o}</span></div>'''
                   for i, o in enumerate(r['opts']))
    ans = '<br>'.join(' '.join(f'<span class="w">{w}</span>' for w in line.split()) for line in r['ans'])
    tail = f' <span style="color:#F5F1E8">{r["tail"]}</span>' if r['tail'] else ''
    body = f"""
    <div id="{p}-cam" class="stage" style="background:{r['bg']}"><img id="{p}-ph" class="ph" src="assets/{r['media']}.jpg" alt="" style="width:{iw}px; height:{ih}px" /></div>
    <div class="scrimT"></div><div class="scrimB"></div>
    <div id="{p}-tag" class="tag" style="top:410px">{r['tag']} · <span id="{p}-tz">zoomed in</span></div>
    <div id="{p}-dial" class="dial"><div class="disc"></div>
      <svg viewBox="0 0 360 360"><circle cx="180" cy="180" r="166" fill="none" stroke="rgba(245,241,232,.16)" stroke-width="14" />
        <circle id="{p}-arc" cx="180" cy="180" r="166" fill="none" stroke="#FFD23F" stroke-width="14" stroke-linecap="round"
          transform="rotate(-90 180 180)" stroke-dasharray="1043 1043" stroke-dashoffset="0" /></svg>
      <div id="{p}-n3" class="num">3</div><div id="{p}-n2" class="num">2</div><div id="{p}-n1" class="num">1</div>
    </div>{opts}
    <svg class="callout" viewBox="0 0 1080 1920"><circle id="{p}-ring" cx="0" cy="0" r="100" fill="none" stroke="#FFD23F" stroke-width="9"
      stroke-linecap="round" pathLength="100" stroke-dasharray="0 120" transform="rotate(-90)" /></svg>
    <div id="{p}-ans" class="ans gothic">{ans}</div>
    <div class="fact"><div id="{p}-eb" class="eb">{r['eyebrow']}</div>
      <div id="{p}-val" class="val gothic"><span id="{p}-v">0</span> {r['unit']}{tail}</div></div>"""
    R = r['right']; wrong = [i for i in range(3) if i != R]
    js = EASE_JS + f"""
      const ph = document.getElementById("{p}-ph"), cam = document.getElementById("{p}-cam"), arc = document.getElementById("{p}-arc");
      const ring = document.getElementById("{p}-ring"), CAM = {J(cam)}, BL = {J(blur)}, RING = {J(r['ring'])};
      function render(t) {{
        const c = camAt(CAM, t); applyCam(ph, c);
        cam.style.filter = `blur(${{kf(BL, t, 'b').toFixed(2)}}px)`;
        arc.setAttribute("stroke-dashoffset", (1043 * clamp(t / 3.0, 0, 1)).toFixed(1));
        const q = toFrame(c, RING.x, RING.y);
        ring.setAttribute("cx", q[0].toFixed(1)); ring.setAttribute("cy", q[1].toFixed(1)); ring.setAttribute("r", (RING.r * c.s).toFixed(1));
        ring.setAttribute("transform", `rotate(-90 ${{q[0].toFixed(1)}} ${{q[1].toFixed(1)}})`);
        const L = document.getElementById("{p}-L{R}"), lt = t >= 3.4 ? "✓" : "{'ABC'[R]}"; if (L.textContent !== lt) L.textContent = lt;
        const tz = document.getElementById("{p}-tz"), zt = t >= 3.9 ? "full frame" : "zoomed in"; if (tz.textContent !== zt) tz.textContent = zt;
      }}
      const st = {{ t: 0 }};
      // countdown: 3 is on screen at frame 0 (the hook); each swap is a zoom-through (out grows + blurs, in grows into focus)
      tl.set("#{p}-n3", {{ opacity: 1 }}, 0);
      [["3", "2", 1.0], ["2", "1", 2.0]].forEach(([a, b, at]) => {{
        tl.to("#{p}-n" + a, {{ scale: 1.25, filter: "blur(10px)", duration: 0.2, ease: "power3.in" }}, at - 0.2);
        tl.to("#{p}-n" + a, {{ opacity: 0, duration: 0.2, ease: "none" }}, at - 0.2);
        tl.fromTo("#{p}-n" + b, {{ scale: 0.75, opacity: 0.15, filter: "blur(10px)" }}, {{ scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }}, at);
      }});
      // time's up: the dial pushes through the camera (Z forward) — then a dead-still beat before the answer
      tl.to("#{p}-dial", {{ scale: 1.3, filter: "blur(10px)", duration: 0.24, ease: "power3.in" }}, 2.86);
      tl.to("#{p}-dial", {{ opacity: 0, duration: 0.24, ease: "none" }}, 2.86);
      // options: waterfall entry from below (binary opacity, shrinking gaps)
      [0.10, 0.24, 0.35].forEach((at, i) => {{
        tl.set("#{p}-o" + i, {{ opacity: 1 }}, at);
        tl.fromTo("#{p}-o" + i, {{ y: 70 }}, {{ y: 0, duration: 0.22, ease: "power4.out" }}, at);
      }});
      // reveal @3.4: the right answer lights up (causal: the photo snaps into focus on the same frame)
      tl.set("#{p}-o{R}", {{ backgroundColor: "#20B865", borderColor: "#6CF0A6" }}, 3.4);
      tl.set("#{p}-L{R}", {{ backgroundColor: "#F5F1E8", color: "#138A49" }}, 3.4);
      tl.fromTo("#{p}-o{R}", {{ scale: 1 }}, {{ scale: 1.06, duration: 0.12, ease: "power2.out" }}, 3.4);
      tl.to("#{p}-o{R}", {{ scale: 1, duration: 0.3, ease: "back.out(1.6)" }}, 3.52);
      {J(wrong)}.forEach((i) => tl.to("#{p}-o" + i, {{ opacity: 0.28, x: -14, duration: 0.18, ease: "power2.out" }}, 3.4));
      // options leave downward as a cascade; the answer arrives as a waterfall entry
      [2, 1, 0].forEach((i, n) => tl.to("#{p}-o" + i, {{ y: 120, opacity: 0, duration: 0.22, ease: "power3.in" }}, 4.05 + n * 0.04));
      const W = document.querySelectorAll("#{p}-ans .w");
      W.forEach((w, i) => {{ const at = 4.32 + [0, 0.07, 0.13, 0.18][Math.min(i, 3)];
        tl.set(w, {{ opacity: 1 }}, at); tl.fromTo(w, {{ y: 80 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, at); }});
      // the fact: eyebrow, then the number counts up while the camera travels onto the detail, the ring draws on arrival
      tl.set("#{p}-eb", {{ opacity: 1 }}, 5.0); tl.fromTo("#{p}-eb", {{ y: 40 }}, {{ y: 0, duration: 0.2, ease: "power4.out" }}, 5.0);
      tl.set("#{p}-val", {{ opacity: 1 }}, 5.12); tl.fromTo("#{p}-val", {{ y: 60 }}, {{ y: 0, duration: 0.22, ease: "power4.out" }}, 5.12);
      const cnt = {{ v: 0 }};
      tl.fromTo(cnt, {{ v: 0 }}, {{ v: {r['val']}, duration: 0.9, ease: "power2.out",
        onUpdate: () => {{ document.getElementById("{p}-v").textContent = Math.round(cnt.v); }} }}, 5.15);
      tl.fromTo("#{p}-val", {{ scale: 1 }}, {{ scale: 1.08, duration: 0.1, ease: "power2.out", immediateRender: false }}, 6.05);
      tl.to("#{p}-val", {{ scale: 1, duration: 0.25, ease: "power2.out" }}, 6.15);
      tl.fromTo(ring, {{ attr: {{ "stroke-dasharray": "0 120" }} }}, {{ attr: {{ "stroke-dasharray": "100 120" }}, duration: 0.4, ease: "power2.inOut" }}, 6.05);
      tl.fromTo(st, {{ t: 0 }}, {{ t: {RD}, duration: {RD}, ease: "none", onUpdate: () => render(st.t) }}, 0);
      render(0);
"""
    return scene(p, CSS, body, js, RD + 0.05)


HUD_CSS = """
  #root { background: transparent; pointer-events: none; }
  .hk { position: absolute; left: 60px; top: 196px; font: 900 40px Inter, sans-serif; letter-spacing: .16em; color: #F5F1E8; text-transform: uppercase;
    text-shadow: 0 4px 20px rgba(0,0,0,.6); }
  .hb { position: absolute; left: 56px; top: 238px; font-size: 140px; color: #FFD23F; text-shadow: 0 8px 30px rgba(0,0,0,.55); }
  .rnd { position: absolute; right: 60px; top: 200px; height: 74px; padding: 0 22px; border-radius: 18px; background: rgba(6,8,12,.7);
    border: 2px solid rgba(245,241,232,.25); font: 900 34px/70px Inter, sans-serif; letter-spacing: .1em; overflow: hidden; white-space: nowrap; }
  .slot { display: inline-block; position: relative; width: 24px; height: 70px; vertical-align: top; overflow: hidden; }
  .slot span { position: absolute; left: 0; top: 0; color: #FFD23F; }
"""


def hud():
    body = """
    <div id="hud-all">
      <div id="hud-k" class="hk"><span class="w">Guess</span> <span class="w">it</span> <span class="w">in</span></div>
      <div id="hud-b" class="hb gothic">3 seconds</div>
      <div class="rnd">ROUND <span class="slot"><span id="hud-r1">1</span><span id="hud-r2" style="top:70px">2</span></span>/2</div>
    </div>"""
    js = f"""
      // round counter rolls like a slot machine on the round seam
      tl.to("#hud-r1", {{ y: -70, duration: 0.28, ease: "power3.in" }}, {RD - 0.28});
      tl.fromTo("#hud-r2", {{ y: 0 }}, {{ y: -70, duration: 0.32, ease: "power4.out", immediateRender: false }}, {RD});
      // the whole HUD leaves upward with the closing seam (same vector as the end card's entry)
      tl.to("#hud-all", {{ y: -230, duration: 0.34, ease: "power3.in" }}, {2 * RD - 0.34});
      tl.to("#hud-all", {{ opacity: 0, duration: 0.3, ease: "none" }}, {2 * RD - 0.3});
"""
    return scene('hud', HUD_CSS, body, js, 2 * RD + 0.05)


END_CSS = """
  #root { background: radial-gradient(90% 60% at 50% 42%, #2A2410 0%, #0B0B0C 62%, #06080C 100%); }
  .ek { position: absolute; left: 0; right: 0; top: 520px; text-align: center; font: 900 42px Inter, sans-serif; letter-spacing: .18em; color: #F5F1E8; }
  .eb2 { position: absolute; left: 30px; right: 30px; top: 600px; text-align: center; font-size: 210px; color: #FFD23F; }
  .eb2 .w { opacity: 0; margin: 0 .06em; }
  .sc { position: absolute; top: 1110px; width: 250px; height: 130px; border-radius: 30px; background: rgba(245,241,232,.08);
    border: 2.5px solid rgba(245,241,232,.3); text-align: center; font: 400 104px/130px "League Gothic", sans-serif; color: #F5F1E8; opacity: 0; }
  .sc.top { background: #FFD23F; color: #0B0D12; border-color: #FFD23F; }
  .ec { position: absolute; left: 0; right: 0; top: 1280px; text-align: center; font: 800 30px Inter, sans-serif; letter-spacing: .2em; color: rgba(245,241,232,.75); opacity: 0; }
"""


def end():
    body = """
    <div id="e-k" class="ek">HOW MANY DID YOU GET?</div>
    <div id="e-b" class="eb2 gothic"><span class="w">Comment</span><br><span class="w">your</span> <span class="w">score</span></div>
    <div id="e-s0" class="sc" style="left:75px">0/2</div><div id="e-s1" class="sc" style="left:415px">1/2</div><div id="e-s2" class="sc top" style="left:755px">2/2</div>
    <div id="e-c" class="ec">ROUND 3 IN THE COMMENTS?</div>"""
    js = """
      const W = document.querySelectorAll("#e-b .w");
      W.forEach((w, i) => { const at = 0.12 + [0, 0.09, 0.15][i]; tl.set(w, { opacity: 1 }, at);
        tl.fromTo(w, { y: 90 }, { y: 0, duration: 0.22, ease: "power4.out" }, at); });
      [0.62, 0.72, 0.80].forEach((at, i) => { tl.set("#e-s" + i, { opacity: 1 }, at);
        tl.fromTo("#e-s" + i, { y: 70 }, { y: 0, duration: 0.2, ease: "power4.out" }, at); });
      // the perfect score gets the one accent move
      tl.fromTo("#e-s2", { scale: 1 }, { scale: 1.12, duration: 0.14, ease: "power2.out" }, 1.25);
      tl.to("#e-s2", { scale: 1, duration: 0.35, ease: "back.out(1.6)" }, 1.40);
      tl.set("#e-c", { opacity: 1 }, 1.0); tl.fromTo("#e-c", { y: 30 }, { y: 0, duration: 0.2, ease: "power4.out" }, 1.0);
"""
    return scene('end', END_CSS, body, js, END)


def build():
    prep()
    files = {f'compositions/{r["id"]}.html': round_scene(r, k) for k, r in enumerate(ROUNDS)}
    files['compositions/hud.html'] = hud()
    files['compositions/end.html'] = end()
    files['index.html'] = index('Guess it in 3 seconds', DUR,
                                [('r1', 0, RD + 0.05, 1), ('r2', RD, RD + 0.05, 2), ('end', 2 * RD, END, 3), ('hud', 0, 2 * RD + 0.05, 10)])
    ledger = dict(fps=30, seams=[
        dict(id='round1→round2', cut=RD, technique='cut-the-curve LEFT',
             exit=dict(selector='#r1', axis='x', dir=-1), entry=dict(selector='#r2', axis='x', dir=-1)),
        dict(id='round2→end', cut=2 * RD, technique='cut-the-curve UP (conclusion rises)',
             exit=dict(selector='#r2', axis='y', dir=-1), entry=dict(selector='#end', axis='y', dir=-1)),
    ])
    write_project(D, files, ledger)
    open(os.path.join(D, 'CREDITS.md'), 'w').write('# D quiz — media\n' + credits([r['media'] for r in ROUNDS]) + '\n')
    print('D built', DUR)


if __name__ == '__main__':
    build()
