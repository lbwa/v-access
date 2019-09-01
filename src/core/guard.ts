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
    // to next beforeEach hook or resolve current navigation
    if (whiteList.includes(to.path)) return next()

    // NOTICE: auth.reset should be invoked when user logout
    if (!auth.created) {
      return next(`${redirect}?access_redirect=${to.fullPath}`)
    }

    if (!auth.verifyRouteAccess(to as RouteWithAccess)) {
      return next(`${redirect}?access_redirect=${to.fullPath}`)
    }

    // to next beforeEach hook in the pipeline or resolve current navigation
    next()
  }
}
