export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== null && val !== undefined
}

export function isString(val: any): val is string {
  return typeof val === 'string'
}
