// node render.mjs --page "wiki.html?ep=001" --name ep001 [--fps 30 --sub 2 --crf 18]
// writes out/<name>/silent.mp4 and out/<name>/cues.json (sound cues + episode meta from the page)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { openPage } from './serve.mjs';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = Number(arg('fps', 30)), SUB = Number(arg('sub', 2)), NAME = arg('name', 'main'), PAGE = arg('page', '');
const dir = `out/${NAME}`; mkdirSync(dir, { recursive: true });
const { page, close } = await openPage(chromium, PAGE);
const meta = await page.evaluate(() => ({ dur: window.DUR, ep: window.EP || null, cues: window.CUES || [] }));
writeFileSync(`${dir}/cues.json`, JSON.stringify(meta, null, 1));
if (process.argv.includes('--cues-only')) { await close(); process.exit(0); }
const DUR = meta.dur;
const vf = SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null';
const JPG = arg('format', 'jpeg') === 'jpeg';   // PNG screenshots of grainy frames cost ~750 ms each; JPEG q95 ~65 ms
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS * SUB), ...(JPG ? ['-c:v', 'mjpeg'] : []), '-i', '-',
  '-vf', vf, '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium', '-crf', String(arg('crf', 18)), '-pix_fmt', 'yuv420p', `${dir}/silent.mp4`],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const total = Math.round(DUR * FPS * SUB), t0 = Date.now();
for (let i = 0; i < total; i++) {
  const t = Math.max(0, i / (FPS * SUB) - (SUB - 1) / (2 * FPS * SUB));   // subframes centred on the output frame
  await page.evaluate((t) => window.seek(t), t);
  const img = await page.screenshot(JPG ? { type: 'jpeg', quality: 95, clip: { x: 0, y: 0, width: 1080, height: 1920 } } : { type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % (FPS * SUB * 4) === 0) console.log(`[${NAME}] ${(i / (FPS * SUB)).toFixed(0)}s / ${DUR}s  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await close();
console.log('done', `${dir}/silent.mp4`);
