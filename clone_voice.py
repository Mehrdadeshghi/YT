#!/usr/bin/env python3
"""Voice cloning with Chatterbox (Resemble AI, MIT licence): speaks any text in the voice of a short reference recording.

    python3 clone_voice.py test assets/voice/ref.wav "line one" "line two" ...   -> dist/clone/clone_XX.wav + timing log
    from clone_voice import Cloner; c = Cloner(ref); samples, sr = c.create(text, speed=1.15)

The reference only gives the timbre; pronunciation comes from the model, so the accent of the speaker matters little.
speed > 1 is applied afterwards with ffmpeg atempo (keeps the pitch)."""
import os, subprocess, sys, tempfile, time
import numpy as np, soundfile as sf

class Cloner:
    def __init__(self, ref, lang='en'):
        import torch
        self.ref, self.lang = ref, lang
        dev = 'cuda' if torch.cuda.is_available() else 'cpu'
        local = os.environ.get('CHATTERBOX_DIR')          # local copy of the weights (release model-chatterbox) instead of Hugging Face
        if lang == 'en':
            from chatterbox.tts import ChatterboxTTS
            self.m = ChatterboxTTS.from_local(local, device=dev) if local else ChatterboxTTS.from_pretrained(device=dev)
        else:
            from chatterbox.mtl_tts import ChatterboxMultilingualTTS
            self.m = ChatterboxMultilingualTTS.from_pretrained(device=dev)
    def create(self, text, voice=None, speed=1.0, lang=None, exaggeration=0.55, cfg=0.45):
        kw = dict(audio_prompt_path=self.ref, exaggeration=exaggeration, cfg_weight=cfg)
        if self.lang != 'en': kw['language_id'] = self.lang
        w = self.m.generate(text, **kw).squeeze().cpu().numpy().astype('float32'); sr = self.m.sr
        if abs(speed - 1) > 0.01:
            with tempfile.TemporaryDirectory() as d:
                a, b = f'{d}/a.wav', f'{d}/b.wav'; sf.write(a, w, sr)
                subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', a, '-filter:a', f'atempo={speed:.3f}', b], check=True)
                w, sr = sf.read(b, dtype='float32')
        return w, sr

if __name__ == '__main__' and sys.argv[1] == 'test':
    ref, lines = sys.argv[2], sys.argv[3:]
    os.makedirs('dist/clone', exist_ok=True); t0 = time.time(); c = Cloner(ref); print(f'model loaded in {time.time() - t0:.0f}s', flush=True)
    for i, ln in enumerate(lines):
        t1 = time.time(); w, sr = c.create(ln, speed=float(os.environ.get('CLONE_SPEED', '1.15')))
        sf.write(f'dist/clone/clone_{i:02d}.wav', w, sr, subtype='PCM_16')
        print(f'{i:02d} {len(w) / sr:5.2f}s audio in {time.time() - t1:5.1f}s  | {ln}', flush=True)
    subprocess.run('ffmpeg -y -loglevel error ' + ' '.join(f'-i dist/clone/clone_{i:02d}.wav' for i in range(len(lines))) +
                   f' -filter_complex "concat=n={len(lines)}:v=0:a=1" dist/clone/all.m4a', shell=True, check=True)
