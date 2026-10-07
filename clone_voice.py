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

def _heard(w, sr, text):
    """0..1: how much of the script Whisper hears in this take (catches mumbled / garbled names); 1 if Whisper is not installed"""
    try:
        import align, difflib
        if not align.available(): return 1.0
        with tempfile.TemporaryDirectory() as d:
            f = f'{d}/t.wav'; sf.write(f, w, sr); segs, _ = align.model().transcribe(f, language='en', beam_size=5)
            got = ' '.join(x.text for x in segs)
        n = lambda s: [align.norm(x) for x in s.replace('-', ' ').split() if align.norm(x)]
        return difflib.SequenceMatcher(None, n(text), n(got)).ratio()
    except Exception as e:
        print('heard check failed', e); return 1.0

# ---------- studio cleanup (DeepFilterNet3, local weights from release model-enhance) ----------
def df_dir():
    for d in (os.environ.get('DF_DIR'), 'models/DeepFilterNet3', '/home/claude/dfmodel/DeepFilterNet3'):
        if d and os.path.exists(os.path.join(d, 'config.ini')): return d
    return None
_DF = None
def denoise(w, sr):
    """neural noise/room removal at 48 kHz; returns (w48, 48000)"""
    global _DF
    import torch
    from df.enhance import enhance, init_df
    if _DF is None: _DF = init_df(model_base_dir=df_dir(), log_level='ERROR')[:2]
    if sr != 48000: w, sr = _ff(w, sr, 'aresample=48000')
    out = enhance(_DF[0], _DF[1], torch.from_numpy(np.asarray(w, dtype='float32'))[None])
    return out.squeeze(0).numpy().astype('float32'), 48000
def polish(w, sr):
    """clone output → remove the hiss/room the clone copied from a phone recording"""
    return denoise(w, sr)
def clean_ref(src, dst, start=None, end=None):
    """phone/WhatsApp recording → clean cloning reference: denoise, de-mud, presence + air, gentle compression, loudness"""
    with tempfile.TemporaryDirectory() as d:                     # any format (m4a/ogg/mp3 voice messages) → mono wav
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-ac', '1', f'{d}/s.wav'], check=True); w, sr = sf.read(f'{d}/s.wav', dtype='float32')
    if start is not None: w = w[int(start * sr): int(end * sr) if end else None]
    w, sr = denoise(w, sr)
    w, sr = _ff(w, sr, 'highpass=f=90,equalizer=f=250:t=q:w=1:g=-4,equalizer=f=2500:t=o:w=1.5:g=6,highshelf=f=6000:g=6,'
                       'acompressor=threshold=-22dB:ratio=2.5:attack=5:release=80,loudnorm=I=-18:TP=-2,aresample=24000')
    sf.write(dst, w, sr, subtype='PCM_16'); return dst

class Narrator:
    """Excited native sports-narrator voice (choice "2", Oct 2026): Chatterbox TTS conditioned on a synthetic Kokoro am_echo
    reference read with excitement (assets/voice/narrator_ref.wav). exaggeration 0.9 / cfg 0.35 / temperature 0.85 gives a
    ~25-30 st pitch range (engaging narrators: ~12-15 st; flat TTS: ~6 st). Not Mehrdad's voice - no conversion.
    Chatterbox speaks slowly (~140 wpm), so pauses are squeezed and the line is sped up (pitch kept) towards house tempo."""
    def __init__(self, ref='assets/voice/narrator_ref.wav', ex=0.9, cfg=0.35, temp=0.85, wpm=205, keep=0.14, max_speed=1.32, min_speed=1.0):
        import torch
        from chatterbox.tts import ChatterboxTTS
        local = os.environ.get('CHATTERBOX_DIR'); dev = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.m = ChatterboxTTS.from_local(local, device=dev) if local else ChatterboxTTS.from_pretrained(device=dev)
        self.ref, self.ex, self.cfg, self.temp, self.wpm, self.keep, self.maxsp, self.minsp = ref, ex, cfg, temp, wpm, keep, max_speed, min_speed
        self.takes = int(os.environ.get('CLONE_TAKES', '2'))
        self.polish = df_dir() is not None and os.environ.get('POLISH', '1') == '1'
    def create(self, text, voice=None, speed=None, lang=None):
        best = None
        for k in range(self.takes):
            w = self.m.generate(text, audio_prompt_path=self.ref, exaggeration=self.ex, cfg_weight=self.cfg,
                                temperature=self.temp).squeeze().cpu().numpy().astype('float32')
            sc = _score(w, self.m.sr, text) + 2.0 * (1 - _heard(w, self.m.sr, text))   # length + silences + did Whisper hear the script?
            if best is None or sc < best[0]: best = (sc, w)
            if sc < 0.3: break
        w, sr = best[1], self.m.sr
        w = squeeze_pauses(w, sr, keep=self.keep)              # kids: longer natural pauses (child-directed speech)
        nz = np.where(np.abs(w) > 0.01)[0]
        if len(nz): w = w[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
        words = len(re.findall(r"[A-Za-z0-9'-]+", text)); target = words / self.wpm * 60 + 0.12 * len(re.findall(r'[.!?,…;:]', text))
        sp = min(self.maxsp, max(self.minsp, (len(w) / sr) / max(0.5, target)))
        if self.polish: w, sr = polish(w, sr)
        return _ff(w, sr, CHAIN + (f',atempo={sp:.3f}' if abs(sp - 1) > 0.01 else ''))

if __name__ == '__main__' and sys.argv[1] == 'test':
    ref, lines = sys.argv[2], sys.argv[3:]
    out = os.environ.get('CLONE_OUT', 'dist/clone'); os.makedirs(out, exist_ok=True); t0 = time.time(); c = Cloner(ref); print(f'model loaded in {time.time() - t0:.0f}s', flush=True)
    for i, ln in enumerate(lines):
        t1 = time.time(); w, sr = c.create(ln, speed=float(os.environ.get('CLONE_SPEED', '1.05')))
        sf.write(f'{out}/clone_{i:02d}.wav', w, sr, subtype='PCM_16')
        print(f'{i:02d} {len(w) / sr:5.2f}s audio in {time.time() - t1:5.1f}s  | {ln}', flush=True)
