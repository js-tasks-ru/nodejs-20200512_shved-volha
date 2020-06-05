const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const dirName = (path.dirname(pathname)).split();

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, function(err) {
        if (err && err.code === 'ENOENT') {
          if (dirName[0] !== '.') {
            res.statusCode = 400;
          } else {
            res.statusCode = 404;
          }
          res.end(`Error getting the file.`);
        }
        else {
          res.statusCode = 200;
          res.end('File successfully deleted');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
