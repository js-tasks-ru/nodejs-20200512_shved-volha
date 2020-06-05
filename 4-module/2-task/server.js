const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const limitedStream = new LimitSizeStream({limit: 1000000});

const server = new http.Server();

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
 
  switch (req.method) {
    case 'POST':
      req
          .pipe(limitedStream)
          .on('error', (error) => {
            res.statusCode = 413;
            res.end();
          })
          .pipe(writeStream)
          .on('error', (error) => {
            if (error.code === 'ENOENT') {
              res.statusCode = 400;
              res.end('File size is too big');
            } else if (error.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('File already exists');
            } else {
              res.statusCode = 500;
              res.end('Internal service error');
            }
          })
          .on('finish', () => {
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
