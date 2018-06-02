/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    // 获取广告筛选参数
    getAdParams: function () {
        $$app.getApi('/api/adPosInfogetParameters.json', '', function (obj) {
            model.trigger('getAdParams', obj);
        });
    },
    // 获取广告位列表
    getAdInfo: function (params, fn) {
        $$app.getApi('/api/searchAdPosByCondition.json', params, function (obj) {
            model.trigger('getAdInfo', obj);
            fn && fn(obj);
        });
    },
    //获取广告位排期数据
    getAdPosSched: function (params, fn) {
        $$app.getApi('/api/getAdPosSched.json', params, function (obj) {
            model.trigger('getAdPosSched', obj);
            fn && fn(obj);
        });
    },
    //下载广告位排期数据
    downloadAdPosSched: function (params, fn) {
        $$app.getApi('/api/downloadAdPosSched.json', params, function (obj) {
            model.trigger('downloadAdPosSched', obj);
            fn && fn(obj);
        });
    },
    // 获取广告位明细
    getAdDetail: function (params, fn) {
        $$app.getApi('/api/adPosDetail.json', params, function (obj) {
            model.trigger('getAdDetail', obj);
            fn && fn(obj);
        });
    },
    // 下载广告excel
    downloadAd: function (params, fn) {
        $$app.getApi('/api/download.json?type=ad', params, function (obj) {
            model.trigger('downloadAd', obj);
            fn && fn(obj);
        });
    },
    // 获取广告释放
    getReleaseInfo: function (params, fn) {
        $$app.getApi('/api/getReleaseInfo.json', params, function (obj) {
            model.trigger('getReleaseInfo', obj);
            fn && fn(obj);
        });
    },
    // 释放广告
    releaseAd: function (params, fn) {
        $$app.getApi('/api/action.json?type=releaseAdPos', params, function (obj) {
            fn && fn(obj);
        });
    },
    disableAdTest: function (params, fn) {
        $$app.getApi('/api/action.json?method=disableAdTest', params, function (obj) {
            fn && fn(obj);
        });
    },
    // 禁用广告
    disableAd: function (params, fn) {
        $$app.getApi('/api/action.json?method=disableAd', params, function (obj) {
            fn && fn(obj);
        });
    },
    editPriceTest: function (params, fn) {
        $$app.getApi('/api/action.json?method=editPriceTest', params, function (obj) {
            fn && fn(obj);
        });
    },
    editPrice: function (params, fn) {
        $$app.getApi('/api/action.json?method=editPrice', params, function (obj) {
            fn && fn(obj);
        });
    },
    editPriceExcel: function (params, fn) {
        $$app.getApi('/api/action.json?type=editPriceExcel', params, function (obj) {
            fn && fn(obj);
        });
    },
    editPriceExcelTest: function (params, fn) {
        $$app.getApi('/api/action.json?method=editPriceExcelTest', params, function (obj) {
            fn && fn(obj);
        });
    },
    setPic: function (params, fn) {
        $$app.getApi('/api/action.json?type=editBaseIdea', params, function (obj) {
            fn && fn(obj);
        });
    },
    getAdForPic: function (params, fn) {
        $$app.getApi('/api/getAdForPic.json', params, function (obj) {
            fn && fn(obj);
        });
    },
    setPreviewPic: function (params, fn) {
        $$app.getApi('/api/action.json?type=setPreviewPic', params, function (obj) {
            fn && fn(obj);
        });
    },
    downLoadAdDetail: function (params, fn) {
        $$app.getApi('/api/download.json?type=adDetail', params, function (obj) {
            fn && fn(obj);
        });
    },
    //获取下载参数
    // getAdDownloadParams: function (fn) {
    //     $$app.getApi('/api/download.json?type=ad', {}, function (obj) {
    //         // model.trigger('getAdDownloadParams', {});
    //         fn && fn(obj);
    //     });
    // },
    //获取上传参数
    getAdUploadParams: function (params) {
        model.trigger('getAdUploadParams', params);
    },
    //操作成功之后刷新列表
    actionSuccess: function () {
        model.trigger('actionSuccess');
    },
    deletePriceTest: function (params, fn) {
        $$app.getApi('/api/action.json?type=deletePriceTest', params, function (obj) {
            fn && fn(obj);
        });
    },
    deletePrice: function (params, fn) {
        $$app.getApi('/api/action.json?type=deletePrice', params, function (obj) {
            fn && fn(obj);
        });
    },

    getIdAndGetDetail: function (id) {
        model.trigger('getIdAndGetDetail', id);
    },
    getAdInfoByPage: function (page) {
        model.trigger('getAdInfoByPage', page);
    },
    getAdDetailInfoByPage: function (page) {
        model.trigger('getAdDetailInfoByPage', page);
    },
    backToFirst: function () {
        model.trigger('backToFirst');
    },
    // 禁用计划
    banPlan: function (params, fn) {
        $$app.getApi('/api/updateAdPosAreaStatus', params, function (obj) {
            model.trigger('banPlan', obj);
            fn && fn(obj);
        })
    },
    // 下载表格链接
    downloadTableModel: function (fn) {
        $$app.getApi('/api/excelTemplateGetURL', {}, function (obj) {
            model.trigger('downloadTableModel', obj);
            fn && fn(obj);
        })
    },
    // 导出数据连接
    getAdDownloadParams: function (fn) {
        $$app.getApi('/api/getAdDownloadParams', {}, function (obj) {
            model.trigger('getAdDownloadParams', obj);
            fn && fn(obj);
        })
    }
});

export default model;
