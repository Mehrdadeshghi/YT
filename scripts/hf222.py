"""#222: spoken-word events + captions → hf/222/ev.json for the offline 3D renderer (scripts/hf222w, workflow offline-render.yml), and the sound cues.
HyperFrames doesn't draw this film: each frame averages many jittered renders, too slow and too heavy for its capture loop. The score, mix and dubs stay the normal pipeline."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_warn': (0, 'warn'), 'o_jam': (0, 'jam'), 'o_jump': (0, 'jump'), 'o_strangers': (0, 'strangers'),
 'b_jam': (1, 'jam'), 'b_brakes': (1, 'brakes'), 'b_radio': (1, 'radio'), 'b_broadcast': (1, 'broadcast'), 'b_phone': (1, 'phone'), 'b_cell': (1, 'cell'),
 'd_times': (2, '10'), 'd_where': (2, 'where'), 'd_fast': (2, 'fast'), 'd_way': (2, 'way'),
 'h_one': (3, 'broadcast'), 'h_thousand': (3, '1000'), 'h_trick': (3, 'trick'), 'h_next': (3, 'next'), 'h_hop': (3, 'hop'), 'h_hop2': (3, 'hop', 2),
 'a_behind': (4, 'behind'), 'a_80': (4, '80'), 'a_warning': (4, 'warning'), 'a_dash': (4, 'dashboard'), 'a_jam': (4, 'jam'), 'a_slow': (4, 'slow'), 'a_sight': (4, 'sight'),
 'c_catch': (5, 'catch'), 'c_other': (5, 'other'), 'c_too': (5, 'too'), 'y_2016': (5, '2016'), 'y_proposed': (5, 'proposed'), 'y_2020': (5, '2020'), 'y_fcc': (5, 'fcc'), 'y_wifi': (5, 'wifi'), 'y_kept': (5, 'kept'), 'y_rest': (5, 'rest'),
 'e_would': (6, 'would'), 'e_stranger': (6, 'stranger'), 'e_yes': (6, 'yes'), 'e_no': (6, 'no'), 'e_subscribe': (6, 'subscribe'),
}
CUES = [('o_jump', 0, 'pop', .4), ('b_brakes', -.05, 'scratch', .55), ('b_brakes', .1, 'thump', .7), ('b_radio', 0, 'ding', .45), ('b_broadcast', 0, 'sonar', .5), ('b_cell', 0, 'click', .6),
 ('d_times', 0, 'beep', .4), ('d_where', 0, 'pop', .55), ('d_fast', 0, 'pop', .55), ('d_way', 0, 'pop', .55), ('h_one', 0, 'sonar', .5), ('h_trick', 0, 'riser', .3), ('h_next', 0, 'zap', .5), ('h_hop', 0, 'zap', .45), ('h_hop2', 0, 'zap', .45),
 ('a_behind', -.4, 'whoosh', .5), ('a_warning', 0, 'beep', .8), ('a_warning', .22, 'beep', .8), ('a_slow', 0, 'thump', .5), ('c_catch', -.3, 'whoosh', .5), ('c_too', 0, 'wrong', .6), ('y_2016', 0, 'stamp', .7), ('y_2020', 0, 'stamp', .8), ('y_wifi', 0, 'whoosh', .6), ('y_rest', 0, 'ding', .4), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_subscribe', 0, 'ding', .5)]

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
    json.dump({'ev': ev, 'dur': C.DUR, 'caps': C.CAPS, 'cta': [i for i, s in enumerate(C.segs) if s.get('cta')]}, open(f'{C.prj}/ev.json', 'w'))
    return '', '', [(ev[n] + o, s, g) for n, o, s, g in CUES]
