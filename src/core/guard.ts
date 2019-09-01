import { NavigationGuard } from 'vue-router'
import { EnhanceVAccess } from '.'
import { RouteWithAccess, VAccessOptions } from '../shared/types'

interface ComposeOptions {
  auth: EnhanceVAccess
  redirect: VAccessOptions['redirect']
  exclude: VAccessOptions['exclude']
}

export function authorizer({
  auth,
  redirect,
  exclude
}: ComposeOptions): NavigationGuard {
  const isInExclude = (function(condition) {
    if (Array.isArray(condition))
      return (route: RouteWithAccess) => condition.includes(route.path)

    if (condition instanceof RegExp) {
      return (route: RouteWithAccess) => condition.test(route.path)
    }

    return () => false
  })(exclude)

  const verifyRouteAccess = (route: RouteWithAccess) =>
    auth.created && auth.verifyRouteAccess(route as RouteWithAccess)

  return function(to, _, next) {
    if (to.path === redirect || isInExclude(to) || verifyRouteAccess(to)) {
      /**
       * vue-router accepts a beforeEach hooks list
       * Every beforeEach hook should invoke `next` function to
       * **next beforeEach** hook in the pipeline or resolve current navigation
       */
      return next()
    }

    // Uninitialized or unauthorized will cause redirect behavior
    next(`${redirect}?unauthorized=${to.fullPath}`)
  }
}
