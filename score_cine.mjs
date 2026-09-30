// node score.mjs out/ep001   -> out/ep001/score.wav (reads cues.json written by render.mjs)
// Series sound: 120 BPM marimba-pluck groove, chord progression picked per episode, SFX from the page's cues.
import { readFileSync, writeFileSync } from 'node:fs';
const DIR = process.argv[2];
const META = JSON.parse(readFileSync(`${DIR}/cues.json`, 'utf8'));
const SR = 48000, DUR = META.dur, BEAT = 0.5, N = Math.ceil(DUR * SR), BARS = Math.round(DUR / 2);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 777 + (META.ep?.ep || 0); const noise = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2147483648 - 1;

class Biquad {
  constructor(type, f, q = 0.707) { this.type = type; this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(f, q); }
  set(f, q = 0.707) {
    const w = 2 * Math.PI * Math.min(f, SR * 0.45) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w); let b0, b1, b2; const a0 = 1 + a;
    if (this.type === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = (1 - c) / 2; }
    else if (this.type === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = (1 + c) / 2; }
    else { b0 = a; b1 = 0; b2 = -a; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = -2 * c / a0; this.a2 = (1 - a) / a0;
  }
  p(x) { const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y; return y; }
}
function add(t0, len, fn, gain = 1, pan = 0) {
  const s0 = Math.floor(t0 * SR), gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = 0; i < len * SR; i++) { const k = s0 + i; if (k < 0) continue; if (k >= N) break;
    const v = fn(i / SR, i); L[k] += v * gl; R[k] += v * gr; }
}
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const PROGS = [[[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],      // Am F C G
               [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]],      // Dm Bb F C
               [[52, 55, 59], [48, 52, 55], [55, 59, 62], [50, 54, 57]]];     // Em C G D
const CH = PROGS[(META.ep?.prog || 0) % PROGS.length];

// ------------------------------------------------ CINE bed — mood "clock" (heartbeat + clock) or "deep" (sonar + drone)
const OPEN = META.ep?.openDur || 4, MOOD = META.ep?.mood || 'clock';
const CHORDS = MOOD === 'deep' ? [[50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55]]   // Dm Bb F C
                               : [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 56, 59]];  // Am F C E
for (let bar = 0; bar < BARS; bar++) {
  const ch = CHORDS[bar % 4], t0 = bar * 2, len = 2.5, oct = MOOD === 'deep' ? -12 : 0;
  for (const m of ch) for (const det of [-0.004, 0.004]) {
    const f = hz(m + oct) * (1 + det), lp = new Biquad('lp', MOOD === 'deep' ? 700 : 900 + 500 * (bar % 4 === 3)), ph = [0, 0, 0, 0, 0, 0];
    add(t0, len, (x) => { let v = 0; for (let h = 1; h <= 6; h++) { ph[h - 1] += f * h / SR; v += Math.sin(2 * Math.PI * ph[h - 1]) / h; }
      const env = Math.min(1, x / 0.35) * Math.min(1, Math.max(0, (len - x) / 0.5));
      return lp.p(v) * env; }, MOOD === 'deep' ? 0.07 : 0.05, det < 0 ? -0.5 : 0.5);
  }
  const fr = hz(ch[0] - 24); let ph = 0;
  add(t0, 2.1, (x) => { ph += fr / SR; return Math.sin(2 * Math.PI * ph) * Math.min(1, x / 0.05) * Math.min(1, (2.1 - x) / 0.2); }, 0.32);
}
function heart(t, g) { for (const [o, gg] of [[0, 1], [0.2, 0.7]]) { let ph = 0;
  add(t + o, 0.3, (x) => { ph += (48 + 70 * Math.exp(-x * 30)) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-x * 11); }, g * gg); } }
if (MOOD === 'deep') {
  for (let t = OPEN; t < DUR - 0.01; t += 2) { let ph = 0;                       // slow deep boom on every bar
    add(t, 0.9, (x) => { ph += (38 + 40 * Math.exp(-x * 18)) / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-x * 4.5); }, 0.6); }
  for (let t = OPEN + 1; t < DUR - 0.01; t += 1) { const hp = new Biquad('hp', 5000, 0.7);   // soft shaker on the off-beat
    add(t, 0.09, (x) => hp.p(noise()) * Math.sin(Math.PI * x / 0.09), 0.07, 0.35); }
} else {
  for (let t = OPEN; t < DUR - 0.01; t += 1) heart(t, t % 2 ? 0.45 : 0.6);
  for (let t = 0; t < DUR - 0.01; t += BEAT) {
    const hp = new Biquad('hp', t % 1 ? 2600 : 1800, 2), tock = !(t % 1);
    add(t + 0.25, 0.04, (x) => hp.p(noise()) * Math.exp(-x * 160), tock ? 0.16 : 0.11, tock ? -0.3 : 0.3);
  }
}
// ------------------------------------------------ SFX from the page's cue list
const SFX = {
  tick:  (t, g) => add(t, 0.025, (x) => Math.sin(2 * Math.PI * 3200 * x) * Math.exp(-x * 220), 0.28 * g),
  click: (t, g) => add(t, 0.05, (x) => (Math.sin(2 * Math.PI * 1900 * x) * 0.6 + noise() * 0.4) * Math.exp(-x * 120), 0.4 * g),
  pop:   (t, g, f) => add(t, 0.15, (x) => Math.sin(2 * Math.PI * ((f || 600) + 900 * x) * x) * Math.exp(-x * 28), 0.38 * g),
  thump: (t, g) => { let ph = 0; add(t, 0.6, (x) => { ph += (65 * Math.exp(-x * 4) + 30) / SR;
    return Math.sin(2 * Math.PI * ph) * Math.exp(-x * 5) + noise() * 0.12 * Math.exp(-x * 30); }, 0.7 * g); },
  whoosh: (t, g, len = 0.5) => { const bp = new Biquad('bp', 400, 1.2);
    add(t, len, (x, i) => { if (i % 32 === 0) bp.set(300 + 5000 * Math.pow(x / len, 1.6), 1.2);
      return bp.p(noise()) * Math.pow(Math.sin(Math.PI * x / len), 2) * 1.6; }, 0.45 * g); },
  swish: (t, g) => SFX.whoosh(t, 0.5 * g, 0.28),
  scratch: (t, g) => { let ph = 0; add(t, 0.35, (x) => { ph += (900 * Math.exp(-x * 9) + 60) / SR;
    return (Math.sin(2 * Math.PI * ph) * 0.5 + noise() * 0.5) * Math.exp(-x * 7); }, 0.5 * g); },
  riser: (t, g, len = 1.4) => { const bp = new Biquad('bp', 300, 2);
    add(t, len, (x, i) => { if (i % 32 === 0) bp.set(200 + 4000 * Math.pow(x / len, 2), 2);
      return bp.p(noise()) * Math.pow(x / len, 2) * 2; }, 0.5 * g); },
  mute: () => {},
  bloop: (t, g) => { let ph = 0; const lp = new Biquad('lp', 600); add(t, 1.8, (x) => { ph += (70 + 190 * (x / 1.8) ** 1.5) / SR;
    return (Math.sin(2 * Math.PI * ph) + 0.3 * lp.p(noise())) * Math.sin(Math.PI * Math.min(1, x / 1.8)) ** 0.7; }, 0.55 * g); },
  type: (t, g) => { const bp = new Biquad('bp', 2400, 3); add(t, 0.06, (x) => (bp.p(noise()) * 2 + Math.sin(2 * Math.PI * 180 * x) * 0.6) * Math.exp(-x * 90), 0.5 * g); },
  crack: (t, g) => { const hp = new Biquad('hp', 1200, 0.7); SFX.thump(t, 0.8 * g); add(t, 0.8, (x) => hp.p(noise()) * Math.exp(-x * 6) * (0.4 + 0.6 * (Math.sin(x * 400) > 0.7)), 0.6 * g); },
  splash: (t, g) => { const lp = new Biquad('lp', 1500); SFX.thump(t, 0.9 * g); add(t, 1.4, (x) => lp.p(noise()) * Math.exp(-x * 2.6) * Math.min(1, x / 0.03), 0.7 * g); },
  sonar: (t, g) => [[0, 1], [0.38, 0.45], [0.76, 0.2]].forEach(([o, e]) => add(t + o, 1.6, (x) => Math.sin(2 * Math.PI * 1320 * x) * Math.min(1, x / 0.01) * Math.exp(-x * 3.2), 0.16 * g * e, o ? 0.4 : -0.2)),
  bubble: (t, g) => { for (let i = 0; i < 5; i++) { let ph = 0; const f0 = 380 + i * 90;
    add(t + i * 0.07, 0.12, (x) => { ph += (f0 + 2600 * x) / SR; return Math.sin(2 * Math.PI * ph) * Math.sin(Math.PI * x / 0.12); }, 0.12 * g); } },
  beep:  (t, g) => add(t, 0.13, (x) => Math.sin(2 * Math.PI * 988 * x) * Math.min(1, x / 0.004) * Math.min(1, (0.13 - x) / 0.02), 0.18 * g),
  flat:  (t, g, len = 1.6) => add(t, len, (x) => Math.sin(2 * Math.PI * 988 * x) * Math.min(1, x / 0.004) * Math.min(1, (len - x) / 0.3), 0.2 * g),
  pen:   (t, g) => { const bp = new Biquad('bp', 3500, 1.5); add(t, 0.7, (x) => bp.p(noise()) * (0.5 + 0.5 * Math.sin(x * 60)) * Math.sin(Math.PI * x / 0.7), 0.35 * g); },
  coin:  (t, g) => [2093, 2637, 3136].forEach((f, i) => add(t + i * 0.05, 0.5, (x) => Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 9), 0.13 * g)),
  hit:   (t, g) => { SFX.thump(t, 1.1 * g); const lp = new Biquad('lp', 1200); add(t, 1.2, (x) => lp.p(noise()) * Math.exp(-x * 4), 0.35 * g);
    let ph = 0; add(t, 1.6, (x) => { ph += 42 / SR; return Math.sin(2 * Math.PI * ph) * Math.exp(-x * 2.2); }, 0.5 * g); },
  zap:   (t, g) => { const hp = new Biquad('hp', 1800, 0.7); SFX.thump(t, 0.6 * g);
    add(t, 0.35, (x) => hp.p(noise()) * Math.exp(-x * 14) * (1 + 0.6 * Math.sin(x * 900)), 0.4 * g); },
  land:  (t, g) => { SFX.thump(t, 0.9 * g); [1320, 1980].forEach((f, i) =>
    add(t + 0.01, 1.0, (x) => Math.sin(2 * Math.PI * f * x) * Math.exp(-x * 5) * (i ? 0.5 : 1), 0.18 * g)); },
};
for (const c of META.cues.filter((c) => c.type === 'mute')) {        // pattern interrupt: the music drops out
  const s0 = Math.floor(c.t * SR), n = Math.floor((c.p || 0.8) * SR);
  for (let i = 0; i < n + 2400 && s0 + i < N; i++) { const g = i < n ? 0 : (i - n) / 2400; L[s0 + i] *= g; R[s0 + i] *= g; } }
for (const c of META.cues) if (c.type !== 'vo' && c.type !== 'mute') SFX[c.type]?.(c.t, c.gain ?? 1, c.p);

// ------------------------------------------------ voice-over: clips placed by the page's cues, music ducks under it
const VL = new Float32Array(N);
function readWav(f) {                                     // 16-bit PCM mono
  const b = readFileSync(f); let o = 12, sr = 24000, data = null;
  while (o < b.length - 8) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4);
    if (id === 'fmt ') sr = b.readUInt32LE(o + 12); if (id === 'data') { data = b.subarray(o + 8, o + 8 + sz); break; } o += 8 + sz + (sz % 2); }
  const n = data.length / 2, x = new Float32Array(n); for (let i = 0; i < n; i++) x[i] = data.readInt16LE(i * 2) / 32768;
  return { x, sr };
}
const vos = META.cues.filter((c) => c.type === 'vo' && c.p);
for (const c of vos) {
  const { x, sr } = readWav(c.p), ratio = sr / SR, s0 = Math.floor(c.t * SR), len = Math.floor(x.length / ratio);
  for (let i = 0; i < len; i++) { const k = s0 + i; if (k < 0 || k >= N) continue;
    const pos = i * ratio, j = Math.floor(pos), f = pos - j; VL[k] += (x[j] * (1 - f) + (x[Math.min(j + 1, x.length - 1)] || 0) * f); }
}
if (vos.length) {
  let env = 0; const att = Math.exp(-1 / (0.01 * SR)), rel = Math.exp(-1 / (0.35 * SR));
  let vpk = 0; for (let i = 0; i < N; i++) vpk = Math.max(vpk, Math.abs(VL[i]));
  let mpk = 0; for (let i = 0; i < N; i++) mpk = Math.max(mpk, Math.abs(L[i]), Math.abs(R[i]));
  const vg = 0.95 / (vpk || 1), mg = 0.95 / (mpk || 1);
  for (let i = 0; i < N; i++) {
    const a = Math.abs(VL[i]) * vg; env = a > env ? att * env + (1 - att) * a : rel * env + (1 - rel) * a;
    const duck = 1 - 0.62 * Math.min(1, env * 6);            // music + SFX sit ~8 dB lower while the voice talks
    L[i] = L[i] * mg * 0.5 * duck + VL[i] * vg; R[i] = R[i] * mg * 0.5 * duck + VL[i] * vg;
  }
  console.log('voice clips', vos.length);
}

// ------------------------------------------------ master
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const pre = 0.9 / peak, b = Buffer.alloc(44 + N * 4);
b.write('RIFF', 0); b.writeUInt32LE(36 + N * 4, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16);
b.writeUInt16LE(1, 20); b.writeUInt16LE(2, 22); b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 4, 28);
b.writeUInt16LE(4, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / (SR * 0.004), (N - i) / (SR * 0.02));
  b.writeInt16LE(Math.round(Math.tanh(L[i] * pre * 1.15) * fade * 32000), 44 + i * 4);
  b.writeInt16LE(Math.round(Math.tanh(R[i] * pre * 1.15) * fade * 32000), 46 + i * 4);
}
writeFileSync(`${DIR}/score.wav`, b); console.log(`${DIR}/score.wav`, DUR + 's', META.cues.length, 'cues');
