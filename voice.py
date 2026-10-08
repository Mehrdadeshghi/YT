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
elif VOICE == 'narrator':             # native narrator (Chatterbox TTS + synthetic reference), see clone_voice.Narrator
    from clone_voice import Narrator
    # the voice STYLE follows the topic (ep "voice_style"); any single key can still be overridden in the episode
    #  hype      – football / crazy stories: excited announcer, fast, pauses squeezed
    #  explainer – How It Works / science: calm, warm, conversational teacher ("let me show you"), natural pauses
    #  story     – history / mystery: measured storyteller, a bit slower, room for suspense
    #  kids      – Story Time: slow child-directed speech, long pauses, never sped up
    STYLES = {'hype': dict(ref='assets/voice/narrator_ref.wav', ex=0.9, cfg=0.35, wpm=205, keep=0.14, maxsp=1.32, minsp=1.0),
              'explainer': dict(ref='assets/voice/explainer_michael.wav', ex=0.45, cfg=0.5, wpm=185, keep=0.45, maxsp=1.1, minsp=0.95),
              'story': dict(ref='assets/voice/explainer_george.wav', ex=0.55, cfg=0.45, wpm=170, keep=0.5, maxsp=1.08, minsp=0.92),
              'kids': dict(ref='assets/voice/narrator_ref.wav', ex=0.9, cfg=0.35, wpm=140, keep=0.4, maxsp=1.0, minsp=0.88)}
    KIDS = bool(E.get('kids'))                         # kids: slower, with breathing pauses, never sped up
    ST = dict(STYLES[E.get('voice_style', 'kids' if KIDS else 'hype')])
    ST.update({k2: E[k1] for k1, k2 in [('voice_ref', 'ref'), ('voice_ex', 'ex'), ('voice_cfg', 'cfg'), ('wpm', 'wpm'), ('pause_keep', 'keep'), ('max_speed', 'maxsp'), ('min_speed', 'minsp')] if k1 in E})
    k = Narrator(ST['ref'], float(ST['ex']), float(ST['cfg']), 0.85, float(ST['wpm']), keep=float(ST['keep']), max_speed=float(ST['maxsp']), min_speed=float(ST['minsp']))
    VTAG = f"{ST['ex']}|{ST['cfg']}|{ST['wpm']}|v2|{E.get('kids', 0)}|{hashlib.md5(open(ST['ref'], 'rb').read()).hexdigest()[:8]}|{k.polish}" + ('' if E.get('voice_style', 'hype') == 'hype' or KIDS else f"|{ST['keep']}|{ST['maxsp']}")
elif VOICE == 'chirp':                # Google Chirp 3 HD (human-like); audio comes from the "Chirp voices" workflow (release chirp-N → assets/chirp)
    import chirp
    CV, CR = chirp.voice_for(E)
    class _Chirp:
        def create(self, text, **kw):
            p = chirp.path(text, CV, CR)
            if not os.path.exists(p): sys.exit(f'missing {p}: push the episode number to chirp.txt and download the chirp-N release into assets/')
            s, sr = sf.read(p, dtype='float32'); return (s if s.ndim == 1 else s.mean(1)), sr
    k = _Chirp(); VTAG = f'chirp|{CV}|{CR}'; SPEED = 1.0
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
