import Vue from 'vue'
//import {sync} from 'vuex-router-sync';
import login from './script/login'

Vue.config.devtools = true;

// VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import routes from './config/route-config.js'
const router = new VueRouter({
    mode: 'hash',
    routes
});

// vuex
// import store from './store'

// Element
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Element);

// vueResource
var vueResource = require('vue-resource');
Vue.use(vueResource);

window.app = {
    router: router,
    currentRouter: null
};
window.app.router.beforeEach((to, from, next) => {
    window.app.currentRouter = to;
    next();
});


// AppData
import AppData from './config/data.js'
window.AppData = new AppData();

import App from './app'
new Vue({
    el: '#app',
    router,
    // store,
    render: h => h(App)
});


