const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  }
})
