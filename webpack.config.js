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
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
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
        ],
    },
    target: "node",
    externals:{
        fs:    "commonjs fs",
        path:  "commonjs path"
    }
};
