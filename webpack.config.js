const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/application.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /tests\.js$/,
                use: 'mocha-loader',
                exclude: '/node_modules/'
            },
        ],
    },
};
