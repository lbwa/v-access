export function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`[V-ACCESS]: ${msg || 'Unknown error'}`)
}
