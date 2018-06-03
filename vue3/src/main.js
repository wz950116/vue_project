import Vue from 'vue'

import login from './model/login'

Vue.config.devtools = true;

import App from './App'

// vue-router
import router from './router'

// axios
// import axios from './model/axios'
import axios from 'axios'
Vue.prototype.$axios = axios;
axios({
	url: '/api/addresslist',
	method: 'get',
	baseURL: 'http://127.0.0.1:3000',
	params: {},
	withCredentials: true,
}).then(res => {
	console.log(res.data, 111);
})

// fetch
let headers = new Headers({
	'Access-Control-Allow-Origin': '*',
	'Content-Type': 'text/plain; application/json; charset=utf8'
})
let result = fetch('http://127.0.0.1:3000/api/addresslist', {
	headers
})
result.then(res => {
	return res.json();
}).then(data => {
	console.log(data, 222);
})

// vuex
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

Vue.config.productionTip = false  // 生产提示

// 全局定义路由变量
window.app = {
    router: router,
    currentRouter: null
};
window.app.router.beforeEach((to, from, next) => {
    window.app.currentRouter = to;
    next();
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");