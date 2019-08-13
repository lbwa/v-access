import { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import VAccessCore from '@src/core'
import VAccess from './components/VAccess'

export default {
  install(Vue: VueConstructor, { router }: { router: VueRouter }) {
    const authClient = new VAccessCore()
    // use this.$_auth.set() to pass accessList
    Vue.prototype.$_auth = authClient

    Vue.component(VAccess.name, Vue.extend(VAccess))

    // router beforeEach navigation guard
    router.beforeEach((to, _, next) => {})
  }
}
