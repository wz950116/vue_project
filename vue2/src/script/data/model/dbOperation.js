import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    //广告位模板排期表
    initialAdPosAlloc: function (params, fn) {
        $$app.getApi('/api/initialAdPosAlloc.json', params, function (obj) {
            model.trigger('initialAdPosAlloc', obj);
            fn && fn(obj);
        });
    },
    //广告位城市表
    insertAdPosAreaAndAdPosAllocCity: function (params, fn) {
        $$app.getApi('/api/insertAdPosAreaAndAdPosAllocCity.json', params, function (obj) {
            model.trigger('insertAdPosAreaAndAdPosAllocCity', obj);
            fn && fn(obj);
        });
    },
});

export default model;