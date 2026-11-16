// node scripts/comic/clip.mjs <page.html> <outdir> <fps>   (renders a whole look test to frames)
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [page, out, fps] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true }); const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, s) => { const f = '.' + decodeURI(q.url.split('?')[0]); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); }).listen(0, '127.0.0.1'); await new Promise(r => srv.once('listening', r));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(`http://127.0.0.1:${srv.address().port}/${page}?w=1080&h=1920`); await p.waitForFunction('window.ready'); const end = await p.evaluate('END');
for (let i = 0; i < Math.round(end * fps); i++) { await p.evaluate(t => seek(t), i / fps); await p.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 92 }); }
await b.close(); srv.close(); console.log('done');
