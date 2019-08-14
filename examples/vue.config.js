const { resolve } = require('path')

module.exports = {
  devServer: {
    // https://github.com/webpack/webpack-dev-server/issues/2190#issuecomment-520670599
    contentBase: './public'
  },
  chainWebpack(webpackConf) {
    // path alias
    webpackConf.resolve.alias.set('@src', resolve(__dirname, '../src'))

    // Enforce use examples/.eslintrc.js
    // https://github.com/webpack-contrib/eslint-loader#defining-configfile-or-using-eslint--c-patheslintrc
    webpackConf.module
      .rule('eslint')
      .use('eslint-loader')
      .tap(options => ({
        ...options,
        configFile: resolve('.eslintrc.js')
      }))
  }
}
