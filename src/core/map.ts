import { Access, AccessMap } from 'src/shared/types'

let accessMap: AccessMap = {}

export default {
  get(key?: string) {
    return key ? accessMap[key] : accessMap
  },
  set(accessList: Access[]) {
    accessMap = accessList.reduce(
      (map: AccessMap, access: Access) =>
        Object.assign(map, {
          [access.id]: access
        }),
      {}
    )
  }
}
