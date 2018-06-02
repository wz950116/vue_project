import Vue from 'vue'

import login from './model/login'

Vue.config.devtools = true;

import App from './App'

// vue-router
import router from './router'

// http
import axios from 'axios'
import VueAxios from 'vue-axios'

// vuex
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

Vue.use(VueAxios, axios)

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