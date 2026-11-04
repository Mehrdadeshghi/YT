"""#221 Attack chain: the whole film as ONE continuous Three.js world on one camera ("hf": {"style": "doku", "custom": "hf221"}, called by hf_build.py).
The world lives in scripts/hf221w/*.js (seeded, every frame a pure function of t; three.js r160 vendored in scripts/vendor/three, MIT).
This file only pulls the spoken-word times out of the Whisper captions (window.EV), lists the sound cues on the same events and copies the files.
Every fact on screen comes from Binance's preliminary report (see scripts/mk221.py); no logos, no real-brand UI; own stylised objects.
"""
import json, os, shutil
import hf_kinetic as K

HERE = os.path.dirname(os.path.abspath(__file__))
norm = K.norm

# name: (scene, caption word prefix, nth occurrence); exact=True via a leading '=' for one-letter words
WORDS = {
 'h_interview': (0, 'interview'), 'h_steal': (0, 'steal'), 'h_six': (0, '63'), 'h_attack': (0, 'attack'), 'h_according': (0, 'according'),
 'j_june': (1, 'june'), 'j_engineer': (1, 'engineer'), 'j_downloads': (1, 'downloads'), 'j_tampered': (1, 'tampered'), 'j_caught': (1, 'caught'), 'j_hackers': (1, 'hackers'),
 'j_know': (1, 'know'), 'j_runs': (1, 'runs'), 'j_wallets': (1, 'wallets'),
 's_sept': (2, 'september'), 's_job': (2, 'job'), 's_b': (2, '=b'), 's_two': (2, 'two'), 's_interviews': (2, 'interviews'), 's_fake': (2, 'fake'), 's_ceo': (2, 'ceo'),
 's_assignment': (2, 'assignment'), 's_undetected': (2, 'undetected'), 's_malware': (2, 'malware'),
 'n_oct': (3, 'october'), 'n_internal': (3, 'internal'), 'n_tool': (3, 'tool'), 'n_take': (3, 'take'), 'n_a': (3, '=a'), 'n_c': (3, '=c'), 'n_holds': (3, 'holds'), 'n_token': (3, 'token'), 'n_containers': (3, 'containers'),
 'l_oct': (4, 'october'), 'l_stolen': (4, 'stolen'), 'l_deploy': (4, 'deploy'), 'l_container': (4, 'container'), 'l_reach': (4, 'reach'), 'l_signing': (4, 'signing'), 'l_service': (4, 'service'),
 'd_drain': (5, 'drain'), 'd_233': (5, '233'), 'd_minutes': (5, 'minutes'), 'd_solana': (5, 'solana'), 'd_optimism': (5, 'optimism'), 'd_18270': (5, '18270'), 'd_bitcoin': (5, 'bitcoin'),
 't_binance': (6, 'binance'), 't_stops': (6, 'stops'), 't_withdrawals': (6, 'withdrawals'), 't_outflow': (6, 'outflow'), 't_running': (6, 'running'), 't_eip': (6, 'eip7702'), 't_gave': (6, 'gave'), 't_rights': (6, 'rights'),
 't_onchain': (6, 'onchain'), 't_mpc': (6, 'mpc'), 't_no': (6, 'no'), 't_key': (6, 'key'), 't_revoke': (6, 'revoke'), 't_fast': (6, 'fast'),
 'p_634': (7, '634'), 'p_285': (7, '285'), 'p_frozen': (7, 'frozen'), 'p_binance': (7, 'binance'), 'p_users': (7, 'users'), 'p_wont': (7, 'wont'), 'p_fbi': (7, 'fbi'), 'p_points': (7, 'points'), 'p_north': (7, 'north'), 'p_north2': (7, 'north', 2), 'p_denies': (7, 'denies'),
 'c_weakest': (7, 'weakest'), 'c_installer': (7, 'installer'), 'c_interview': (7, 'interview'), 'c_comment': (7, 'comment'), 'c_installer2': (7, 'installer', 2), 'c_interview2': (7, 'interview', 2), 'c_subscribe': (7, 'subscribe'),
}

def events(C):
    ev = {}
    for name, spec in WORDS.items():
        k, key = spec[0], spec[1]; nth = spec[2] if len(spec) > 2 else 1
        exact = key.startswith('='); key = norm(key); n = 0
        for i, ws in enumerate(C.CAPS):
            if C.scene_of[i] != k: continue
            for w in ws:
                nw = norm(w['w'])
                if nw == key if exact else nw.startswith(key):
                    n += 1
                    if n == nth and name not in ev: ev[name] = round(w['s'], 3)
        if name not in ev: raise KeyError(f'{name}: {key} not spoken in scene {k}')
    return ev

CUES = [  # (event or number, offset, sound, gain)
 ('h_steal', 0, 'glitch', .6), ('h_six', 0, 'boom', .7), ('h_six', .05, 'coin', .9), ('h_six', .3, 'coin', .7), ('h_six', .6, 'coin', .6), ('h_six', .95, 'coin', .5), ('h_attack', .12, 'hit', .55), ('j_june', -.5, 'whoosh', .5),
 ('j_downloads', 0, 'thump', .9), ('j_tampered', 0, 'scratch', .5), ('j_tampered', .25, 'pop', .5), ('j_caught', 0, 'beep', .8), ('j_caught', .22, 'beep', .8), ('j_caught', .44, 'beep', .8), ('j_caught', .44, 'click', .8), ('j_caught', .65, 'whoosh', .35), ('j_hackers', 0, 'riser', .3), ('j_wallets', 0, 'ding', .6),
 ('s_sept', -.45, 'whoosh', .5), ('s_job', 0, 'paper', .7), ('s_b', 0, 'pop', .6), ('s_two', 0, 'pop', .6), ('s_interviews', 0, 'pop', .6), ('s_ceo', 0, 'wrong', .6), ('s_assignment', 0, 'thump', .8), ('s_undetected', 0, 'sonar', .35), ('s_malware', 0, 'ding', .5),
 ('n_oct', -.45, 'whoosh', .5), ('n_internal', 0, 'zap', .5), ('n_take', 0, 'zap', .7), ('n_a', 0, 'hit', .5), ('n_c', 0, 'hit', .5), ('n_token', 0, 'ding', .6),
 ('l_oct', -.45, 'whoosh', .5), ('l_stolen', .2, 'click', .9), ('l_deploy', 0, 'scratch', .35), ('l_container', 0, 'hit', .75), ('l_reach', 0, 'whoosh', .4), ('l_signing', 0, 'stamp', .8), ('l_service', 0, 'stamp', .7),
 ('d_drain', 0, 'crack', .6), ('d_drain', .3, 'boom', .6), ('d_233', 0, 'whoosh', .5), ('d_solana', -.15, 'whoosh', .4), ('d_optimism', -.15, 'whoosh', .4), ('d_18270', -.3, 'riser', .4), ('d_18270', 0, 'hit', .7),
 ('t_stops', 0, 'hit', .9), ('t_stops', .05, 'click', 1), ('t_stops', .15, 'scratch', .6), ('t_outflow', 0, 'riser', .35), ('t_rights', 0, 'stamp', .8), ('t_onchain', 0, 'pop', .6), ('t_mpc', .42, 'crack', .7),
 ('p_634', 0, 'boom', .7), ('p_285', 0, 'crack', .7), ('p_frozen', 0, 'crack', .6), ('p_wont', 0, 'thump', .6), ('p_points', 0, 'zap', .4), ('p_denies', 0, 'stamp', 1),
 ('c_installer', 0, 'pop', .7), ('c_interview', 0, 'pop', .7), ('c_installer2', 0, 'pop', .7), ('c_interview2', 0, 'pop', .7), ('c_subscribe', 0, 'ding', .5),
]

STYLE = """
  #gl { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; z-index: 0; }
  #ov { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; z-index: 10; overflow: hidden; pointer-events: none; }
  .st { position: absolute; left: 0; width: 1080px; text-align: center; font-family: "League Gothic", sans-serif; line-height: .95; color: #fff; white-space: nowrap; opacity: 0; will-change: transform;
    text-shadow: 0 0 2px rgba(0,0,0,.55), 0 5px 0 rgba(0,0,0,.35), 0 10px 34px rgba(0,0,0,.55); text-transform: uppercase; letter-spacing: .005em; }
  .cp { position: absolute; left: 0; width: 1080px; text-align: center; font: 500 36px/1 "JetBrains Mono", monospace; letter-spacing: .06em; color: #fff; opacity: 0; white-space: nowrap; text-transform: uppercase; }
  .cp span { display: inline-block; padding: 12px 20px 11px; background: rgba(8,10,20,.72); border: 1px solid rgba(255,255,255,.4); }
  #tag { position: absolute; left: 56px; top: 150px; font: 500 21px/1 "JetBrains Mono", monospace; letter-spacing: .1em; color: #fff; padding: 9px 13px 8px; background: rgba(8,10,20,.55); border: 1px solid rgba(255,255,255,.35); white-space: nowrap; text-transform: uppercase; }
"""

def build(C):
    ev = events(C)
    ev['cta'] = next(C.CAPS[i][0]['s'] for i, s in enumerate(C.segs) if s.get('cta'))
    cues = [(ev[n] + o, s, g) for n, o, s, g in CUES]
    # copy the world into the project
    A = f'{C.prj}/assets'
    for sub in ('world', 'lib'): shutil.rmtree(f'{A}/{sub}', ignore_errors=True)
    shutil.copytree(f'{HERE}/hf221w', f'{A}/world', ignore=shutil.ignore_patterns('__pycache__'))
    shutil.copytree(f'{HERE}/vendor/three', f'{A}/lib/three')
    os.makedirs(f'{A}/fonts', exist_ok=True); shutil.copy(f'{HERE}/../fonts/ArchivoBlack.woff2', f'{A}/fonts/')
    D = C.DUR
    hosts = (f'      <canvas id="gl" class="clip" width="1080" height="1920" data-start="0" data-duration="{D:.2f}" data-track-index="0"></canvas>\n'
             f'      <div id="ov" class="clip" data-start="0" data-duration="{D:.2f}" data-track-index="1"><div id="tag">Graphic / animation · based on Binance’s report</div></div>')
    tail = f"""
    <style>{STYLE}</style>
    <script type="importmap">{{"imports":{{"three":"./assets/lib/three/three.module.js","three/addons/geometries/RoundedBoxGeometry.js":"./assets/lib/three/addons/RoundedBoxGeometry.js","three/addons/environments/RoomEnvironment.js":"./assets/lib/three/addons/RoomEnvironment.js"}}}}</script>
    <script>
      // seek bridge: the module loads asynchronously; HyperFrames waits for buildReady, then seeks. EV = spoken-word times from Whisper.
      window.EV = {json.dumps(ev)}; window.EV_DUR = {D};
      window.__hf = window.__hf || {{}}; window.__hf.buildReady = window.__hf.buildReady || {{}};
      window.__hf.buildReady['world221'] = new Promise((res) => {{ window.__hfReady = res; }});
      window.__lastT = 0;
      window.addEventListener('hf-seek', (e) => {{ window.__lastT = e.detail.time; if (window.__render) window.__render(e.detail.time); }});
    </script>
    <script type="module" src="assets/world/film.js"></script>"""
    return hosts, tail, cues
