import Vue from 'vue'
import PluginVAccess from 'v-access'
import router from '@/router'
import pendingPrivateRoutes from '@/router/private'

// vue-router instance is required
Vue.use(PluginVAccess, {
  router,
  routes: pendingPrivateRoutes,
  exclude: /^\/$/
})
