const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const root = __dirname;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.join(root, pathname);
  if (pathname.startsWith('/api/')) {
    res.writeHead(404);
    res.end('API requires Vercel runtime');
    return;
  }
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    let ct = 'text/html';
    if (ext === '.css') ct = 'text/css';
    if (ext === '.js') ct = 'application/javascript';
    if (ext === '.json') ct = 'application/json';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(content);
  });
});
server.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
