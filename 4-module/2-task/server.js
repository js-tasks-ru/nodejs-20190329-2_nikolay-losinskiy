const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.indexOf('/') !== -1) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      writeFile(req, res, filepath);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

function writeFile(req, res, filepath) {
  const wStream = fs.createWriteStream(filepath, {flags: 'wx'});
  const limitStream = new LimitSizeStream({limit: 1024 * 1024});

  req.on('error', () => send500(res));
  res.on('error', () => send500(res));
  limitStream.on('error', (error) => {
    if (error instanceof LimitExceededError) {
      fs.unlink(filepath, (err) => {
        if (err) send500(res);

        res.statusCode = 413;
        res.end();
      });
    } else {
      send500(res);
    }
  });
  wStream.on('error', (error) => {
    if (error.code === 'EEXIST') {
      res.statusCode = 409;
      res.end();
    } else {
      send500(res);
    }
  });

  req.on('aborted', () => {
    fs.unlink(filepath, (err) => {
      if (err) send500(res);
    });
  });

  wStream.on('close', () => {
    res.statusCode = 201;
    res.end();
  });

  req.pipe(limitStream).pipe(wStream);
}

function send500(res) {
  res.statusCode = 500;
  res.end();
}

module.exports = server;
