const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.bytes = 0;
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString();
    this.bytes += data.length;

    try {
      if (this.bytes > this.limit) {
        throw new LimitExceededError();
      } else {
        this.push(data);
      }
    } catch (err) {
      return callback(err);
    }
    callback();
  }
}

module.exports = LimitSizeStream;
