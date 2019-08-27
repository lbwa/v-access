import VueRouter, { RouteConfig, NavigationGuard } from 'vue-router'
import VAccessCore from '../core'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $$auth: VAccessCore
  }
}

declare module 'vue-router/types/router' {
  interface VueRouter {
    options: RouterOptions

    // https://github.com/vuejs/vue-router/blob/v3.1.2/src/create-matcher.js#L11-L14
    matcher: {
      match: (
        raw: RawLocation,
        current?: Route,
        redirectedFrom?: Location
      ) => Route
      addRoutes: (routes: RouteConfig[]) => void
    }
  }
}

export interface Access {
  readonly id: string
  readonly [accessKey: string]: any
}

export interface AccessMap {
  readonly [accessIdKey: string]: Access
}

export interface RouteWithAccess extends RouteConfig {
  readonly children?: RouteWithAccess[]
  readonly meta?: {
    access?: string[]
    weakAccess?: string[]
    [metaKey: string]: any
  }
}

export type UserGuard<T> = Function | Promise<T>

export type NextParameters = (Parameters<(Parameters<NavigationGuard>)[2]>)[0]

export type BeforeEachHook = NavigationGuard | Promise<NextParameters>

export interface VAccessOptions {
  router: VueRouter
  routes?: RouteWithAccess[]
  redirect?: string
  beforeEach?: BeforeEachHook
  afterEach?: (Parameters<VueRouter['afterEach']>)[0]
}
