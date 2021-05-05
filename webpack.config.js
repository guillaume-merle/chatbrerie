const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/chat.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};