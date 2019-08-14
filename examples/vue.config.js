const { resolve } = require('path')

module.exports = {
  devServer: {
    // https://github.com/webpack/webpack-dev-server/issues/2190#issuecomment-520670599
    contentBase: './public'
  },
  chainWebpack(webpackConf) {
    webpackConf.resolve.alias.set('@src', resolve(__dirname, '../src'))
  }
}
