import Vue from 'vue'
import { addRoutes, removeRoutes } from '../src/core/routes'
import { AbilitiesSet } from '../src/core/ability'

describe('routes', () => {
  describe('addRoutes', () => {
    const abilities = ['github.repo.read', 'github.repo.write']
    const fakeAbilities = ['npm.org.add', 'npm.pkg.upload']
    const abilitiesSet = new AbilitiesSet(Vue)
    abilitiesSet.assign(abilities)
    const prototype = {
      constructor: jest.fn(() => ({
        matcher: ''
      }))
    }
    const router: any = Object.create(prototype)

    beforeEach(() => {
      router.addRoutes = jest.fn()
    })

    it('Should add routes', () => {
      const presetRoutes = [
        {
          path: '/ability-resolve',
          meta: { ability: abilities[0] }
        },
        {
          path: '/ability-reject',
          meta: { ability: fakeAbilities[0] }
        },
        {
          path: '/strict-resolve',
          meta: { strict: abilities }
        },
        {
          path: '/strict-reject',
          meta: { strict: [abilities[0], fakeAbilities[0]] }
        },
        {
          path: '/strict-reject',
          meta: { strict: fakeAbilities }
        },
        {
          path: '/weak-resolve',
          meta: { weak: abilities }
        },
        {
          path: '/weak-resolve',
          meta: { weak: [abilities[0], fakeAbilities[0]] }
        },
        {
          path: '/weak-reject',
          meta: { weak: fakeAbilities }
        },
        {
          path: '/with-child',
          children: [
            {
              path: 'first-child',
              meta: { ability: abilities[0] }
            },
            {
              path: 'second-child',
              meta: { ability: fakeAbilities[0] }
            }
          ]
        },
        {
          path: '/without-child',
          children: [
            {
              path: 'first-child',
              meta: { ability: fakeAbilities[0] }
            },
            {
              path: 'second-child',
              meta: { ability: fakeAbilities[0] }
            }
          ]
        }
      ]
      const expectedRoutes = [
        {
          path: '/ability-resolve',
          meta: { ability: abilities[0] }
        },
        {
          path: '/strict-resolve',
          meta: { strict: abilities }
        },
        {
          path: '/weak-resolve',
          meta: { weak: abilities }
        },
        {
          path: '/weak-resolve',
          meta: { weak: [abilities[0], fakeAbilities[0]] }
        },
        {
          path: '/with-child',
          children: [
            {
              path: 'first-child',
              meta: { ability: abilities[0] }
            }
          ]
        }
      ]

      addRoutes(router, presetRoutes, abilitiesSet)
      expect(router.addRoutes.mock.calls[0][0]).toEqual(expectedRoutes)
    })

    it('Should remove routes and rest flag', () => {
      removeRoutes(router)
      expect(prototype.constructor.mock.calls.length).toEqual(1)
    })

    it('Should add routes only once', () => {
      addRoutes(router, [], abilitiesSet)
      addRoutes(router, [], abilitiesSet)
      expect(router.addRoutes.mock.calls.length).toEqual(1)
      removeRoutes(router)
    })

    it("Should throw a Error instance with development env when routes wasn't Array type", () => {
      expect(() => {
        addRoutes(router, '[]' as any, abilitiesSet)
      }).toThrowError('Routes must be a RouteConfig list.')
      removeRoutes(router)
    })
  })
})
