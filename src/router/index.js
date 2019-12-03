import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import success from '@/components/success.vue'
import login from '@/components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
           requiresAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
  },
  {
    path: '/success',
    name: 'success',
    component: success,
    meta: {
            requiresAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
  },
  {
    path:'/login',
    name:'login',
    component:login,
    meta: {
           requiresAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
