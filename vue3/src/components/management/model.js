import $$model from "@/model/model.js";
import $$api from "@/model/api.js";
import _ from "@/lib/underscore.v1.4.4.min.js";

const model = new $$model({});

_.extend(model, {

    //获取所有用户信息
    getAllManager(params,fn){
      $$api('api/user/list', params, data => {
          fn && fn(data);
      })
    },

    //根据邮箱查询用户信息
    queryUserInfo(params,fn){
      $$api('api/user/query', params, data => {
          fn && fn(data);
      })
    },

    // 新增或更新管理人员
    addNewManager(params, fn) {
        $$api("api/user/add", params, obj => {
            fn && fn(obj);
        });
    },
    
    //删除用户权限
    delUserByEmail (param, fn) {
        $$api('api/user/del', param, data => {
            fn && fn(data);
        })
    },
});

export default model;
