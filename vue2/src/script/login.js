/**
 * Created by WeiWang on 2016/12/23.
 */
import $$user from '../script/data/model/user.js';
import _ from '../lib/underscore.v1.4.4.min'
var base = location.hostname;
var cookies = document.cookie;
var mainUrl = 'http://' + base + '/ecology-ad-admin/#/city';
var type = '';
var hashName = location.hash;
if (base.indexOf('focus-test') >= 0) {
    type = '-test';
} else if (base.indexOf('focus-dev') >= 0) {
    type = '-dev'
}

var loginUrl = 'http://common-ldap.focus' + type + '.cn/tologin?ru=http://' + base + '/ecology-ad-admin/#/city';
var logoutUrl = 'http://ad-manage.focus' + type + '.cn/user/logout?ru=http://' + base + '/ecology-ad-admin/#/city';
var platformUrl = 'http://common-ldap.focus' + type + '.cn/';

var userCookie = '';
cookies.split(';').forEach(function (item) {
    if (item.indexOf('FOCUS_A_UDIG') !== -1) {
        userCookie = item;
    }
});
if (!userCookie) {
    location.href = loginUrl;
} else {
    $$user.setCookie(userCookie);
    //数据加载
    $$user.getUserInfo(function (data) {
        if (data.code == 401) {
            location.href = loginUrl;
            return;
        } else if (data.code == 403) {
            alert('没有权限!');
            return;
        }
        _.extend(data, {
            mainUrl: mainUrl,
            logoutUrl: logoutUrl,
            platformUrl: platformUrl
        });
        $$user.setUserInfo(data);
    });
}
