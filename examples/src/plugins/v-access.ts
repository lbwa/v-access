import Vue from 'vue'
import PluginVAccess from '@src/index'
import router from '@/router'

// vue-router instance is required
Vue.use(PluginVAccess, { router, redirect: '/' })
