import combine from './lib/combine.js';
import domain from './lib/domain-base.js';
import _ from '../../../lib/underscore.v1.4.4.min';
var currentPage = 0;
var cacheParams = {};
var serchFromPage = false;

var init = function (params, fn) {
    var paramsWithoutCurrentPage = _.omit(params, ['currentPage','pageIndex']);
    serchFromPage = _.isEqual(cacheParams, paramsWithoutCurrentPage);
    cacheParams = paramsWithoutCurrentPage;
    currentPage = params.pageIndex;

    var request = [{
        url: `${domain}performance/getPerformance`,
        method: 'POST',
        params: params
    }];

    combine(request, function (data) {
        if (data.length === 1) {
            data[0].currentPage = currentPage;
            data[0].serchFromPage = serchFromPage;
            fn(data[0]);
        }
    });
};

export default  init;