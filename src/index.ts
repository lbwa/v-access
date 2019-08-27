import { BasicVAccess, EnhanceVAccess } from './core'
import VAccessComponent from './components/VAccess'
import enhanceInstall from './enhance-install'

const basicInstall: typeof BasicVAccess.install = function(Vue) {
  // use this.$$auth.init() to pass accessList
  ;(Vue as any).util.defineReactive(Vue.prototype, '$$auth', new BasicVAccess())

  Vue.component('VAccess', VAccessComponent(Vue))
}

BasicVAccess.install = basicInstall
EnhanceVAccess.install = enhanceInstall
EnhanceVAccess.Basic = BasicVAccess

export default EnhanceVAccess
