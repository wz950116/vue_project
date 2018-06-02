/**
 * Created by lidonglin on 2017/03/01.
 */
import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {
    var request = [{
        url: `${domain}report/getFinanceReport`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        if (data.length === 1) {
            fn(data[0]);
        }
    });
};

export default init;
