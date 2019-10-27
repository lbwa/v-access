import { Access, AccessMap } from 'src/shared/types'

export let accessMap: { value: AccessMap } = { value: {} }

export function setAccessMap(accessList: Access[]) {
  accessMap.value = accessList.reduce(
    (map: AccessMap, access: Access) =>
      Object.assign(map, {
        [access.id]: access
      }),
    {}
  )
}
