#!/usr/bin/env python3
"""Final check of a rendered episode in one step (keeps agents' context small):

    .venv/bin/python scripts/check_final.py 191 [shorts-N]     (default: newest release containing the mp4)

Downloads mp4 + md + dub tracks into /home/meshg/sandbox/wr_deliver/<ep>/, then prints a SHORT report:
duration, Whisper transcript vs. script (word diff: missing / extra words), dub tracks (duration, mean volume,
silences > 2 s), and writes one frame strip (6 frames) to wr_deliver/<ep>/strip.png — look at that ONE image.
"""
import difflib, json, os, re, subprocess, sys
import numpy as np

ep = sys.argv[1].zfill(3)
REPO = 'Mehrdadeshghi/YT'
DST = f'/home/meshg/sandbox/wr_deliver/{ep}'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
run = lambda *a, **k: subprocess.run(a, capture_output=True, text=True, **k)

rel = sys.argv[2] if len(sys.argv) > 2 else None
if not rel:
    for r in json.loads(run('gh', 'release', 'list', '-R', REPO, '-L', '40', '--json', 'tagName').stdout):
        names = run('gh', 'release', 'view', r['tagName'], '-R', REPO, '--json', 'assets', '-q', '.assets[].name').stdout.split()
        if f'wiki_roulette_{ep}.mp4' in names: rel = r['tagName']; break
if not rel: sys.exit(f'no release with wiki_roulette_{ep}.mp4')
os.makedirs(DST, exist_ok=True)
run('gh', 'release', 'download', rel, '-R', REPO, '-D', DST, '--clobber', '-p', f'wiki_roulette_{ep}*')
mp4 = f'{DST}/wiki_roulette_{ep}.mp4'
dur = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4).stdout)
print(f'#{ep} {rel}: {dur:.1f} s')

E = json.load(open(f'{ROOT}/episodes/{ep}.json'))
segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
script = ' '.join(s['text'] for s in segs)
pcm = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                                   capture_output=True, check=True).stdout, np.int16).astype(np.float32) / 32768
from faster_whisper import WhisperModel
m = WhisperModel(f'{ROOT}/models/whisper', device='cpu', compute_type='int8')
heard = ' '.join(x.text.strip() for x in m.transcribe(pcm, language='en', beam_size=5)[0])
norm = lambda s: [re.sub(r'[^a-z0-9]', '', w.lower()) for w in s.split() if re.sub(r'[^a-z0-9]', '', w.lower())]
a, b = norm(script), norm(heard)
diffs = [(op, ' '.join(a[i1:i2]), ' '.join(b[j1:j2])) for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op != 'equal']
print('transcript:', heard)
print('diff (script → heard):', '; '.join(f'{op}: "{x}" → "{y}"' for op, x, y in diffs) or 'none')

for L in ('de', 'es', 'fr'):
    f = f'{DST}/wiki_roulette_{ep}_{L}.m4a'
    if not os.path.exists(f): print(f'{L}: missing'); continue
    d = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f).stdout)
    vol = re.search(r'mean_volume: (\S+)', run('ffmpeg', '-i', f, '-af', 'volumedetect', '-f', 'null', '-').stderr)
    sil = run('ffmpeg', '-i', f, '-af', 'silencedetect=n=-45dB:d=2', '-f', 'null', '-').stderr.count('silence_start')
    print(f'{L}: {d:.1f} s, mean {vol.group(1) if vol else "?"} dB, silences>2s: {sil}')

tmp = f'{DST}/.frames'; os.makedirs(tmp, exist_ok=True)
ts = [0.3] + [dur * k / 6 for k in range(1, 5)] + [dur - 1.0]
for i, t in enumerate(ts):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', mp4, '-frames:v', '1', '-vf', 'scale=360:-1', f'{tmp}/{i}.png'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', *sum([['-i', f'{tmp}/{i}.png'] for i in range(6)], []), '-filter_complex', 'hstack=6', f'{DST}/strip.png'], check=True)
print('frames at', ', '.join(f'{t:.1f}s' for t in ts), '→', f'{DST}/strip.png')
