import { BasicVAccess, EnhanceVAccess } from './core'
import VAccessComponent from './components/VAccess'
import enhanceInstall from './enhance-install'
import { accessMap } from './core/map'

const basicInstall: typeof BasicVAccess.install = function(Vue) {
  const auth = new BasicVAccess()
  // Only make $$auth.map reactive
  // for better compatibilities use Vue.util.defineReactive,
  // instead Vue.observable(only supported by Vue v2.6.0+)
  Vue.util.defineReactive(auth, 'map', accessMap)

  Vue.component('VAccess', VAccessComponent(Vue))
}

BasicVAccess.install = basicInstall
EnhanceVAccess.install = enhanceInstall
EnhanceVAccess.Basic = BasicVAccess

export default EnhanceVAccess
