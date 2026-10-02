// node frames.mjs "wiki.html?ep=002" out/x.png 6.5 13.5 23.5   -> one strip of frames at those times
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { openPage } from './serve.mjs';
const [PAGE, OUT, ...ts] = process.argv.slice(2);
const { page, close } = await openPage(chromium, PAGE);
const files = [];
for (const [i, t] of ts.entries()) { await page.evaluate((t) => window.seek(t), Number(t)); const f = `/tmp/claude-0/fr_${i}.png`;
  await page.locator('#c').screenshot({ path: f }); files.push(f); }
await close();
const fc = files.length > 1 ? files.map((_, i) => `[${i}]scale=iw/2:ih/2[s${i}]`).join(';') + ';' + files.map((_, i) => `[s${i}]`).join('') + `hstack=inputs=${files.length}` : '[0]scale=iw/2:ih/2';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...files.flatMap((f) => ['-i', f]), '-filter_complex', fc, OUT]);
