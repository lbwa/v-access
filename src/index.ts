import { BasicVAccess, EnhanceVAccess } from './core'
import VAccessComponent from './components/VAccess'
import enhanceInstall from './enhance-install'

const basicInstall: typeof BasicVAccess.install = function(Vue) {
  // make $$auth is reactivity
  // for better compatibilities use Vue.util.defineReactive,
  // instead Vue.observable(only supported by Vue v2.6.0+)
  Vue.util.defineReactive(Vue.prototype, '$$auth', new BasicVAccess())

  Vue.component('VAccess', VAccessComponent(Vue))
}

BasicVAccess.install = basicInstall
EnhanceVAccess.install = enhanceInstall
EnhanceVAccess.Basic = BasicVAccess

export default EnhanceVAccess
