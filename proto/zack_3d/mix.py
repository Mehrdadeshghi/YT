# proto/zack_3d/mix.py <silent.mp4> <out.mp4> — VO + light synthesized SFX (rumble, rivet pops, burst, roar, crash, splash), -14 LUFS
import sys, os, subprocess, numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
vo, sr = sf.read(f'{HERE}/assets/vo.wav', dtype='float32')
DUR = 36.7; n = int(DUR * sr); out = np.zeros(n, np.float32); out[:len(vo)] += vo[:n]
rng = np.random.default_rng(7)
def lp(x, a):   # one-pole low-pass
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s += a * (x[i] - s); y[i] = s
    return y
def add(t, x, g):
    i = int(t * sr); j = min(n, i + len(x)); out[i:j] += g * x[:j - i]
def env(L, a, r):
    t = np.arange(int(L * sr)) / sr; return np.minimum(1, t / max(a, 1e-3)) * np.exp(-np.maximum(0, t - a) / r)
noise = lambda L: rng.standard_normal(int(L * sr)).astype(np.float32)
rumble = lp(noise(9), 0.004); rumble /= np.abs(rumble).max()
add(2.4, rumble[:int(7 * sr)] * env(7, 1.0, 3.0)[:int(7 * sr)], 0.35)                       # ground shaking
for i in range(34):                                                                           # rivets: machine-gun pops
    p = noise(0.05) * env(0.05, 0.001, 0.008); add(3.85 + i * 0.048, p, 0.25)
b = lp(noise(3), 0.02); b /= np.abs(b).max(); add(8.78, b * env(3, 0.01, 0.9), 0.6)       # burst
roar = lp(noise(12), 0.01); roar /= np.abs(roar).max()                                        # wave roar under 11.6-20.3
e = np.ones(int(8.7 * sr), np.float32); fade = int(0.4 * sr); e[:fade] = np.linspace(0, 1, fade); e[-fade:] = np.linspace(1, 0, fade)
add(11.6, roar[:len(e)] * e, 0.32)
c = lp(noise(1.2), 0.08); c /= np.abs(c).max(); add(17.15, c * env(1.2, 0.005, 0.25), 0.4)  # truck crash
s = noise(1.5) * env(1.5, 0.02, 0.4); add(18.35, lp(s, 0.3) * 0.5, 0.3)                   # splash
add(18.7, c * env(1.2, 0.005, 0.3), 0.35)                                                     # streetcar
add(34.5, roar[:int(2.2 * sr)] * env(2.2, 1.0, 2.0), 0.4)                                     # finale roar
out = np.tanh(out * 1.1) / 1.1
wav = f'{HERE}/assets/mix.wav'; sf.write(wav, out, sr, subtype='PCM_16')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', sys.argv[1], '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-shortest', '-movflags', '+faststart', sys.argv[2]], check=True)
print('mixed', sys.argv[2])
