import combine from "../../script/data/proxy/lib/combine.js";
import domain from "../../script/data/proxy/lib/domain-base.js";

export default {
    // 获取参数
    initRedPacketData (fn) {
        const request = [{
            url: `${domain}adRedPacketManage/getParameters`,
            method: "POST"
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 红包数据展示
    showRedPacketList (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/list`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 新建红包
    createRedPacket (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/create`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 点击预览
    checkoutLink (params, fn) {
        const request = [{
            url: `${domain}adPosInfo/getAutoContent`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 导出全部excel
    exportExcel (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/list2Excel`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 查看红包创意
    checkReaPacket (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/showIdea`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 编辑红包创意
    editIdea (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/editIdea`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 编辑红包属性
    editOrder (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/editOrder`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 设置单笔红包金额
    editDrawMoney (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/editDrawMoney`,
            method: "POST",
            params: params
        }];

        combine(request, function (data) {
            if (data.length === 1) {
                fn(data[0]);
            }
        });
    },

    // 获取当前领取钱数
    getCurrentDrawMoney (params, fn) {
        const request = [{
            url: `${domain}adRedPacketManage/getCurrentDrawMoney`,
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
