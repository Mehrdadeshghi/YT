"""#224: spoken-word events + captions → hf/223/ev.json for the offline renderer (scripts/hf224w, workflow offline-render.yml), and the sound cues."""
import json, os
import hf_kinetic as K
norm = K.norm
WORDS = {
 'o_steer': (0, 'steer'), 'o_radar': (0, 'radar'), 'o_cam': (0, 'camera'),
 'r_bump': (1, 'bumper'), 'r_wave': (1, 'radio'), 'r_bounce': (1, 'bounce'), 'r_time': (1, 'time'), 'r_dist': (1, 'distance'), 'r_500': (1, '500'),
 'g_slow': (2, 'slows'), 'g_brake': (2, 'brakes'), 'g_gap': (2, 'gap'), 'g_up': (2, 'up'), 'g_set': (2, 'set'),
 'c_lane': (3, 'lane'), 'c_wind': (3, 'windshield'), 'c_edge': (3, 'edges'), 'c_lines': (3, 'lines'),
 'd_drift': (4, 'drift'), 'd_force': (4, 'force'), 'd_back': (4, 'back'),
 'x_see': (5, 'see'), 'x_faded': (5, 'faded'), 'x_snow': (5, 'snow'), 'x_aaa': (5, 'aaa'), 'x_broken': (5, 'brokendown'), 'x_66': (5, '66'), 'x_time': (5, 'time'),
 'e_hands': (6, 'hands'), 'e_trust': (6, 'trust'), 'e_yes': (6, 'yes'), 'e_no': (6, 'no'), 'e_sub': (6, 'subscribe'),
}
CUES = [('o_radar', 0, 'pop', .5), ('o_cam', 0, 'click', .6), ('r_wave', 0, 'sonar', .55), ('r_bounce', 0, 'ding', .4), ('r_dist', 0, 'beep', .5), ('g_slow', 0, 'thump', .4), ('g_brake', 0, 'scratch', .35), ('g_set', 0, 'ding', .35),
 ('c_lane', -.3, 'whoosh', .5), ('c_edge', 0, 'zap', .45), ('d_drift', 0, 'beep', .55), ('d_force', 0, 'thump', .5), ('x_faded', 0, 'wrong', .4), ('x_aaa', -.3, 'riser', .35), ('x_66', 0, 'stamp', 1), ('e_hands', -.3, 'whoosh', .4), ('e_yes', 0, 'pop', .7), ('e_no', 0, 'pop', .7), ('e_sub', 0, 'ding', .5)]

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
