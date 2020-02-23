import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
const version = require('../package.json').version

const fromRoot = p => path.resolve(__dirname, '../', p)

const banner = `/*!
  * v-access v${version}
  * (c) ${new Date().getFullYear()} Bowen<Github: lbwa>
  * @license MIT
  */`

const build = {
  es: {
    env: 'development',
    output: fromRoot('dist/v-access.esm.development.js'),
    format: 'es',
    plugins: []
  },

  cjs: {
    env: 'development',
    output: fromRoot('dist/v-access.cjs.development.js'),
    format: 'cjs',
    plugins: []
  },

  umd: {
    env: 'development',
    output: fromRoot('dist/v-access.development.js'),
    format: 'umd',
    plugins: []
  },

  min: {
    env: 'production',
    output: fromRoot('dist/v-access.production.min.js'),
    format: 'umd',
    plugins: [
      terser({
        output: {
          comments: function(node, comment) {
            const text = comment.value
            const type = comment.type
            if (type == 'comment2') {
              // multiline comment
              return /@preserve|@license|@cc_on/i.test(text)
            }
          }
        }
      })
    ]
  }
}

function createConfig(opts) {
  const options = build[opts]
  const config = {
    input: fromRoot('src/install.ts'),
    treeshake: true,
    output: {
      file: options.output,
      format: options.format,
      banner,
      name: 'VAccess', // global name in window
      sourcemap: true,
      exports: 'named',
      external: ['vue-router', 'vue']
    },
    plugins: [
      // https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
      resolve({
        browser: true
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(options.env),
        __DEV__: JSON.stringify(options.env === 'development')
      }),
      typescript({
        clean: true,
        typescript: require('typescript'),
        tsconfigDefaults: {
          exclude: [
            // all TS test files, regardless whether co-located or in test/ etc
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/*.spec.tsx',
            '**/*.test.tsx',
            // TS defaults below
            'node_modules',
            'bower_components',
            'jspm_packages'
          ],
          compilerOptions: {
            sourceMap: true,
            declaration: true
          }
        }
      })
    ].concat(options.plugins)
  }

  return config
}

module.exports = Object.keys(build).map(createConfig)
