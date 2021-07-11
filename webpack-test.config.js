var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin-next');

const path = require('path');

var config = {
 mode: "development",
 entry: './test/all-test',
 target: 'node',
 output: {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'dist'),
  globalObject: 'this',
  publicPath: './test/testBundle'
  },
 externals: [nodeExternals()],
 plugins: [
   new WebpackShellPlugin({
     onBuildExit: "mocha ./test/testBundle --exit --timeout 10000"
   })
 ],
 module: {
  rules: [
    {
        test: /\.(js)$/,
        exclude: /node_modules/
    },
    {
      test: /\.(js)$/,
      exclude: /node_modules/,
      use: [
          {
              loader: 'transform-loader?'+path.resolve('brfs.js')
          },
      ]
    }
  ]
 },
 target: "node",
    externals:{
        fs:    "commonjs fs",
        path:  "commonjs path"
    }
};

module.exports = config;