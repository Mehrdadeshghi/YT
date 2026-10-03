#!/usr/bin/env python3
"""Spanish audio track for YouTube multi-language audio.

    python3 dub_es.py 079        (after render.mjs + finish.sh wrote out/ep079/cues.json)

Every voice-over segment in episodes/<ep>.json may carry an "es" text. Each Spanish line is synthesized with
Kokoro (ef_dora, house tempo 1.3) and fitted into the English slot (until the next line starts; speed goes up to
1.7 if needed). Music and sound effects are the same as the English mix. Output: dist/wiki_roulette_<ep>_es.m4a,
exactly as long as the video, ready to upload as the "Spanish" audio track in YouTube Studio.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

ep = sys.argv[1]
TTS = os.environ.get('TTS_DIR', 'models')
E = json.load(open(f'episodes/{ep}.json'))
segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
if not all(s.get('es') for s in segs):
    print(f'{ep}: no Spanish text on every segment, skipping'); sys.exit(0)
src, dst = f'out/ep{ep}', f'out/ep{ep}_es'
os.makedirs(f'{dst}/vo', exist_ok=True)
M = json.load(open(f'{src}/cues.json'))
vos = [c for c in M['cues'] if c['type'] == 'vo' and c.get('p')]
assert len(vos) == len(segs), (len(vos), len(segs))
k = Kokoro(f'{TTS}/kokoro-v1.0.onnx', f'{TTS}/voices-v1.0.bin')
VOICE, BASE = E.get('voice_es', 'ef_dora'), float(E.get('speed', 1.3))

def synth(text, slot):
    sp = BASE
    for _ in range(8):
        s, sr = k.create(text, voice=VOICE, speed=sp, lang='es')
        nz = np.where(np.abs(s) > 0.01)[0]
        if len(nz): s = s[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
        d = len(s) / sr
        if d <= slot or sp >= 1.7: break
        sp = min(1.7, sp * (1 + (d / slot - 1) * 0.9) + 0.02)
    return s, sr, d, sp

for i, (c, sg) in enumerate(zip(vos, segs)):
    nxt = vos[i + 1]['t'] if i + 1 < len(vos) else M['dur'] - 0.3
    slot = max(0.6, nxt - c['t'] - 0.08)
    s, sr, d, sp = synth(sg['es'], slot)
    f = f'{dst}/vo/{i:02d}.wav'; sf.write(f, s, sr, subtype='PCM_16'); c['p'] = f
    print(f'{ep} es {i:02d} {d:5.2f}s / slot {slot:5.2f}s  speed {sp:.2f}' + ('  (over)' if d > slot + 0.05 else ''))
json.dump(M, open(f'{dst}/cues.json', 'w'), indent=1)
subprocess.run(['node', os.environ.get('SCORE', 'score_cine.mjs'), dst], check=True)
os.makedirs('dist', exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{dst}/score.wav', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-ar', '48000',
                '-c:a', 'aac', '-b:a', '192k', f'dist/wiki_roulette_{ep}_es.m4a'], check=True)
print('wrote', f'dist/wiki_roulette_{ep}_es.m4a')
