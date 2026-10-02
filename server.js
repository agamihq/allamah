// خادم ثابت بسيط بلا اعتماديات: يخدم index.html فقط
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const html = fs.readFileSync(path.join(__dirname, 'index.html'));
const gz = zlib.gzipSync(html);

http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  if (url !== '/' && url !== '/index.html') { res.writeHead(302, { Location: '/' }); return res.end(); }
  const useGz = /\bgzip\b/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    ...(useGz ? { 'Content-Encoding': 'gzip', 'Vary': 'Accept-Encoding' } : {})
  });
  res.end(req.method === 'HEAD' ? undefined : (useGz ? gz : html));
}).listen(PORT, () => console.log('allamah-eval on :' + PORT));
