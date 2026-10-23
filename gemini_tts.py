"""Gemini TTS (Google AI Studio, free tier) — human-like narration. Runs in GitHub Actions (needs secret GEMINI_API_KEY);
the WAVs come back as a release (gemini-N). Docs: ai.google.dev/gemini-api/docs/speech-generation (Interactions API).

  python3 gemini_tts.py samples [Voice …]   → assets/gemini/samples/<voice>_<lang>.wav (voice audition on #186's script)
  episode "voice": "gemini"                 → voice.py calls Take(): the WHOLE English script in ONE request (free-tier
                                              friendly, natural flow between lines), cut into the lines with Whisper word
                                              timestamps, sped up to the target pace. Dubs stay on dub.py's voices.
  episode flags: gemini_voice (default Charon), gemini_style (delivery prompt), gemini_wpm (target pace, default 185)

Output: WAV 24 kHz mono 16-bit. Free tier: requests are rate-limited per day (see aistudio.google.com/rate-limit) and
free-tier prompts may be used by Google to improve its products (our scripts are public anyway).
"""
import base64, hashlib, json, os, subprocess, sys, time, urllib.error, urllib.request

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


def segments(E):
    """narrated lines in voice.py's order: opener, scenes, outro"""
    return ([s['text'] for s in E.get('vo_open', [])] + [v['text'] for sc in E['scenes'] for v in sc.get('vo', [])]
            + [s['text'] for s in E.get('vo_outro', [{'text': 'Subscribe for the next random article.'}])])


def tag(E):
    return f"gemini|{MODEL}|{E.get('gemini_voice', 'Charon')}|{E.get('gemini_style', STYLE)}|{E.get('gemini_wpm', 185)}"


class Take:
    """voice.py backend: create(text) returns the clip of that line, cut from one take of the whole script"""
    def __init__(self, E, out):
        self.E, self.out, self.clips = E, out, None

    def _make(self):
        import align, numpy as np, soundfile as sf
        lines = segments(self.E)
        full = f"{self.out}/gemini_{hashlib.md5((tag(self.E) + '|' + chr(10).join(lines)).encode()).hexdigest()[:10]}.wav"
        if not os.path.exists(full): synth(chr(10).join(lines), self.E.get('gemini_voice', 'Charon'), full, self.E.get('gemini_style', STYLE))
        s, sr = sf.read(full, dtype='float32'); s = s if s.ndim == 1 else s.mean(1)
        W = align.words(full, ' '.join(lines))                  # same tokenisation as align.words → split by token count
        n = [len([t for t in ln.replace('...', '… ').replace('…', '… ').split() if align.norm(t)]) for ln in lines]
        spans, i = [], 0
        for c in n: spans.append((W[i]['t0'], W[i + c - 1]['t1'])); i += c
        talk = sum(b - a for a, b in spans)
        tempo = min(1.3, max(1.0, float(self.E.get('gemini_wpm', 185)) / (sum(n) / talk * 60)))
        print(f'gemini take: {len(s) / sr:.1f}s, {sum(n) / talk * 60:.0f} wpm → tempo {tempo:.2f}', flush=True)
        self.clips = {}
        for j, (ln, (a, b)) in enumerate(zip(lines, spans)):
            lo = 0 if j == 0 else (spans[j - 1][1] + a) / 2
            hi = len(s) / sr if j == len(lines) - 1 else (b + spans[j + 1][0]) / 2
            clip = s[int(lo * sr): int(hi * sr)]
            if tempo > 1.001:
                pcm = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-', '-filter:a', f'atempo={tempo:.3f}',
                                      '-f', 'f32le', '-'], input=clip.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
                clip = np.frombuffer(pcm, np.float32)
            self.clips[ln] = (clip, sr)

    def create(self, text, **kw):
        if self.clips is None: self._make()
        return self.clips[text]


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
