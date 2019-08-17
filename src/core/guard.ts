import VueRouter, { NavigationGuard } from 'vue-router'
import { compose } from '@src/shared/_utils'
import VAccessCore from '.'
import { RouteWithAccess } from '@src/shared/types'
import { NextParameters } from '..'

interface ComposeOptions {
  router: VueRouter
  routes: RouteWithAccess[]
  auth: VAccessCore
  redirect: string
}

export function composeBeforeEach({
  router,
  routes,
  auth,
  redirect
}: ComposeOptions) {
  return (hook: Function | Promise<NextParameters>): NavigationGuard => {
    let hasRoutesAdded = false
    const whiteList = [redirect]
    const privateRoutes: RouteWithAccess[] = auth.createPrivateRoutes(routes)

    return function(to, _, next) {
      if (whiteList.includes(to.path)) return next()

      /**
       * @description Handle logout
       * auth.reset should be invoked when user logout
       */
      if (!auth.created) {
        return next(redirect)
      }

      if (!hasRoutesAdded && privateRoutes.length) {
        router.addRoutes(privateRoutes)
        hasRoutesAdded = true
      }

      if (!auth.verifyRouteAccess(to as RouteWithAccess)) {
        return next(redirect)
      }

      // Run custom function and ensure next function calling
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
}
