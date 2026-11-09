// node render.mjs out_dir w h samples "t1,t2,.." or fps [shard of] (run from repo root; serves over a local port)
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [out, w, h, n, spec, shard = 0, of = 1, ev = '/hf/225/ev.json'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.hdr': 'application/octet-stream', '.json': 'application/json' };
// byte ranges: the page seeks inside the video, Chrome needs 206 responses for that
const srv = http.createServer((q, s) => { const f = '.' + decodeURI(q.url.split('?')[0]); fs.stat(f, (e, st) => { if (e) { s.writeHead(404); s.end(); return; } const type = T[path.extname(f)] || 'application/octet-stream', r = /bytes=(\d*)-(\d*)/.exec(q.headers.range || '');
  if (r) { const a = r[1] ? +r[1] : 0, b = r[2] ? +r[2] : st.size - 1; s.writeHead(206, { 'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${a}-${b}/${st.size}`, 'content-length': b - a + 1 }); fs.createReadStream(f, { start: a, end: b }).pipe(s); }
  else { s.writeHead(200, { 'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size }); fs.createReadStream(f).pipe(s); } }); }).listen(0, '127.0.0.1');
await new Promise(r => srv.once('listening', r));
const b = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
await p.goto(`http://127.0.0.1:${srv.address().port}/scripts/hf225r/index.html?w=${w}&h=${h}&n=${n}&ev=${encodeURIComponent(ev)}`); await p.waitForFunction('window.ready', null, { timeout: 120000 });
const end = await p.evaluate('END'), ts = spec.includes(',') ? spec.split(',').map(Number) : Array.from({ length: Math.round(end * +spec) }, (_, i) => i / +spec);
let t0 = Date.now();
for (let i = +shard; i < ts.length; i += +of) { const f = `${out}/f${String(i).padStart(4, '0')}.jpg`; if (fs.existsSync(f)) continue; await p.evaluate(t => seek(t), ts[i]); await p.screenshot({ path: f, type: 'jpeg', quality: 95, timeout: 0 }); }
console.log('done', ((Date.now() - t0) / Math.ceil((ts.length - +shard) / +of) / 1000).toFixed(2), 's/frame'); await b.close(); srv.close();
