import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    //获取省份列表
    getProvinceList: function (params, fn) {
        $$app.getApi('/api/getAreaList.json', params, function (obj) {
            model.trigger('getProvinceList', obj);
            fn && fn(obj);
        });
    },
    //获取城市列表
    getCityList: function (params, fn) {
        $$app.getApi('/api/getAreaList.json', params, function (obj) {
            model.trigger('getCityList', obj);
            fn && fn(obj);
        });
    },
    //获取地区列表
    getAreaList: function (params, fn) {
        $$app.getApi('/api/getAreaList.json', params, function (obj) {
            model.trigger('getAreaList', obj);
            fn && fn(obj);
        });
    },
    //获取表格数据列表
    getLoupanDataList: function (params, fn) {
        $$app.getApi('/api/getLoupanDataList.json', params, function (obj) {
            model.trigger('getLoupanDataList', obj);
            fn && fn(obj);
        });
    },
    //改变展示数据列
    changeShowData: function (data) {
        model.trigger('changeShowData', data);
    },
    //跳页
    getLoupanDataByPage: function (page) {
        model.trigger('getLoupanDataByPage', page);
    }
});

export default model;
