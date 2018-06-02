import combine from './lib/combine.js';
import domain from './lib/domain-base.js';
var downLoadUrl = {
    city: 'download/statistic/citiesStatistics',
    allCity: 'statistic/getAllCityStaistics',
    cityDetail: 'download/statistic/cityDetailStatistic',
    ad: 'download/adPosInfo/getExcelByCondition',
    performace: 'download/performance',
    taxpayer: 'download/invoice/taxpayers',
    invoices: 'download/invoice/invoices',
    adDetail: 'download/adPosInfo/getadPosDetailExcelByCondition'
};

var init = function (params, fn, type) {
    var request = [{
        url: domain + downLoadUrl[type],
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
