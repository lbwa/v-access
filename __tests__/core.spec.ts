import VAccessCore from '@src/core'

describe('Instantiation', () => {
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
    expect(auth.strictList).toBeDefined()
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
    expect(auth.weakList(['accessOne', 'accessFour'])).toBeTruthy()
    expect(auth.weakList(['accessOne', 'accessFive'])).toBeTruthy()
  })

  it('Has ALL access', () => {
    expect(auth.strictList(['accessOne', 'accessTwo'])).toBeTruthy()
    expect(auth.strictList(['accessOne', 'accessFour'])).toBeFalsy()
    expect(auth.strictList(['accessOne', 'accessFive'])).toBeFalsy()
  })
})
