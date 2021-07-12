const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/application.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this',
        publicPath: './test/testBundle'
    },
    resolve: {
        fallback: {
            "console": require.resolve("console-browserify"),
            "assert": require.resolve("assert/")
        }
    },
    optimization: {
        minimize: true
    }
};
