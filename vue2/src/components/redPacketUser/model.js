import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 获取参数
    getRedUserList (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/userList`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 导出excel
    exportExcel (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/userList2Excel`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 提取码手动发放红包
    extractMoney (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/extractMoney`,
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
