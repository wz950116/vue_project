/**
 * Created by wangwei on 2016/11/21.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';


var _ = under;
var model = new $$model({});
var userData = {
    userId: 1,
    userName: '羊羊',
    cookie: ''
};

_.extend(model, {
    getUserInfo: function (fn) {
        $$app.getApi('/api/getInfo.json', '', function (obj) {
            model.trigger('getUserInfo', obj);
            fn && fn(obj);
        });
    },
    disableTab: function (roles) {
        model.trigger('disableTab', roles);
    },
    getCookie: function () {
        var that = this;
        that.trigger('getCookie');
        return userData.cookie;
    },
    setCookie: function (userCookie) {
        var that = this;
        userData.cookie = userCookie;
        that.trigger('setCookie');
    },
    logout: function (fn) {
        $$app.getApi('/api/action.json?type=logout', '', function (obj) {
            fn && fn(obj);
        });
    },
    setUserInfo: function (params) {
        model.trigger('setUserInfo', params);
    }
});


export default model;
