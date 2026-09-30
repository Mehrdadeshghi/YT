import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const TYPES = { '.html': 'text/html', '.woff2': 'font/woff2', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
export function serve(root = process.cwd()) {
  return new Promise((res) => {
    const srv = http.createServer(async (req, rsp) => {
      try { const f = join(root, (req.url.split('?')[0] === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0])));
        const body = await readFile(f);   // read first, so a missing file becomes a clean 404
        rsp.writeHead(200, { 'content-type': TYPES[extname(f)] || 'application/octet-stream' }); rsp.end(body);
      } catch { rsp.writeHead(404); rsp.end(); }
    }).listen(0, '127.0.0.1', () => res({ url: `http://127.0.0.1:${srv.address().port}/`, close: () => srv.close() }));
  });
}
export async function openPage(chromium, path = '') {
  const s = await serve();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto(s.url + path);
  await page.evaluate(() => window.ready);
  return { page, close: async () => { await browser.close(); s.close(); } };
}
