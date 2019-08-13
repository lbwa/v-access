import { NavigationGuard } from 'vue-router'
import { compose } from '@src/_utils'

export function createBeforeEachGuard(
  hook: Function | Promise<any>
): NavigationGuard {
  return function(to, _, next) {
    // TODO: filter is here

    // Run custom function
    if (hook instanceof Promise) {
      hook.then(next)
    } else {
      compose(
        hook,
        next
      )(to, _)
    }
  }
}
