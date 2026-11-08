"""#225: spoken-word events + captions → hf/223/ev.json for the offline renderer (scripts/hf225w, workflow offline-render.yml), and the sound cues."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_four': (0, 'four'), 'o_time': (0, 'time'),
 's_hits': (1, 'hits'), 's_sens': (1, 'sensors'), 's_stop': (1, 'stop'), 's_unit': (1, 'control'), 's_ms': (1, '15'), 's_fire': (1, 'fire'),
 'f_fires': (2, 'fires'), 'f_ign': (2, 'igniter'), 'f_wheel': (2, 'steering'), 'f_nitro': (2, 'nitrogen'), 'f_fills': (2, 'fills'), 'f_ms': (2, '20'),
 'v_rock': (3, 'rockhard'), 'v_vents': (3, 'vents'), 'v_soft': (3, 'softens'), 'v_sink': (3, 'sink'),
 'd_dust': (4, 'dust'), 'd_corn': (4, 'cornstarch'), 'd_talc': (4, 'talc'), 'd_unfold': (4, 'unfold'),
 'u_wall': (5, 'wall'), 'u_14': (5, '14'), 'u_never': (5, 'never'), 'u_child': (5, 'child'),
 'e_fast': (6, 'fast'), 'e_yes': (6, 'yes'), 'e_no': (6, 'no'), 'e_sub': (6, 'subscribe'),
}
CUES = [('o_four', 0, 'tick', .4), ('s_hits', 0, 'hit', .9), ('s_hits', .05, 'crack', .7), ('s_sens', 0, 'pop', .5), ('s_unit', 0, 'beep', .5), ('s_fire', 0, 'click', .7), ('f_ign', 0, 'zap', .6), ('f_nitro', 0, 'whoosh', .6), ('f_fills', 0, 'hit', .6),
 ('v_vents', 0, 'whoosh', .45), ('v_soft', 0, 'thump', .4), ('d_dust', 0, 'pop', .4), ('u_wall', 0, 'thump', .6), ('u_never', 0, 'flat', .5), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_sub', 0, 'coin', .5)]

def events(C):
    ev = {}
    for name, (k, key, *n) in WORDS.items():
        nth = n[0] if n else 1; key = norm(key); c = 0
        for i, ws in enumerate(C.CAPS):
            if C.scene_of[i] != k: continue
            for w in ws:
                if norm(w['w']).startswith(key):
                    c += 1
                    if c == nth and name not in ev: ev[name] = round(w['s'], 3)
        if name not in ev: raise KeyError(f'{name}: {key} not spoken in scene {k}')
    return ev

def build(C):
    ev = events(C)
    os.makedirs(C.prj, exist_ok=True)
    json.dump({'ev': ev, 'dur': C.DUR, 'caps': C.CAPS}, open(f'{C.prj}/ev.json', 'w'))
    return '', '', [(ev[n] + o, s, g) for n, o, s, g in CUES]
