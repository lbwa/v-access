import { Access, AccessMap, RouteWithAccess } from '@src/shared/types'
import { assert } from '@src/shared/_utils'

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

  constructor() {
    assert(
      this instanceof VAccessCore,
      'VAccess is a constructor and should be called with the `new` keyword'
    )
  }

  init(accessList: Access[]) {
    this.map = createAccessMap(accessList)
    this.created = true
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

  createPrivateRoutes(pendingRoutes: RouteWithAccess[]) {}
}
