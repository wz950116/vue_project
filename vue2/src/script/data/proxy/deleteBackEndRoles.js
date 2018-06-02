import combine from './lib/combine.js';
import domain from './lib/domain-base.js';

var init = function (params, fn) {
    var request = [{
        url: `${domain}authority/person/deleteBackEndRoles`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        fn(data[0]);
    });
};

export default init;