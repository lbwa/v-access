import { Access, VAccessOptions } from '../shared/types'
import { VueConstructor } from 'vue'
import map from './map'
export class BasicVAccess {
  static install: (Vue: VueConstructor, VAccessOptions: VAccessOptions) => void

  created: boolean = false
  get map() {
    return map.get()
  }

  init(accessList: Access[]) {
    if (this.created) return
    map.set(accessList)
    this.created = true
  }

  has(accessId: string) {
    return !!map.get(accessId)
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
    map.set([])
    this.created = false
  }
}
