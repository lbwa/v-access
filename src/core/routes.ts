import VueRouter, {
  RouteConfig,
  RouterOptions,
  NavigationGuard
} from 'vue-router'
import { AbilitiesSet, Ability } from './ability'
import { isDef } from 'src/shared/utils'
import invariant from 'tiny-invariant'

export interface RouteWithPrivilege extends RouteConfig {
  readonly children?: RouteWithPrivilege[]
  readonly meta?: {
    strict?: Ability[]
    weak?: Ability[]
    privilege: Ability
  }
}

let routerOptions: RouterOptions | null
let isRoutesAdded = false

export function addRoutes(
  router: VueRouter,
  routes: RouteWithPrivilege[],
  abilitiesSet: AbilitiesSet
) {
  if (isRoutesAdded) return

  routerOptions = router.options
  const createRoutes = (routes: RouteWithPrivilege[]) =>
    routes.reduce((list: RouteWithPrivilege[], route) => {
      const shallow = { ...route }
      if (verifyRoute(route, abilitiesSet)) {
        if (shallow.children) {
          shallow.children = createRoutes(shallow.children)
        } else {
          list.push(shallow)
        }
      }
      return list
    }, [])

  invariant(Array.isArray(routes), 'Routes must be a RouteConfig list.')

  const privilegeRoutes = createRoutes(routes)
  router.addRoutes(privilegeRoutes)
  isRoutesAdded = true
}

export function removeRoutes(router: VueRouter) {
  const Router = Object.getPrototypeOf(router).constructor

  // router.matcher includes all routes we set, so we replace it with new
  // matcher to reset our vue-router instance
  router.matcher = new Router(Object.assign({}, routerOptions)).matcher
  routerOptions = null
  isRoutesAdded = false
}

/**
 * No matter where route is come from, we will verify all routes which has
 * included `meta.x` properties.
 */
export function verifyRoute(
  route: RouteWithPrivilege,
  abilitiesSet: AbilitiesSet
) {
  const { meta = {} as Record<string, any> } = route

  if (Array.isArray(meta.strict)) {
    return abilitiesSet.verifyAll(meta.strict)
  }

  if (Array.isArray(meta.weak)) {
    return abilitiesSet.verifySome(meta.weak)
  }

  if (isDef(meta.privilege)) {
    return abilitiesSet.has(meta.privilege)
  }
  return true
}

export function registerAuthorizer(
  redirect: string,
  abilitiesSet: AbilitiesSet
): NavigationGuard {
  if (__DEV__) {
    console.log('[v-access]: Authorizer registered.')
  }
  return function(to, _, next) {
    if (to.fullPath === redirect || verifyRoute(to, abilitiesSet)) {
      return next()
    }

    next(`${redirect}?from=${to.fullPath}`)
  }
}
