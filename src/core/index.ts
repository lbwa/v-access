import VueRouter from 'vue-router'
import { Access, AccessMap, RouteWithAccess } from '../shared/types'
import { assert, readObjectSize, log } from '../shared/_utils'

function createAccessMap(accessList: Access[]): AccessMap {
  return accessList.reduce(
    (map: AccessMap, access: Access) =>
      Object.assign(map, {
        [access.id]: access
      }),
    {}
  )
}

export default class VAccessCore {
  private presetRoutes: RouteWithAccess[]
  private router: VueRouter
  map: AccessMap = {}
  created: boolean = false

  constructor(router: VueRouter, routes: RouteWithAccess[]) {
    assert(
      this instanceof VAccessCore,
      'VAccess is a constructor and should be called with the `new` keyword'
    )
    this.presetRoutes = routes
    this.router = router
  }

  init(accessList: Access[]) {
    if (this.created) return
    this.map = createAccessMap(accessList)

    const privateRoutes = this.createPrivateRoutes(this.presetRoutes)
    log('Private routes', privateRoutes)
    this.router.addRoutes(privateRoutes)

    this.created = true
  }

  reset() {
    this.map = {}
    this.created = false
  }

  has(accessId: string) {
    return !!this.map[accessId]
  }

  weak(accessIdList: string[]) {
    return accessIdList.some(this.has.bind(this))
  }

  strict(accessIdList: string[]) {
    return accessIdList.every(this.has.bind(this))
  }

  weakList(accessIdList: string[]) {
    return this.weak(accessIdList)
  }

  strictList(accessIdList: string[]) {
    return this.strict(accessIdList)
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
