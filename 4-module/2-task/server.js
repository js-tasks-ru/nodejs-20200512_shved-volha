const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const limitedStream = new LimitSizeStream({limit: 1000000, encoding: 'utf-8'});

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath);
      req.pipe(limitedStream).pipe(writeStream);

      writeStream.on('error', (error) => {
        console.log(error.code);
        writeStream.end();
        if (error.code === 'ENOENT') {
          res.statusCode = 400;
          res.end('File size is too big');
        } else {
          res.statusCode = 500;
          res.end('Internal service error');
        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File successfully created');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
