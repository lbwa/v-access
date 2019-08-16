import VAccessCore from '@src/core'

describe('VAccessCore', () => {
  const auth = new VAccessCore()
  const ACCESS_LIST = [
    {
      id: 'accessOne'
    },
    {
      id: 'accessTwo'
    },
    {
      id: 'accessThree'
    }
  ]

  it("With 'new' keyword", () => {
    expect(auth.has).toBeDefined()
    expect(auth.init).toBeDefined()
    expect(auth.reset).toBeDefined()
    expect(auth.strict).toBeDefined()
    expect(auth.strictList).toBeDefined()
    expect(auth.weak).toBeDefined()
    expect(auth.weakList).toBeDefined()
    expect(auth.createPrivateRoutes).toBeDefined()
    expect(auth.verifyRouteAccess).toBeDefined()
  })

  it('Init with access list', () => {
    auth.init(ACCESS_LIST)
    expect(auth.map).toBeDefined()
    expect(Object.keys(auth.map).length).toBe(ACCESS_LIST.length)
  })

  it('Has ONE access', () => {
    expect(auth.has(ACCESS_LIST[1].id)).toBeTruthy()
    expect(auth.has('accessFour')).toBeFalsy()
  })

  it('Has AT LEAST ONE access', () => {
    const PENDING_LIST_TRUTHY = [
      ['accessOne', 'accessFour'],
      ['accessOne', 'accessFive']
    ]
    const PENDING_FALSY = ['accessFour', 'accessFive']
    for (const pending of PENDING_LIST_TRUTHY) {
      expect(auth.weak(pending)).toBeTruthy()
      expect(auth.weakList(pending)).toBeTruthy()
    }
    expect(auth.weak(PENDING_FALSY)).toBeFalsy()
    expect(auth.weakList(PENDING_FALSY)).toBeFalsy()
  })

  it('Has ALL access', () => {
    const PENDING_LIST_TRUTHY = [['accessOne', 'accessTwo']]
    const PENDING_FALSY = ['accessOne', 'accessFour']

    for (const pending of PENDING_LIST_TRUTHY) {
      expect(auth.strict(pending)).toBeTruthy()
      expect(auth.strictList(pending)).toBeTruthy()
    }
    expect(auth.strict(PENDING_FALSY)).toBeFalsy()
    expect(auth.strictList(PENDING_FALSY)).toBeFalsy()
  })
})
