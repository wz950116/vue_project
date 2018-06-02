import $$api from "@/model/api.js";

export default {
    // 获取必要参数
    getParameters (params, fn) {
        $$api("api/salesManage/getParameters", params, data => {
            fn && fn(data);
        });
    },
    // 数据呈现
    getListData (params, fn) {
        $$api("api/salesManage/estateInfo/list", params, data => {
            fn && fn(data);
        }); 
    },
    // 添加楼盘
    createEstate (params, fn) {
        $$api("api/salesManage/estateInfo/createOrEdit", params, data => {
            fn && fn(data);
        });
    },
    // 编辑楼盘
    editEstate (params, fn) {
        $$api("api/salesManage/estateInfo/createOrEdit", params, data => {
            fn && fn(data);
        });
    },
    // 删除楼盘
    deleteEstate (params, fn) {
        $$api("api/salesManage/estateInfo/delete", params, data => {
            fn && fn(data);
        });
    },
    // 展示楼盘数据
    getEstateList (params, fn) {
        $$api("api/salesManage/estateList/list", params, data => {
            fn && fn(data);
        });
    },
    // 添加楼盘数据
    addEstate (params, fn) {
        $$api("api/salesManage/estateList/create", params, data => {
            fn && fn(data);
        });
    },
    // 获取单个楼盘投放金额数据
    getAdMoneyInfo (params, fn) {
        $$api("api/admoney/manager/getAdMoneyInfo", params, data => {
            fn && fn(data);
        });
    },
    // 获取单个楼盘投放目标数据
    getAdMoneyTarget (params, fn) {
        $$api("api/admoney/manager/getAdMoneyTarget", params, data => {
            fn && fn(data);
        });
    },
    // 添加或编辑楼盘投放金额或目标数据
    upsertAdmoney (params, fn) {
        $$api("api/admoney/manager/upsertAdmoney", params, data => {
            fn && fn(data);
        });
    },
    // 删除楼盘投放金额或目标数据
    deleteAdmoney (params, fn) {
        $$api("api/admoney/manager/deleteAdmoney", params, data => {
            fn && fn(data);
        });
    }
};
