import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 添加历史页面
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
    }
};
