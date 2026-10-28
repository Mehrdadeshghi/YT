// node snap.mjs <port> <outdir> t1 t2 ... — fast local look at frames (static server on <port> serving proto/zack_3d)
import { chromium } from 'playwright';
import fs from 'fs';
const [port, out, ...ts] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console:', m.text().slice(0, 300)); });
p.on('pageerror', (e) => console.log('pageerror:', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => !!window.__render, null, { timeout: 120000 });
for (const t of ts) {
  const t0 = Date.now();
  await p.evaluate((t) => window.__render(+t), t);
  await p.screenshot({ path: `${out}/f_${(+t).toFixed(2).padStart(6, '0')}.jpg`, type: 'jpeg', quality: 80 });
  console.log(t, Date.now() - t0, 'ms');
}
await b.close();
