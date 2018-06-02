import combine from '../lib/combine.js'
var $$domain = '//rec-engine-intervention.focus' +  window.env + '.cn/';

var init = function (url, params, fn) {
    var request = [{
        url: $$domain + url,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        fn(data[0])
    })
};

export default init
