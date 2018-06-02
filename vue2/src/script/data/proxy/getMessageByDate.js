import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {
    if (params.operatorId) {
        params.operatorId = parseInt(params.operatorId)
    }
    var request = [{
        url: `${domain}bgMsg/getMessageByDate`,
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