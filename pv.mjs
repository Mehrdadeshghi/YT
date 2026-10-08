// node pv.mjs "cine.html?ep=121" out.png 0:0.5 1:0.9 ...  -> frames at scene i, fraction f (scene 0 = opener)
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { openPage } from './serve.mjs';
const [PAGE, OUT, ...ts] = process.argv.slice(2);
const { page, close } = await openPage(chromium, PAGE);
const sc = await page.evaluate(() => SCENES.map((s) => [s.from, s.to]));
console.log(sc.map(([a, b]) => `${a.toFixed(1)}-${b.toFixed(1)}`).join(' '));
const files = [];
for (const [i, a] of ts.entries()) { const [k, f] = a.split(':').map(Number), [s0, s1] = sc[k]; await page.evaluate((t) => window.seek(t), s0 + (s1 - s0) * f);
  const fn = `/tmp/claude-0/fr_${i}.png`; await page.locator('#c').screenshot({ path: fn }); files.push(fn); }
await close();
const fc = files.map((_, i) => `[${i}]scale=iw/2:ih/2[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `hstack=inputs=${files.length}`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap((f) => ['-i', f]), '-filter_complex', fc, OUT]);
