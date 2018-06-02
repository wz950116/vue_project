import $$api from "@/model/api.js";

export default {
    // 获取必要参数
    getParameters (params, fn) {
        $$api("api/salesManage/getParameters", params, data => {
            fn && fn(data);
        });
    },
    // 销售人员数据呈现
    getListData (params, fn) {
        $$api("api/salesManage/list", params, data => {
            fn && fn(data);
        });
    },
    // 获取领导列表
    getLeaderList (params, fn) {
        $$api("api/salesManage/leaderList", params, data => {
            fn && fn(data);
        });
    },
    // 添加员工信息
    createSeller (params, fn) {
        $$api("api/salesManage/create", params, data => {
            fn && fn(data);
        });
    },
    // 编辑员工信息
    editSeller (params, fn) {
        $$api("api/salesManage/edit", params, data => {
            fn && fn(data);
        });
    },
    // 删除销售人员
    deleteSeller (params, fn) {
        $$api("api/salesManage/delete", params, data => {
            fn && fn(data);
        });
    },
    // 展示楼盘数据list
    getEstateList (params, fn) {
        $$api("api/salesManage/estateList/list", params, data => {
            fn && fn(data);
        });
    },
    // 删除楼盘数据
    deleteEstate (params, fn) {
        $$api("api/salesManage/estateList/delete", params, data => {
            fn && fn(data);
        });
    },
    // 添加楼盘数据
    addEstate (params, fn) {
        $$api("api/salesManage/estateList/create", params, data => {
            fn && fn(data);
        });
    }
};
