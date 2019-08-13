import { Access, AccessMap } from '@src/shared/types'
import { assert } from '@src/_utils'

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
  private map: AccessMap

  constructor() {
    assert(
      this instanceof VAccessCore,
      'VAccess is a constructor and should be called with the `new` keyword'
    )
    this.map = {}
  }

  init(accessList: Access[]) {
    this.map = createAccessMap(accessList)
  }

  has = (accessId: string) => {
    return !!this.map[accessId]
  }

  weakList(accessIdList: string[]) {
    return accessIdList.some(this.has)
  }

  strictList(accessIdList: string[]) {
    return accessIdList.every(this.has)
  }
}
