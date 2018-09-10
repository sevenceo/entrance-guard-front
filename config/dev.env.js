var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_API: '"http://222.190.113.253:8010"',
    BASE_API: '""',
    MATERIAL_API: '"http://222.190.113.253:8050/"',
    UPLOAD_API: '"http://222.190.113.253:8010/"'
})
