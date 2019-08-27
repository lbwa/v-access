export default [
  {
    path: '/react',
    name: 'RouteNamedReact',
    component: () =>
      import(/* webpackChunkName: 'route-react' */ '@/views/React.vue'),
    meta: {
      access: ['react.read']
    }
  },
  {
    path: '/vue',
    name: 'RouteNamedVue',
    component: () =>
      import(/* webpackChunkName: 'route-vue' */ '@/views/Vue.vue'),
    meta: {
      access: ['vue.read', 'vue.write']
    }
  },
  {
    path: '/mongo',
    name: 'RouteNamedMongo',
    component: () =>
      import(/* webpackChunkName: 'route-mongo' */ '@/views/Mongo.vue'),
    meta: {
      weakAccess: ['vue.write', 'react.read']
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]
