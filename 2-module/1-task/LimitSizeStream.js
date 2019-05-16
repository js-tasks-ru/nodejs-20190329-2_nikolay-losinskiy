const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._size = 0;
    this._limit = options && options.limit ? options.limit : 0;
  }

  _transform(chunk, encoding, callback) {
    if (this._limit) {
      this._size += chunk.length;
    }

    if (this._limit && this._size > this._limit) {
      callback(new LimitExceededError());
      return;
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
