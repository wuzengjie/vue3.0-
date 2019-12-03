import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { Field } from 'mint-ui';
Vue.component(Field.name, Field);
import Router from 'vue-router'

import { Toast } from 'vant';
Vue.use(Toast);


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
return routerPush.call(this, location).catch(error=> error)
}

Vue.config.productionTip = false
Vue.prototype.Toast=Toast

//拦截请求，表示在跳转其他页面需要进行登录
//关于路由的跳转前，判断是否有token
router.beforeEach((to, from, next) => {
  //to.meta.requiresAuth在requiresAuth在route的index.js中可以判断
  if (to.meta.requiresAuth) {  // 判断该路由是否需要登录权限
    let token=sessionStorage.getItem('access_token');
      if (token) {  // 通过vuex state获取当前的token是否存在
          next();
      }
      else {
          next({
              path: '/',
              query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
  }
  else {
      next();
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


