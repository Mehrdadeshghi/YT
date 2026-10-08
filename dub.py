#!/usr/bin/env python3
"""Extra audio tracks for YouTube multi-language audio.

    python3 dub.py 079        (after render.mjs + finish.sh wrote out/ep079/cues.json)

Every voice-over segment in episodes/<ep>.json may carry texts in other languages ("es", "en", ...). For each
language that is present on EVERY segment (and is not the episode's own language) the lines are synthesized with
Kokoro (German: Piper Thorsten; house tempo 1.3) and fitted into the original slot (until the next line starts; speed goes up to 1.7 if
needed). Music and sound effects are the same as the main mix. Output: dist/wiki_roulette_<ep>_<lang>.m4a, exactly
as long as the video, ready to upload as an extra audio track in YouTube Studio.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

ep = sys.argv[1]
TTS = os.environ.get('TTS_DIR', 'models')
E = json.load(open(f'episodes/{ep}.json'))
segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
VOICES = {'es': ('ef_dora', 'es'), 'en': ('af_heart', 'en-us'), 'de': ('thorsten', 'de')}
langs = [L for L in VOICES if L != E.get('lang', 'en') and all(s.get(L) for s in segs)]
if not langs: print(f'{ep}: no dub texts on every segment, skipping'); sys.exit(0)
src = f'out/ep{ep}'
M0 = json.load(open(f'{src}/cues.json'))
vos0 = [i for i, c in enumerate(M0['cues']) if c['type'] == 'vo' and c.get('p')]
assert len(vos0) == len(segs), (len(vos0), len(segs))
KOK = Kokoro(f'{TTS}/kokoro-v1.0.onnx', f'{TTS}/voices-v1.0.bin')
BASE = float(E.get('speed_dub', 1.3))   # dubs always at the house tempo
CHIRP = E.get('voice') == 'chirp'      # human-like Google Chirp 3 HD dubs (audio from the "Chirp voices" workflow), only sped up if a line overruns its slot
if CHIRP:
    import chirp, tempfile
    BASE = 1.0
    class _ChirpDub:
        def __init__(self, L): self.v, self.r = chirp.voice_for(E, L)
        def create(self, text, voice=None, speed=1.0, lang=None):
            p = chirp.path(text, self.v, self.r)
            if not os.path.exists(p): sys.exit(f'missing {p}: run the Chirp voices workflow for episode {ep}')
            if abs(speed - 1) < 0.01: s, sr = sf.read(p, dtype='float32'); return (s if s.ndim == 1 else s.mean(1)), sr
            t = tempfile.mktemp(suffix='.wav'); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', p, '-filter:a', f'atempo={speed:.3f}', t], check=True)
            s, sr = sf.read(t, dtype='float32'); os.remove(t); return (s if s.ndim == 1 else s.mean(1)), sr

for L in langs:
    VOICE, KL = E.get(f'voice_{L}', VOICES[L][0]), VOICES[L][1]
    if CHIRP: k = _ChirpDub(L)
    elif L == 'de': import piper_de; k = piper_de.load(TTS)       # German: Piper Thorsten
    else: k = KOK
    dst = f'out/ep{ep}_{L}'; os.makedirs(f'{dst}/vo', exist_ok=True)
    M = json.loads(json.dumps(M0)); vos = [M['cues'][i] for i in vos0]

    def synth(text, slot):
        sp = BASE
        for _ in range(8):
            s, sr = k.create(text, voice=VOICE, speed=sp, lang=KL)
            nz = np.where(np.abs(s) > 0.01)[0]
            if len(nz): s = s[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
            d = len(s) / sr
            if d <= slot or sp >= (1.4 if CHIRP else 1.7): break
            sp = min(1.4 if CHIRP else 1.7, sp * (1 + (d / slot - 1) * 0.9) + 0.02)
        return s, sr, d, sp

    for i, (c, sg) in enumerate(zip(vos, segs)):
        nxt = vos[i + 1]['t'] if i + 1 < len(vos) else M['dur'] - 0.3
        slot = max(0.6, nxt - c['t'] - 0.08)
        s, sr, d, sp = synth(sg[L], slot)
        f = f'{dst}/vo/{i:02d}.wav'; sf.write(f, s, sr, subtype='PCM_16'); c['p'] = f
        print(f'{ep} {L} {i:02d} {d:5.2f}s / slot {slot:5.2f}s  speed {sp:.2f}' + ('  (over)' if d > slot + 0.05 else ''))
    json.dump(M, open(f'{dst}/cues.json', 'w'), indent=1)
    subprocess.run(['node', os.environ.get('SCORE', 'score_cine.mjs'), dst], check=True)
    os.makedirs('dist', exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{dst}/score.wav', '-af', 'loudnorm=I=-14:TP=-1:LRA=11', '-ar', '48000',
                    '-c:a', 'aac', '-b:a', '192k', f'dist/wiki_roulette_{ep}_{L}.m4a'], check=True)
    print('wrote', f'dist/wiki_roulette_{ep}_{L}.m4a')
