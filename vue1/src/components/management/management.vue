<template>
    <div>
        <!-- head -->
        <div class="manage-search">
            <el-select v-model="type" class="mang-select" @change="search">
                <el-option
                    v-for="item in typeOptions" 
                    :label="item.description" :value="item.roleId" :key='item.roleId'
                    style="width:180px;">
                </el-option>
            </el-select>
            <el-button type="primary" class="add-btn" @click="add">分配角色</el-button>
            <el-button type="primary" class="add-btn" @click="edit">编辑角色</el-button>
        </div>

        <!-- table -->
        <div class="manage-list">
            <el-table :data="tableData" border style="width:100%;" align="center">
                <el-table-column property="email" label="邮箱" width="" align="center"></el-table-column>
                <el-table-column property="nickName" label="姓名" width="" align="center"></el-table-column>
                <el-table-column property="description" label="角色" width="" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span><el-button type="text" @click="del(scope.row)">删除</el-button></span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination v-model="page" v-show="this.tableData.length>0" @current-change="changeSize"
                               :current-page="currentPage" :page-size="pageSize"
                               layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

        <!--dialog-->
        <el-dialog title="添加权限" :visible.sync="dialogFormVisible">
          <el-form :model="manageForm" label-width="60px;">
            <el-form-item label="邮箱" >
              <el-input v-model="manageForm.email" auto-complete="off"  class="width1"></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="manageForm.type" class="mang-select">
                <el-option 
                    v-for="(item, key) in typeOptions" 
                    v-if="key > 0" 
                    :label="item.description" :value="item.roleName" :key='item.roleName'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addManForm">确 定</el-button>
          </div>
        </el-dialog>

        <!--edit role dialog -->
        <el-dialog @close="editDialogClose" title="编辑角色" :visible.sync="dialogRoleEditVisible">
            <el-input class="addName" v-model="addName" placeholder="请输入角色英文简写 "></el-input>
            <el-input class="addName" v-model="addDescription" placeholder="请输入角色描述 "></el-input>
            <el-select class="addRoles" v-model="addRoles" multiple placeholder="请选择">
                <el-option 
                    filterable multiple 
                    v-for="item in allPermissions" 
                    :label="item.perm_des" :value="item.perm_id" :key="item.perm_id">
                </el-option>
            </el-select>
            <el-button type="primary" @click="addRoleItem" style='float:right;margin:10px 20px 20px 0;'>添 加</el-button>
            <el-table :data="editRoleData" border style="width:100%;" align="center" max-height="450">
                <el-table-column label="角色名">
                    <template slot-scope="scope">
                        <span v-if="currentEdit !== scope.$index">{{scope.row.description}}</span>
                        <el-input ref="editRoleName" v-else class="editRoleItemDescription" v-model="editRoleItemDescription" placeholder="请输入角色名称"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="权限" width="" align="center">
                    <template slot-scope="scope">
                        <el-select v-show="currentEdit === scope.$index" class="permissionSelect" v-model="editRoleData[scope.$index].options" multiple placeholder="请选择">
                            <el-option 
                                filterable multiple 
                                v-for="item in allPermissions" 
                                :label="item.perm_des" :value="item.perm_id" :key='item.perm_id'>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span v-if="currentEdit !== scope.$index">
                                <el-button type="text" @click="editRoleItem(scope.row, scope.$index)">编辑</el-button>
                                <el-button type="text" @click="delRoleItem(scope.row)">删除</el-button>
                            </span>
                            <span v-else>
                                <el-button type="text" @click="saveRoleItem(scope.row, scope.$index)">确认</el-button>
                            </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div style='text-align:right;'>
                <el-button class="bottom-button" type="primary" @click="publishRoleChange">发 布</el-button>
                <el-button class="bottom-button" type="primary" @click="cancelEditRole">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
.el-select-dropdown {
    z-index: 3999 !important;
}
</style>
<style scoped>
    .manage-list {
    margin-bottom: 25px;
}

.mang-select {
    float: left;
    width: 180px;
    margin-right: 10px;
}

.width1 {
    width: 200px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.manage-search {
    margin: 10px 0 25px 0;
    overflow: hidden;
}

.dialog-footer {
    margin-top: -20px;
    text-align: center;
}

.permissionSelect {
    height: 36px;
}

.permissionSelect input {
    height: 36px;
}

.bottom-button {
    margin: 20px 0 0 20px;
}

.addName {
    width: 160px;
    display: inline-block;
    overflow: hidden;
}

.addRoles {
    width: 300px;
    display: inline-block;
    overflow: hidden;
}

.editRoleItemDescription {
    width: 100%;
}
</style>

<script>
    import $$management from "./model.js";
    export default{
        name: "management",
        data () {
            return {
                page: 1,
                pageSize: 5,
                total: 0,
                self_name: "management",
                tableData: [],
                type: "",
                typeOptions: [],
                delId: -1,
                addList: [],
                manageForm: {
                    email: "",
                    type: "ROLE_BE_STAFF_ADMIN"
                },
                dialogFormVisible: false,
                dialogRoleEditVisible: false,
                editRoleData: [],
                allPermissions: [],
                currentEdit: -1,
                addName: "",
                addDescription: "",
                addRoles: [],
                editRoleItemDescription: "",
                roleIdDes: {}, // roleId description 的映射
                deleteRoleIds: [],
                publishData: {},
                currentPage: 1,
                originRoleData: {}, // 原始数据，如果修改后不发布，用此数据恢复
                closeType: 0, // 1 是点确定，0是其他情况
                isRequire: false
            };
        },
        methods: {
            search (val) {
                if (!this.isRequire) return;

                const params = {
                    pageSize: this.pageSize,
                    roleId: this.type,
                    pageIndex: this.page
                };

                window.localStorage.setItem("ad_management_searchContent", this.type);
                $$management.getManagementList(params);
            },
            changeSize (val) {
                this.page = val;
                this.search();
            },
            add () {
                this.dialogFormVisible = true;
                this.manageForm = {
                    email: "",
                    type: "ROLE_BE_STAFF_ADMIN"
                };
            },
            edit () {
                this.dialogRoleEditVisible = true;
            },
            addRoleItem () {
                const _this = this;
                const params = {
                    "role_perm_list": [{
                        "name": _this.addName,
                        "description": _this.addDescription,
                        "permIds": _this.addRoles
                    }]
                };
                $$management.addBackEndRoles(params, function (res) {
                    if (res.code === 200) {
                        _this.$notify.success({
                            title: "成功",
                            message: "添加角色成功",
                            duration: 2000
                        });
                        $$management.getAllRolesAndPermissions();
                        _this.addName = "";
                        _this.addDescription = "";
                        _this.addRoles = [];
                    } else {
                        _this.$notify.error({
                            title: "发生错误",
                            message: "添加角色错误",
                            duration: 2000
                        });
                    }
                });
            },
            // 删除角色
            delRoleItem: function (row) {
                let roleId = this.roleIdDes[row.description];
                if (!roleId) {
                    roleId = this.getRoleIdByDes(row.description);
                }
                if (this.deleteRoleIds.indexOf(roleId) === -1) {
                    this.deleteRoleIds.push(roleId);
                    delete this.publishData[roleId];
                }
                this.removeEditRoleItem(row);
            },
            // 移除表格中的项
            removeEditRoleItem: function (row) {
                const data = this.editRoleData;
                for (let i = 0, length = data.length; i < length; i++) {
                    const item = data[i];
                    if (item.description === row.description) {
                        data.splice(i, 1);
                        break;
                    }
                }
            },
            del (item) {
                const that = this;
                this.$confirm("确认删除该条记录吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    that.delId = item.userId;
                    $$management.delManagementById({
                        userId: item.userId,
                        roleName: item.roleName
                    });
                }).catch(function () {
                    that.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            addManForm () {
                // 判断邮箱
                const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if (this.manageForm.email == "" || !re.test(this.manageForm.email)) {
                    this.$notify.error({
                        title: "错误",
                        message: "请填写正确的邮箱",
                        duration: 2000
                    });
                    return;
                }
                // 判断角色
                if (this.manageForm.type == "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请选择角色",
                        duration: 2000
                    });
                    return;
                }
                // 邮箱提交
                $$management.addManagementById({
                    email: this.manageForm.email,
                    roleName: this.manageForm.type
                });
            },
            cancelEditRole: function () {
                this.dialogRoleEditVisible = false;
            },
            // 发布修改
            publishRoleChange: function () {
                const params = {
                    "role_perm_list": []
                };
                this.closeType = 1;
                const _this = this;
                for (let i = 0, length = _this.editRoleData.length; i < length; i++) {
                    const item = _this.editRoleData[i];
                    const roleId = _this.getRoleIdByDes(item.description);
                    if (roleId) {
                        params.role_perm_list.push({
                            "roleId": roleId,
                            "permIds": item.options,
                            "description": item.description
                        });
                    }
                }
                if (params.role_perm_list.length > 0) {
                    // 提交编辑部分
                    $$management.editRolePermissionList(params, function (data) {
                        if (data.code === 200) {
                            _this.$notify.success({
                                title: "成功",
                                message: "编辑成功",
                                duration: 2000
                            });
                            _this.updateData();
                            _this.dialogRoleEditVisible = false;
                        } else {
                            _this.$notify.error({
                                title: "失败",
                                message: "编辑失败",
                                duration: 2000
                            });
                        }
                    });
                }
                // 提交删除部分
                if (_this.deleteRoleIds.length === 0) {
                    return;
                }
                $$management.deleteBackEndRoles({
                    "roleIds": _this.deleteRoleIds
                }, function (data) {
                    if (data.code === 200) {
                        _this.$notify.success({
                            title: "成功",
                            message: "删除角色成功",
                            duration: 2000
                        });
                        _this.dialogRoleEditVisible = false;
                    } else if (data.code === 500) {
                        _this.$notify.error({
                            title: "失败",
                            message: data.msg,
                            duration: 2000
                        });
                    } else {
                        _this.$notify.error({
                            title: "失败",
                            message: "删除角色失败",
                            duration: 2000
                        });
                    }
                    _this.updateData();
                });
            },
            // 获取编辑后的roleId
            getRoleIdByDes: function (des) {
                const cache = this.publishData;
                for (const k in cache) {
                    if (cache[k] === des) {
                        return Number(k);
                    }
                }
            },
            // 点击修改
            editRoleItem: function (row, index) {
                this.currentEdit = index;
                this.editRoleItemDescription = this.editRoleData[index].description;
                // 已修改的id和description映射 id:description
                this.publishData[this.roleIdDes[this.editRoleItemDescription]] = this.editRoleItemDescription;
            },
            // 修改后确定
            saveRoleItem: function (row, index) {
                if (this.$refs.editRoleName.currentValue === "") {
                    this.$notify.error({
                        "title": "错误",
                        "message": "不能为空",
                        "duration": 2000
                    });
                    return;
                }
                this.editRoleData.splice(index, 1, { "description": this.$refs.editRoleName.currentValue, "options": this.editRoleData[index].options });
                // 更新已修改的id和description映射
                this.publishData[this.roleIdDes[this.editRoleItemDescription]] = this.$refs.editRoleName.currentValue;
                this.currentEdit = -1;
            },
            updateData: function () {
                $$management.getRoleList();
                $$management.getAllRolesAndPermissions();
            },
            editDialogClose: function () {
                if (this.closeType === 0) {
                    this.editRoleData = JSON.parse(JSON.stringify(this.originRoleData));
                }
            }
        },
        activated: function () {
            $$management.getRoleList();
            this.search();
            $$management.getAllRolesAndPermissions();
            $$management.listAllPermission();
        },
        beforeMount: function () {
            const that = this;
            // 获取角色列表
            $$management.on("getRoleList", function (data) {
                if (parseInt(data.code) === 200) {
                    const _data = data.data;
                    that.roleIdDes = {};
                    for (let k = 0, length = _data.length; k < length; k++) {
                        that.roleIdDes[_data[k].description] = _data[k].roleId;
                    }
                    _data.unshift({
                        roleId: "0",
                        name: "",
                        description: "全部"
                    });
                    that.typeOptions = _data;
                }

                that.type = window.localStorage.getItem("ad_management_searchContent") ? window.localStorage.getItem("ad_management_searchContent") : "0";
                that.isRequire = true;
                that.search(that.type);
            });

            // 获取权限人列表
            $$management.on("getManagementList", data => {
                if (parseInt(data.code) === 200) {
                    const resData = data.data;
                    that.tableData = resData.authorityPersonList;
                    that.total = parseInt(resData.totalNum);
                }
            });

            // 填加权限人回调
            $$management.on("addManagementById", data => {
                if (parseInt(data.code) === 200) {
                    that.dialogFormVisible = false;
                    that.$notify({
                        title: "成功",
                        message: "添加权限成功",
                        type: "success",
                        duration: 2000
                    });
                    that.search();
                } else if (parseInt(data.code) === 408) {
                    that.$notify.error({
                        title: "错误",
                        message: "该邮箱已经拥有这个角色",
                        duration: 2000
                    });
                } else {
                    that.$notify.error({
                        title: "错误",
                        message: "填加权限失败",
                        duration: 2000
                    });
                }
            });
            // 删除
            $$management.on("delManagementById", function (data) {
                if (parseInt(data.code) === 200) {
                    that.$notify({
                        title: "成功",
                        message: "删除数据成功",
                        type: "success",
                        duration: 2000
                    });
                    // 更新数据
                    that.tableData.forEach(function (item, index) {
                        if (item.userId == that.delId) {
                            that.tableData.splice(index, 1);
                        }
                    });
                } else {
                    that.$notify.error({
                        title: "错误",
                        message: "删除数据失败",
                        duration: 2000
                    });
                }
                that.delId = -1;
            });
            // 获取所有角色及其权限
            $$management.on("getAllRolesAndPermissions", data => {
                if (parseInt(data.code) === 200) {
                    const tmp = [];
                    data = data.data;
                    for (let i = 0, length = data.length; i < length; i++) {
                        const item = data[i];
                        for (const key in item) {
                            tmp.push({
                                description: key,
                                options: item[key].map(function (item) {
                                    return item.permId;
                                })
                            });
                        }
                    }
                    that.editRoleData = tmp;
                    that.originRoleData = JSON.parse(JSON.stringify(tmp));
                }
            });
            // 获取权限列表
            $$management.on("listAllPermission", data => {
                if (parseInt(data.code) === 200) {
                    that.allPermissions = data.data;
                }
            });
        }
    };
</script>
