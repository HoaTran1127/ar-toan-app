import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = import.meta.dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

const PORT = Number(process.argv[2] || process.env.PORT || 8000);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) { console.error('cong khong hop le: ' + process.argv[2]); process.exit(1); }

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const file = path.resolve(ROOT, rel === '/' ? 'index.html' : rel.slice(1));
  if (file !== ROOT && !file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('serving ar-toan-app at http://127.0.0.1:' + PORT + '/'));
