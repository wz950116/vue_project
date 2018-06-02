var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
var utils = require('./utils.js');

var root = path.resolve(__dirname, '../');

var publicPath = './';

var webpackConfig = {
    entry: {
        app: `${root}/src/main.js`
    },
    output: {
        path: `${root}/dist/`,
        publicPath: publicPath,
        filename: '[name].[chunkhash].js'
    },
    externals: {
        'AMap': 'window.AMap'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: root,
                exclude: /node_modules/
            },
            
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },
            utils.styleLoaders({ sourceMap: false })
        ]
    },
    resolve: {
        extensions: ['', '.js', '.vue'],
        fallback: [ `${root}/node_modules` ]
    },
    resolveLoader: {
        fallback: [ `${root}/node_modules` ]
    },
    vue: {
        loaders: utils.cssLoaders()
    },
    devtool: '#source-map',
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: `${root}/src/index.html`,
            inject: true
        })
    ]
};

module.exports = webpackConfig;
