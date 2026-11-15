#!/usr/bin/env python3
"""Real-footage Shorts (house style since 9.11.2026): cut the footage an episode lists into one web video.

episodes/<ep>.json → "real": {"sources": ["File:Some clip.ogv", ...], "spans": [{"src": 0, "from": 58.8, "to": 67.5, "slow": 2}, ...]}
→ hf/<ep>/clip.webm (30 fps, VP9; "slow": 2 = twice as slow with motion-interpolated in-between frames) + hf/<ep>/clip.json (where each span starts in the clip).
Footage must be free (public domain / CC) and comes from Wikimedia Commons (credits in uploads/<ep>.md).
    python3 scripts/realclip.py 226
"""
import json, os, subprocess, sys, time, urllib.parse, urllib.request
EP = sys.argv[1].zfill(3)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
R = json.load(open(f'episodes/{EP}.json'))['real']
os.makedirs(f'hf/{EP}/src', exist_ok=True)
# licence gate: only free files (public domain, CC0, CC BY, CC BY-SA)
_u = 'https://commons.wikimedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=extmetadata&titles=' + urllib.parse.quote('|'.join(R['sources']))
for _p in json.load(urllib.request.urlopen(urllib.request.Request(_u, headers={'User-Agent': 'WikiRouletteBot/1.0 (github.com/Mehrdadeshghi/YT)'}), timeout=60))['query']['pages'].values():
    _lic = _p.get('imageinfo', [{}])[0].get('extmetadata', {}).get('LicenseShortName', {}).get('value', '')
    if not any(x in _lic.lower() for x in ('public domain', 'cc0', 'cc by', 'cc-by', 'pdm')): sys.exit(f'{_p.get("title")}: licence "{_lic}" not free, stopping')
files = []
for i, f in enumerate(R['sources']):
    dst = f'hf/{EP}/src/{i}' + os.path.splitext(f)[1].lower()
    if not os.path.exists(dst):
        url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(f.removeprefix('File:'))
        for attempt in range(4):
            try:
                data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'WikiRouletteBot/1.0 (github.com/Mehrdadeshghi/YT)'}), timeout=300).read()
                open(dst, 'wb').write(data); break
            except Exception as ex:
                print('download retry', f, ex); time.sleep(20 * (attempt + 1))
        else: sys.exit(f'could not download {f}')
    files.append(dst)
parts, starts, t = [], [], 0.0
for k, s in enumerate(R['spans']):
    slow = float(s.get('slow', 1)); d = (s['to'] - s['from']) * slow
    f = f"[{s['src']}:v]trim=start={s['from']}:end={s['to']},setpts={slow}*(PTS-STARTPTS),scale=1280:-2,"
    f += ('minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1' if slow > 1 else 'fps=30') + f'[v{k}]'
    parts.append(f); starts.append(round(t, 3)); t += d
fc = ';'.join(parts) + ';' + ''.join(f'[v{k}]' for k in range(len(parts))) + f'concat=n={len(parts)}:v=1:a=0[o]'
cmd = ['ffmpeg', '-v', 'error', '-y'] + sum([['-i', f] for f in files], []) + ['-filter_complex', fc, '-map', '[o]', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-g', '15', '-an', f'hf/{EP}/clip.webm']
subprocess.run(cmd, check=True)
json.dump({'starts': starts, 'dur': round(t, 3)}, open(f'hf/{EP}/clip.json', 'w'))
print(f'#{EP}: clip.webm {t:.1f} s, span starts {starts}')
