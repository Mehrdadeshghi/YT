"""#226: spoken-word events + captions → hf/223/ev.json for the offline renderer (scripts/hf226w, workflow offline-render.yml), and the sound cues."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_tire': (0, 'tire'), 'o_low': (0, 'low'), 'o_know': (0, 'know', 2),
 'd_sensor': (1, 'sensor'), 'd_wheel': (1, 'wheel'), 'd_valve': (1, 'valve'), 'd_press': (1, 'pressure'), 'd_radio': (1, 'radios'),
 'i_no': (2, 'no'), 'i_speed': (2, 'wheelspeed'), 'i_brakes': (2, 'brakes'), 'i_small': (2, 'smaller'), 'i_fast': (2, 'faster'),
 'l_2007': (3, '2007'), 'l_have': (3, 'have'), 'l_recall': (3, 'recall'), 'l_deaths': (3, 'deaths'),
 't_light': (4, 'light'), 't_25': (4, '25'), 't_before': (4, 'before'),
 'e_self': (5, 'yourself'), 'e_yes': (5, 'yes'), 'e_no': (5, 'no'), 'e_sub': (5, 'subscribe'),
}
CUES = [('o_low', 0, 'beep', .55), ('o_know', 0, 'pop', .4), ('d_sensor', -.3, 'whoosh', .5), ('d_valve', 0, 'click', .6), ('d_press', 0, 'pop', .5), ('d_radio', 0, 'sonar', .55),
 ('i_no', -.3, 'whoosh', .45), ('i_speed', 0, 'zap', .45), ('i_small', 0, 'thump', .45), ('i_fast', 0, 'ding', .45), ('l_2007', 0, 'stamp', .8), ('l_deaths', 0, 'stamp', .7),
 ('t_light', 0, 'beep', .6), ('t_25', 0, 'stamp', .9), ('t_before', 0, 'wrong', .4), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_sub', 0, 'ding', .5)]

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
