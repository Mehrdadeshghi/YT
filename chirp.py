"""Google Cloud TTS "Chirp 3: HD" voices (human-like). Runs in GitHub Actions (needs secret GOOGLE_TTS_KEY);
the generated WAVs are shipped back as a release (chirp-N) and used locally by voice.py / dub.py.

  python3 chirp.py synth 112 113 …   → assets/chirp/<hash>.wav for every EN/DE/ES line of these episodes
  python3 chirp.py samples           → assets/chirp/samples/<voice>.wav (voice audition)

The voice follows the topic (episode "voice_style"); "chirp_voice" / "chirp_rate" in the episode override it.
"""
import base64, hashlib, json, os, sys, urllib.request

STYLE = {   # style → (EN voice, speaking rate)
    'explainer': ('en-US-Chirp3-HD-Charon', 1.05),
    'hype': ('en-US-Chirp3-HD-Puck', 1.15),
    'story': ('en-GB-Chirp3-HD-Algieba', 1.0),
    'kids': ('en-US-Chirp3-HD-Aoede', 0.92),
}
DUB = {'de': 'de-DE-Chirp3-HD-Charon', 'es': 'es-ES-Chirp3-HD-Charon'}   # same character in the dubbed tracks
OUT = 'assets/chirp'


def voice_for(E, lang='en'):
    v, r = STYLE.get(E.get('voice_style', 'kids' if E.get('kids') else 'hype'), STYLE['explainer'])
    v, r = E.get('chirp_voice', v), float(E.get('chirp_rate', r))
    if lang != 'en':
        v = E.get(f'chirp_voice_{lang}', DUB[lang].replace('Charon', v.split('-')[-1]))
    return v, r


def key(text, voice, rate):
    return hashlib.md5(f'{voice}|{rate}|{text}'.encode()).hexdigest()[:12]


def path(text, voice, rate):
    return f'{OUT}/{key(text, voice, rate)}.wav'


def lines(E):
    """(text, voice, rate) for every narrated line, in English and in the DE/ES dub languages."""
    segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
    out = []
    for lang in ('en', 'de', 'es'):
        v, r = voice_for(E, lang)
        for s in segs:
            t = s['text'] if lang == 'en' else s.get(lang)
            if t: out.append((t, v, r))
    return out


def synth(text, voice, rate, dst):
    body = {'input': {'text': text}, 'voice': {'languageCode': '-'.join(voice.split('-')[:2]), 'name': voice},
            'audioConfig': {'audioEncoding': 'LINEAR16', 'sampleRateHertz': 24000, 'speakingRate': rate}}
    req = urllib.request.Request('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + os.environ['GOOGLE_TTS_KEY'],
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r:
        audio = base64.b64decode(json.load(r)['audioContent'])
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'wb').write(audio)                                  # LINEAR16 response is a complete WAV file


if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'samples':
        LINE = ("Inside the charging pad is a coil of copper wire. And your phone has one too. "
                "The pad's coil creates a magnetic field that flips over a hundred thousand times a second.")
        for v in args or ['Charon', 'Fenrir', 'Orus', 'Puck', 'Iapetus', 'Algieba', 'Enceladus', 'Kore', 'Aoede', 'Leda']:
            name = v if '-' in v else f'en-US-Chirp3-HD-{v}'
            synth(LINE, name, 1.05, f'{OUT}/samples/{name}.wav'); print('sample', name, flush=True)
    elif cmd == 'synth':
        n = 0
        for ep in args:
            E = json.load(open(f'episodes/{ep}.json'))
            for t, v, r in lines(E):
                p = path(t, v, r)
                if not os.path.exists(p): synth(t, v, r, p); n += 1
            print(ep, 'ok', flush=True)
        print(n, 'lines synthesized')
