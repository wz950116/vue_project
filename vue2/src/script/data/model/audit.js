/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import under from '../../../lib/underscore.v1.4.4.min.js';
import $$assert from '../../../lib/assert.js';

var _ = under;
var model = new $$model({});

var audit = {
    account: {
        name: 'Account',
        get: '/api/auditaccountlist.json',
        set: '/api/action.json?type=auditAccountSubmit',
        assert: {
            "demander_id": 'n',
            "audit_status": 'n'
        },
        query: {}
    },
    estate: {
        name: 'Estate',
        get: '/api/auditEstateList.json',
        set: '/api/action.json?type=auditEstatesubmit',
        assert: {
            "demander_id": 'n',
            "estate_id": 'n',
            "audit_status": 'n'
        },
        query: {}
    },
    order: {
        name: 'Order',
        get: '/api/auditOrderList.json',
        set: '/api/action.json?type=auditOrdersubmit',
        assert: {
            "idea_id": 'n',
            "audit_status": 'n'
        },
        query: {}
    }
};

_.extend(model, {
    getAudit: function (type, params, fn) {
        $$app.getApi(audit[type].get, params, function (obj) {
            model.trigger('getAudit' + audit[type].name, obj);
            fn && fn(obj);
        });
    },
    setAudit: function (type, params, fn) {
        $$app.getApi(audit[type].set, params, function (obj) {
            model.trigger('setAudit' + audit[type].name, obj);
            fn && fn(obj);
        });
    },
    submitContractCode: function (params, fn) {
        $$app.getApi('/api/action.json?type=submitContractCode', params, function (obj) {
            model.trigger('submitContractCode', obj);
            fn && fn(obj);
        });
    },
    getAuditByPage: function (params) {
        model.trigger('getAuditByPage', params);
    },
    actionSuccess: function () {
        model.trigger('actionSuccess')
    },
    showRejectDialog: function (data) {
        model.trigger('showReject' + audit[data.type].name + 'Dialog', data)
    },
    deleteRow: function (type, row) {
        model.trigger('delete' + audit[type].name, row);
    },
    getParameters: function (params,fn) {
        $$app.getApi('/api/getParameters.json', params, function (obj) {
            model.trigger('getParameters', obj);
            fn && fn(obj);
        });
    }
});

export default model;
