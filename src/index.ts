import { VueConstructor } from 'vue'
import VueRouter, { NavigationGuard } from 'vue-router'
import VAccessCore from './core'
import VAccessComponent from './components/VAccess'
import { composeBeforeEach } from './core/guard'
import { assert } from './shared/_utils'
import { RouteWithAccess } from './shared/types'

export type NextParameters = (Parameters<(Parameters<NavigationGuard>)[2]>)[0]
export type BeforeEachHook = NavigationGuard | Promise<NextParameters>
export declare const VAccess: VAccessCore

interface VAccessOptions {
  router: VueRouter
  routes?: RouteWithAccess[]
  redirect?: string
  beforeEach?: BeforeEachHook
  afterEach?: (Parameters<VueRouter['afterEach']>)[0]
}

export default {
  install(
    Vue: VueConstructor,
    {
      router,
      routes = [],
      redirect = '/', // TODO: create a default redirect page, $$unauthorized
      beforeEach,
      afterEach
    }: VAccessOptions = {} as VAccessOptions
  ) {
    const auth = new VAccessCore(router, routes)

      // use this.$$auth.init() to pass accessList
    ;(Vue as any).util.defineReactive(Vue.prototype, '$$auth', auth)

    Vue.component('VAccess', VAccessComponent(Vue))

    assert(
      router,
      'You need provide vue-router instance to create router filter.'
    )
    routes &&
      router.beforeEach(
        composeBeforeEach({ auth, redirect })(beforeEach || (() => {}))
      )
    afterEach && router.afterEach(afterEach)
  }
}
