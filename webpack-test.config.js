var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin-next');

var config = {
 mode: "development",
 entry: './test/all-test',
 target: 'node',
 externals: [nodeExternals()],
 plugins: [
   new WebpackShellPlugin({
     onBuildExit: "mocha ./test/testBundle --exit"
   })
 ]
};

module.exports = config;