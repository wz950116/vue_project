/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';

var _ = under;
var model = new $$model({});

_.extend(model, {
    // 获取审核列表
    getTaxpayer: function (params, fn) {
        $$app.getApi('/api/getTaxpayers.json', params, function (obj) {
            model.trigger('getTaxpayer', obj);
            fn && fn(obj);
        });
    },
    // 获取发票列表
    getInvoices: function (params, fn) {
        $$app.getApi('/api/getInvoices.json', params, function (obj) {
            model.trigger('getInvoices', obj);
            fn && fn(obj);
        });
    },
    // 审核发票资质
    auditTaxpayer: function (params, fn) {
        $$app.getApi('/api/action.json?type=auditTaxpayer', params, function (obj) {
            model.trigger('auditTaxpayer', obj);
            fn && fn(obj);
        });
    },
    // 发票审核
    auditInvoice: function (params, fn) {
        $$app.getApi('/api/action.json?type=auditInvoice', params, function (obj) {
            model.trigger('auditInvoice', obj);
            fn && fn(obj);
        });
    },
    // 下载审核
    downloadTaxpayer: function (params, fn) {
        $$app.getApi('/api/download.json?type=taxpayer', params, function (obj) {
            model.trigger('downloadTaxpayer', obj);
            fn && fn(obj);
        });
    },
    // 下载审核
    downloadInvoices: function (params, fn) {
        $$app.getApi('/api/download.json?type=invoices', params, function (obj) {
            model.trigger('downloadInvoices', obj);
            fn && fn(obj);
        });
    },
    // 获取专票下载参数
    getTaxDownloadParams: function (params) {
        model.trigger('getTaxDownloadParams', params);
    },
    // 获取发票下载参数
    getInvoicesDownloadParams: function (params) {
        model.trigger('getInvoicesDownloadParams', params);
    },
    getInvoiceContact: function (params, fn) {
        $$app.getApi('/api/getInvoiceContact.json', params, function (obj) {
            model.trigger('getInvoiceContact', obj);
            fn && fn(obj);
        });
    },
    showInvoiceDialog: function (params) {
        model.trigger('showInvoiceDialog', params);
    },
    getListByPage: function (page) {
        model.trigger('getListByPage', page);
    },
    getInvoiceListByPage: function (page) {
        model.trigger('getInvoiceListByPage', page);
    },
    getFinanceReport: function (params, fn) {
        $$app.getApi('/api/getFinanceReport.json', params, function (obj) {
            model.trigger('getFinanceReport', obj);
            fn && fn(obj)
        })
    },
    //获取城市列表等参数
    getParameters: function (params,fn) {
        $$app.getApi('/api/getParameters.json', params, function (obj) {
            model.trigger('getParameters', obj);
            fn && fn(obj);
        });
    },
    //获取充值客户列表
    chargeReviewList: function (params,fn) {
        $$app.getApi('/api/chargeReviewList.json', params, function (obj) {
            model.trigger('chargeReviewList', obj);
            fn && fn(obj)
        })
    },
    //提交充值客户审核结果
    chargeReviewAudit: function (params,fn) {
        $$app.getApi('/api/chargeReviewAudit.json', params, function (obj) {
            model.trigger('chargeReviewAudit', obj);
            fn && fn(obj)
        })
    }
});

export default model;
