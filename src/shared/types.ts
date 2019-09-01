import VueRouter, { RouteConfig } from 'vue-router'

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

export interface VAccessOptions {
  router: VueRouter
  routes?: RouteWithAccess[]
  redirect?: string
  exclude: string[] | RegExp
}
