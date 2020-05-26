const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();
const limitedStream = new LimitSizeStream({limit: 1000000, encoding: 'utf-8'});

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const dirName = (path.dirname(pathname)).split();

  switch (req.method) {
    case 'POST':
      if (dirName[0] !== '.') {
        res.statusCode = 400;
        res.end('Nested path is not allowed');
      } else {
        fs.exists(filepath, function(exists) {
          if (!exists) {
            const writeStream = fs.createWriteStream(filepath);
 
            limitedStream.pipe(writeStream);
            writeStream.end();

            limitedStream.on('error', (err) => {
              res.statusCode = 413;
              res.end('File size is too big');
            });

            writeStream.end();
            res.statusCode = 201;
            res.end('File successfully created');
          } else {
            res.statusCode = 409;
            res.end(`File already exists`);
          }
        });
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;