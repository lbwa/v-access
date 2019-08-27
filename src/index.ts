import VAccessCore from './core'
import VAccessComponent from './components/VAccess'
import { composeBeforeEach } from './core/guard'
import { assert } from './shared/_utils'

export declare const VAccess: VAccessCore

VAccessCore.install = function install(
  Vue,
  {
    router,
    routes = [],
    redirect = '/', // TODO: create a default redirect page, $$unauthorized
    beforeEach,
    afterEach
  }
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

export default VAccessCore
