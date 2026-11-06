import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..', 'dist');
const qa = process.argv.includes('--qa');
const port = qa ? 4174 : 4173;
const mime = { '.html': 'text/html;charset=utf-8', '.js': 'text/javascript;charset=utf-8', '.css': 'text/css;charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (qa && pathname === '/__qa__/') {
    const html = fs.readFileSync(path.join(root, 'test/index.html'), 'utf8').replace('<head>', '<head><base href="/test/">').replace('<script src="script.js">', '<script src="/__qa__/harness.js"></script><script src="script.js">');
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }); res.end(html); return;
  }
  if (qa && pathname === '/__qa__/harness.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript;charset=utf-8' }); res.end(fs.readFileSync(path.join(root, '../tests/client-harness.js'))); return;
  }
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log('Local: http://127.0.0.1:' + port + (qa ? '/__qa__/?scenario=retry' : '/test/')));
