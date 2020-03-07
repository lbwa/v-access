import Vue from 'vue'
import {
  addRoutes,
  removeRoutes,
  registerAuthorizer,
  RouteWithAbility
} from '../src/core/routes'
import { AbilitiesSet } from '../src/core/ability'
import { NavigationGuard, Route } from 'vue-router'

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
      router.options = {
        routes: [{}, {}]
      }
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

      const allRoutes = addRoutes(router, presetRoutes, abilitiesSet)
      expect(router.addRoutes.mock.calls[0][0]).toEqual(expectedRoutes)
      expect(allRoutes.length).toEqual(expectedRoutes.length)
    })

    it('Should remove routes and reset flag', () => {
      removeRoutes(router)
      expect(prototype.constructor).toBeCalledTimes(1)
    })

    it('Should add routes only once', () => {
      const fakeRoute = {} as RouteWithAbility
      const firstAddition = addRoutes(
        router,
        [fakeRoute, fakeRoute],
        abilitiesSet
      )
      expect(router.addRoutes).toBeCalledTimes(1)
      expect(firstAddition.length).toEqual(2)
      expect(() => {
        addRoutes(router, [fakeRoute, fakeRoute], abilitiesSet)
      }).toThrowError('Should call `reset` function first')
      removeRoutes(router)
    })

    it("Should throw a Error instance with development env when routes wasn't Array type", () => {
      expect(() => {
        addRoutes(router, '[]' as any, abilitiesSet)
      }).toThrowError('Routes must be a RouteConfig list.')
      removeRoutes(router)
    })
  })

  describe('Authorizer', () => {
    const redirect = '/forbidden'
    const abilities = ['github.repo.read', 'github.repo.write']
    const abilitiesSet = new AbilitiesSet(Vue)
    abilitiesSet.assign(abilities)

    let guard: NavigationGuard
    let next: jest.Mock

    beforeEach(() => {
      spyOn(console, 'log')
      guard = registerAuthorizer(redirect, abilitiesSet)
      next = jest.fn()
    })

    it('Should create a navigation guard', () => {
      expect(guard).toBeInstanceOf(Function)
    })

    it('Should pass navigation with redirect path', () => {
      guard(
        {
          fullPath: redirect
        } as Route,
        {} as Route,
        next
      )
      expect(next).toBeCalledTimes(1)
      expect(next.mock.calls[0].length).toEqual(0)
    })

    it('Should pass navigation with a correct ability', () => {
      guard(
        {
          fullPath: '/universal',
          meta: { ability: abilities[0] }
        } as Route,
        {} as Route,
        next
      )
      expect(next).toBeCalledTimes(1)
      expect(next.mock.calls[0].length).toEqual(0)
    })

    it('Should abort navigation and navigate to redirect path', () => {
      guard(
        {
          fullPath: '/should-be-reject',
          meta: { ability: 'npm.org.add' }
        } as any,
        {} as any,
        next
      )
      expect(next).toBeCalledTimes(1)
      expect(next.mock.calls[0].length).toEqual(1)
      expect(next.mock.calls[0][0]).toEqual(
        `${redirect}?from=/should-be-reject`
      )
    })
  })
})
