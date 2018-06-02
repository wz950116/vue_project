import domain from "../../script/data/proxy/lib/domain-base.js";
import combine from "../../script/data/proxy/lib/combine.js";

export default {
    // 导出广告位excel
    exportAd: function (params, fn) {
        const request = [{
            url: `${domain}excelTemplate/getAdPosInfoExcel`,
            method: "POST",
            params: params
        }];
        combine(request, data => {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    }
};
