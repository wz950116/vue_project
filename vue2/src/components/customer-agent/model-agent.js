import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 获取筛选资源
    add (params, fn) {
        const request = [{
            url: `${domain}credit/add`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    getDemanderInfo (params, fn) {
        const request = [{
            url: `${domain}credit/getDemanderInfo`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    setCreditLine (params, fn) {
        const request = [{
            url: `${domain}credit/setCreditLine`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    setKpi (params, fn) {
        const request = [{
            url: `${domain}credit/setKpi`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    list (params, fn) {
        const request = [{
            url: `${domain}credit/list`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    creditList (params, fn) {
        const request = [{
            url: `${domain}download/credit/creditList`,
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
