import { VueConstructor } from 'vue'
import VueRouter, { NavigationGuard } from 'vue-router'
import VAccessCore from '@src/core'
import VAccessComponent from '@src/components/VAccess'
import { composeBeforeEach } from '@src/core/guard'
import { assert } from './shared/_utils'
import { RouteWithAccess } from './shared/types'

export type NextParameters = (Parameters<(Parameters<NavigationGuard>)[2]>)[0]
export type BeforeEachHook = NavigationGuard | Promise<NextParameters>

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
    const auth = new VAccessCore()
    // use this.$$auth.set() to pass accessList
    Object.defineProperty(Vue.prototype, '$$auth', {
      enumerable: true,
      value: auth
    })

    Vue.component('VAccess', VAccessComponent(Vue))

    assert(
      router,
      'You need provide vue-router instance to create router filter.'
    )
    routes &&
      router.beforeEach(
        composeBeforeEach({ router, routes, auth, redirect })(
          beforeEach || (() => {})
        )
      )
    afterEach && router.afterEach(afterEach)
  }
}
