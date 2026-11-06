"""#223: spoken-word events + captions → hf/223/ev.json for the offline renderer (scripts/hf223w, workflow offline-render.yml), and the sound cues."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_stolen': (0, 'stolen'), 'o_listen': (0, 'listening'), 'o_ring': (0, 'ringing'),
 't_tag': (1, 'tag'), 't_strip': (1, 'metal'), 't_vib': (1, 'vibrate'), 't_magnet': (1, 'magnet'),
 'b_burst': (2, 'bursts'), 'b_58': (2, '58000'), 'b_pitch': (2, 'pitch'), 'b_vib': (2, 'vibrate'), 'b_fork': (2, 'tuning'),
 'l_trick': (3, 'trick'), 'l_stops': (3, 'stops'), 'l_quiet': (3, 'quiet'), 'l_ring': (3, 'ringing'), 'l_sig': (3, 'signal'), 'l_ant': (3, 'antenna'), 'l_pitch': (3, 'pitch'), 'l_rhythm': (3, 'rhythm'), 'l_alarm': (3, 'alarm'),
 'p_pay': (4, 'pay'), 'p_check': (4, 'checkout'), 'p_dem': (4, 'demagnetizes'), 'p_tune': (4, 'tune'), 'p_hear': (4, 'hear'),
 'f_miss': (5, 'misses'), 'f_store': (5, 'another'), 'f_beep': (5, 'beep'),
 'e_beep': (6, 'beeped'), 'e_yes': (6, 'yes'), 'e_no': (6, 'no', 2), 'e_sub': (6, 'subscribe'),
}
BEEP = [(t, 'beep', .85) for t in (.15, .5, .85, 1.2)]
CUES = [('o_listen', 0, 'sonar', .35), ('t_tag', -.3, 'whoosh', .5), ('t_strip', 0, 'pop', .5), ('t_magnet', 0, 'pop', .5), ('b_burst', 0, 'zap', .55), ('b_58', 0, 'zap', .45), ('b_vib', 0, 'ding', .35),
 ('l_stops', 0, 'click', .8), ('l_ring', 0, 'ding', .5), ('l_sig', 0, 'sonar', .5), ('l_alarm', 0, 'beep', .9), ('l_alarm', .3, 'beep', .9), ('l_alarm', .6, 'beep', .9), ('p_pay', -.35, 'whoosh', .5), ('p_dem', 0, 'thump', .7), ('p_tune', 0, 'wrong', .4),
 ('f_miss', -.2, 'whoosh', .4), ('f_beep', 0, 'beep', .9), ('f_beep', .3, 'beep', .9), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_sub', 0, 'ding', .5)]

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
    return '', '', [(ev[n] + o, s, g) for n, o, s, g in CUES] + BEEP
