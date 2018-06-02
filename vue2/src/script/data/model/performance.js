/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';

var _ = under;
var model = new $$model({});

_.extend(model, {

    // 获取城市列表
    getAdParams: function (fn) {
        $$app.getApi('/api/adPosInfogetParameters.json', '', function (obj) {
            model.trigger('getAdParams', obj);
            fn && fn(obj);
        });
    },

    
    //获取城市数据
    getCity: function (params, fn) {
        $$app.getApi('/api/performanceGetCityList.json', '', function (obj) {
            model.trigger('getCity', obj);
            fn && fn(obj);
        });
    },
    //获取绩效列表
    getPerformance: function (params, fn) {
        $$app.getApi('/api/getPerformance.json', params, function (obj) {
            model.trigger('getPerformance', obj);
            fn && fn(obj);
        });
    },
    //获取绩效详情
    getPerformanceDetail: function (params, fn) {
        $$app.getApi('/api/getPerformanceDetail.json', params, function (obj) {
            model.trigger('getPerformanceDetail', obj);
            fn && fn(obj);
        });
    },
    //新增人员
    addUser: function (params, fn) {
        $$app.getApi('/api/action.json?type=addUser', params, function (obj) {
            model.trigger('addUser', obj);
            fn && fn(obj);
        });
    },
    //下载绩效
    downLoadPerformace: function (params, fn) {
        $$app.getApi('/api/download.json?type=performace', params, function (obj) {
            model.trigger('downLoadPerformace', obj);
            fn && fn(obj);
        });
    },
    //获取下载参数
    getPerformaceDownloadParams: function (params) {
        model.trigger('getPerformaceDownloadParams', params);
    },
    getPerByPage: function (params) {
        model.trigger('getPerByPage', params);
    }
});

export default model;
