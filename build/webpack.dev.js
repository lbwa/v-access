const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map',

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    clientLogLevel: 'warning',
    // web 页的错误遮罩
    overlay: {
      warnings: true,
      errors: true
    },
    hot: true,
    noInfo: true
  }
})
