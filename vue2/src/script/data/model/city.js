/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';

var _ = under;
var model = new $$model({});

var query = {
    cityList: {},
    cityDetail: {}
};

_.extend(model, {
    // 获取城市列表
    getAdParams: function (fn) {
        $$app.getApi('/api/adPosInfogetParameters.json', '', function (obj) {
            model.trigger('getAdParams', obj);
            fn && fn(obj);
        });
    },
    //获取城市数据
    getCityStaistics: function (params, fn) {
        $$app.getApi('/api/getCitiesStaistics.json', params, function (obj) {
            model.trigger('getCityStaistics', obj);
            fn && fn(obj);
        });
    },
    //获取城市详情
    getCityDetailStaistics: function (params, fn) {
        _.extend(query.cityDetail, params);
        if (params && params.pageSize) {
            query.cityDetail.eachPageNum = params.pageSize;
        }

        $$app.getApi('/api/getCityDetailStatistics.json', query.cityDetail, function (obj) {
            model.trigger('getCityDetailStaistics', obj);
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
    //获取下载城市概况数据
    getDownloadStatistics: function (params, fn) {
        $$app.getApi('/api/download.json?type=city', params, function (obj) {
            model.trigger('getDownloadStatistics', obj);
            fn && fn(obj);
        });
    },
    //获取下载全部城市概况数据
    getDownloadAllStatistics: function (params, fn) {
        $$app.getApi('/api/download.json?type=allCity', params, function (obj) {
            model.trigger('getDownloadAllStatistics', obj);
            fn && fn(obj);
        });
    },
    //获取下载城市详情数据
    getDownloadDetailStatistic: function (params, fn) {
        $$app.getApi('/api/download.json?type=cityDetail', params, function (obj) {
            model.trigger('getDownloadDetailStatistic', obj);
            fn && fn(obj);
        });
    },
    getCityDetailByPage: function (params) {
        model.trigger('getCityDetailByPage', params);
    },
    getCityDetailAgain:function(){
        model.trigger('getCityDetailAgain');
    }

});

export default model;
