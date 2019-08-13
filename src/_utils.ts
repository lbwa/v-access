export function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[V-ACCESS]: ${msg || 'Unknown error'}`)
}

export function compose(...fns: Function[]) {
  if (!fns.length) return (arg: any) => arg
  return (...args: any[]) =>
    fns.reduce((result, fn) => fn(...(result || [])), args)
}
