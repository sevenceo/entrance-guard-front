// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8089,//开发模式项目默认启动端口
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                // target: 'http://qcloud1:18765/api',//设置你调用的接口域名和端口号 别忘了加http
                target: 'http://172.16.0.162:28765/api',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://106.75.115.185:28765/api',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            },
            '/accessToken': {
                // target: 'http://qcloud1:18765/accessToken',//设置你调用的接口域名和端口号 别忘了加http
                target: 'http://172.16.0.162:28765/accessToken',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://106.75.115.185:28765/accessToken',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    '^/accessToken': '/'
                }
            },
            '/dealer': {
                 target: 'http://127.0.0.1:4040/',//设置你调用的接口域名和端口号 别忘了加http
                 // target: 'http://106.75.115.185:28765/ecloud/',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://172.16.0.162:28765/api/ecloud/',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    '^/dealer': '/'
                }
            },
            '/monitoring': {
                 // target: 'http://127.0.0.1:6060/',//设置你调用的接口域名和端口号 别忘了加http
                target: 'http://172.16.0.162:6060/',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://106.75.115.185:6060/',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://172.16.0.139:28765/api/monitoring/',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    '^/monitoring': '/'
                }
            },
            '/attendance': {
                // target: 'http://127.0.0.1:4040/',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://172.16.0.39:10060',//设置你调用的接口域名和端口号 别忘了加http
                // target: 'http://172.16.0.162:10060',//设置你调用的接口域名和端口号 别忘了加http
                target: 'http://127.0.0.1:10060',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true
            }
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: true
    }
}
