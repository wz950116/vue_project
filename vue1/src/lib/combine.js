import util from './util';

var combine = function (requestArr, fn) {
    var data = {};
    var arr = [];
    for (let i = 0; i < requestArr.length; i++) {
        arr.push(_pfetch(requestArr[i].url, requestArr[i].method, requestArr[i].params));
    }
    Promise.all(arr).then(function (data) {
        fn && fn(data);
    });

};
var _pfetch = function (url, method, params) {
    return new Promise(function (resolve, reject) {
        util.fetch(url, {
            method: method,
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        }, params).then(function (res) {
            res.json().then(function (obj) {
                resolve(obj);
            });
        }, function (err) {
            reject(err);
        });
    })
};

export default combine;
