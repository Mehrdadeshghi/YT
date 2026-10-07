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
if LANG == 'de':                     # German: Piper "Thorsten" (see piper_de.py)
    import piper_de; k = piper_de.load(TTS); VOICE = 'thorsten'
elif VOICE == 'native':               # native US pronunciation (Kokoro) converted to Mehrdad's timbre (Chatterbox VC) at house tempo
    from clone_voice import NativeCloner
    k = NativeCloner(E.get('voice_ref', 'assets/voice/mehrdad.wav'), E.get('voice_src', 'am_echo'), float(E.get('voice_expr', 1.85)))
    VTAG = f"{E.get('voice_src', 'am_echo')}|{E.get('voice_expr', 1.85)}"
elif VOICE == 'narrator':             # excited native narrator (Chatterbox TTS + synthetic reference), see clone_voice.Narrator
    from clone_voice import Narrator
    KIDS = bool(E.get('kids'))                         # kids: slower, with breathing pauses, never sped up
    k = Narrator(E.get('voice_ref', 'assets/voice/narrator_ref.wav'), float(E.get('voice_ex', 0.9)), float(E.get('voice_cfg', 0.35)), 0.85, float(E.get('wpm', 140 if KIDS else 205)),
                 keep=float(E.get('pause_keep', 0.4 if KIDS else 0.14)), max_speed=float(E.get('max_speed', 1.0 if KIDS else 1.32)), min_speed=float(E.get('min_speed', 0.88 if KIDS else 1.0)))
    VTAG = f"{E.get('voice_ex', 0.9)}|{E.get('voice_cfg', 0.35)}|{E.get('wpm', 205)}|v2|{E.get('kids', 0)}|{hashlib.md5(open(E.get('voice_ref', 'assets/voice/narrator_ref.wav'), 'rb').read()).hexdigest()[:8]}|{k.polish}"
elif VOICE == 'clone':                # Mehrdad's own voice, cloned (Chatterbox): timbre from assets/voice/*.wav, pronunciation from the model
    from clone_voice import Cloner
    k = Cloner(E.get('voice_ref', 'assets/voice/mehrdad.wav')); SPEED = float(arg('speed', str(E.get('speed_clone', 1.15))))
else:
    k = Kokoro(f'{TTS}/kokoro-v1.0.onnx', f'{TTS}/voices-v1.0.bin')
import align
ALIGN = LANG == 'en' and align.available() and E.get('align', True)
def synth(key, text):
    h = hashlib.md5(f'{VOICE}|{SPEED}|{globals().get("VTAG", "")}|{text}'.encode()).hexdigest()[:10]
    f = f'{out}/{key}_{h}.wav'
    if not os.path.exists(f):
        s, sr = k.create(text, voice=VOICE, speed=SPEED, lang='en-us')
        nz = np.where(np.abs(s) > 0.01)[0]                      # trim leading/trailing silence
        if len(nz): s = s[max(0, nz[0] - int(0.02 * sr)): nz[-1] + int(0.06 * sr)]
        sf.write(f, s, sr, subtype='PCM_16')
    d = sf.info(f).duration
    r = {'file': f, 'dur': round(d, 3), 'text': text}
    if ALIGN: r['words'] = align.words(f, text)                  # word timestamps (Whisper) → word-synced captions, cuts and hits
    return r
res = {'open': [synth(f'open{i}', s['text']) for i, s in enumerate(E.get('vo_open', []))],
       'scenes': [[synth(f's{j}_{i}', s['text']) for i, s in enumerate(sc.get('vo', []))] for j, sc in enumerate(E['scenes'])],
       'outro': [synth(f'outro{i}', s['text']) for i, s in enumerate(E.get('vo_outro', [{'text': 'Subscribe for the next random article.'}]))]}
json.dump(res, open(f'episodes/{ep}.voice.json', 'w'), indent=1)
for part in ['open', 'outro']: print(part, [x['dur'] for x in res[part]])
for j, sc in enumerate(res['scenes']): print(f'scene {j+1} (dur {E["scenes"][j]["dur"]}):', [x['dur'] for x in sc])
