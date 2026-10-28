#!/usr/bin/env python3
"""QA of the final mp4: probe, loudness, contact sheet of frames at given times, Whisper transcript.
    python qa.py VIDEO OUT_SHEET.jpg t1,t2,...  """
import json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw

v, out, ts = sys.argv[1], sys.argv[2], [float(x) for x in sys.argv[3].split(',')]
run = lambda *a: subprocess.run(a, capture_output=True, text=True)
print(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,r_frame_rate', '-of', 'compact', v).stdout)
e = run('ffmpeg', '-i', v, '-af', 'ebur128=peak=true', '-f', 'null', '-').stderr
print('\n'.join(l.strip() for l in e.splitlines()[-12:] if 'I:' in l or 'Peak:' in l or 'LRA:' in l))
tmp = tempfile.mkdtemp(dir=os.environ.get('TMPDIR'))
ims = []
for t in ts:
    p = f'{tmp}/f{t:.2f}.png'
    run('ffmpeg', '-v', 'error', '-ss', f'{t}', '-i', v, '-frames:v', '1', '-vf', 'scale=270:480', p)
    ims.append(Image.open(p).convert('RGB'))
cols = min(6, len(ims)); rows = -(-len(ims) // cols)
c = Image.new('RGB', (cols * 274, rows * 504), (40, 40, 40)); d = ImageDraw.Draw(c)
for i, im in enumerate(ims):
    x, y = (i % cols) * 274, (i // cols) * 504; c.paste(im, (x, y + 22)); d.text((x + 4, y + 4), f'{ts[i]:.2f}s', fill='white')
c.save(out, quality=88)
if '--asr' in sys.argv:
    import soundfile as sf
    w = f'{tmp}/a.wav'; run('ffmpeg', '-v', 'error', '-i', v, '-ac', '1', '-ar', '16000', w)
    from faster_whisper import WhisperModel
    a, _ = sf.read(w, dtype='float32')
    segs, _ = WhisperModel(os.environ.get('WHISPER', 'models/whisper'), device='cpu', compute_type='int8').transcribe(a, language='en')
    print('ASR:', ' '.join(s.text.strip() for s in segs))
