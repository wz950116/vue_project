import $$api from "@/model/api.js";

export default {
    //获取置顶楼盘列表
    getInsertList(params, fn){
        $$api("api/intervention/insert/list", params, data => {
            fn && fn(data);
        });
    },
    //新增置顶楼盘
    addInsertInfo(params, fn){
        $$api("api/intervention/insert", params, data => {
            fn && fn(data);
        });
    },
    //更新置顶楼盘
    updateInsertInfo(params, fn){
        $$api("api/intervention/insert/update", params, data => {
            fn && fn(data);
        });
    },
    //获取过滤楼盘列表
    getDeleteList(params, fn){
        $$api("api/intervention/delete/list", params, data => {
            fn && fn(data);
        });
    },
    //新增过滤楼盘
    addDeleteInfo(params, fn){
        $$api("api/intervention/delete", params, data => {
            fn && fn(data);
        });
    },
    //更新过滤楼盘
    revertDeleteInfo(params, fn){
        $$api("api/intervention/delete/revert", params, data => {
            fn && fn(data);
        });
    },
    //获取feed流实时数据
    getFeedList(params, fn){
        $$api("api/intervention/feed/list", params, data => {
            fn && fn(data);
        });
    },
    //获取用户推荐楼盘
    getRecommendList(params, fn){
        $$api("api/intervention/recommend", params, data => {
            fn && fn(data);
        });
    },
    //获取楼盘信息
    getProjectInfo(params, fn){
        $$api("api/info/project", params, data => {
            fn&&fn(data);
        })
    },
    //获取楼盘信息
    getAllProjectInfo(params, fn){
        $$api("api/info/project/all", params, data => {
            fn&&fn(data);
        })
    },
     //交换置顶楼盘
    exchangeInsertInfos(params, fn){
        $$api("api/intervention/insert/exchange", params, data => {
            fn && fn(data);
        });
    },
};
