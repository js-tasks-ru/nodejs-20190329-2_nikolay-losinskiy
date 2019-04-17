const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.str = '';
  }

  _transform(chunk, encoding, callback) {
    this.str += chunk.toString('utf8');

    callback();
  }

  _flush(callback) {
    this.str.split(os.EOL)
        .forEach((value) => {
          this.push(value);
        });

    callback();
  }
}

module.exports = LineSplitStream;
