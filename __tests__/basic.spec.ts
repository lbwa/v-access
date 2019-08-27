import { BasicVAccess } from 'src/core'

describe('BasicVAccess', () => {
  const auth = new BasicVAccess()
  const ACCESS_LIST = [
    {
      id: 'home.read'
    },
    {
      id: 'service.read'
    }
  ]

  it('Instantiation', () => {
    expect(auth.has).toBeDefined()
    expect(auth.init).toBeDefined()
    expect(auth.reset).toBeDefined()
    expect(auth.strict).toBeDefined()
    expect(auth.strictList).toBeDefined()
    expect(auth.weak).toBeDefined()
    expect(auth.weakList).toBeDefined()
  })

  it('Accept access list and create access map', () => {
    auth.init(ACCESS_LIST)
    expect(auth.map).toBeDefined()
    expect(Object.keys(auth.map).length).toBe(ACCESS_LIST.length)
  })

  it('Only invoke once before reset() calling', () => {
    auth.init(ACCESS_LIST.concat({ id: 'react.write' }))
    expect(auth.map).toBeDefined()
    expect(Object.keys(auth.map).length).toBe(ACCESS_LIST.length)
  })

  it('Has ONE access', () => {
    expect(auth.has(ACCESS_LIST[1].id)).toBeTruthy()
    expect(auth.has('mongo.read')).toBeFalsy()
  })

  it('Has AT LEAST ONE access', () => {
    const PENDING_LIST_TRUTHY = [
      ['home.read', 'mongo.read'],
      ['home.read', 'sql.read']
    ]
    const PENDING_FALSY = ['mongo.read', 'sql.read']
    for (const pending of PENDING_LIST_TRUTHY) {
      expect(auth.weak(pending)).toBeTruthy()
      expect(auth.weakList(pending)).toBeTruthy()
    }
    expect(auth.weak(PENDING_FALSY)).toBeFalsy()
    expect(auth.weakList(PENDING_FALSY)).toBeFalsy()
  })

  it('Has ALL access', () => {
    const PENDING_LIST_TRUTHY = [['home.read', 'service.read']]
    const PENDING_FALSY = ['home.read', 'mongo.read']

    for (const pending of PENDING_LIST_TRUTHY) {
      expect(auth.strict(pending)).toBeTruthy()
      expect(auth.strictList(pending)).toBeTruthy()
    }
    expect(auth.strict(PENDING_FALSY)).toBeFalsy()
    expect(auth.strictList(PENDING_FALSY)).toBeFalsy()
  })

  it('Reset all data', () => {
    auth.reset()
    expect(auth.map).toEqual({})
    expect(auth.created).toBe(false)
  })
})
