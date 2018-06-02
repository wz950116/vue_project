<template>
    <div>
        <!-- head -->
        <div class="manage-search">
            <el-button type="primary" class="add-btn" @click="add">权限管理</el-button>
        </div>

        <!-- table -->
        <div class="manage-list">
            <el-table :data="tableData" border style="width:100%;" align="center">
                <el-table-column property="user" label="邮箱" width="" align="center"></el-table-column>
                <el-table-column property="auths" label="权限描述" width="" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span><el-button type="text" @click="del(scope.row)">删除</el-button></span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination 
                    v-model="page" 
                    v-show="this.tableData.length > 0" 
                    @current-change="changeSize"
                    :current-page="currentPage" :page-size="pageSize"
                    layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div> -->
        </div>

        <!--dialog-->
        <el-dialog title="权限管理" :visible.sync="dialogFormVisible">
            <el-form :model="manageForm" label-width="60px;">
                <el-form-item label="邮箱">
                    <el-input 
                        v-model="manageForm.email" 
                        auto-complete="off" 
                        class="width1" placeholder='请输入邮箱'
                        @blur='isCreated'>
                    </el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-select 
                        v-model="manageForm.type"
                        placeholder='请选择权限'
                        multiple>
                        <el-option 
                            v-for="item in typeOptions"
                            :label="item.option" :value="item.value" :key='item.option'>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addManForm">
                    {{update === 0 ? '确 定' : '更 新'}}
                </el-button>
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

    .width1 {
        width: 217px;
    }

    .pagination {
        margin-top: 20px;
        text-align: right;
    }

    .manage-search {
        margin: 30px 0;
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
</style>

<script>
    import $user from "./model";
    export default{
        name: "management",
        data () {
            return {
                page: 1,
                pageSize: 2,
                total: 0,
                tableData: [],
                typeOptions: [],  // 权限
                delId: -1,
                manageForm: {
                    email: "",
                    type: [],
                },
                dialogFormVisible: false,
                currentPage: 1,
                queryCity: [],
                update: 0,  // 0确定  1更新
            };
        },

        methods: {
            initRander () {
                $user.getAllManager({}, res =>{
                    this.tableData = res.data;
                    this.total = this.tableData.length;
                });
            },
            changeSize (val) {
                this.page = val;
            },
            // 判断是否已添加
            isCreated () {
                $user.queryUserInfo({
                    user: this.manageForm.email
                }, res => {
                    if (res.data && res.data.userId) {
                        this.update = 1;
                        this.$message({
                            type: 'warning',
                            message: '该用户已添加'
                        });
                        if (res.data.auths.length > 0)
                            this.manageForm.type = res.data.auths.split(",");
                        if (res.data.cities.length > 0)
                            res.data.cities.split(",").forEach(city => {
                            this.manageForm.cities.push(city * 1)
                            });
                    } else {
                        this.update = 0;
                    }
                });

            },
            // 添加编辑
            add () {
                this.dialogFormVisible = true;
                this.manageForm = {
                    email: '',
                    type: [],
                };
            },
            // 添加编辑-确定
            addManForm () {
                // 判断邮箱
                const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                if (this.manageForm.email == "" || !re.test(this.manageForm.email)) {
                    this.$message.error({
                        title: "错误",
                        message: "请填写正确的邮箱",
                        duration: 2000
                    });
                    return;
                }
                // 判断角色
                if (this.manageForm.type == "") {
                    this.$message.error({
                        title: "错误",
                        message: "请选择权限",
                        duration: 2000
                    });
                    return;
                }
                // 邮箱提交
                $user.addNewManager({
                    user: this.manageForm.email,
                    access: this.manageForm.type,
                }, res => {
                    if (res.code === 200) {
                        this.dialogFormVisible = false;
                        this.$message({
                            type: "info",
                            message: "添加成功"
                        });
                        this.initRander();
                    } else {
                        this.$message.error({
                            title: "错误",
                            message: res.msg,
                            duration: 2000
                        });
                    }
                });
            },
            // 删除
            del (item) {
                this.$confirm("确认删除该条记录吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    $user.delUserByEmail({
                        user: item.user
                    }, res => {
                        if(res.code == 200){
                            this.$message({
                                type: "info",
                                message: "删除成功"
                            });
                            this.initRander();
                        }else
                            this.$message.error({
                                title: "错误",
                                message: res.msg,
                            });
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
        },
        beforeMount () {
            // 权限列表
            this.typeOptions = [
                {
                    option: '权限管理',
                    value: 'MANAGE'
                },
                {
                    option: '置顶楼盘',
                    value: 'INSERT'
                },
                {
                    option: '删除楼盘',
                    value: 'DELETE'
                }
            ];
            // 初始化
            this.initRander();
        },
    };
</script>
