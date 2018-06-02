/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';

var _ = under;
var model = new $$model({});

var query = {};

_.extend(model, {
    //获取客户参数
    getCustomerParams: function (fn) {
        $$app.getApi('/api/customersIndex.json', '', function (obj) {
            model.trigger('getCustomerParams', obj);
            fn && fn(obj);
        });
    },
    //根据省份获取城市
    getCity: function (params, fn) {
        $$app.getApi('/api/customersCities.json', params, function (obj) {
            model.trigger('getCity', obj);
            fn && fn(obj);
        });
    },
    //获取客户列表
    getCustomerList: function (params, fn) {
        $$app.getApi('/api/customersList.json', params, function (obj) {
            model.trigger('getCustomerList', obj);
            fn && fn(obj);
        });
    },
    //获取客户详细
    getCustomerDetail: function (params, fn) {
        $$app.getApi('/api/customersBasicInfo.json', params, function (obj) {
            model.trigger('getCustomerDetail', obj);
            fn && fn(obj);
        });
    },
    //获取子客信息
    getChildCustomer: function (params, fn) {
        $$app.getApi('/api/customersChildGuests.json', params, function (obj) {
            model.trigger('getChildCustomer', obj);
            fn && fn(obj);
        });
    },
    //获取子客楼盘
    getChildEstates: function (params, fn) {
        $$app.getApi('/api/customersEstates.json', params, function (obj) {
            model.trigger('getChildEstates', obj);
            fn && fn(obj);
        });
    },
    //获取子客订单
    getChildOrders: function (params, fn) {
        $$app.getApi('/api/customersOrders.json', params, function (obj) {
            model.trigger('getChildOrders', obj);
            fn && fn(obj);
        });
    },
    getCustomerByPage:function(params){
        model.trigger('getCustomerByPage', params);
    },
    // 获取城市列表
    getCityList: function (fn) {
        $$app.getApi('/api/adPosInfogetParameters.json', '', function (obj) {
            model.trigger('getAdParams', obj);
            fn && fn(obj);
        });
    },
    //获取推广顾问列表
    getConsultantList: function (fn) {
        $$app.getApi('/api/getConsultantList.json', '', function (obj) {
            model.trigger('getConsultantList', obj);
            fn && fn(obj);
        });
    },
    //查询推广顾问下的代理商消耗
    searchExpend: function (params,fn) {
        $$app.getApi('/api/searchExpend.json', params, function (obj) {
            model.trigger('searchExpend', obj);
            fn && fn(obj);
        });
    },
    //下载推广顾问下的代理商消耗
    downloadExpend: function (params,fn) {
        $$app.getApi('/api/downloadExpend.json', params, function (obj) {
            model.trigger('downloadExpend', obj);
            fn && fn(obj);
        });
    },
    //查询代理商消耗明细
    searchDetail: function (params,fn) {
        $$app.getApi('/api/searchDetail.json', params, function (obj) {
            model.trigger('searchDetail', obj);
            fn && fn(obj);
        });
    },
    //下载代理商消耗明细
    downloadDetail: function (params,fn) {
        $$app.getApi('/api/downloadDetail.json', params, function (obj) {
            model.trigger('downloadDetail', obj);
            fn && fn(obj);
        });
    }
});

export default model;
