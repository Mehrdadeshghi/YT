// node scripts/comic/shot.mjs out.png scene t   (look tests)
import { chromium } from 'playwright'; import http from 'http'; import fs from 'fs'; import path from 'path';
const [out, scene, t] = process.argv.slice(2); const T = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const srv = http.createServer((q, s) => { const f = '.' + decodeURI(q.url.split('?')[0]); fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); s.end(); } else { s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); s.end(d); } }); }).listen(0, '127.0.0.1'); await new Promise(r => srv.once('listening', r));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 540, height: 960 } }); p.on('pageerror', e => console.log('PAGEERROR', e.message));
await p.goto(`http://127.0.0.1:${srv.address().port}/scripts/comic/index.html?scene=${scene}`); await p.waitForFunction('window.ready'); await p.evaluate(t => seek(t), +t); await p.screenshot({ path: out }); await b.close(); srv.close();
