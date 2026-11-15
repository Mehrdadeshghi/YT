#!/usr/bin/env python3
"""Research helper for the daily cloud routine, which can't reach Wikimedia itself: GitHub Actions runs this and commits the results.

research/<ep>.json = {"commons_search": ["airbag test", ...], "commons_files": ["File:X.ogv", ...], "wiki": ["Airbag", ...]}
→ research/<ep>/search.md   (video hits per query: file, licence, duration, size)
→ research/<ep>/wiki_<title>.txt (plain article text, for fact checks)
→ research/<ep>/files.md + sheet_<i>_<k>.jpg (per file: licence, size, duration; contact sheets 1 frame/s with the source second burnt in)
"""
import json, os, re, subprocess, sys, urllib.parse, urllib.request
EP = sys.argv[1].zfill(3); os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
Q = json.load(open(f'research/{EP}.json')); OUT = f'research/{EP}'; os.makedirs(OUT, exist_ok=True)
UA = {'User-Agent': 'WikiRouletteBot/1.0 (github.com/Mehrdadeshghi/YT)'}
get = lambda u: json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60))
API = 'https://commons.wikimedia.org/w/api.php?format=json&'
def info(titles):
    d = get(API + 'action=query&prop=imageinfo&iiprop=extmetadata|size|url&titles=' + urllib.parse.quote('|'.join(titles)))
    out = {}
    for p in d['query']['pages'].values():
        if 'imageinfo' not in p: continue
        ii = p['imageinfo'][0]; m = ii['extmetadata']
        out[p['title']] = dict(lic=m.get('LicenseShortName', {}).get('value', '?'), dur=ii.get('duration'), w=ii.get('width'), h=ii.get('height'), url=ii.get('url'), artist=re.sub('<[^>]+>', '', m.get('Artist', {}).get('value', ''))[:80])
    return out
if Q.get('commons_search'):
    md = []
    for s in Q['commons_search']:
        d = get(API + 'action=query&list=search&srnamespace=6&srlimit=20&srsearch=' + urllib.parse.quote(s + ' filetype:video'))
        titles = [x['title'] for x in d['query']['search']]
        inf = info(titles) if titles else {}
        md.append(f'## {s}\n' + ('\n'.join(f'- {t} | {i["lic"]} | {i["dur"] and round(i["dur"])} s | {i["w"]}x{i["h"]} | {i["artist"]}' for t, i in inf.items()) or '- (no video hits)'))
    open(f'{OUT}/search.md', 'w').write('\n\n'.join(md) + '\n')
for t in Q.get('wiki', []):
    d = get('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&redirects=1&titles=' + urllib.parse.quote(t))
    txt = next(iter(d['query']['pages'].values())).get('extract', '(not found)')
    open(f'{OUT}/wiki_{re.sub(r"[^A-Za-z0-9]+", "_", t)}.txt', 'w').write(txt)
if Q.get('commons_files'):
    inf = info(Q['commons_files']); md = []
    for i, f in enumerate(Q['commons_files']):
        it = inf.get(f.replace('_', ' '))
        if not it: md.append(f'- {i}: {f} NOT FOUND'); continue
        src = f'/tmp/src{i}'; open(src, 'wb').write(urllib.request.urlopen(urllib.request.Request(it['url'], headers=UA), timeout=300).read())
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout or 0)
        md.append(f'- {i}: {f} | {it["lic"]} | {dur:.1f} s | {it["w"]}x{it["h"]} | {it["artist"]} → sheet_{i}_*.jpg (1 frame/s, source second in yellow)')
        FONT = next((f for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf') if os.path.exists(f)), None)
        for k in range(0, int(dur) + 1, 30):
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(k), '-t', '30', '-i', src, '-vf', "fps=1,scale=320:-1,drawtext=" + (f"fontfile={FONT}:" if FONT else "") + "text='%{eif\\:t+" + str(k) + "\\:d}s':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black", '-frames:v', '30', f'/tmp/s{i}_%02d.jpg'], check=False)
            fr = sorted(x for x in os.listdir('/tmp') if x.startswith(f's{i}_'))
            if fr: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'/tmp/s{i}_%02d.jpg', '-vf', 'tile=6x5', '-frames:v', '1', f'{OUT}/sheet_{i}_{k:04d}.jpg'], check=False)
            for x in fr: os.remove('/tmp/' + x)
    open(f'{OUT}/files.md', 'w').write('\n'.join(md) + '\n')
print(f'research {EP}: done →', sorted(os.listdir(OUT)))
