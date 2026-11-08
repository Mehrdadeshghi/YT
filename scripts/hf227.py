"""#227: spoken-word events + captions → hf/223/ev.json for the offline renderer (scripts/hf227w, workflow offline-render.yml), and the sound cues."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_speedo': (0, 'speedometer'), 'o_72': (0, '72'),
 'b_beam': (1, 'radio'), 'b_bounce': (1, 'bounces'), 'b_echo': (1, 'echo'),
 'd_toward': (2, 'toward'), 'd_squeeze': (2, 'squeezed'), 'd_freq': (2, 'frequency'), 'd_faster': (2, 'faster'), 'd_shift': (2, 'shift'), 'd_siren': (2, 'siren'),
 'f_limit': (3, 'limit'), 'f_flash': (3, 'flash'), 'f_plate': (3, 'plate'), 'f_lines': (3, 'lines'),
 'a_twist': (4, 'twist'), 'a_angle': (4, 'angle'), 'a_slower': (4, 'slower'), 'a_faster': (4, 'faster'), 'a_favor': (4, 'favor'),
 'v_comp': (5, 'completely'), 'v_time': (5, 'time'), 'v_points': (5, 'points'), 'v_mile': (5, 'mile'), 'v_50': (5, '50'), 'v_72': (5, '72'),
 'e_hw': (6, 'highway'), 'e_yes': (6, 'yes'), 'e_no': (6, 'no'), 'e_sub': (6, 'subscribe'),
}
CUES = [('o_72', 0, 'pop', .5), ('b_beam', 0, 'zap', .5), ('b_bounce', 0, 'sonar', .5), ('b_echo', 0, 'ding', .35), ('d_squeeze', 0, 'whoosh', .4), ('d_shift', 0, 'beep', .5), ('d_siren', 0, 'riser', .35),
 ('f_flash', 0, 'click', .9), ('f_flash', .02, 'hit', .6), ('f_plate', 0, 'pop', .5), ('a_twist', -.3, 'whoosh', .5), ('a_slower', 0, 'ding', .45), ('v_time', 0, 'beep', .55), ('v_points', 0, 'beep', .55), ('v_72', 0, 'stamp', .9),
 ('e_hw', -.3, 'whoosh', .4), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_sub', 0, 'ding', .5)]

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
