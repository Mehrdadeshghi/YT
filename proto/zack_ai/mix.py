#!/usr/bin/env python3
"""Sound for the Zack prototype: Kokoro VO + synthesized whooshes/rumble/roar (ffmpeg noise) + Kenney CC0 impacts.
    python mix.py VIDEO_SILENT OUT_MP4      (reads assets/vo.wav, assets/cues.json) — loudness -14 LUFS"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__)); A = f'{HERE}/assets'; SFX = os.path.join(HERE, '..', '..', 'assets', 'sfx')
vid, dst = sys.argv[1], sys.argv[2]
C = json.load(open(f'{A}/cues.json')); END = C['end']
os.makedirs(f'{A}/sfx', exist_ok=True)


def ff(*a): subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)


# synthesized sources (deterministic noise seeds)
ff('-f', 'lavfi', '-i', 'anoisesrc=d=0.45:c=pink:seed=7:a=0.9', '-af',
   'highpass=f=300,lowpass=f=5000,afade=t=in:d=0.3:curve=exp,afade=t=out:st=0.3:d=0.15,volume=0.8', '-ar', '48000', f'{A}/sfx/whoosh.wav')
ff('-f', 'lavfi', '-i', 'anoisesrc=d=0.6:c=pink:seed=9:a=0.9', '-af',
   'highpass=f=120,lowpass=f=2500,afade=t=in:d=0.4:curve=exp,afade=t=out:st=0.4:d=0.2', '-ar', '48000', f'{A}/sfx/zoom.wav')


def span(a, b): return max(0.3, b - a)


r0, r1 = C['rumble']; w0, w1 = C['roar']
ff('-f', 'lavfi', '-i', f'anoisesrc=d={span(r0, r1):.2f}:c=brown:seed=3:a=1', '-af',
   f'lowpass=f=90,volume=6,afade=t=in:d=0.8,afade=t=out:st={span(r0, r1) - 0.6:.2f}:d=0.6', '-ar', '48000', f'{A}/sfx/rumble.wav')
ff('-f', 'lavfi', '-i', f'anoisesrc=d={span(w0, w1):.2f}:c=brown:seed=5:a=1', '-af',
   f'lowpass=f=420,highpass=f=40,volume=4,afade=t=in:d=0.5,afade=t=out:st={span(w0, w1) - 0.7:.2f}:d=0.7', '-ar', '48000', f'{A}/sfx/roar.wav')

ins = [vid, f'{A}/vo.wav']
mix = []   # (input index, delay s, gain)


def add(path, at, gain):
    ins.append(path); mix.append((len(ins) - 1, at, gain))


for t in C['whoosh']: add(f'{A}/sfx/whoosh.wav', t - 0.3, 0.35)
for t in C['zoom']: add(f'{A}/sfx/zoom.wav', t - 0.35, 0.45)
for k, t in enumerate(C['rivets']): add(f'{SFX}/hit_{1 + k % 3}.wav', t, 0.32)
add(f'{A}/sfx/rumble.wav', r0, 0.9)
for t in C['boom']: add(f'{SFX}/boom_1.wav', t, 0.6)
add(f'{A}/sfx/roar.wav', w0, 0.55)
for t in C['hits']: add(f'{SFX}/crack_2.wav', t, 0.45)
for t in C['freeze']: add(f'{SFX}/crack_3.wav', t, 0.25)

args = []
for p in ins: args += ['-i', p]
fc = ['[1:a]aresample=48000,aformat=channel_layouts=stereo,volume=1.0[vo]']
labels = ['[vo]']
for j, (i, at, g) in enumerate(mix):
    ms = max(0, int(at * 1000))
    fc.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g},adelay={ms}|{ms}[s{j}]'); labels.append(f'[s{j}]')
fc.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{END:.2f},loudnorm=I=-14:TP=-1.5:LRA=11[a]')
ff(*args, '-filter_complex', ';'.join(fc), '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
   '-movflags', '+faststart', '-shortest', dst)
print(dst)
