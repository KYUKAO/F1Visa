const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  let filePath = path.join(__dirname, url === '/' ? 'index.html' : url);

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback: serve index.html for SPA-style routing
        if (url !== '/favicon.ico') {
          fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
            if (!err2) {
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end(data2);
            } else {
              res.writeHead(404);
              res.end('Not Found: ' + url);
            }
          });
          return;
        }
        res.writeHead(404);
        res.end();
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  F1 Visa Config is running at: http://localhost:${PORT}\n`);
});
