import $$api from "@/model/api.js";

export default {
    //获取置顶楼盘列表
    getHistoryList(params, fn){
        $$api("api/intervention/log", params, data => {
            fn && fn(data);
        });
    },
};
