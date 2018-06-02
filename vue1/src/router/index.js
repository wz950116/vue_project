import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
Vue.use(Router);

// lazy router
const SellerManage = reslove => {
	require.ensure(['@/components/seller-manage/seller-manage.vue'], () => {
		reslove(require('@/components/seller-manage/seller-manage.vue'));
	});
};
const SellerList = reslove => {
	require.ensure(['@/components/seller-manage/seller-list.vue'], () => {
		reslove(require('@/components/seller-manage/seller-list.vue'));
	});
};
const SellerLoupan = reslove => {
	require.ensure(['@/components/seller-manage/seller-loupan.vue'], () => {
		reslove(require('@/components/seller-manage/seller-loupan.vue'));
	});
};
const Estate = reslove => {
	require.ensure(['@/components/estate-manage/estate.vue'], () => {
		reslove(require('@/components/estate-manage/estate.vue'));
	});
};
const EstateManage = reslove => {
	require.ensure(['@/components/estate-manage/estate-manage.vue'], () => {
		reslove(require('@/components/estate-manage/estate-manage.vue'));
	});
};
const EstateMoney = reslove => {
	require.ensure(['@/components/estate-manage/estate-money.vue'], () => {
		reslove(require('@/components/estate-manage/estate-money.vue'));
	});
};
const Management = reslove => {
	require.ensure(['@/components/management/management.vue'], () => {
		reslove(require('@/components/management/management.vue'));
	});
};

var router = new Router({
	routes: [
	    {
	        path: '/seller-manage',
	        component: SellerManage,
	        children: [
				{
					path: '',
					name: 'seller-list',
					component: SellerList
				}, {
					path: 'seller-loupan/:id',
					name: 'seller-loupan',
					component: SellerLoupan
				}
	        ]
	    },
	    {
	        path: '/estate-manage',
	        component: Estate,
	        children: [
	        	{
	        		path: '',
	        		name: 'estate-manage',
	        		component: EstateManage
	        	}, {
	        		path: 'estate-money/:id',
	        		name: 'estate-money',
	        		component: EstateMoney
	        	}
	        ]
	    },
	    {
	        path: '/management',
	        name: 'management',
	        component: Management
	    }
	],
	mode: "hash"
});

router.beforeEach((to, from, next)=>{
	NProgress.start();
	next();
})
router.afterEach(()=>{
	NProgress.done();
})

export default router