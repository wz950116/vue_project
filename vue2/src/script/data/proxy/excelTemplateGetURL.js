import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {

    var request = [{
        url: `${domain}excelTemplate/getURL`,
        method: 'POST',
        params: {}
    }];

    combine(request, function (data) {
        if (data.length === 1) {
            fn(data[0]);
        }
    });
};

export default init;