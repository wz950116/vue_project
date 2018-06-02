import $$user from './user.js';
import _ from '../lib/underscore.v1.4.4.min';

var base = location.hostname;
var hashName = location.hash;
var cookies = document.cookie;
var mainUrl = 'http://' + base + '/';
var type = '';
if (base.indexOf('focus-test') >= 0) {
    type = '-test';
} else if (base.indexOf('focus-dev') >= 0) {
    type = '-dev'
}

var loginUrl = 'http://common-ldap.focus' + type + '.cn/tologin?ru=' + (type === '' ? 'https' : 'http') + '://' + base;
// var logoutUrl = 'http://ad-manage.focus' + type + '.cn/user/logout?ru=https://' + base;
var logoutUrl = 'http://ad-manage.focus' + type + '.cn/user/logout?ru=' + (type === '' ? 'https' : 'http') + '://' + base;
// var platformUrl = 'http://common-ldap.focus' + type + '.cn/';
var platformUrl = '//shengtai-op.focus' + type + '.cn/#/';

var userCookie = '';
cookies.split(';').forEach(function (item) {
    if (item.indexOf('FOCUS_A_UDIG') !== -1) {
        userCookie = item;
    }
});

if (!userCookie) {
    location.href = platformUrl;
} else {
    $$user.setCookie(userCookie);
    // 数据加载
    $$user.getUserInfo(function (data) {
        if (data.code == 401) {
            location.href = platformUrl;
            return;
        } else if (data.code == 403) {
            alert('没有权限!');
            return;
        }
        _.extend(data, {
            mainUrl: mainUrl,
            logoutUrl: platformUrl,
            platformUrl: platformUrl
        });

        $$user.setUserInfo(data);
    });
}
