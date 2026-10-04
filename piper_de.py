"""German voice (Piper "Thorsten"): high quality in CI (models/de_DE-thorsten-high.onnx), low locally if that is all there is.
load(TTS).create(text, speed=1.0) -> (float32 samples, sample rate), same shape as Kokoro.create."""
import io, os, unicodedata, wave
import soundfile as sf

def load(TTS):
    from piper import PiperVoice
    try: from piper import SynthesisConfig
    except ImportError: SynthesisConfig = None
    path = next(p for p in [f'{TTS}/de_DE-thorsten-high.onnx', f'{TTS}/de-thorsten-low.onnx'] if os.path.exists(p))
    pv = PiperVoice.load(path); print('german voice', path)
    _ph = pv.phonemize          # espeak gives "ç" decomposed (c + U+0327), which the id map lacks: "ich" would sound like "ik"
    def _fix(text):
        out = []
        for sent in _ph(text):
            new = []
            for p in sent:
                c = unicodedata.normalize('NFC', new[-1] + p) if new and unicodedata.combining(p) else None
                if c and c in pv.config.phoneme_id_map: new[-1] = c
                else: new.append(p)
            out.append(new)
        return out
    pv.phonemize = _fix
    class _K:
        def create(self, text, voice=None, speed=1.0, lang=None):
            buf = io.BytesIO()
            with wave.open(buf, 'wb') as w:
                if SynthesisConfig: pv.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=1 / speed))
                else: pv.synthesize(text, w, length_scale=1 / speed)
            buf.seek(0); s, sr = sf.read(buf, dtype='float32'); return s, sr
    return _K()
