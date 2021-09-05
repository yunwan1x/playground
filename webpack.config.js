const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    mode: 'development',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({terserOptions:{
            module: true,
            compress: {},
            mangle: {},
            output: {},
            parse: {},
            rename: {},
        }})],
    },
    entry: './docs/src/gitpost.js',
    output: {
        filename: 'gitpost.js',
        path: path.resolve(__dirname, 'public'),
    },
    // devtool: 'inline-source-map',
    devServer: {
        port: 8010,
        host: 'blog.vs2010wy.top',
    },
};
