import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    //获取白名单列表
    getWhiteList: function (params, fn) {
        $$app.getApi('/api/getWhiteList.json', params, function (obj) {
            model.trigger('getWhiteList', obj);
            fn && fn(obj);
        });
    },
    //添加白名单
    addWhiteList: function (params, fn) {
        $$app.getApi('/api/addWhiteList.json', params, function (obj) {
            model.trigger('addWhiteList', obj);
            fn && fn(obj);
        });
    },
    //删除白名单
    delWhiteList: function (params, fn) {
        $$app.getApi('/api/delWhiteList.json', params, function (obj) {
            model.trigger('delWhiteList', obj);
            fn && fn(obj);
        });
    },
    //导出白名单列表
    exportWhiteList: function (fn) {
        $$app.getApi('/api/exportWhiteList.json', '', function (obj) {
            model.trigger('exportWhiteList', obj);
            fn && fn(obj);
        });
    },
    //获取城市列表
    getCityList: function (fn) {
        $$app.getApi('/api/statisticGetCityList.json', '', function (obj) {
            model.trigger('getCityList', obj);
            fn && fn(obj);
        });
    },
     // 获取城市列表
    getAdParams: function (fn) {
        $$app.getApi('/api/adPosInfogetParameters.json', '', function (obj) {
            model.trigger('getAdParams', obj);
            fn && fn(obj);
        });
    }
});

export default model;
