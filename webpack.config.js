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
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};
