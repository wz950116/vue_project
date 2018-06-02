import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.use(Router);

// lazy router
const InsertList = reslove => {
	require.ensure(['@/components/intervention/insert-list.vue'], () => {
		reslove(require('@/components/intervention/insert-list.vue'));
	});
};
const DeletedList = reslove => {
	require.ensure(['@/components/intervention/deleted-list.vue'], () => {
		reslove(require('@/components/intervention/deleted-list.vue'));
	});
};
const DeleteList = reslove => {
	require.ensure(['@/components/intervention/delete-list.vue'], () => {
		reslove(require('@/components/intervention/delete-list.vue'));
	});
};
const History = reslove => {
	require.ensure(['@/components/history/history.vue'], () => {
		reslove(require('@/components/history/history.vue'));
	});
};
// const Management = reslove => {
// 	require.ensure(['@/components/management/management.vue'], () => {
// 		reslove(require('@/components/management/management.vue'));
// 	});
// };

var router = new Router({
	routes: [
	    // {
	    //     path: '/management',
	    //     name: 'management',
	    //     component: Management
	    // },
	    {
	        path: '/insert',
	        name: 'insert-list',
	        component: InsertList
	    },
	    {
	        path: '/deleted',
	        name: 'deleted-list',
	        component: DeletedList
	    },
	    {
	        path: '/delete',
	        name: 'delete-list',
	        component: DeleteList
	    },
	    {
	        path: '/history',
	        name: 'history-operation',
	        component: History
	    },
	],
	mode: "hash"
});

router.beforeEach((to, from, next)=>{
	NProgress.start();
	next();
});
router.afterEach(()=>{
	NProgress.done();
});

export default router