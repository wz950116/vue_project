import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    showAdDialog: function (params, fn) {
        model.trigger('showAdDialog', params);
    },
    clearRow: function (params) {
        model.trigger('clearRow', params);
    },
    showUploadAdImageDialog: function (params) {
        model.trigger('showUploadAdImageDialog', params);
    },
    showUploadAdImagePreviewDialog: function (params, type) {
        model.trigger('show' + type + 'UploadAdImagePreviewDialog', params);
    },
    getEstateById: function (params, fn) {
        $$app.getApi('/api/getEstateById.json', params, function (obj) {
            model.trigger('getEstateById', obj);
            fn && fn(obj);
        });
    },
    isValidLink: function (params, fn) {
        $$app.getApi('/api/getEstateById.json', params, function (obj) {
            model.trigger('isValidLink', obj);
            fn && fn(obj);
        });
    },
    getLinkByLiveId: function (params, fn) {
        $$app.getApi('/api/getEstateById.json', params, function (obj) {
            model.trigger('getLinkByLiveId', obj);
            fn && fn(obj);
        });
    },
    previewLinkByLiveId: function (params, fn) {
        $$app.getApi('/api/getEstateById.json', params, function (obj) {
            model.trigger('previewLinkByLiveId', obj);
            fn && fn(obj);
        });
    },
    editBaseIdea: function (params, fn) {
        $$app.getApi('/api/editBaseIdea.json', params, function (obj) {
            model.trigger('editBaseIdea', obj);
            fn && fn(obj);
        });
    }
});
export default model;
