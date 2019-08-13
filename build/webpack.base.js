const HTMLWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')
const { __DEV__, fromRoot } = require('./_utils')

module.exports = {
  mode: __DEV__ ? 'development' : 'production',

  context: fromRoot('./'),

  entry: {
    main: fromRoot('./src/index.ts')
  },

  output: {
    path: fromRoot('./dist'),
    filename: __DEV__ ? '[name].[hash].js' : '[name].[contenthash:8].js',
    publicPath: __DEV__ ? '/' : './'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader'
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: fromRoot('public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        minifyCSS: true
      }
    }),
    new WebpackBar({
      name: 'Webpack progress',
      reporter: {
        done(ctx) {
          __DEV__ &&
            console.log(`[DEV]: Server is running at http://localhost:8080`)
        }
      }
    })
  ]
}
