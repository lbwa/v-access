import { Access, AccessMap, VAccessOptions } from '../shared/types'
import { VueConstructor } from 'vue'

export function createAccessMap(accessList: Access[]): AccessMap {
  return accessList.reduce(
    (map: AccessMap, access: Access) =>
      Object.assign(map, {
        [access.id]: access
      }),
    {}
  )
}

export class BasicVAccess {
  static install: (Vue: VueConstructor, VAccessOptions: VAccessOptions) => void

  map: AccessMap = {}
  created: boolean = false

  init(accessList: Access[]) {
    if (this.created) return
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

  reset() {
    this.map = {}
    this.created = false
  }
}
