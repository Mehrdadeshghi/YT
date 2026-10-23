"""Gemini TTS (Google AI Studio, free tier) — human-like narration. Runs in GitHub Actions (needs secret GEMINI_API_KEY);
the WAVs come back as a release (gemini-N). Docs: ai.google.dev/gemini-api/docs/speech-generation (Interactions API).

  python3 gemini_tts.py samples [Voice …]   → assets/gemini/samples/<voice>_<lang>.wav (voice audition on #186's script)

Output: WAV 24 kHz mono 16-bit. Free tier: requests are rate-limited per day (see aistudio.google.com/rate-limit) and
free-tier prompts may be used by Google to improve its products (our scripts are public anyway).
"""
import base64, json, os, sys, time, urllib.error, urllib.request

MODEL = os.environ.get('GEMINI_TTS_MODEL', 'gemini-3.8-flash-tts')
STYLE = ('Engaging documentary narrator for a short science video: curious, warm and confident, '
         'natural conversational pace with a little energy, clear emphasis on numbers, not robotic')
OUT = 'assets/gemini'


def synth(text, voice, dst, style=STYLE):
    body = {'model': MODEL,
            'input': [{'type': 'user_input', 'content': [{'type': 'text', 'text': text,
                                                          'annotations': [{'type': 'speech_metadata', 'style': style}]}]}],
            'response_format': {'type': 'audio'},
            'generation_config': {'speech_config': [{'voice': voice}]}}
    req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions', data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']})
    for wait in (0, 30, 90):                                       # only transient errors are retried (429 = free-tier limit)
        time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=180) as r: res = json.load(r); break
        except urllib.error.HTTPError as ex:
            msg = ex.read().decode(errors='replace')[:300]
            if ex.code not in (429, 500, 503) or wait == 90: sys.exit(f'Gemini TTS error {ex.code}: {msg}')
            print(f'  {ex.code}, retry in a moment: {msg[:120]}', flush=True)
    audio = [b for s in res.get('steps', []) if s.get('type') == 'model_output' for b in s.get('content', []) if b.get('type') == 'audio']
    if not audio: sys.exit('Gemini TTS: no audio in the response: ' + json.dumps(res)[:300])
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'wb').write(base64.b64decode(audio[-1]['data']))    # unary output is a complete WAV file


def script(ep, lang):
    E = json.load(open(f'episodes/{ep}.json'))
    segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
    return ' '.join(s['text'] if lang == 'en' else s.get(lang, '') for s in segs).strip()


if __name__ == '__main__':
    if not os.environ.get('GEMINI_API_KEY'): sys.exit('secret GEMINI_API_KEY missing (GitHub → Settings → Secrets → Actions)')
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'samples':
        en, de = script('186', 'en'), script('186', 'de')
        for v in args or ['Charon', 'Sadaltager', 'Iapetus', 'Algieba', 'Gacrux', 'Puck']:
            synth(en, v, f'{OUT}/samples/{v}_en.wav'); print('sample', v, 'en', flush=True)
        for v in (args or ['Charon', 'Sadaltager'])[:2]:
            synth(de, v, f'{OUT}/samples/{v}_de.wav'); print('sample', v, 'de', flush=True)
