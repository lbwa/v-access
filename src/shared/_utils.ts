const __PROD__ = process.env.NODE_ENV === 'production'
const __TEST__ = process.env.NODE_ENV === 'test'
const noop: Function = () => {}

export let log = noop
export let assert = noop

if (!__PROD__) {
  log = __TEST__
    ? noop
    : (...msg: string[]) => {
        /* eslint-disable-next-line */
        console.log(`[V-Access]: `, ...msg)
      }

  assert = (condition: any, msg: string) => {
    /* istanbul ignore next */
    if (!condition) throw new Error(`[V-ACCESS]: ${msg || 'Unknown error'}`)
  }
}
