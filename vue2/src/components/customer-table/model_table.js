import domain from "../../script/data/proxy/lib/domain-base.js";
import combine from "../../script/data/proxy/lib/combine.js";

export default {
    // 获取筛选资源
    add (params, fn) {
        const request = [{
            url: `${domain}customers/list`,
            method: "POST",
            params: params
        }, {
            url: `${domain}performance/getPerformance`,
            method: "POST",
            params: params
        }];
        combine(request, function (data) {
            fn && fn(data);
        });
    }
};
