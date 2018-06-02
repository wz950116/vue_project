import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 获取筛选资源
    getResourceList (params, fn) {
        const request = [{
            url: `${domain}resource/list`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    changeResourceStatus (params, fn) {
        const request = [{
            url: `${domain}resource/status`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    getPlatform (params, fn) {
        const request = [{
            url: `${domain}resource/platform`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    addResource (params, fn) {
        const request = [{
            url: `${domain}resource/addResource`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    deletePreview (params, fn) {
        const request = [{
            url: `${domain}resource/deletePreview`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    }
};
