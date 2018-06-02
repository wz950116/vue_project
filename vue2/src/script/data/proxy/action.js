import combine from './lib/combine.js';
import domain from './lib/domain-base.js';
var actionUrl = {
    disableAdTest: 'adPosInfo/deletePriceTest',
    disableAd: 'adPosInfo/deletePrice',
    editPrice: 'adPosInfo/editPrice',
    editPriceTest: 'adPosInfo/editPriceTest',
    editPriceByExcel: 'adPosInfo/editPriceByExcel',
    editPriceByExcelTest: 'adPosInfo/editPriceByExcelTest',
    releaseAdPos: 'adPosInfo/releaseAdPos',
    addUser: 'performance/addNewUser',
    bgMsgbyUserId: 'bgMsg/byUserId',
    bgMsgbyCondition: 'bgMsg/byCondition',
    auditAccountSubmit: 'audit/account/submit',
    auditEstatesubmit: 'audit/estate/submit',
    auditOrdersubmit: 'audit/order/submit',
    auditTaxpayer: 'invoice/auditTaxpayer',
    auditInvoice: 'invoice/auditInvoice',
    editPriceExcel: 'adPosInfo/editPriceByExcel',
    editBaseIdea: 'adPosInfo/editBaseIdea',
    logout: 'user/logout',
    setPreviewPic: 'adPosInfo/editPreview',
    submitContractCode:'audit/account/contractCode/submit',
    deletePrice:'adPosInfo/deletePrice',
    deletePriceTest:'adPosInfo/deletePriceTest'
};

var init = function (params, fn, type) {
    var request = [{
        url: domain + actionUrl[type],
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