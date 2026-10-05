#!/usr/bin/env python3
"""Voice cloning with Chatterbox (Resemble AI, MIT licence): speaks any text in the voice of a short reference recording.

Quality + prosody rules (see README "Voice"):
- reference: the cleanest ~10 s of the recording (Chatterbox conditions on the first ~10 s only), lightly denoised
- expressive settings: exaggeration 0.55-0.8 (bigger pitch accents / F0 range), cfg_weight ~0.3 (natural pacing)
- several takes per line, keep the one with the most plausible length and no long silences (no hallucinated tails)
- broadcast voice chain: high-pass, de-mud, presence + air, de-esser, compressor, limiter
- tempo only lightly adjusted (atempo <= 1.1) so the voice stays natural
"""
import os, re, subprocess, sys, tempfile, time
import numpy as np, soundfile as sf

CHAIN = ('highpass=f=75,equalizer=f=250:t=q:w=1.2:g=-2.5,equalizer=f=3400:t=q:w=1.0:g=3,'
         'highshelf=f=9000:g=2,deesser=i=0.35,acompressor=threshold=-20dB:ratio=3:attack=4:release=90:makeup=2,'
         'alimiter=limit=0.9')

def _ff(w, sr, filt):
    with tempfile.TemporaryDirectory() as d:
        a, b = f'{d}/a.wav', f'{d}/b.wav'; sf.write(a, w, sr)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', a, '-filter:a', filt, b], check=True)
        return sf.read(b, dtype='float32')

def _score(w, sr, text):
    """lower is better: deviation from expected length (~14.5 chars/s at natural pace) + penalty for long silences"""
    nz = np.abs(w) > 0.02; fr = int(0.02 * sr); n = len(w) // fr
    act = np.array([nz[i * fr:(i + 1) * fr].mean() > 0.05 for i in range(n)])
    run = longest = 0
    for a in act: run = 0 if a else run + 1; longest = max(longest, run)
    exp = max(0.8, len(re.sub(r'[^A-Za-z0-9]', '', text)) / 14.5)
    return abs(len(w) / sr - exp) / exp + 2.0 * max(0, longest * 0.02 - 0.45)

def squeeze_pauses(w, sr, keep=0.18, thr_db=-38):
    """house tempo: shorten every pause longer than `keep` seconds to `keep` (no dead air, rhythm stays natural)"""
    fr = int(0.01 * sr); n = len(w) // fr
    if n == 0: return w
    peak = np.max(np.abs(w)) + 1e-9
    quiet = np.array([20 * np.log10(np.sqrt(np.mean(w[i * fr:(i + 1) * fr] ** 2)) / peak + 1e-9) < thr_db for i in range(n)])
    out, i, K = [], 0, int(keep / 0.01)
    while i < n:
        j = i
        while j < n and quiet[j] == quiet[i]: j += 1
        seg = w[i * fr:j * fr]
        if quiet[i] and (j - i) > K: seg = np.concatenate([seg[:K // 2 * fr], seg[-(K - K // 2) * fr:]])
        out.append(seg); i = j
    out.append(w[n * fr:]); return np.concatenate(out)

def fit_tempo(w, sr, target, max_speed=1.35):
    """squeeze pauses, then speed up (pitch kept) so the line lasts about `target` seconds"""
    w = squeeze_pauses(w, sr)
    nz = np.where(np.abs(w) > 0.01)[0]
    if len(nz): w = w[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
    sp = min(max_speed, max(1.0, (len(w) / sr) / target))
    if sp > 1.01: w, sr = _ff(w, sr, f'atempo={sp:.3f}')
    return w, sr

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
        self.takes = int(os.environ.get('CLONE_TAKES', '3'))
    def create(self, text, voice=None, speed=1.0, lang=None, exaggeration=None, cfg=0.3):
        ex = exaggeration if exaggeration is not None else (0.75 if ('?' in text or '!' in text) else 0.6)
        best = None
        for k in range(self.takes):
            kw = dict(audio_prompt_path=self.ref, exaggeration=ex, cfg_weight=cfg)
            if self.lang != 'en': kw['language_id'] = self.lang
            w = self.m.generate(text, **kw).squeeze().cpu().numpy().astype('float32'); sr = self.m.sr
            sc = _score(w, sr, text)
            if best is None or sc < best[0]: best = (sc, w)
            if sc < 0.12: break                      # good enough, skip further takes
        w = best[1]
        filt = CHAIN + (f',atempo={min(1.1, speed):.3f}' if abs(speed - 1) > 0.01 else '')
        return _ff(w, sr, filt)

def expand_pitch(w, sr, factor=1.85, floor=65, ceil=420):
    """livelier intonation: every pitch point moves away from the speaker's median by `factor` (in semitones), PSOLA resynthesis.
    Voice conversion flattens the source melody (~10 -> ~6 semitones); engaging narrators use ~14 st (5-95 % range)."""
    import parselmouth
    from parselmouth.praat import call
    snd = parselmouth.Sound(np.asarray(w, dtype='float64'), sr)
    manip = call(snd, "To Manipulation", 0.01, floor, ceil)
    tier = call(manip, "Extract pitch tier")
    med = call(snd.to_pitch(0.01, floor, ceil), "Get quantile", 0, 0, 0.5, "Hertz")
    call(tier, "Formula", f"{med} * (self / {med}) ^ {factor}")
    call([tier, manip], "Replace pitch tier")
    return call(manip, "Get resynthesis (overlap-add)").values[0].astype('float32')

class NativeCloner:
    """Native American-English pronunciation in Mehrdad's voice colour: Kokoro speaks the line at house tempo,
    then Chatterbox voice conversion swaps only the timbre to the reference recording, then the intonation is widened
    (expand_pitch) because conversion flattens it. Source am_echo = the most melodic Kokoro male voice (18 st raw range)."""
    def __init__(self, ref, source='am_echo', expr=1.85):
        from kokoro_onnx import Kokoro
        from chatterbox.vc import ChatterboxVC
        tts = os.environ.get('TTS_DIR', 'models'); local = os.environ.get('CHATTERBOX_DIR')
        self.k = Kokoro(f'{tts}/kokoro-v1.0.onnx', f'{tts}/voices-v1.0.bin'); self.src = source; self.ref = ref; self.expr = expr
        self.vc = ChatterboxVC.from_local(local, device='cpu') if local else ChatterboxVC.from_pretrained(device='cpu')
    def create(self, text, voice=None, speed=1.3, lang='en-us'):
        s, sr = self.k.create(text, voice=self.src, speed=speed, lang='en-us')
        with tempfile.TemporaryDirectory() as d:
            a = f'{d}/a.wav'; sf.write(a, s, sr)
            w = self.vc.generate(a, target_voice_path=self.ref).squeeze().cpu().numpy().astype('float32')
        if self.expr and abs(self.expr - 1) > 0.01: w = expand_pitch(w, self.vc.sr, self.expr)
        w = squeeze_pauses(w, self.vc.sr)
        return _ff(w, self.vc.sr, CHAIN)

if __name__ == '__main__' and sys.argv[1] == 'test':
    ref, lines = sys.argv[2], sys.argv[3:]
    out = os.environ.get('CLONE_OUT', 'dist/clone'); os.makedirs(out, exist_ok=True); t0 = time.time(); c = Cloner(ref); print(f'model loaded in {time.time() - t0:.0f}s', flush=True)
    for i, ln in enumerate(lines):
        t1 = time.time(); w, sr = c.create(ln, speed=float(os.environ.get('CLONE_SPEED', '1.05')))
        sf.write(f'{out}/clone_{i:02d}.wav', w, sr, subtype='PCM_16')
        print(f'{i:02d} {len(w) / sr:5.2f}s audio in {time.time() - t1:5.1f}s  | {ln}', flush=True)
