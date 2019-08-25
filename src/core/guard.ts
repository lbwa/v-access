import { NavigationGuard } from 'vue-router'
import { compose } from '../shared/_utils'
import VAccessCore from '.'
import { RouteWithAccess } from '../shared/types'
import { NextParameters } from '..'

interface ComposeOptions {
  auth: VAccessCore
  redirect: string
}

export function composeBeforeEach({ auth, redirect }: ComposeOptions) {
  return (hook: Function | Promise<NextParameters>): NavigationGuard => {
    const whiteList = [redirect]

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
