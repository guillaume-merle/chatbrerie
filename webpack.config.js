const path = require('path');

module.exports = {
  mode: 'production',
    entry: './src/views/chat.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
