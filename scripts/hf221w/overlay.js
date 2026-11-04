// #221 world: the few words on screen (date stamps, big numbers, a chip or two). DOM over the canvas, driven by t like everything else.
import { EV, clamp, ss, up, eo, bk, lerp } from './core.js';
const ov = document.getElementById('ov');
const S = [];
function mk(cls, html, y, size, color) { const d = document.createElement('div'); d.className = cls; d.style.top = y + 'px'; if (size) d.style.fontSize = size + 'px'; if (color) d.style.color = color; d.innerHTML = html; ov.appendChild(d); return d; }
// slam-in stamp, from t0 to t1; fn(t) may rewrite the text (counters)
export function stamp(html, t0, t1, y, size, color, o = {}) { S.push({ d: mk('st', html, y, size, color), t0, t1, o }); }
export function chip(html, t0, t1, y, o = {}) { S.push({ d: mk('cp', `<span${o.c ? ` style="background:${o.c};color:${o.fg ?? '#111'};border-color:${o.c};font-weight:700"` : ''}>${html}</span>`, y), t0, t1, o: { ...o, chip: true } }); }
let al;
export function overlay(t) {
  // June's alarm: the whole frame pulses red
  if (!al) { al = document.createElement('div'); al.style.cssText = 'position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(255,30,40,.05),rgba(255,20,30,.55));opacity:0'; ov.prepend(al); }
  const a0 = EV.j_caught, a1 = EV.j_hackers; al.style.opacity = t > a0 - .02 && t < a1 ? (.45 + .55 * Math.max(0, Math.sin((t - a0) * 14))) * (1 - ss(a1 - .25, a1, t)) : 0;
  for (const s of S) { const { d, t0, t1, o } = s, on = t >= t0 - .02 && t < t1; if (!on) { if (d.style.opacity !== '0') d.style.opacity = 0; continue; }
    const u = (t - t0) / .22, out = ss(t1 - .16, t1, t);
    let sc = 1, y = 0, op = 1; if (o.chip) { y = lerp(16, 0, eo(clamp(u))); op = clamp(u * 2); } else { sc = lerp(1.35, 1, eo(clamp(u))); op = clamp(u * 3); }
    if (o.shrink) { const q = eo(up(t, t0 + o.shrink, .3)); sc *= lerp(1, o.to ?? .6, q); y += lerp(0, o.dy ?? -38, q); }
    y -= out * 40; op *= 1 - out;
    d.style.opacity = op; d.style.transform = `translateY(${y}px) scale(${sc})`; if (o.rot) d.style.transform += ` rotate(${o.rot}deg)`; d.style.transformOrigin = o.origin ?? '50% 50%';
    if (o.fn) { const v = o.fn(t); if (d.textContent !== v) d.textContent = v; } }
}
const fmtInt = (v) => Math.round(v).toLocaleString('en-US');
export function buildOverlay() {
  const e = EV, A = '#FFC24A', J = e.j_june, Se = e.s_sept, N = e.n_oct, L = e.l_oct, Dr = e.d_drain, Tw = e.t_binance, P0 = e.p_634, cta = e.cta;
  stamp('A fake job interview', 0, e.h_attack - .1, 250, 118, '#fff');
  stamp('$6.3 billion', e.h_six, e.h_attack - .1, 360, 232, A);
  stamp('The attack chain', e.h_attack, J - .35, 300, 150, '#fff');
  chip('According to Binance', e.h_according, J - .35, 470);
  stamp('June', J - .05, e.j_hackers - .05, 240, 210, A, { shrink: 1, to: .62, dy: -46 });
  stamp('September', Se - .05, N - .55, 240, 190, A, { shrink: 1, to: .62, dy: -46 });
  chip('Malware: not detected', e.s_malware, N - .35, 650, { c: '#35E08C' });
  stamp('20 Oct', N - .05, L - .55, 240, 210, A, { shrink: 1, to: .62, dy: -46 });
  stamp('29 Oct', L - .05, Dr - .55, 240, 210, A, { shrink: 1, to: .62, dy: -46 });
  // the drain: clock + counters
  const t233 = e.d_233, tm = e.d_minutes, m4 = Math.max(.6, tm - t233);
  stamp('20:05 UTC', Dr - .1, Tw - .4, 240, 110, '#fff', { fn: (t) => `20:${String(5 + Math.round(4 * eo(up(t, t233, m4)))).padStart(2, '0')} UTC` });
  stamp('0M XRP', t233, Tw - .4, 340, 220, '#E8F4FF', { fn: (t) => { const u = up(t, t233, m4), v = 233.46 * (1 - (1 - u) ** 3); return u >= 1 ? '233.46M XRP' : `${v.toFixed(1)}M XRP`; } });
  stamp('~970,500 SOL', e.d_solana, Tw - .4, 560, 124, '#E6D4FF');
  stamp('44.2M OP', e.d_optimism, Tw - .4, 680, 124, '#FFC9BF');
  stamp('18,270 BTC', e.d_18270, Tw - .4, 800, 190, '#FFB04A', { fn: (t) => fmtInt(18270 * eo(up(t, e.d_18270, .55))) + ' BTC' });
  // twist
  stamp('Still running', e.t_outflow, e.t_eip - .1, 300, 170, '#7CFFD8');
  stamp('MPC', e.t_mpc, P0 - .55, 250, 170, '#FFD36A');
  stamp('No single key', e.t_no - .03, P0 - .55, 410, 140, '#fff');
  // payoff
  stamp('$0B', P0, e.p_fbi - .12, 240, 260, A, { fn: (t) => { const u = up(t, P0, .7); return `$${(6.34 * (1 - (1 - u) ** 3)).toFixed(2)}B`; } });
  stamp('$2.85B frozen', e.p_285, e.p_fbi - .12, 486, 130, '#BFEBFF');
  stamp('Users won’t pay', e.p_wont - .05, e.p_fbi - .15, 610, 96, '#fff');
  chip('Binance says', e.p_binance, e.p_fbi - .15, 712);
  stamp('FBI: North Korea', e.p_fbi, cta - .3, 250, 150, '#fff');
  // end
  stamp('Weakest link?', cta - .05, 1e4, 250, 170, '#fff');
  chip('Comment installer or interview', e.c_comment, 1e4, 1540, { c: '#fff', fg: '#111' });
  chip('And subscribe', e.c_subscribe, 1e4, 1610, { c: '#FF3B3B', fg: '#fff' });
}
