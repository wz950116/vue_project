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

    //获取消息列表
    getMsgList: function (params, fn) {
        $$app.getApi('/api/getMessageByDate.json', params, function (obj) {
            model.trigger('getMsgList', obj);
            fn && fn(obj);
        });
    },
    //批量发送
    sendMsgByCondition: function (params, fn) {
        var data = {
            areaCodes: params.areaCodes,
            msgType: params.msgType,
            userType: params.userType,
            messageContent: params.messageContent
        };
        $$app.getApi('/api/action.json?type=bgMsgbyCondition', data, function (obj) {
            fn && fn(obj);
        });
    },
    //单独发送
    sendMsgByUserId: function (params, fn) {
        var data = {
            msgType: params.nttype,
            userIds: params.cstid,
            messageContent: params.desc
        };
        $$app.getApi('/api/action.json?type=bgMsgbyUserId', data, function (obj) {
            fn && fn(obj);
        });
    },
    //获取发送消息相关参数
    getMsgParams: function (fn) {
        $$app.getApi('/api/bgMsgGetParameters.json', '', function (obj) {
            model.trigger('getMsgParams', obj);
            fn && fn(obj);
        });
    }
});

export default model;
