/*
 * @description util
 * @date 2016年11月1日11:48:32
 * @author Luobata
 */

import userModel from '../model/user.js';

let util = {
    isuniqueId: function(id) {

    },
    isObject: function(data) {

    },
    isFunction: function(fn) {

    },
    isString: function(str) {

    },
    isEqual: function(a, b) {

    },
    has: function(data, key) {

    },
    clone: function(obj) {

    },
    extend: function(obj, target) {

    },
    formate: function (data) {
        // data的属性可能是obj
        var str = '';
        for (var k in data) {
            if (typeof data[k] === 'object') {
                str += '&' + k + '=' + this.formate(data[k]);
            } else {
                str += '&' + k + '=' + data[k];
            }
        }
        str = str.substr(1);
        return str;
    },
    fetch: function (url, http, data) {
        var args;
        if (url.indexOf('house-sv-base') === -1) {
            http.credentials = 'include';
            http.Cookie = userModel.getCookie();
        }
        if (data instanceof Object) {
            args = JSON.stringify(data);
        } else {
            args = data;
        }

        if (http.method === 'POST') {
            http.body = args; 
        } else {
            url += '?' + args;
        }
        return fetch(url, http);
    },
    dateFormat: function (date, str) {
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(str)) str = str.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(str)) str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return str;
    }
}

export default util;
