import combine from './lib/combine.js';
import domain from './lib/domain-base.js';
var currentPage = 0;
var init = function (params, fn) {
    currentPage = params.pageIndex;
    var request = [{
        url: `${domain}customers/list`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        if (data.length === 1) {
            data[0].currentPage = currentPage;
            fn(data[0]);
        }
    });
};

export default  init;