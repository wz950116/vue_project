import combine from './lib/combine.js';
import domain from './lib/domain-base.js';
var currentPage = 0;

var init = function (params, fn) {
    currentPage = params.pageIndex;
    var request = [{
        url: `${domain}authority/person/add`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
         fn(data[0]);
    });
};

export default init;