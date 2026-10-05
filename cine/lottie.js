// Lottie stickers (Noto Emoji Animation by Google, CC BY 4.0) drawn frame-exact into the main canvas.
// ep.lottie = ['mindblown', 'bell', …] (names below or raw codepoints). Loaded by cine.html before the episode script.
// lot(t, tIn, name, x, y, size, o) → springs in at tIn, loops the animation, optional o.out (fade-out time), o.rot, o.speed, o.once, o.f0 (start frame), o.pop:false (no spring-in).
const LOTN = { scream: '1f631', mindblown: '1f92f', wow: '1f62e', shocked: '1f632', flushed: '1f633', starstruck: '1f929', fire: '1f525',
  hundred: '1f4af', heart: '2764_fe0f', thumbsup: '1f44d', eyes: '1f440', think: '1f914', lol: '1f602', party: '1f389', sparkles: '2728',
  skull: '1f480', alarm: '23f0', hourglass: '23f3', bell: '1f514', wave: '1f30a', jellyfish: '1fabc', zap: '26a1', boom: '1f4a5',
  infinity: '267e_fe0f', down: '1f447', comment: '1f4ac', peek: '1fae3', cold: '1f976', dizzy: '1f635_200d_1f4ab', praise: '1f64c', clap: '1f44f',
  idea: '1f4a1', globe: '1f30d', siren: '1f6a8', trophy: '1f3c6', moneyfly: '1f4b8', warning: '26a0_fe0f', question: '2753',
  check: '2705', cross: '274c', turtle: '1f422', shark: '1f988', octopus: '1f419', microbe: '1f9a0',
  crown: '1f451',
  brain: '1f9e0', monocle: '1f9d0', cry: '1f62d', angry: '1f621', cool: '1f60e', hi: '1f44b', rocket: '1f680', bomb: '1f4a3',
  volcano: '1f30b', ghost: '1f47b', alien: '1f47d', robot: '1f916', gift: '1f381' };
var LOT = {};                                      // name → { anim, cv, fr, n }
async function lottieInit(names) {
  await new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'lib/lottie_canvas.min.js'; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); });
  await Promise.all(names.map(async (nm) => {
    const cp = LOTN[nm] || nm, data = await fetch(`assets/lottie/${cp}.json`).then((r) => r.ok ? r.json() : null).catch(() => null); if (!data) return;
    const cv = document.createElement('canvas'); cv.width = cv.height = 384; const cx = cv.getContext('2d');
    const anim = lottie.loadAnimation({ renderer: 'canvas', loop: false, autoplay: false, animationData: data,
      rendererSettings: { context: cx, clearCanvas: true, dpr: 1, preserveAspectRatio: 'xMidYMid meet' } });
    await new Promise((res) => { if (anim.isLoaded) res(); else { anim.addEventListener('DOMLoaded', res); setTimeout(res, 3000); } });
    LOT[nm] = { anim, cv, fr: data.fr || 30, n: Math.max(1, (data.op || 60) - (data.ip || 0) - 1) };
  }));
}
function lot(t, tIn, nm, x, y, size, o = {}) {
  const L = LOT[nm], lt = t - tIn; if (!L || lt < 0) return false;
  const out = o.out != null ? clamp(1 - (t - o.out) / 0.25) : 1; if (out <= 0) return false;
  const s = (o.pop === false ? 1 : spring(lt, o.k || 260, o.d || 14)) * out; if (s <= 0.001) return false;
  let f = (o.f0 || 0) + lt * L.fr * (o.speed || 1); f = o.once ? Math.min(f, L.n) : f % L.n;     // o.f0: start mid-animation
  L.anim.goToAndStop(f, true);
  g.save(); g.translate(x, y); g.rotate((o.rot || 0) + (1 - s) * -0.5); g.scale(s, s); g.globalAlpha *= clamp(s * 1.5);
  g.drawImage(L.cv, -size / 2, -size / 2, size, size); g.restore(); return true;
}
