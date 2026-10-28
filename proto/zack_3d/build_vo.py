# proto/zack_3d/build_vo.py — preview voice for the Zack-style 3D probe (local Kokoro am_michael, no cloud TTS)
# scripts/zack/molasses.txt → one Kokoro take per sentence → assets/vo.wav + words.js (Whisper word timings, global seconds)
# run from the repo root: .venv/bin/python proto/zack_3d/build_vo.py
import os, re, sys, json, subprocess, numpy as np, soundfile as sf
sys.path.insert(0, os.getcwd())
import align
from kokoro_onnx import Kokoro
HERE = os.path.dirname(os.path.abspath(__file__))
VOICE, SPEED, GAP = 'am_michael', float(os.environ.get('SPEED', '1.25')), 0.16
text = open('scripts/zack/molasses.txt').read().strip()
sents = re.findall(r'[^.?!]+[.?!]', text)
k = Kokoro('models/kokoro-v1.0.onnx', 'models/voices-v1.0.bin')
os.makedirs(f'{HERE}/assets/vo', exist_ok=True)
pcm, words, sent_t, t = [], [], [], 0.0
for i, s in enumerate(sents):
    s = s.strip(); f = f'{HERE}/assets/vo/s{i:02d}_{SPEED}.wav'
    if not (os.path.exists(f) and os.path.exists(f + '.txt') and open(f + '.txt').read() == s):
        a, sr = k.create(s, voice=VOICE, speed=SPEED, lang='en-us')
        nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - int(.02 * sr)): nz[-1] + int(.06 * sr)]
        sf.write(f, a, sr, subtype='PCM_16'); open(f + '.txt', 'w').write(s)
        for c in [f + '.words.json']:
            if os.path.exists(c): os.remove(c)
    a, sr = sf.read(f, dtype='float32')
    ws = align.words(f, s)
    words += [{'w': w['w'], 't0': round(t + w['t0'], 3), 't1': round(t + w['t1'], 3), 's': i} for w in ws]
    sent_t.append([round(t, 3), round(t + len(a) / sr, 3), s])
    pcm.append(a); pcm.append(np.zeros(int(GAP * sr), np.float32)); t += len(a) / sr + GAP
sig = np.concatenate(pcm)
sf.write(f'{HERE}/assets/vo.wav', sig, sr, subtype='PCM_16')
# captions: 1-3 words, numbers as digits, break after punctuation
PHR = [('nineteen nineteen', '1919'), ('fifty feet tall', '50 feet tall'), ('two point three million', '2.3 million'),
       ('twenty-five feet high', '25 feet high'), ('thirty-five miles an hour', '35 mph'), ('twenty-one', '21')]
nrm = lambda w: re.sub(r'[^a-z0-9 -]', '', w.lower())
toks, i = [], 0
while i < len(words):
    for p, rep in PHR:
        n = len(p.split())
        if ' '.join(nrm(w['w']) for w in words[i:i + n]) == p:
            tail = re.sub(r'^.*?([.,!?]*)$', r'\1', words[i + n - 1]['w'])
            toks.append({'w': rep + tail, 't0': words[i]['t0'], 't1': words[i + n - 1]['t1'], 'one': True}); i += n; break
    else:
        toks.append(dict(words[i])); i += 1
STOP = set('a an the of at in into off and like to on by its'.split())
caps, cur = [], []
for j, w in enumerate(toks):
    if w.get('one') and cur and not (len(cur) == 1 and nrm(cur[0]['w']) in STOP): caps.append(cur); cur = []
    cur.append(w)
    nxt = toks[j + 1] if j + 1 < len(toks) else None
    orphan = nxt and len(cur) == 3 and not nxt.get('one') and re.search(r'[.,!?]$', nxt['w']) and not re.search(r'[.,!?]$', w['w'])
    if w.get('one') or re.search(r'[.,!?]$', w['w']) or (len(cur) >= 3 and not orphan):
        if len(cur) == 1 and nrm(w['w']) in STOP: continue          # lone "and" joins the next chunk
        keep = []
        while len(cur) > 1 and nrm(cur[-1]['w']) in STOP and not re.search(r'[.,!?]$', cur[-1]['w']): keep.insert(0, cur.pop())
        caps.append(cur); cur = keep
if cur: caps.append(cur)
caps = [{'t0': c[0]['t0'], 'text': ' '.join(x['w'] for x in c).rstrip('.,')} for c in caps]
for a, b in zip(caps, caps[1:] + [None]): a['t1'] = b['t0'] if b else round(t, 3)
VO = {'words': words, 'sents': sent_t, 'caps': caps, 'dur': round(t, 3)}
json.dump(VO, open(f'{HERE}/vo.json', 'w'), indent=0)
open(f'{HERE}/words.js', 'w').write('window.VO = ' + json.dumps(VO) + ';\n')
print(' | '.join(c['text'] for c in caps))
print('VO', round(t, 2), 's,', len(words), 'words')
for a, b, s in sent_t: print(f'{a:6.2f}-{b:6.2f}  {s}')
