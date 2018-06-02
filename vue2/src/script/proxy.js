/**
 * Created by wangwei on 2016/11/19.
 */
var interfaceModule = '';
var type;
var handleUrl = function(url) {
    var interfaceUrl;
    if (url.indexOf('?') > 0) {
        var urlParamsQuery = url.split('?')[1];
        var url = url.split('?')[0];
        interfaceUrl = url.split('/')[2].split('.')[0];
        type = urlParamsQuery.split('=')[1];
    } else {
        interfaceUrl = url.split('/')[2].split('.')[0];
    }
    return interfaceUrl;
};
var req = function(url, params, fn) {
    var jsonName = handleUrl(url);
    switch (jsonName) {
        case 'action':
            interfaceModule = require('./data/proxy/action');
            break;
        case 'getInfo':
            interfaceModule = require('./data/proxy/getInfo');
            break;
        case 'adPosDetail':
            interfaceModule = require('./data/proxy/adPosDetail');
            break;
        case 'adPosInfogetParameters':
            interfaceModule = require('./data/proxy/adPosInfogetParameters');
            break;
        case 'aadPosInfogetReleaseInfo':
            interfaceModule = require('./data/proxy/adPosInfogetReleaseInfo');
            break;
        case 'auditaccountlist':
            interfaceModule = require('./data/proxy/auditaccountlist');
            break;
        case 'auditEstateList':
            interfaceModule = require('./data/proxy/auditEstateList');
            break;
        case 'auditOrderList':
            interfaceModule = require('./data/proxy/auditOrderList');
            break;
        case 'customersBasicInfo':
            interfaceModule = require('./data/proxy/customersBasicInfo');
            break;
        case 'customersChildGuests':
            interfaceModule = require('./data/proxy/customersChildGuests');
            break;
        case 'customersCities':
            interfaceModule = require('./data/proxy/customersCities');
            break;
        case 'customersEstates':
            interfaceModule = require('./data/proxy/customersEstates');
            break;
        case 'customersIndex':
            interfaceModule = require('./data/proxy/customersIndex');
            break;
        case 'customersList':
            interfaceModule = require('./data/proxy/customersList');
            break;
        case 'customersOrders':
            interfaceModule = require('./data/proxy/customersOrders');
            break;
        case 'getCitiesStaistics':
            interfaceModule = require('./data/proxy/getCitiesStaistics');
            break;
        case 'getCityDetailStatistics':
            interfaceModule = require('./data/proxy/getCityDetailStatistics');
            break;
        case 'getInvoices':
            interfaceModule = require('./data/proxy/getInvoices');
            break;
        case 'getMessageByDate':
            interfaceModule = require('./data/proxy/getMessageByDate');
            break;
        case 'getPerformance':
            interfaceModule = require('./data/proxy/getPerformance');
            break;
        case 'getPerformanceDetail':
            interfaceModule = require('./data/proxy/getPerformanceDetail');
            break;
        case 'getReleaseInfo':
            interfaceModule = require('./data/proxy/getReleaseInfo');
            break;
        case 'getTaxpayers':
            interfaceModule = require('./data/proxy/getTaxpayers');
            break;
        case 'operationHistoryDetails':
            interfaceModule = require('./data/proxy/operationHistoryDetails');
            break;
        case 'operationHistoryIndex':
            interfaceModule = require('./data/proxy/operationHistoryIndex');
            break;
        case 'operationHistoryTotal':
            interfaceModule = require('./data/proxy/operationHistoryTotal');
            break;
        case 'performanceGetCityList':
            interfaceModule = require('./data/proxy/performanceGetCityList');
            break;
        case 'searchAdPosByCondition':
            interfaceModule = require('./data/proxy/searchAdPosByCondition');
            break;
        case 'statisticGetCityList':
            interfaceModule = require('./data/proxy/statisticGetCityList');
            break;
        case 'bgMsgGetParameters':
            interfaceModule = require('./data/proxy/bgMsgGetParameters');
            break;
        case 'download':
            interfaceModule = require('./data/proxy/download');
            break;
        case 'getInvoiceContact':
            interfaceModule = require('./data/proxy/getInvoiceContact');
            break;
        case 'getAdForPic':
            interfaceModule = require('./data/proxy/getAdForPic');
            break;
        case 'getManagementList':
            interfaceModule = require('./data/proxy/getManagementList');
            break;
        case 'getRoleList':
            interfaceModule = require('./data/proxy/getRoleList');
            break;
        case 'delManagementById':
            interfaceModule = require('./data/proxy/delManagementById');
            break;
        case 'addManagementById':
            interfaceModule = require('./data/proxy/addManagementById');
            break;
        case 'addRechargeById':
            interfaceModule = require('./data/proxy/rechargeAdd');
            break;
        case 'getRechargeList':
            interfaceModule = require('./data/proxy/rechargeList');
            break;
        case 'cancelRechargeById':
            interfaceModule = require('./data/proxy/rechargeCancel');
            break;
        case 'rechargeByExcelFile':
            interfaceModule = require('./data/proxy/rechargeBatch');
            break;
        case 'editRolePermissionList':
            interfaceModule = require('./data/proxy/editRolePermissionList');
            break;
        case 'listAllPermission':
            interfaceModule = require('./data/proxy/listAllPermission');
            break;
        case 'getAllRolesAndPermissions':
            interfaceModule = require('./data/proxy/getAllRolesAndPermissions');
            break;
        case 'getFinanceReport':
            interfaceModule = require('./data/proxy/getFinanceReport');
            break;
        case 'addBackEndRoles':
            interfaceModule = require('./data/proxy/addBackEndRoles');
            break;
        case 'deleteBackEndRoles':
            interfaceModule = require('./data/proxy/deleteBackEndRoles');
            break;
        case 'getCashBackList':
            interfaceModule = require('./data/proxy/getCashBackList');
            break;
        case 'addCashDiscount':
            interfaceModule = require('./data/proxy/addCashDiscount');
            break;
        case 'delCashDiscount':
            interfaceModule = require('./data/proxy/delCashDiscount');
            break;
        case 'getLevelDiscountList':
            interfaceModule = require('./data/proxy/getLevelDiscountList');
            break;
        case 'addLevelDiscount':
            interfaceModule = require('./data/proxy/addLevelDiscount');
            break;
        case 'delLevelDiscount':
            interfaceModule = require('./data/proxy/delLevelDiscount');
            break;
        case 'getLevelList':
            interfaceModule = require('./data/proxy/getLevelList');
            break;
        case 'getWhiteList':
            interfaceModule = require('./data/proxy/getWhiteList');
            break;
        case 'addWhiteList':
            interfaceModule = require('./data/proxy/addWhiteList');
            break;
        case 'delWhiteList':
            interfaceModule = require('./data/proxy/delWhiteList');
            break;
        case 'exportWhiteList':
            interfaceModule = require('./data/proxy/exportWhiteList');
            break;
        case 'getAreaList':
            interfaceModule = require('./data/proxy/getAreaList');
            break;
        case 'getLoupanDataList':
            interfaceModule = require('./data/proxy/getLoupanDataList');
            break;
        case 'getEstateById':
            interfaceModule = require('./data/proxy/getEstateById');
            break;
        case 'editBaseIdea':
            interfaceModule = require('./data/proxy/editBaseIdea');
            break;
        case 'updateAdPosAreaStatus':
            interfaceModule = require('./data/proxy/updateAdPosAreaStatus');
            break;
        case 'excelTemplateGetURL':
            interfaceModule = require('./data/proxy/excelTemplateGetURL');
            break;
        case 'getAdPosSched':
            interfaceModule = require('./data/proxy/getAdPosSched');
            break;
        case 'downloadAdPosSched':
            interfaceModule = require('./data/proxy/downloadAdPosSched');
            break;
        case 'getParameters':
            interfaceModule = require('./data/proxy/getParameters');
            break;
        case 'chargeReviewList':
            interfaceModule = require('./data/proxy/chargeReviewList');
            break;
        case 'chargeReviewAudit':
            interfaceModule = require('./data/proxy/chargeReviewAudit');
            break;
        case 'getAdDownloadParams':
            interfaceModule = require('./data/proxy/getAdDownloadParams');
            break;
        case 'getConsultantList':
            interfaceModule = require('./data/proxy/getConsultantList');
            break;
        case 'searchExpend':
            interfaceModule = require('./data/proxy/searchExpend');
            break;
        case 'downloadExpend':
            interfaceModule = require('./data/proxy/downloadExpend');
            break;
        case 'searchDetail':
            interfaceModule = require('./data/proxy/searchDetail');
            break;
        case 'downloadDetail':
            interfaceModule = require('./data/proxy/downloadDetail');
            break;
        case 'initialAdPosAlloc':
            interfaceModule = require('./data/proxy/initialAdPosAlloc');
            break;
        case 'insertAdPosAreaAndAdPosAllocCity':
            interfaceModule = require('./data/proxy/insertAdPosAreaAndAdPosAllocCity');
            break;
    }
    interfaceModule.default(params, fn, type);
};

export default req;
