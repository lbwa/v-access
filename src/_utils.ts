export function assert(condition: any, msg: string) {
  /* istanbul ignore next */
  if (!condition) throw new Error(`[V-ACCESS]: ${msg || 'Unknown error'}`)
}

export function compose(...fns: Function[]) {
  return (...args: any[]) =>
    fns.reduce((result, fn) => fn(...(result || [])), args)
}
