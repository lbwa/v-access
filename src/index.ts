import { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
// import VAccess from './components/VAccess'

export default {
  install(Vue: VueConstructor, { router }: { router: VueRouter }) {
    // Register global Vue.js component
    // Vue.component(VAccess.name, Vue.extend(VAccess))

    // router beforeEach navigation guard
    router.beforeEach((to, _, next) => {})
  }
}
