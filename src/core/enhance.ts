import VueRouter, { RouterOptions } from 'vue-router'
import { Access, RouteWithAccess } from '../shared/types'
import { assert, log } from '../shared/_utils'
import { BasicVAccess, createAccessMap } from './basic'
import DefaultErrorComponent from '../components/Error'
import { VueConstructor } from 'vue'

export const UNAUTHORIZED_ROUTE = '/@v-access-error'

export class EnhanceVAccess extends BasicVAccess {
  static Basic: typeof BasicVAccess

  private Vue: VueConstructor
  private router: VueRouter
  private routerOptions: RouterOptions
  private pendingRoutes: RouteWithAccess[]

  constructor({
    Vue,
    router,
    routes
  }: {
    Vue: VueConstructor
    router: VueRouter
    routes: RouteWithAccess[]
  }) {
    super()
    assert(
      this instanceof EnhanceVAccess,
      'VAccess is a constructor and should be called with the `new` keyword'
    )
    this.Vue = Vue
    this.router = router
    this.routerOptions = router.options || {}
    this.pendingRoutes = routes || []
  }

  init(accessList: Access[]) {
    if (this.created) return
    this.map = createAccessMap(accessList)

    if (this.router) {
      const privateRoutes = [
        {
          name: 'VAccessError',
          path: UNAUTHORIZED_ROUTE,
          component: DefaultErrorComponent(this.Vue),
          props: {
            errorCode: 401,
            errorMessage: 'Unauthorized access'
          }
        },
        ...this.createPrivateRoutes(this.pendingRoutes)
      ]
      this.router.addRoutes(privateRoutes)
      log('Private routes', privateRoutes)
    }

    this.created = true
  }

  reset() {
    this.map = {}
    this.created = false

    /**
     * @description to implement addRoutes resetting
     * @ref https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
     */
    this.router.matcher = new VueRouter(
      Object.assign({}, this.routerOptions)
    ).matcher
  }

  createPrivateRoutes(pendingRoutes: RouteWithAccess[]) {
    return pendingRoutes.reduce((result: RouteWithAccess[], route) => {
      const routeShallow = { ...route }
      if (this.verifyRouteAccess(routeShallow)) {
        if (routeShallow.children) {
          routeShallow.children = this.createPrivateRoutes(
            routeShallow.children
          )
        }

        if (!(routeShallow.children && !routeShallow.children.length)) {
          result.push(routeShallow)
        }
      }
      return result
    }, [])
  }

  verifyRouteAccess(route: RouteWithAccess) {
    const { meta } = route
    if (meta && meta.access) {
      return meta.access.every(this.has.bind(this))
    }
    if (meta && meta.weakAccess) {
      return meta.weakAccess.some(this.has.bind(this))
    }
    return true
  }
}
