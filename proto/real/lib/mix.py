#!/usr/bin/env python3
"""Sound for proto/real/<n>: Kokoro VO + synthesized sound design (ffmpeg lavfi noise/sines) + Kenney CC0 impacts
+ a quiet synthesized drone/pulse music bed. Loudness −14 LUFS.
    python mix.py N VIDEO_SILENT OUT_MP4      (reads proto/real/N/assets/vo.wav + cues.json)

cues.json fx: [kind, t, gain, (dur)] — kinds: boom hit crack thump stamp tick (Kenney) | whoosh riser (s) | rumble wind thunder rain
drill hiss (s, dur) | pulse (s, dur, bpm) | duck (s, dur, level: music only)."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf

LIB = os.path.dirname(os.path.abspath(__file__)); REAL = os.path.dirname(LIB); REPO = os.path.dirname(os.path.dirname(REAL))
N, vid, dst = sys.argv[1], sys.argv[2], sys.argv[3]
A = f'{REAL}/{N}/assets'; S = f'{A}/sfx'; KEN = f'{REPO}/assets/sfx'
C = json.load(open(f'{A}/cues.json')); END = C['end']
os.makedirs(S, exist_ok=True)


def ff(*a): subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)


def npwav(name, d, fn, lp=None):
    sr = 48000; t = np.arange(int(d * sr)) / sr; r = np.random.default_rng(len(name))
    y = fn(t, r)
    if lp:
        import scipy.signal as ss
        y = ss.lfilter(*ss.butter(2, lp / (sr / 2)), y)
    fade = np.minimum(1, np.minimum(t / 0.3, (d - t) / 0.4)); y = (y * fade).astype(np.float32)
    p = f'{S}/{name}.wav'; sf.write(p, np.stack([y, y], 1), sr); return p


def synth(name, src, af):
    p = f'{S}/{name}.wav'
    ff('-f', 'lavfi', '-i', src, '-af', af + ',aformat=channel_layouts=stereo', '-ar', '48000', p); return p


WH = synth('whoosh', 'anoisesrc=d=0.45:c=pink:seed=7:a=0.9', 'highpass=f=300,lowpass=f=5200,afade=t=in:d=0.3:curve=exp,afade=t=out:st=0.3:d=0.15,volume=0.8')
ZM = synth('zoom', 'anoisesrc=d=0.6:c=pink:seed=9:a=0.9', 'highpass=f=120,lowpass=f=2600,afade=t=in:d=0.42:curve=exp,afade=t=out:st=0.42:d=0.18')
KMAP = dict(boom='boom_1', hit='hit_2', crack='crack_2', thump='thump_1', stamp='stamp_1', tick='tick_1', land='land_1', zap='zap_1', glitch='glitch_1', paper='paper_1')

ins = [vid, f'{A}/vo.wav']; mix = []


def add(path, at, gain):
    ins.append(path); mix.append((len(ins) - 1, at, gain))


for at, seam in C['cuts']:
    if seam == 'left': add(WH, at - 0.3, 0.32)
    else: add(ZM, at - 0.42, 0.42)
for k, f in enumerate(C['fx']):
    kind, at, g = f[0], f[1], f[2]; d = f[3] if len(f) > 3 else 1.0
    if kind in KMAP: add(f'{KEN}/{KMAP[kind]}.wav', at, g); continue
    nm = f'{kind}_{k}'
    if kind == 'riser':
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=pink:seed={k}:a=0.9', f'highpass=f=500,lowpass=f=7000,afade=t=in:d={d:.2f}:curve=exp')
    elif kind == 'rumble':
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=brown:seed={k}:a=1', f'lowpass=f=110,volume=7,afade=t=in:d={min(0.6, d / 3):.2f},afade=t=out:st={d - min(0.8, d / 3):.2f}:d={min(0.8, d / 3):.2f}')
    elif kind == 'wind':     # roaring air through a hole
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=pink:seed={k}:a=1', f'bandpass=f=700:width_type=o:w=2.5,tremolo=f=5:d=0.25,volume=2.2,afade=t=in:d=0.08,afade=t=out:st={d - 1.2:.2f}:d=1.2')
    elif kind == 'thunder':  # crack + long rolling low end
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=brown:seed={k}:a=1', f'lowpass=f=260,tremolo=f=7:d=0.5,volume=8,afade=t=in:d=0.02,afade=t=out:st=0.3:d={d - 0.3:.2f}:curve=log')
    elif kind == 'rain':
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=white:seed={k}:a=0.5', f'highpass=f=1200,lowpass=f=9000,volume=0.5,afade=t=in:d=0.8,afade=t=out:st={d - 1:.2f}:d=1')
    elif kind == 'drill':    # grinding rotary drill: low saw tone, 11 Hz chatter, gritty noise (numpy)
        p = npwav(nm, d, lambda t, r: (0.5 * np.sign(np.sin(2 * np.pi * 47 * t)) * 0.4 + 0.25 * r.standard_normal(len(t))) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * t)), lp=900)
    elif kind == 'hiss':     # pressure hiss / decompression
        p = synth(nm, f'anoisesrc=d={d:.2f}:c=white:seed={k}:a=0.9', f'highpass=f=2500,volume=0.7,afade=t=in:d=0.02,afade=t=out:st=0.1:d={d - 0.1:.2f}:curve=log')
    elif kind == 'pulse':    # low heartbeat pulse (music bed tension)
        bpm = f[4] if len(f) > 4 else 92
        p = npwav(nm, d, lambda t, r: np.sin(2 * np.pi * 52 * t) * np.exp(-14 * np.mod(t, 60 / bpm)) * 0.9)
    else:
        raise ValueError(kind)
    add(p, at, g)

# music bed: two detuned low pads + air, slow swells (subtle; ducks under the VO by staying quiet)
M = C.get('music') or {}
f1, f2 = M.get('f', (55.0, 82.41))
pads = f'{S}/pad.wav'
ff('-f', 'lavfi', '-i', f'sine=f={f1}:d={END:.2f}', '-f', 'lavfi', '-i', f'sine=f={f1 * 1.003}:d={END:.2f}', '-f', 'lavfi', '-i', f'sine=f={f2}:d={END:.2f}',
   '-f', 'lavfi', '-i', f'sine=f={f2 * 2}:d={END:.2f}', '-f', 'lavfi', '-i', f'anoisesrc=d={END:.2f}:c=pink:seed=31:a=0.3',
   '-filter_complex', '[0][1][2]amix=inputs=3:normalize=0,volume=0.30,tremolo=f=0.13:d=0.5[a];[3]volume=0.05,tremolo=f=0.21:d=0.7[b];'
   '[4]bandpass=f=420:width_type=o:w=1,volume=0.35,tremolo=f=0.11:d=0.6[c];[a][b][c]amix=inputs=3:normalize=0,'
   f'afade=t=in:d=0.25,afade=t=out:st={END - 1.6:.2f}:d=1.6,aformat=channel_layouts=stereo', '-ar', '48000', pads)
add(pads, 0, M.get('gain', 0.5))

args = []
for p in ins: args += ['-i', p]
fc = ['[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.0,asplit=2[vo][key]']; labels = []
for j, (i, at, g) in enumerate(mix):
    ms = max(0, int(at * 1000))
    fc.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g},adelay={ms}|{ms}[s{j}]'); labels.append(f'[s{j}]')
# everything but the voice is ducked by the voice (sidechain), so words stay intelligible under wind/rumble
fc.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest[fx]')
fc.append('[fx][key]sidechaincompress=threshold=0.03:ratio=5:attack=8:release=300:makeup=1[fxd]')
fc.append(f'[vo][fxd]amix=inputs=2:normalize=0:duration=longest,apad,atrim=0:{END:.2f},loudnorm=I=-14:TP=-1.5:LRA=11[a]')
ff(*args, '-filter_complex', ';'.join(fc), '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
   '-movflags', '+faststart', '-shortest', dst)
print(dst)
