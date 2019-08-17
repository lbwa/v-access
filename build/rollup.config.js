import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import path from 'path'
const version = require('../package.json').version

const resolve = p => path.resolve(__dirname, '../', p)

const banner = `/*!
  * v-access v${version}
  * (c) ${new Date().getFullYear()} Bowen<Github: lbwa>
  * @license MIT
  */`

const build = {
  es: {
    output: resolve('dist/v-access.esm.js'),
    format: 'es'
  },

  umd: {
    output: resolve('dist/v-access.min.js'),
    format: 'umd'
  }
}

function createConfig(opts) {
  const options = build[opts]
  const config = {
    input: resolve('src/index.ts'),
    output: {
      file: options.output,
      format: options.format,
      banner,
      name: 'VAccess' // global name in window
    },
    plugins: [
      typescript({
        clean: true
      }),
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

  return config
}

module.exports = createConfig(process.env.TARGET)
