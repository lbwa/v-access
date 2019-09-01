import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: 'route-home' */ '@/views/Home.vue')
    },
    {
      path: '/angular',
      name: 'Angular',
      meta: {
        access: ['vue.write']
      }
    },
    {
      path: '/401',
      name: 'Unauthorized',
      component: () =>
        import(
          /* webpackChunkName: 'route-unauthorized' */ '@/views/Error/401.vue'
        )
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () =>
        import(
          /* webpackChunkName: 'route-not-found' */ '@/views/Error/404.vue'
        )
    }
  ]
})
