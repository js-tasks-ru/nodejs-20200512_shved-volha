const stream = require('stream');
const os = require('os');
class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.line = '';
    this.data = [];
  }

  _transform(chunk, encoding, callback) {
    this.line += chunk.toString();
    this.data = this.line.split(os.EOL);
    callback();
  }

  _flush(callback) {
    for (let line of this.data) {
      this.push(line); 
    }
    // This will be called when there is no more written data to be consumed,
    // but before the 'end' event is emitted signaling the end of the Readable stream.
    callback();
  }
}

module.exports = LineSplitStream;
