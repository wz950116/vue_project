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
    //获取当前用户信息
    getUserInfo (fn) {
        $$api('api/user/info', {}, data => {
            fn && fn(data);
        })
    },
    setUserInfo (params) {
        model.trigger('setUserInfo', params);
    },
    //删除用户权限
    delUserByEmail (param, fn) {
        $$api('api/user/del', param, data => {
            fn && fn(data);
        })
    },
    //获取城市信息
    getCityInfos(params, fn){
        $$api("api/info/city", params, data => {
            fn&&fn(data);
        })
    },
    setCityInfos (params) {
        model.trigger('setCityInfos', params);
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
    // 统一平台城市权限
    getCityPermission: function (params, fn) {
        $.ajax({
            type: "get",
            url: '//common-ldap-op.focus' +  window.env + '.cn/citypermission',
            data: params,
            async: true,
            cache: false,
            success: function (res) {
                fn && fn(res);
            },
            error: function() {
                console.log("error");
            }
        });
    },
});

export default model;