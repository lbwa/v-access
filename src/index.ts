import { VueConstructor } from 'vue'
import VueRouter, { NavigationGuard, Route } from 'vue-router'
import VAccessCore from '@src/core'
import component from '@src/components/VAccess'
import { composeBeforeEach } from '@src/core/guard'
import { assert } from './_utils'

type BeforeEachHook = NavigationGuard | Promise<any>

interface VAccessOptions {
  router: VueRouter
  beforeEach: BeforeEachHook
  afterEach: (to: Route, from: Route) => any
}

export default {
  install(
    Vue: VueConstructor,
    { router, beforeEach, afterEach }: VAccessOptions = {} as VAccessOptions
  ) {
    const authClient = new VAccessCore()
    // use this.$$auth.set() to pass accessList
    Object.defineProperty(Vue.prototype, '$$auth', {
      value: authClient
    })

    Vue.component(component.name, Vue.extend(component))

    assert(
      !!router,
      'You need provide vue-router instance to create router filter.'
    )
    beforeEach && router.beforeEach(composeBeforeEach(beforeEach))
    afterEach && router.afterEach(afterEach)
  }
}
