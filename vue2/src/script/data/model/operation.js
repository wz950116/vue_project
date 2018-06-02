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
    //获取操作者和操作对象
    getOperationIndex: function (fn) {
        $$app.getApi('/api/operationHistoryIndex.json', '', function (obj) {
            model.trigger('getOperationIndex', obj);
            fn && fn(obj);
        });
    },
    //获取操作列表
    getOperationList: function (params, fn) {
        $$app.getApi('/api/operationHistoryDetails.json', params, function (obj) {
            model.trigger('getOperationList', obj);
            fn && fn(obj);
        });
    },
    getTargetType:function(obj){
        model.trigger('getTargetType', obj);
    },
    getOpByPage:function(params){
        model.trigger('getOpByPage', params);
    }
});

export default model;
