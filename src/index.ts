import { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import VAccessCore from '@src/core'
import component from '@src/components/VAccess'
import { createBeforeEachGuard } from '@src/core/guard'

// TODO: How to create a beforeEach guard

export default {
  install(Vue: VueConstructor, { router }: { router: VueRouter }) {
    const authClient = new VAccessCore()
    // use this.$$auth.set() to pass accessList
    Object.defineProperty(Vue.prototype, '$$auth', {
      value: authClient
    })

    Vue.component(component.name, Vue.extend(component))
  }
}
