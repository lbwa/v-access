import { EnhanceVAccess } from './core'
import VAccessComponent from './components/VAccess'
import { authorizer } from './core/guard'
import { assert } from './shared/_utils'

const install: typeof EnhanceVAccess.install = function(
  Vue,
  { router, routes = [], redirect = '/' }
) {
  assert(
    router,
    'You need provide vue-router instance to create router filter.'
  )

  const auth = new EnhanceVAccess(router, routes)

    // use this.$$auth.init() to pass accessList
  ;(Vue as any).util.defineReactive(Vue.prototype, '$$auth', auth)

  Vue.component('VAccess', VAccessComponent(Vue))

  router.beforeEach(authorizer({ auth, redirect }))
}

export default install
