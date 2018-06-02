import domain from "../../script/data/proxy/lib/domain-base.js";
import combine from "../../script/data/proxy/lib/combine.js";

export default {
    // 获取筛选资源
    add (params, fn) {
        const request = [{
            url: `${domain}orderProfile/getOrderProfiles`,
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
