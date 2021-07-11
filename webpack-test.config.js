var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin-next');

const path = require('path');

var config = {
 mode: "development",
 entry: './test/all-test',
 target: 'node',
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
    }
  ]
 }
};

module.exports = config;