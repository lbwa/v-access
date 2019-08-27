import { NavigationGuard } from 'vue-router'
import { compose } from '../shared/_utils'
import { EnhanceVAccess } from '.'
import { RouteWithAccess, NextParameters } from '../shared/types'

interface ComposeOptions {
  auth: EnhanceVAccess
  redirect: string
}

export function composeBeforeEach({ auth, redirect }: ComposeOptions) {
  return (hook: Function | Promise<NextParameters>): NavigationGuard => {
    const whiteList = [redirect]

    /**
     * @description Why do we implement beforeEach composite ? and beforeEach
     * navigation guards already support a guards list.
     *
     * TL,DR : Ensure above function would be last calling which is used to
     * play a authorizer role.
     *
     * Detail:
     *  1. register navigation guard
     *    https://github.com/vuejs/vue-router/blob/dev/src/index.js#L134
     *  2. Push callback to same type guard list, and return a cleaner for removing the registered callbacks.
     *    https://github.com/vuejs/vue-router/blob/dev/src/index.js#L244-L250
     *    https://router.vuejs.org/api/#router-beforeeach
     */
    return function(to, _, next) {
      if (whiteList.includes(to.path)) return next()

      /**
       * @description Handle logout
       * auth.reset should be invoked when user logout
       */
      if (!auth.created) {
        return next(redirect)
      }

      if (!auth.verifyRouteAccess(to as RouteWithAccess)) {
        return next(redirect)
      }

      // Run custom function and ensure next function calling
      if (hook instanceof Promise) {
        debugger
        hook.then(next)
      } else {
        compose(
          hook,
          next
        )(to, _)
      }
    }
  }
}
