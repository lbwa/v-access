import VueRouter from 'vue-router'
import { EnhanceVAccess } from 'src/core'
import { RouteWithAccess } from 'src/shared/types'

describe('EnhanceVAccess', () => {
  const pendingRoutes: RouteWithAccess[] = []
  const router = new VueRouter()
  const auth = new EnhanceVAccess(router, pendingRoutes)
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
    expect(auth.createPrivateRoutes).toBeDefined()
    expect(auth.verifyRouteAccess).toBeDefined()
  })

  it('Accept access list and create access map', () => {
    auth.init(ACCESS_LIST)
    expect(auth.map).toBeDefined()
    expect(Object.keys(auth.map).length).toBe(ACCESS_LIST.length)
  })

  it('Prevent multiple initialization', () => {
    auth.init([ACCESS_LIST[0]])
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

  // notice: omit all components
  const routesRoot = {
    path: '/',
    meta: {
      access: ['home.read']
    }
  }
  const routesServiceRead = {
    path: '/service',
    meta: {
      access: ['service.read']
    }
  }
  const routesMongoRead = {
    path: '/mongo',
    meta: {
      access: ['mongo.read']
    }
  }
  const routesServiceOrMongoRead = {
    path: '/service_mongo',
    meta: {
      weakAccess: ['service.read', 'mongo.read']
    }
  }
  const routesNestWithWeakAccess = {
    path: '/nest_with_weak_access',
    children: [
      {
        path: 'service_or_mongo',
        weakAccess: ['service.read', 'mongo.read']
      }
    ]
  }

  it('Create private routes with `access` field', () => {
    expect(
      auth.createPrivateRoutes([routesRoot, routesServiceRead, routesMongoRead])
    ).toStrictEqual([routesRoot, routesServiceRead])
  })

  it('Create private routes with `weakAccess` field', () => {
    expect(
      auth.createPrivateRoutes([
        routesRoot,
        routesServiceRead,
        routesMongoRead,
        routesServiceOrMongoRead
      ])
    ).toStrictEqual([routesRoot, routesServiceRead, routesServiceOrMongoRead])
  })

  it('Create private children routes with `access` field', () => {
    expect(
      auth.createPrivateRoutes([
        {
          path: '/nest_with_access',
          // Level 1 nested routes
          children: [
            {
              path: 'service',
              meta: {
                access: ['service.read']
              }
            },
            {
              path: 'mongo',
              meta: {
                access: ['mongo.read']
              }
            },
            // Level 2 nested routes
            {
              path: 'nest',
              children: [
                {
                  path: 'nest_with_access',
                  meta: {
                    access: ['service.read']
                  }
                },
                {
                  path: 'nest_with_access_mongo',
                  meta: {
                    access: ['mongo.read']
                  }
                },
                {
                  path: 'nest_with_weak_access',
                  meta: {
                    weakAccess: ['service', 'service.read']
                  }
                }
              ]
            }
          ]
        }
      ])
    ).toStrictEqual([
      {
        path: '/nest_with_access',
        children: [
          {
            path: 'service',
            meta: {
              access: ['service.read']
            }
          },
          {
            path: 'nest',
            children: [
              {
                path: 'nest_with_access',
                meta: {
                  access: ['service.read']
                }
              },
              {
                path: 'nest_with_weak_access',
                meta: {
                  weakAccess: ['service', 'service.read']
                }
              }
            ]
          }
        ]
      }
    ])
  })

  it('Create private children routes with `weakAccess` field', () => {
    expect(auth.createPrivateRoutes([routesNestWithWeakAccess])).toStrictEqual([
      routesNestWithWeakAccess
    ])
  })

  it('Reset all data', () => {
    auth.reset()
    expect(auth.map).toEqual({})
    expect(auth.created).toBe(false)
  })
})
