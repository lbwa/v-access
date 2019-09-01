import { NavigationGuard } from 'vue-router'
import { EnhanceVAccess } from '.'
import { RouteWithAccess } from '../shared/types'

interface ComposeOptions {
  auth: EnhanceVAccess
  redirect: string
}

export function authorizer({
  auth,
  redirect
}: ComposeOptions): NavigationGuard {
  const whiteList = [redirect]

  return function(to, _, next) {
    if (!whiteList.includes(to.path)) {
      // Uninitialized or unauthorized will cause redirect behavior
      if (!auth.created || !auth.verifyRouteAccess(to as RouteWithAccess)) {
        return next(`${redirect}?unauthorized_redirect=${to.fullPath}`)
      }
    }

    /**
     * vue-router accepts a beforeEach hooks list
     * Every beforeEach hook should invoke `next` function to next beforeEach
     * hook in the pipeline or resolve current navigation
     */
    next()
  }
}
