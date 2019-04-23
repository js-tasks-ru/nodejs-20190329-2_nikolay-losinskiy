const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      deleteFile(req, res, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  function deleteFile(req, res, filepath) {
    if (pathname.indexOf('/') !== -1) {
      res.statusCode = 400;
      res.end();
      return;
    }

    fs.unlink(filepath, (error) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
        } else {
          res.statusCode = 500;
        }
        res.end();
      } else {
        res.statusCode = 200;
        res.end();
      }
    });
  }
});

module.exports = server;
