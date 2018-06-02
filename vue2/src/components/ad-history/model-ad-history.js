import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 添加历史页面
    addPage (params, fn) {
        const request = [{
            url: `${domain}historyPage/add`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 查询已添加的 url
    getUrlList (params, fn) {
        const request = [{
            url: `${domain}historyPage/list`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },
    // 删除某个历史页面
    delPage (params, fn) {
        const request = [{
            url: `${domain}historyPage/delete`,
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
