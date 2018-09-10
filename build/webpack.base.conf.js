var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function resolveApp(relativePath) {
    return path.resolve(relativePath);
}


module.exports = {
    entry: {
        app: './src/main.js'
    },
    externals: {
        "BMap": "BMap"
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].[hash].js',
        publicPath: process.env.NODE_ENV === 'production'
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components'),
            'views': path.resolve(__dirname, '../src/views'),
            'api': path.resolve(__dirname, '../src/api'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'store': path.resolve(__dirname, '../src/store'),
            'router': path.resolve(__dirname, '../src/router'),
            'mock': path.resolve(__dirname, '../src/mock'),
            'vendor': path.resolve(__dirname, '../src/vendor'),
            'static': path.resolve(__dirname, '../static'),
            'jquery': 'jquery'
        }
    },
    // vue: {
    //     html: {
    //         // all loader queries can be specified here
    //         // also, you can specify options for htmlMinifier here.
    //     }
    // },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig,
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         { loader: 'css-loader', options: { importLoaders: 1 } },
            //         'postcss-loader'
            //     ]
            // },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolveApp('favicon.ico')
        }),
        new webpack.ProvidePlugin({
            // Promise: 'es6-promise-promise',
            $: 'jquery',
            'jQuery': 'jquery'
        })

    ],

}
