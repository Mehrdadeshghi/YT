# python3 voice.py 001 [--voice af_heart --speed 1.08]
# Reads episodes/<ep>.json voice-over segments, synthesizes each with Kokoro (local, offline),
# writes out/ep<ep>/vo/*.wav and episodes/<ep>.voice.json (durations) for the template.
import sys, json, hashlib, os, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
TTS = os.environ.get('TTS_DIR', 'models')
ep = sys.argv[1]
arg = lambda k, d: sys.argv[sys.argv.index('--' + k) + 1] if '--' + k in sys.argv else d
E = json.load(open(f'episodes/{ep}.json'))
VOICE, SPEED = arg('voice', E.get('voice', 'af_heart')), float(arg('speed', str(E.get('speed', 1.3))))   # house standard: 1.30 (fast, no dead air)
out = f'out/ep{ep}/vo'; os.makedirs(out, exist_ok=True)
LANG = E.get('lang', 'en')
if LANG == 'de':                     # German: Piper "Thorsten" (high quality in CI, low locally if that is all there is)
    import wave, io
    from piper import PiperVoice
    try: from piper import SynthesisConfig
    except ImportError: SynthesisConfig = None
    PV = next(p for p in [f'{TTS}/de_DE-thorsten-high.onnx', f'{TTS}/de-thorsten-low.onnx'] if os.path.exists(p))
    pv = PiperVoice.load(PV); print('german voice', PV)
    class _K:
        def create(self, text, voice=None, speed=1.0, lang=None):
            buf = io.BytesIO()
            with wave.open(buf, 'wb') as w:
                if SynthesisConfig: pv.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=1 / speed))
                else: pv.synthesize(text, w, length_scale=1 / speed)
            buf.seek(0); s, sr = sf.read(buf, dtype='float32'); return s, sr
    k = _K(); VOICE = 'thorsten'
else:
    k = Kokoro(f'{TTS}/kokoro-v1.0.onnx', f'{TTS}/voices-v1.0.bin')
def synth(key, text):
    h = hashlib.md5(f'{VOICE}|{SPEED}|{text}'.encode()).hexdigest()[:10]
    f = f'{out}/{key}_{h}.wav'
    if not os.path.exists(f):
        s, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-us')
        nz = np.where(np.abs(s) > 0.01)[0]                      # trim leading/trailing silence
        if len(nz): s = s[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
        sf.write(f, s, sr, subtype='PCM_16')
    d = sf.info(f).duration
    return {'file': f, 'dur': round(d, 3), 'text': text}
res = {'open': [synth(f'open{i}', s['text']) for i, s in enumerate(E.get('vo_open', []))],
       'scenes': [[synth(f's{j}_{i}', s['text']) for i, s in enumerate(sc.get('vo', []))] for j, sc in enumerate(E['scenes'])],
       'outro': [synth(f'outro{i}', s['text']) for i, s in enumerate(E.get('vo_outro', [{'text': 'Subscribe for the next random article.'}]))]}
json.dump(res, open(f'episodes/{ep}.voice.json', 'w'), indent=1)
for part in ['open', 'outro']: print(part, [x['dur'] for x in res[part]])
for j, sc in enumerate(res['scenes']): print(f'scene {j+1} (dur {E["scenes"][j]["dur"]}):', [x['dur'] for x in sc])
