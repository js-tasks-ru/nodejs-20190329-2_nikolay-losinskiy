const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end();
    return;
  }

  switch (req.method) {
    case 'GET':
      readFile(filepath, res);
      break;
    default:
      res.statusCode = 500;
      res.end();
  }
});

function readFile(filepath, res) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.statusCode = (err.code === 'ENOENT') ? 404 : 500;
      res.end();
      return;
    }

    res.end(data);
  });
}

module.exports = server;
