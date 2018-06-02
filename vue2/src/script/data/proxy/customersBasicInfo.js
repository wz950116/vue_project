import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {
    params.id = parseInt(params.id);
    var request = [{
        url: `${domain}customers/basicInfo`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        if (data.length === 1) {
            fn(data[0]);
        }
    });
};

export default  init;