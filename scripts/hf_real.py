"""Real-footage Shorts: spoken-word events + captions → hf/<ep>/ev.json for scripts/realfilm (rendered by workflow offline-render.yml, world=realfilm).
Events and sound cues are data in episodes/<ep>.json → "real": {"events": {"hit": [1, "hits"], "no": [6, "no", 2]}, "cues": [["hit", 0, "hit", .9], ...]}
(scene index, caption-word prefix, nth occurrence). The CTA words of "cta" (a, b) and "subscribe" are found automatically."""
import json, os
import hf_kinetic as K
norm = K.norm
SFX = {'tick', 'click', 'pop', 'thump', 'whoosh', 'swish', 'scratch', 'riser', 'geiger', 'bloop', 'type', 'crack', 'splash', 'sonar', 'bubble', 'beep', 'flat', 'pen', 'coin', 'hit', 'zap', 'land'}

def find(C, k, key, nth=1, exact=False):
    key = norm(key); c = 0
    for i, ws in enumerate(C.CAPS):
        if k is not None and C.scene_of[i] != k: continue
        for w in ws:
            nw = norm(w['w'])
            if (nw == key) if exact else nw.startswith(key):
                c += 1
                if c == nth: return round(w['s'], 3)
    return None

def build(C):
    R = C.E['real']; ev = {}
    for name, spec in R.get('events', {}).items():
        k, key, nth = spec[0], spec[1], (spec[2] if len(spec) > 2 else 1)
        v = find(C, k, key, nth)
        if v is None: raise KeyError(f'event {name}: "{key}" #{nth} not spoken in scene {k}')
        ev[name] = v
    last = C.NSC - 1; cta = C.E.get('cta', {})
    for name, word in (('cta_a', cta.get('a', 'yes')), ('cta_b', cta.get('b', 'no')), ('cta_sub', 'subscribe')):
        ev.setdefault(name, find(C, last, word, 1, exact=True) or find(C, last, word) or C.DUR - 1.5)
    ev.setdefault('cta', min(w['s'] for i, ws in enumerate(C.CAPS) if C.scene_of[i] == last for w in ws))
    os.makedirs(C.prj, exist_ok=True)
    json.dump({'ev': ev, 'dur': C.DUR, 'caps': C.CAPS, 'real': R, 'cta': cta, 'hook': C.E.get('hook', [])}, open(f'{C.prj}/ev.json', 'w'))
    cues = []
    for name, off, sfx, gain in R.get('cues', []):
        if sfx not in SFX: print(f'  (cue {sfx} unknown to score_cine.mjs, skipped)'); continue
        if name in ev: cues.append((ev[name] + off, sfx, gain))
    return '', '', cues
