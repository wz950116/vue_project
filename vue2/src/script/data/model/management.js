/**
 * Created by wangwei on 2016/11/18.
 */
import $$model from '../../../lib/model.js';
import $$app from '../../app.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';

var model = new $$model({});

_.extend(model, {
    // 获取角色列表
    getRoleList: function (params, fn) {
        $$app.getApi('/api/getRoleList.json', {}, function (obj) {
            model.trigger('getRoleList', obj);
            fn && fn(obj);
        });
    },
    // 获取权限人列表
    getManagementList: function (params, fn) {
        $$app.getApi('/api/getManagementList.json', params, function (obj) {
            model.trigger('getManagementList', obj);
            fn && fn(obj);
        });
    },
    // 添加权限
    addManagementById: function (params, fn) {
        $$app.getApi('/api/addManagementById.json', params, function (obj) {
            model.trigger('addManagementById', obj);
            fn && fn(obj);
        });
    },
    // 删除
    delManagementById: function (params, fn) {
        $$app.getApi('/api/delManagementById.json', params, function (obj) {
            model.trigger('delManagementById', obj);
            fn && fn(obj);
        });
    },
    // 编辑角色权限
    editRolePermissionList: function (params, fn) {
        $$app.getApi('/api/editRolePermissionList.json', params, function (obj) {
            model.trigger('editRolePermissionList', obj);
            fn && fn(obj);
        })
    },
    // 获取权限列表
    listAllPermission: function (params, fn) {
        $$app.getApi('/api/listAllPermission.json', params, function (obj) {
            model.trigger('listAllPermission', obj);
            fn && fn(obj);
        })
    },
    // 获取所有角色及其对应权限
    getAllRolesAndPermissions: function (params, fn) {
        $$app.getApi('/api/getAllRolesAndPermissions.json', params, function (obj) {
            model.trigger('getAllRolesAndPermissions', obj);
            fn && fn(obj);
        })
    },
    // 添加角色
    addBackEndRoles: function (params, fn) {
        $$app.getApi('/api/addBackEndRoles.json', params, function (obj) {
            model.trigger('addBackEndRoles', obj);
            fn && fn(obj);
        })
    },
    // 删除角色
    deleteBackEndRoles: function (params, fn) {
        $$app.getApi('/api/deleteBackEndRoles.json', params, function (obj) {
            model.trigger('deleteBackEndRoles', obj);
            fn && fn(obj);
        })
    }
});

export default model;
