/**
 * Created by wangtang on 2017/01/22.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {

    //新增配额
    addRechargeById: function (params, fn) {
        $$app.getApi('/api/addRechargeById.json', params, function (obj) {
            model.trigger('addRechargeById', obj);
            fn && fn(obj);
        });
    },
    //获取配额列表
    getRechargeList: function (params, fn) {
        $$app.getApi('/api/getRechargeList.json', params, function (obj) {
            model.trigger('getRechargeList', obj);
            fn && fn(obj);
        });
    },
    //取消配额
    cancelRechargeById: function (params, fn) {
        $$app.getApi('/api/cancelRechargeById.json', params, function (obj) {
            model.trigger('cancelRechargeById', obj);
            fn && fn(obj);
        });
    },
    //批量给运营充值
    rechargeByExcelFile: function (params, fn) {
        $$app.getApi('/api/rechargeByExcelFile.json', params, function (obj) {
            model.trigger('rechargeByExcelFile', obj);
            fn && fn(obj);
        });
    }
});

export default model;
