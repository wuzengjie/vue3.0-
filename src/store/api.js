/**
  * axios封装
  * 请求拦截、响应拦截、错误统一处理
  */
 import axios from 'axios';
 import QS from 'qs';
 import router from '@/router';
 import store from '@/store/index';
 import { Toast } from 'vant';


// 环境的切换
//设置开发环境，测试环境，生产环境
//在package.json中设置"serve": "vue-cli-service serve --mode development","build": "vue-cli-service build --mode production"
//
if (process.env.NODE_ENV == 'development') {
	axios.defaults.baseURL = 'http://localhost:8081'}
else if (process.env.NODE_ENV == 'debug') {
	axios.defaults.baseURL = 'http://localhost:8081';
}
else if (process.env.NODE_ENV == 'production') {
	axios.defaults.baseURL = 'http://localhost:8081';
}

//axios.defaults.timeout设置默认的请求超时时间
axios.defaults.timeout = 10000

//post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


// 先导入vuex,因为我们要使用到里面的状态对象
// vuex的路径根据自己的路径去写
//import store from '@/store/index';
//1.全局loadin配置

/*2.token校验:一般是在登录完成之后,将用户的token通过localStorage或者cookie存在本地;
然后用户每次在进入页面的时候（即在main.js中），会首先从本地存储中读取token;
如果token存在说明用户已经登陆过则更新vuex中的token状态;
然后,在每次请求接口的时候,都会在请求的header中携带token;
后台人员就可以根据你携带的token来判断你的登录是否过期,如果没有携带,则说明没有登录过。
v1.每次发送请求之前判断vuex中是否存在token        
v2.如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
v3.即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断*/

// 请求拦截器
axios.interceptors.request.use(
    config => {
        // 每次发送请求之前判断vuex中是否存在token
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        const token = sessionStorage.getItem('access_token');
        token && (config.headers.Authorization = token);
        console.log(token);
        return config;
    },
    error => {
        return Promise.error(error);
})

// 响应拦截器
axios.interceptors.response.use(
    response => {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (response.status === 200) {
            console.log("请求成功");
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                //后台通过给response的status进行设置状态码就可以执行相应的跳转
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    router.replace({
                        path: '/',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                // 403 token过期
                // 登录过期对用户进行提示
                // 清除本地token和清空vuex中token对象
                // 跳转登录页面
                case 403:
                      Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    //store.state.token="";
                    sessionStorage.removeItem("access_token")
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                    setTimeout(() => {
                        router.replace({
                            path: '/',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }
    });




/**
  * get方法，对应get请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
 export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err =>{
            reject(err.data)
    })
});}



/**
  * post方法，对应post请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
 export function post(url, params) {
    return new Promise((resolve, reject) => {
          axios.post(url, QS.stringify(params))
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) =>{
            reject(err.data)
        })
    });
}
