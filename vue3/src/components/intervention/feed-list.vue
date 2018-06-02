<template>
    <div class="seller-list-main">
        <!-- 顶部按钮、搜索组件 -->
        <div class="header">
            <el-button class="header-btns" type="primary" @click="clickNewBtn">
                <i class="el-icon-plus" style="margin-right:10px;"></i>新增
            </el-button>
            <el-button class="header-btns" type="primary" @click="clickEditBtn" :disabled="!hasChecked">
                <i class="el-icon-edit" style="margin-right:10px;"></i>编辑
            </el-button>
            <el-button class="header-btns" type="primary" @click="clickDeleteBtn" :disabled="!hasChecked">
                <i class="el-icon-delete" style="margin-right:10px;"></i>删除
            </el-button>

            <el-form style="padding:0 60px;float:right;">
                <el-form-item label="城市:" style='display:inline-block;width:250px;'>
                    <el-select
                            v-model="queryCity"
                            style="width:180px;"
                            filterable
                            @change='initRander'>
                        <el-option-group>
                            <el-option label='全部城市' value=''></el-option>
                        </el-option-group>
                        <el-option-group
                                v-for="group in cityOptions"
                                :label="group.province" :key='group.province'>
                            <el-option
                                    v-for="item in group.cityList"
                                    :label="item.cityName" :value="item.cityId" :key="item.cityId">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <!-- table表格 -->
        <div class="table-content">
            <el-table :data="currentTableData" border style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="index" label="序号"></el-table-column>
                <el-table-column prop="pid" label="楼盘id"></el-table-column>
                <el-table-column prop="projectName" label="楼盘名"></el-table-column>
                <el-table-column prop="managerName" label="管理员id"></el-table-column>
                <el-table-column prop="updateTime" label="添加时间"></el-table-column>
            </el-table>
        </div>

        <!-- 分页组件 -->
        <div class="footer">
            <el-pagination @current-change="handleCurrentChange" :page-size="page_size" layout="total,prev,pager,next,jumper" :total="totalCount">
            </el-pagination>
        </div>

        <!-- 新增员工模态框 -->
        <el-dialog title="新增楼盘" :visible.sync="addFormVisible">
            <el-form :model="formEdit" style="padding:0 60px;">
                <el-form-item label="楼盘id :">
                    <el-input v-model="formEdit.pid" placeholder="输入楼盘id" auto-complete="on" class="dialog-input" @change="getProjectInfo"></el-input>
                </el-form-item>
                <el-form-item label="城市:">
                    <el-input :disabled="true" v-model="formEdit.cityName" placeholder="城市id" auto-complete="on" class="dialog-input"></el-input>
                </el-form-item>
                <el-form-item label="楼盘名称:">
                    <el-input :disabled="true" v-model="formEdit.projectName" placeholder="楼盘名" auto-complete="on" class="dialog-input"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInit">取 消</el-button>
                <el-button type="primary" @click="addDelete">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑楼盘模态框 -->
        <el-dialog title="编辑楼盘" :visible.sync="editFormVisible">
            <el-form :model="formEdit" style="padding:0 60px;">

                <el-form-item label="楼盘id :">
                    <el-input v-model="formEdit.pid" placeholder="输入楼盘id" auto-complete="on" class="dialog-input" @change="getProjectInfo" @input="isChanged = true"></el-input>
                </el-form-item>
                <el-form-item label="城市:">
                    <el-input :disabled="true" v-model="formEdit.cityName" placeholder="城市id" auto-complete="on" class="dialog-input" @change="isChanged = true"></el-input>
                </el-form-item>
                <el-form-item label="楼盘名称:">
                    <el-input :disabled="true" v-model="formEdit.projectName" placeholder="楼盘名" auto-complete="on" class="dialog-input" @change="isChanged = true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInit">取 消</el-button>
                <el-button type="primary" @click="editDelete" :disabled="!isChanged">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import $api from "./model.js";
    import $user from "@/model/user";
    import $$util from "@/lib/util";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }

    export default {
        data () {
            return {
                tableData: [],
                currentTableData: [],
                page_size: 10,
                page_index: 1,
                totalCount: 0,
                queryContent: "",
                queryCity: "",
                multipleSelection: [],
                addFormVisible: false,
                editFormVisible: false,
                hasChecked: false,
                isAdmin: false,
                isChanged: false,
                formEdit: {
                    pid: "",
                    cityId: "",
                    cityName: "",
                    projectName: "",
                    updateTime: ""
                },
                //记录更新前状态
                formEx: {
                    pid: "",
                    cityId: "",
                    cityName: "",
                    projectName: "",
                    updateTime: ""
                },
                cityOptions: [],
            };
        },

        watch: {
            multipleSelection (val, oldVal) {
                if (val.length > 0) {
                    this.hasChecked = true;
                } else {
                    this.hasChecked = false;
                }
            }
        },

        methods: {
            initRander () {
                const that = this;
                // 获取列表数据
                if (that.queryCity) {
                    $api.getDeleteList({
                        cityId: that.queryCity
                    }, res => {
                        that.tableData = res.data.list;
                        that.totalCount = res.data.count;
                        that.page_index = 1;
                        that.currentTableData = [];
                        for (var i = 0; i < that.page_size; i++) {
                            if (that.tableData[i]) {
                                that.currentTableData[i] = that.tableData[i];
                                that.currentTableData[i].index = i +1;
                            }
                        }
                    });
                }
            },
            // 选择table中的checkbox事件
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            // 编辑按钮点击事件
            clickEditBtn () {
                const that = this;

                if (that.multipleSelection.length == 1) {
                    that.editFormVisible = true;
                    // 编辑一个楼盘
                    that.formEdit.pid = that.multipleSelection[0].pid;
                    that.isChanged = false;
                    that.getProjectInfo();

                    that.formEx.pid = that.multipleSelection[0].pid;
                    that.formEx.projectName = that.multipleSelection[0].projectName;
                    that.formEx.cityId = that.queryCity;
                } else {
                    // 编辑多个楼盘报错
                    that.$message.warning("仅可同时编辑一个楼盘");
                }
            },

            clickNewBtn(){
                const that = this;
                that.cancelInit();
                that.addFormVisible = true;
            },

            // 点击删除按钮事件
            clickDeleteBtn () {
                const that = this;
                let deleteIdList = [];
                that.multipleSelection.forEach((item, index) => {
                    // push要删除员工的number或id
                    deleteIdList.push(item.pid);
                });

                that.$confirm("确定要删除吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    $api.updateDeleteInfo({
                        pidList: deleteIdList,
                        type: "delete"
                    }, res => {
                        if (res.msg == "success") {
                            that.$message("删除成功");
                            that.initRander();
                        } else {
                            that.$message({
                                type: "error",
                                message: "部分楼盘删除失败，请稍后重试"
                            });
                        }
                    });
                }).catch(function (e) {
                    // console.log(e);
                });
            },

            //取消操作
            cancelInit(){
                const that = this;

                that.addFormVisible = false;
                that.editFormVisible = false;
                that.formEdit.pid = "";
                that.formEdit.cityId = "";
                that.formEdit.cityName = "";
                that.formEdit.projectName = "";
                that.formEdit.updateTime = "";
            },

            // 翻页事件
            handleCurrentChange (val) {
                const that = this;
                this.page_index = val;
                that.currentTableData = [];
                var index = that.page_size*(that.page_index-1);
                for (var i = 0; i < that.page_size; i++) {
                    if (that.tableData[i+index]) {
                        that.currentTableData[i] = that.tableData[i + index];
                        that.currentTableData[i].index = i + index +1;
                    }
                }
            },

            // 提交新建过滤楼盘 确认按钮
            addDelete () {
                const that = this;
                const params = {};
                for (const key in that.formEdit) {
                    params[key] = that.formEdit[key];
                }
                if (!that.queryCity){
                    that.$message.error("请先选择干预城市");
                    return;
                }
                if (!params.pid) {
                    that.$message.error("楼盘id不可以为空");
                    return;
                }
                if (!params.cityId) {
                    that.$message.error("楼盘不存在或已售罄");
                    return;
                }
                if (params.cityId != that.queryCity){
                    that.$message.error("所添加楼盘为"+params.cityName+"楼盘");
                    return;
                }
                // 提交表单发送请求新建过滤楼盘
                $api.addDeleteInfo({
                    pid: that.formEdit.pid,
                    cityId: that.formEdit.cityId,
                    projectName: that.formEdit.projectName,
                }, (res) => {
                    if (res.msg == "success") {
                        that.$message("添加成功");
                        that.queryCity = that.formEdit.cityId;
                        that.initRander();
                        that.addFormVisible = false;
                        that.formEdit.pid = "";
                        that.formEdit.cityId = "";
                        that.formEdit.cityName = "";
                        that.formEdit.projectName = "";
                    } else {
                        that.$message.error(res.msg);
                    }
                });
            },

            // 编辑置顶楼盘 确认按钮
            editDelete () {
                const that = this;
                const editParams = {};
                for (const key in that.formEdit) {
                    editParams[key] = that.formEdit[key];
                }
                if (!editParams.pid) {
                    that.$message.error("楼盘id不可以为空");
                    return;
                }
                if (!editParams.cityId) {
                    that.$message.error("楼盘不存在或已售罄");
                    return;
                }
                if (editParams.cityId != that.queryCity){
                    that.$message.error("所添加楼盘为"+editParams.cityName+"楼盘");
                    return;
                }
                // 提交表单发送请求编辑用户
                $api.updateDeleteInfo({
                    type: "update",
                    newInfo: {
                        pid: that.formEdit.pid,
                        cityId: that.formEdit.cityId,
                        projectName: that.formEdit.projectName,
                    },
                    exInfo: {
                        pid: that.formEx.pid,
                        cityId: that.formEx.cityId,
                        projectName: that.formEx.projectName,
                    }
                }, (res) => {
                    if (res.msg == "success") {
                        that.$message("编辑成功");
                        that.initRander();
                        that.editFormVisible = false;
                        that.formEdit.pid = "";
                        that.formEdit.cityId = "";
                        that.formEdit.cityName = "";
                        that.formEdit.projectName = "";
                        that.isChanged = false;
                    } else {
                        that.$message.error(res.msg);
                    }
                });
            },
            formatDate(date) {
                return $$util.dateFormat(new Date(date), "yyyy-MM-dd");
            },
            getProjectInfo(){
                const that = this;
                $api.getProjectInfo({
                    pid: that.formEdit.pid
                }, res => {
                    if (res.msg == "success") {
                        that.formEdit.cityId = res.data.info.cityId;
                        that.formEdit.cityName = res.data.info.cityName;
                        that.formEdit.projectName = res.data.info.projName;

                        if (that.formEdit.cityId != that.queryCity){
                            that.$message.error("所修改楼盘为"+that.formEdit.cityName+"楼盘");
                            return;
                        }
                    } else {
                        that.formEdit.cityId = "";
                        that.formEdit.cityName = "";
                        that.formEdit.projectName = "";
                        that.$message.error(res.msg);
                    }
                });
            }
        },

        beforeMount () {
            const that = this;
            // 获取必要参数
            $user.getUserInfo(res => {
                if (res.code === 200) {
                    if (res.data.access.indexOf("DELETE") >= 0) {
                        that.cityOptions = res.data.cities;
                    }
                }
            });
        },
        mounted () {
            this.initRander();
        }
    };
</script>

<style scoped>
    .seller-list-main {
        padding: 30px 0;
        overflow: hidden;
    }

    .header {
        overflow: hidden;
        width: 95%;
        margin: 30px auto;
    }

    .header .header-btns {
        float: left;
        margin-right: 20px;
    }

    .header .header-input {
        float: left;
        margin-left: 20px;
    }

    .header .header-search {
        width: 260px;
        float: left;
    }

    .table-content {
        width: 95%;

        /*height: 700px;*/
        margin: 30px auto;
    }

    .table-btns {
        display: block;
        width: 80px;
        line-height: 28px;
        background: rgb(32, 160, 255);
        color: #fff;
        border-radius: 5px;
        text-align: center;
        padding: 0 15px;
        margin: 0 auto;
    }

    .table-btns:hover {
        background: rgba(32, 160, 255, 0.8);
    }

    .dialog-input {
        float: left;
        width: 70%;
    }

    .footer {
        float: right;
        margin-right: 40px;
    }
</style>
