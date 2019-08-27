import { EnhanceVAccess } from './core'
import VAccessComponent from './components/VAccess'
import { composeBeforeEach } from './core/guard'
import { assert } from './shared/_utils'

const install: typeof EnhanceVAccess.install = function(
  Vue,
  { router, routes = [], redirect = '/', beforeEach, afterEach }
) {
  const auth = new EnhanceVAccess(router, routes)

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

export default install
