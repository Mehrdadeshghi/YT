#!/usr/bin/env python3
"""Checks a real-footage episode before it is pushed for rendering (no voice needed):
    python3 scripts/real_check.py 226
Fails loudly on: missing fields, segments without de/es/fr, unknown event names in shots/stamps/labels/cues, event words that don't
appear in the caption of their scene, spans outside a source, non-free or missing Commons files, missing upload text."""
import json, os, re, sys, urllib.parse, urllib.request
EP = sys.argv[1].zfill(3); os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
E = json.load(open(f'episodes/{EP}.json')); errs = []
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
for k in ('title', 'hook', 'cta', 'vo_open', 'scenes', 'photos', 'real', 'voice'):
    if k not in E: errs.append(f'missing "{k}"')
if E.get('hf', {}).get('custom') != 'hf_real': errs.append('"hf" must be {"style": "doku", "custom": "hf_real"}')
segs = list(E.get('vo_open', [])) + [v for sc in E.get('scenes', []) for v in sc.get('vo', [])]
for i, s in enumerate(segs):
    for l in ('text', 'cap', 'de', 'es', 'fr'):
        if not s.get(l): errs.append(f'segment {i}: no "{l}"')
if not segs or not segs[-1].get('cta'): errs.append('last segment needs "cta": true')
scene_words = [sum(([norm(w) for w in s.get('cap', '').replace('*', '').split()] for s in E.get('vo_open', [])), [])] + [sum(([norm(w) for w in v.get('cap', '').replace('*', '').split()] for v in sc.get('vo', [])), []) for sc in E.get('scenes', [])]
R = E.get('real', {}); ev = R.get('events', {})
for name, spec in ev.items():
    k, key, nth = spec[0], norm(spec[1]), (spec[2] if len(spec) > 2 else 1)
    if k >= len(scene_words) or sum(w.startswith(key) for w in scene_words[k]) < nth: errs.append(f'event {name}: "{spec[1]}" #{nth} not in the caption of scene {k}')
known = set(ev) | {'cta', 'cta_a', 'cta_b', 'cta_sub'}
def tchk(x, where):
    if isinstance(x, (int, float)) or x == 'end': return
    m = re.match(r'^([a-z0-9_]+)([+-][\d.]+)?$', str(x), re.I)
    if not m or m.group(1) not in known: errs.append(f'{where}: unknown time "{x}"')
cta = E.get('cta', {})
for w in (cta.get('a', ''), cta.get('b', '')):
    if norm(w) not in scene_words[-1]: errs.append(f'CTA answer "{w}" is not spoken in the last scene')
spans = R.get('spans', []); srcs = R.get('sources', [])
for i, s in enumerate(R.get('shots', [])):
    tchk(s.get('from'), f'shot {i}'); tchk(s.get('to'), f'shot {i}')
    if s.get('span', 99) >= len(spans): errs.append(f'shot {i}: no span {s.get("span")}')
    else:
        sp = spans[s['span']]; L = (sp['to'] - sp['from']) * sp.get('slow', 1)
        if not (0 <= s['at'][0] < s['at'][1] <= L + 1e-6): errs.append(f'shot {i}: "at" {s["at"]} outside its span (0..{L:.2f})')
for kind in ('stamps', 'labels'):
    for i, s in enumerate(R.get(kind, [])): tchk(s.get('from'), f'{kind} {i}'); tchk(s.get('to'), f'{kind} {i}')
for c in R.get('cues', []):
    if c[0] not in known: errs.append(f'cue on unknown event {c[0]}')
for i, sp in enumerate(spans):
    if sp.get('src', 99) >= len(srcs): errs.append(f'span {i}: no source {sp.get("src")}')
d = None
if srcs:
    u = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=extmetadata|size&format=json&titles=' + urllib.parse.quote('|'.join(srcs))
    try: d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'WikiRouletteBot/1.0 (github.com/Mehrdadeshghi/YT)'}), timeout=60))
    except Exception as ex: print(f'  (Commons not reachable here: {ex}; licences are checked again by realclip.py in CI)')
    for p in (d['query']['pages'].values() if d else []):
        if 'imageinfo' not in p: errs.append(f'Commons file not found: {p.get("title")}'); continue
        lic = p['imageinfo'][0]['extmetadata'].get('LicenseShortName', {}).get('value', '')
        dur = p['imageinfo'][0].get('duration')
        ok = any(x in lic.lower() for x in ('public domain', 'cc0', 'cc by', 'cc-by', 'pdm'))
        print(f'  source {p["title"]}: {lic}, {dur and round(dur, 1)} s')
        if not ok: errs.append(f'{p["title"]}: licence "{lic}" not free enough')
        if dur:
            for i, sp in enumerate(spans):
                if srcs[sp['src']] .replace('_', ' ') == p['title'] and sp['to'] > dur + .01: errs.append(f'span {i} ends at {sp["to"]} s, file is {dur:.1f} s')
if not os.path.exists(f'uploads/{EP}.md'): errs.append(f'uploads/{EP}.md missing')
elif 'Commons' not in open(f'uploads/{EP}.md').read(): errs.append(f'uploads/{EP}.md: credit the footage (Wikimedia Commons file + licence)')
if f'#{EP} ' not in open('docs/topics.md').read(): errs.append('docs/topics.md: add a line "#<ep> <topic> (facts)"')
print('\n'.join('ERROR ' + e for e in errs) or f'#{EP}: ok')
sys.exit(1 if errs else 0)
