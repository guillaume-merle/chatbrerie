var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin-next');

var config = {
 mode: "development",
 entry: './all-test',
 output: {
   filename: './testBundle.js'
},
 target: 'node',
 externals: [nodeExternals()],
 plugins: [
   new WebpackShellPlugin({
     onBuildExit: "mocha ./testBundle.js --exit"
   })
 ]
};

module.exports = config;