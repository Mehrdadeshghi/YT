#!/usr/bin/env python3
"""Patch a clone of antgroup/ditto-talkinghead (Apache-2.0) to run its PyTorch model on CPU (GitHub runners have no GPU).
    python3 scripts/ditto_cpu.py /opt/ditto"""
import os, re, sys
root = sys.argv[1]
for dp, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.py'): continue
        p = os.path.join(dp, f); s = open(p).read(); o = s
        s = re.sub(r'(?<!torch\.)(["\'])cuda\1', r'\1cpu\1', s)                       # default devices
        s = s.replace('dtype=torch.float16, enabled=True', 'dtype=torch.bfloat16, enabled=False')   # no fp16 autocast on CPU
        s = s.replace('torch.cuda.manual_seed(seed)', 'pass').replace('torch.cuda.manual_seed_all(seed)', 'pass')
        if '        return pickle.load(f)' in s:                                         # config pickles may name cuda devices too
            s = s.replace('        return pickle.load(f)', '        d = pickle.load(f)\n    def fix(x):\n        if isinstance(x, dict): return {k: fix(v) for k, v in x.items()}\n        if isinstance(x, list): return [fix(v) for v in x]\n        return "cpu" if x == "cuda" else x\n    return fix(d)')
        if s != o: open(p, 'w').write(s); print('patched', p)
