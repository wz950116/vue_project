var path = require('path');
var webpack = require("webpack");
var htmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

var publicPath = '/';

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: __dirname + "/dist/",
        publicPath: publicPath,
        filename: "[name].[hash].js"
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src')
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000
            }
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }]
        }]
    },
    // 本地服务器配置
    devServer: {
        contentBase: './dist',
        historyApiFallback: true,
        inline: true,
        port: 4002,
        disableHostCheck: true  // 禁用host的授权检测
    },
    plugins: [
        new FriendlyErrorsPlugin(),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: `./index.html`,
            inject: true
        })
    ]
}
