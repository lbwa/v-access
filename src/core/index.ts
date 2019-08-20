import { Access, AccessMap, RouteWithAccess } from '../shared/types'
import { assert, readObjectSize } from '../shared/_utils'

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
  map: AccessMap = {}
  created: boolean = false
  size: number = readObjectSize(this.map)

  constructor() {
    assert(
      this instanceof VAccessCore,
      'VAccess is a constructor and should be called with the `new` keyword'
    )
  }

  init(accessList: Access[]) {
    if (this.created) return
    this.map = createAccessMap(accessList)
    this.size = readObjectSize(this.map)
    this.created = true
  }

  reset() {
    this.map = {}
    this.created = false
    this.size = 0
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
