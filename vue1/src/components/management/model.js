import $$model from "@/model/model.js";
import $$api from "@/model/api.js";
import _ from "@/lib/underscore.v1.4.4.min.js";

const model = new $$model({});

_.extend(model, {
    // 获取角色列表
    getRoleList (params, fn) {
        $$api("api/authority/person/select", {}, obj => {
            model.trigger("getRoleList", obj);
            fn && fn(obj);
        });
    },
    // 获取权限人列表
    getManagementList (params, fn) {
        $$api("api/authority/person/list", params, obj => {
            model.trigger("getManagementList", obj);
            fn && fn(obj);
        });
    },
    // 添加权限
    addManagementById (params, fn) {
        $$api("api/authority/person/add", params, obj => {
            model.trigger("addManagementById", obj);
            fn && fn(obj);
        });
    },
    // 删除
    delManagementById (params, fn) {
        $$api("api/authority/person/delete", params, obj => {
            model.trigger("delManagementById", obj);
            fn && fn(obj);
        });
    },
    // 编辑角色权限
    editRolePermissionList (params, fn) {
        $$api("api/authority/person/editRolePermissionList", params, obj => {
            model.trigger("editRolePermissionList", obj);
            fn && fn(obj);
        });
    },
    // 获取权限列表
    listAllPermission (params, fn) {
        $$api("api/authority/person/listAllPermission", params, obj => {
            model.trigger("listAllPermission", obj);
            fn && fn(obj);
        });
    },
    // 获取所有角色及其对应权限
    getAllRolesAndPermissions (params, fn) {
        $$api("api/authority/person/getAllBackEndRolesAndPermissions", params, obj => {
            model.trigger("getAllRolesAndPermissions", obj);
            fn && fn(obj);
        });
    },
    // 添加角色
    addBackEndRoles (params, fn) {
        $$api("api/authority/person/addBackEndRoles", params, obj => {
            model.trigger("addBackEndRoles", obj);
            fn && fn(obj);
        });
    },
    // 删除角色
    deleteBackEndRoles (params, fn) {
        $$api("api/authority/person/deleteBackEndRoles", params, obj => {
            model.trigger("deleteBackEndRoles", obj);
            fn && fn(obj);
        });
    }
});

export default model;
