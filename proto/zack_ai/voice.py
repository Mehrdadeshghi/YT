#!/usr/bin/env python3
"""Preview voice for the Zack prototype: Kokoro (local, am_michael) + faster-whisper word timings.
    .venv/bin/python proto/zack_ai/voice.py scripts/zack/molasses.txt proto/zack_ai/assets/vo.wav [voice] [speed]
→ vo.wav + vo.words.json [{w, s, e}]"""
import json, os, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

txt, dst = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else 'am_michael'
speed = float(sys.argv[4]) if len(sys.argv) > 4 else 1.25
M = os.environ.get('TTS_DIR', 'models')
os.makedirs(os.path.dirname(dst), exist_ok=True)
k = Kokoro(f'{M}/kokoro-v1.0.onnx', f'{M}/voices-v1.0.bin')
text = open(txt).read().strip()
# sentence by sentence with short gaps: Kokoro keeps better prosody on short inputs
import re
parts = [p for p in re.split(r'(?<=[.?!])\s+', text) if p]
sr = 24000; buf = []
for i, p in enumerate(parts):
    a, sr = k.create(p, voice=voice, speed=speed, lang='en-us')
    nz = np.nonzero(np.abs(a) > 0.01)[0]
    if len(nz): a = a[max(0, nz[0] - 600): nz[-1] + 1200]
    buf += [a, np.zeros(int(sr * 0.12), dtype=a.dtype)]
a = np.concatenate([np.zeros(int(sr * 0.05), dtype=buf[0].dtype)] + buf)
sf.write(dst, a, sr)

from faster_whisper import WhisperModel
import scipy.signal as ss
a16 = ss.resample_poly(a, 2, 3).astype(np.float32)
wm = WhisperModel(f'{M}/whisper', device='cpu', compute_type='int8')
segs, _ = wm.transcribe(a16, language='en', word_timestamps=True, initial_prompt=text)
W = [dict(w=w.word.strip(), s=round(w.start, 3), e=round(w.end, 3)) for s in segs for w in s.words]
json.dump(W, open(os.path.splitext(dst)[0] + '.words.json', 'w'), indent=0)
print(len(W), 'words,', round(len(a) / sr, 2), 's')
print(' '.join(w['w'] for w in W))
