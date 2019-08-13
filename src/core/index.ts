import { Access, AccessMap } from '@src/shared/types'

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

  constructor({ accessList }: { accessList: Access[] }) {
    this.map = createAccessMap(accessList)
  }
}
