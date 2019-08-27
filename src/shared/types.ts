import VueRouter, { RouteConfig, NavigationGuard } from 'vue-router'

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
