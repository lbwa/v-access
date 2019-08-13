const { resolve } = require('path')

module.exports = {
  chainWebpack(webpackConf) {
    webpackConf.resolve.alias.set('@src', resolve(__dirname, '../src'))
  }
}
