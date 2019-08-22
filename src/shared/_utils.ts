const __PROD__ = process.env.NODE_ENV === 'production'
const noop: Function = () => {}

export function compose(...fns: Function[]) {
  return (...args: any[]) =>
    fns.reduce((result, fn) => fn(...(result || [])), args)
}

export function readObjectSize(obj: { [key: string]: any }) {
  return Object.keys(obj).length
}

export let log = noop
export let assert = noop

if (!__PROD__) {
  log = (...msg: string[]) => {
    /* eslint-disable-next-line */
    console.log(`[V-Access]: `, ...msg)
  }

  assert = (condition: any, msg: string) => {
    /* istanbul ignore next */
    if (!condition) throw new Error(`[V-ACCESS]: ${msg || 'Unknown error'}`)
  }
}
