import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/v-access'

Vue.config.productionTip = false

new Vue({
  // Option router will trigger vue-router injection
  router,
  render: h => h(App)
}).$mount('#app')
