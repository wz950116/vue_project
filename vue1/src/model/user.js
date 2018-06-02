import $$api from '@/model/api.js';
import $$model from './model.js';
import _ from '../lib/underscore.v1.4.4.min.js';

var model = new $$model({});
var userData = {
    userId: 1,
    userName: '羊羊',
    cookie: ''
};

_.extend(model, {
    getUserInfo (fn) {
        $$api('api/user/info', '', data => {
            fn && fn(data);
        })
    },
    setUserInfo (params) {
        model.trigger('setUserInfo', params);
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
    }
});

export default model;