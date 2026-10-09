#!/usr/bin/env python3
"""Rebuild an episode's exact timeline from an already published video, so an extra dub track fits it.

    python3 recon.py 112 path/to/wiki_roulette_112.mp4      → episodes/112.voice.json + out/ep112/cues.json
    DUB_LANGS=fr python3 dub.py 112                          → dist/wiki_roulette_112_fr.m4a (same timing as the video)

The original voice files are gone, but the page only needs each line's duration and word times. Whisper hears the
English voice in the video; line durations are then nudged until every voice cue the page computes lands where the
line starts in the video (scene lengths snap to a 0.25 s grid, so the match is exact). Checks: voice-cue error and
total length against the video.
"""
import json, os, re, subprocess, sys, difflib, tempfile
import numpy as np

ep, mp4 = sys.argv[1], sys.argv[2]
E = json.load(open(f'episodes/{ep}.json'))
segs = list(E.get('vo_open', [])) + [v for sc in E['scenes'] for v in sc.get('vo', [])]
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
probe = lambda f: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
VDUR = probe(mp4)

# 1) what Whisper hears in the published video
wav = tempfile.mktemp(suffix='.wav')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp4, '-ac', '1', '-ar', '16000', wav], check=True)
from faster_whisper import WhisperModel
M = WhisperModel(os.environ.get('WHISPER_DIR', 'models/whisper'), device='cpu', compute_type='int8')
res, _ = M.transcribe(wav, word_timestamps=True, language='en', beam_size=5, initial_prompt=' '.join(s['text'] for s in segs)[:800])
heard = [(w.word.strip(), w.start, w.end) for s in res for w in s.words]

# 2) script tokens (same tokenisation as align.py) → heard words
toks, owner = [], []
for i, s in enumerate(segs):
    for t in s['text'].replace('...', '… ').replace('…', '… ').split():
        if norm(t): toks.append(t); owner.append(i)
a, b = [norm(t) for t in toks], [norm(h[0]) for h in heard]
hit = [None] * len(toks)
for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
    for k in range(blk.size): hit[blk.a + k] = heard[blk.b + k]
for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
    if op == 'replace' and i2 - i1 == j2 - j1:
        for k in range(i2 - i1): hit[i1 + k] = heard[j1 + k]
cover = sum(h is not None for h in hit) / len(hit)
print(f'{ep}: video {VDUR:.2f}s, {len(heard)} words heard, {cover:.0%} of script matched')

lines = []
for i in range(len(segs)):
    idx = [k for k in range(len(toks)) if owner[k] == i]
    m = [k for k in idx if hit[k]]
    if not m: sys.exit(f'line {i} not found in the audio: {segs[i]["text"]}')
    lines.append({'idx': idx, 's': hit[m[0]][1] - 0.02, 'e': hit[m[-1]][2] + 0.06})
for L in lines: L['d'] = L['e'] - L['s']


def words(i, start):
    """word times relative to the file start; unmatched tokens interpolated between neighbours"""
    idx = lines[i]['idx']; out = []
    for n, k in enumerate(idx):
        if hit[k]: out.append([toks[k], hit[k][1] - start, hit[k][2] - start])
        else: out.append([toks[k], None, None])
    for n, w in enumerate(out):
        if w[1] is None:
            p = next((out[j][2] for j in range(n - 1, -1, -1) if out[j][1] is not None), 0.0)
            q = next((out[j][1] for j in range(n + 1, len(out)) if out[j][1] is not None), lines[i]['d'])
            w[1], w[2] = p, max(p + 0.05, (p + q) / 2)
    return [{'w': w, 't0': round(max(0, t0), 3), 't1': round(max(0, t1), 3)} for w, t0, t1 in out]


nO = len(E.get('vo_open', []))
def write_voice(cue_t=None):
    st = cue_t or [L['s'] for L in lines]
    rec = [{'file': f'recon/{ep}/{i:02d}.wav', 'dur': round(lines[i]['d'], 3), 'text': segs[i]['text'], 'words': words(i, st[i])} for i in range(len(segs))]
    V = {'open': rec[:nO], 'scenes': [], 'outro': []}; k = nO
    for sc in E['scenes']:
        V['scenes'].append(rec[k:k + len(sc['vo'])]); k += len(sc['vo'])
    json.dump(V, open(f'episodes/{ep}.voice.json', 'w'), indent=1)


def cues():
    subprocess.run(['node', 'render.mjs', '--page', f'cine.html?ep={ep}', '--name', f'ep{ep}', '--cues-only'], check=True, capture_output=True)
    C = json.load(open(f'out/ep{ep}/cues.json'))
    return C, [c['t'] for c in C['cues'] if c['type'] == 'vo' and c.get('p')]


# 3) nudge durations until the page's voice cues land on the video's line starts
for it in range(8):
    write_voice(); C, ct = cues()
    err = [o['s'] - c for o, c in zip(lines, ct)]
    worst = max(range(len(err)), key=lambda i: abs(err[i]))
    print(f'  pass {it}: worst cue error {err[worst]:+.3f}s (line {worst}), length {C["dur"]:.2f}s vs video {VDUR:.2f}s')
    bad = [i for i in range(1, len(err)) if abs(err[i]) > 0.1]
    if not bad: break
    i = bad[0]; lines[i - 1]['d'] += err[i]          # the line before decides where this one (or its scene) starts
# final: words relative to the page's own cue times; the last line keeps the video's total length
write_voice(ct); C, ct = cues()
err = [o['s'] - c for o, c in zip(lines, ct)]
ok = max(abs(e) for e in err) < 0.12 and abs(C['dur'] - VDUR) < 0.1
print(f'{ep}: {"OK" if ok else "CHECK"}  max cue error {max(abs(e) for e in err):.3f}s, length {C["dur"]:.2f}s / video {VDUR:.2f}s')
os.remove(wav)
sys.exit(0 if ok else 2)
