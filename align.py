"""Word timestamps for voice-over lines (faster-whisper, local weights from release model-whisper).

words(file, text) -> [{'w': script token as shown in captions, 't0', 't1'}] in seconds from the start of the file.
Whisper hears the audio; the script tokens are matched to what it heard (difflib), unmatched tokens are spread
linearly between their matched neighbours. Digits that Whisper wrote ("20", "83rd") replace spelled-out numbers
in the captions. Results are cached next to the wav (<file>.words.json)."""
import os, re, json, difflib
_M = None
def model():
    global _M
    if _M is None:
        from faster_whisper import WhisperModel
        d = os.environ.get('WHISPER_DIR', 'models/whisper')
        _M = WhisperModel(d, device='cpu', compute_type='int8')
    return _M
def available():
    return os.path.exists(os.path.join(os.environ.get('WHISPER_DIR', 'models/whisper'), 'model.bin'))
NUM = set('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million first second third fourth fifth sixth seventh eighth ninth tenth twentieth thirtieth fortieth fiftieth sixtieth seventieth eightieth ninetieth'.split())
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def words(f, text):
    cache = f + '.words.json'
    if os.path.exists(cache): return json.load(open(cache))
    segs, _ = model().transcribe(f, word_timestamps=True, language='en', beam_size=5, initial_prompt=text)
    heard = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    toks = text.replace('...', '… ').replace('…', '… ').split()
    toks = [t for t in toks if norm(t) or t == '…']
    toks = [t for t in toks if t != '…']
    a, b = [norm(t) for t in toks], [norm(h[0]) for h in heard]
    out = [None] * len(toks)
    for blk in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks():
        for k in range(blk.size): out[blk.a + k] = list(heard[blk.b + k])
    # replaced blocks of equal size (e.g. "Twenty" heard as "20") → take Whisper's timing and digits
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == 'replace':
            if i2 - i1 == j2 - j1:
                for k in range(i2 - i1): out[i1 + k] = list(heard[j1 + k])
            elif i2 - i1 > 0 and j2 > j1:          # n script tokens heard as m words: spread over the heard span
                s0, s1 = heard[j1][1], heard[j2 - 1][2]
                for k in range(i2 - i1): out[i1 + k] = [None, s0 + (s1 - s0) * k / (i2 - i1), s0 + (s1 - s0) * (k + 1) / (i2 - i1)]
    end = heard[-1][2] if heard else 1.0
    for i in range(len(toks)):                      # unmatched: interpolate between neighbours
        if out[i] is None:
            p = next((out[j][2] for j in range(i - 1, -1, -1) if out[j]), 0.0)
            n = next((out[j][1] for j in range(i + 1, len(toks)) if out[j]), end)
            out[i] = [None, p, max(p + 0.05, (p + n) / 2)]
    res = []
    for t, (h, t0, t1) in zip(toks, out):
        shown = t
        if h and re.match(r'^\d', h) and all(x in NUM for x in re.split(r'[-\s]', norm(t) and t.lower().strip('.,!?:;…')) if x):
            shown = re.sub(r'[.,!?:;]+$', '', h) + re.sub(r'^.*?([.,!?:;…]*)$', r'\1', t)
        res.append({'w': shown, 't0': round(t0, 3), 't1': round(t1, 3)})
    json.dump(res, open(cache, 'w')); return res
if __name__ == '__main__':
    import sys; print(json.dumps(words(sys.argv[1], sys.argv[2]), ensure_ascii=False))
