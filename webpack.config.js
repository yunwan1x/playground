const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/gitpost.js',
    output: {
        filename: 'gitpost.js',
        path: path.resolve(__dirname, 'public'),
        clean: true,
    },
    devtool: 'inline-source-map',
    devServer: {
        port: 8010,
        host: 'localhost',
    },
};
