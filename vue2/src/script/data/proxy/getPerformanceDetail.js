import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {
    params.employee_id = parseInt(params.employee_id);
    var request = [{
        url: `${domain}performance/getPerformanceDetail`,
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