import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    //获取返现优惠列表
    getCashBackList: function (params, fn) {
        $$app.getApi('/api/getCashBackList.json', {}, function (obj) {
            model.trigger('getCashBackList', obj);
            fn && fn(obj);
        });
    },
    //添加返现优惠
    addCashDiscount: function (params, fn) {
        $$app.getApi('/api/addCashDiscount.json', params, function (obj) {
            model.trigger('addCashDiscount', obj);
            fn && fn(obj);
        });
    },
    //删除返现优惠
    delCashDiscount: function (params, fn) {
        $$app.getApi('/api/delCashDiscount.json', params, function (obj) {
            model.trigger('delCashDiscount', obj);
            fn && fn(obj);
        });
    },
    //获取等级优惠列表
    getLevelDiscountList: function (params, fn) {
        $$app.getApi('/api/getLevelDiscountList.json', {}, function (obj) {
            model.trigger('getLevelDiscountList', obj);
            fn && fn(obj);
        });
    },
    //添加等级优惠
    addLevelDiscount: function (params, fn) {
        $$app.getApi('/api/addLevelDiscount.json', params, function (obj) {
            model.trigger('addLevelDiscount', obj);
            fn && fn(obj);
        });
    },
    //删除等级优惠
    delLevelDiscount: function (params, fn) {
        $$app.getApi('/api/delLevelDiscount.json', params, function (obj) {
            model.trigger('delLevelDiscount', obj);
            fn && fn(obj);
        });
    },
    //获取等级名称列表
    getLevelList: function (params, fn) {
        $$app.getApi('/api/getLevelList.json', {}, function (obj) {
            model.trigger('getLevelList', obj);
            fn && fn(obj);
        });
    }
});

export default model;
