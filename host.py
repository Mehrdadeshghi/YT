#!/usr/bin/env python3
"""AI presenter: makes the fictional host (assets/host/*.png, generated image of a non-existent person) speak the
episode's own voice-over lines. Engine "ditto" (default; Ant Group's Ditto, LivePortrait motion space: sharp face, natural
head motion, blinks, teeth) or "sadtalker" (older, softer). Both open source and patched to run on CPU.

    python3 host.py 119p          (after voice.py; DITTO_DIR/DITTO_PY from scripts/setup_ditto.sh, or SADTALKER_DIR/ST_PY)

Which lines: every vo segment whose scene has "host": true (or the segment itself has "host": true).
Output: assets/clips/<ep>_host/<k>/0001.jpg … (30 fps, the host image's size) and assets/clips/<ep>_host.json {k: frames}
where k is the segment's index in voice order (vo_open first, then the scenes). cine/pro.js host() draws them in sync.
"""
import hashlib, json, os, shutil, subprocess, sys, tempfile

ep = sys.argv[1]
E = json.load(open(f'episodes/{ep}.json')); V = json.load(open(f'episodes/{ep}.voice.json'))
ST, PY = os.environ.get('SADTALKER_DIR', '/home/claude/avatar/SadTalker'), os.environ.get('ST_PY', 'python3')
IMG = os.path.abspath(E.get('host_img', 'assets/host/host_v1.png'))
segs = [(s, False) for s in E.get('vo_open', [])] + [(v, sc.get('host', False)) for sc in E['scenes'] for v in sc.get('vo', [])]
files = [x['file'] for x in V['open']] + [x['file'] for sc in V['scenes'] for x in sc]
out_dir, index_f = f'assets/clips/{ep}_host', f'assets/clips/{ep}_host.json'
index = json.load(open(index_f)) if os.path.exists(index_f) else {}
os.makedirs(out_dir, exist_ok=True)
for k, ((sg, sc_host), wav) in enumerate(zip(segs, files)):
    if not (sg.get('host', sc_host)): continue
    key = hashlib.md5(open(wav, 'rb').read() + open(IMG, 'rb').read() + E.get('host_engine', 'ditto').encode()).hexdigest()[:10]
    dst = f'{out_dir}/{k}'
    if index.get(str(k), {}).get('key') == key and os.path.exists(f'{dst}/0001.jpg'): print(f'{ep} host {k}: cached'); continue
    tmp = tempfile.mkdtemp()
    if E.get('host_engine', 'ditto') == 'ditto':
        DD = os.environ.get('DITTO_DIR', '/opt/ditto')
        print(f'{ep} host {k} (ditto): {sg["text"][:60]}…', flush=True)
        subprocess.run([os.environ.get('DITTO_PY', f'{DD}/py/bin/python'), 'inference.py', '--data_root', './checkpoints/ditto_pytorch',
                        '--cfg_pkl', './checkpoints/ditto_cfg/v0.4_hubert_cfg_pytorch.pkl', '--audio_path', os.path.abspath(wav),
                        '--source_path', IMG, '--output_path', f'{tmp}/host.mp4'], cwd=DD, check=True)
    else:
      cmd = [PY, 'inference.py', '--driven_audio', os.path.abspath(wav), '--source_image', IMG, '--result_dir', tmp,
             '--still', '--preprocess', 'full', '--size', '256', '--expression_scale', str(E.get('host_expr', 1.0))]
      if os.environ.get('HOST_ENHANCE', '1' if E.get('host_enhance') else '0') == '1': cmd += ['--enhancer', 'gfpgan']   # face enhancer: sharper but ~3x slower
      print(f'{ep} host {k} (sadtalker): {sg["text"][:60]}…', flush=True)
      subprocess.run(cmd, cwd=ST, check=True)
    mp4 = f'{tmp}/host.mp4' if os.path.exists(f'{tmp}/host.mp4') else next(os.path.join(r, f) for r, _, fs in os.walk(tmp) for f in fs if f.endswith('.mp4') and not f.startswith('temp_'))
    shutil.rmtree(dst, ignore_errors=True); os.makedirs(dst)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', 'fps=30', '-q:v', '3', f'{dst}/%04d.jpg'], check=True)
    n = len([f for f in os.listdir(dst) if f.endswith('.jpg')]); shutil.rmtree(tmp, ignore_errors=True)
    index[str(k)] = {'frames': n, 'key': key}; json.dump(index, open(index_f, 'w'), indent=1)
    print(f'{ep} host {k}: {n} frames', flush=True)
json.dump(index, open(index_f, 'w'), indent=1)
