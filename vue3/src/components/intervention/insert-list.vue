<template>
    <div class="seller-list-main">
        <!-- 顶部按钮、搜索组件 -->
        <div class="header">
            <el-form style="float:left;">
                <el-form-item label="城市:" style='display:inline-block;width:500px;'>
                    <el-select
                        v-model="cityList"
                        style="width:180px;"
                        filterable
                        placeholder="请选择省份"
                        @change='refreshCity'>
                        <el-option
                            v-for="group in info"
                            :label="group.province" 
                            :key='group.province' 
                            :value="group.cityList">
                        </el-option>
                    </el-select>
                    <el-select
                        v-model="queryCity"
                        style="width:180px;"
                        filterable
                        placeholder="请选择城市"
                        @change='initRander'>
                        <el-option
                            v-for="item in cityList"
                            :label="item.cityName" :value="item.cityId" :key="item.cityId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form style="float:right;">
                <el-button 
                    class="header-btns" 
                    type="primary" 
                    @click="clickDeleteBtn" 
                    :disabled="!hasChecked">
                    <i class="el-icon-delete" style="margin-right:10px;"></i>删除
                </el-button>
            </el-form>
        </div>

        <!-- table表格 -->
        <div class="table-content">
            <el-table
                :data="tableData"
                border
                @selection-change="handleSelectionChange">
                <el-table-column type='selection'></el-table-column>
                <el-table-column prop="position" label="位置" width="80" align='center'></el-table-column>
                <el-table-column prop="pid" label="楼盘ID" width="120" align='center'></el-table-column>
                <el-table-column prop="projectName" label="楼盘名称" width="220" align='center'></el-table-column>
                <el-table-column prop="from" label="起始日期" :format="formatDate" width="200" align='center'></el-table-column>
                <el-table-column prop="to" label="失效日期" :format="formatDate" width="200" align='center'></el-table-column>
                <el-table-column prop="managerName" label="操作人员" width="240" align='center'></el-table-column>
                <el-table-column label="操作" width="240" align='center'>
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click='clickEditBtn(scope.row)'>编辑</el-button>
                        <el-tooltip class="item" effect="dark" content="上调" placement="top-start">
                            <el-button 
                                type="text" size="medium" 
                                class='el-icon-arrow-up' 
                                style='font-weight:bold;font-size:20px;'
                                @click='updownChange(scope.row, scope.$index, 0)'
                                :disabled='scope.$index == 0'>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="下调" placement="top-start">
                            <el-button 
                                type="text" size="medium" 
                                class='el-icon-arrow-down' 
                                style='font-weight:bold;font-size:20px;'
                                @click='updownChange(scope.row, scope.$index, 1)'
                                :disabled='scope.$index == 9'>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页组件 -->
        <div class="footer">
            <el-pagination @current-change="handleCurrentChange" :page-size="page_size" layout="total,prev,pager,next,jumper" :total="totalCount">
            </el-pagination>
        </div>

        <!-- 编辑楼盘模态框 -->
        <el-dialog title="编辑楼盘" :visible.sync="editFormVisible">
            <el-form :model="formEdit" style="padding:0 60px;" class='editEstate'>
                <el-form-item label="楼盘id :">
                    <el-input 
                        v-model="formEdit.pid" 
                        placeholder="输入楼盘id" 
                        auto-complete="on" 
                        class="dialog-input" 
                        @change="getProjectInfo">
                    </el-input>
                </el-form-item>
                <el-form-item label="楼盘名称 :">
                    <el-input 
                        v-model="formEdit.projectName" 
                        class="dialog-input" 
                        @input="isChanged = true"
                        :disabled='true'>
                    </el-input>
                </el-form-item>
                <el-form-item label="城市:">
                    <el-select v-model="formEdit.cityId" :disabled='true'>
                        <el-option
                            v-for="item in cityList"
                            :label="item.cityName" :value="item.cityId" :key="item.cityId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效日期：">
                    <el-date-picker
                        v-model="formEdit.from"
                        placeholder="选择日期"
                        :editable="false"
                        format="yyyy-MM-dd"
                        @change="startDateChange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="过期日期：">
                    <el-date-picker
                        v-model="formEdit.to"
                        placeholder="选择日期"
                        :editable="true"
                        format="yyyy-MM-dd"
                        @change="endDateChange">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInit">取 消</el-button>
                <el-button type="primary" @click="editInsert" :disabled="!isChanged">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from "@/model/utils";
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
                page_size: 10,
                page_index: 1,
                totalCount: 0,
                maxPosition: 10,
                queryContent: "",
                queryCity: '',
                multipleSelection: [],
                editFormVisible: false,
                hasChecked: false,
                isAdmin: false,
                isChanged: false,
                formEdit: {
                    position:"",
                    pid: "",
                    cityId: "",
                    cityName: "",
                    projectName: "",
                    from: "",
                    to: ""
                },
                // 记录更新前状态
                formEx: {
                    position:"",
                    pid: "",
                    cityId: "",
                    cityName: "",
                    projectName: "",
                    from: "",
                    to: ""
                },
                cityList: [],
                estateListShow: [],
            };
        },

        methods: {
            initRander () {
                // 获取列表数据
                if (this.queryCity) {
                    $api.getInsertList({
                        cityId: this.queryCity
                    }, res => {
                        this.tableData = res.data.list;
                        this.tableData.forEach(item => {
                            if (item.from) {
                                item.from = utils._dateTimeFormatter(new Date(item.from));
                            }
                            if (item.to) {
                                item.to = utils._dateTimeFormatter(new Date(item.to));
                            }
                        });
                        this.totalCount = res.data.count;
                    });
                }
            },
            // 选择table中的checkbox事件
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            // 编辑按钮点击事件
            clickEditBtn (row) {
                this.editFormVisible = true;
                this.formEdit.position = row.position;
                this.formEdit.pid = row.pid;
                this.formEdit.projectName = row.projectName;
                this.formEdit.from = row.from;
                this.formEdit.to = row.to;

                if (row.pid) this.getProjectInfo();

                //记录更改前状态
                this.formEx.position = row.position;
                this.formEx.pid = row.pid;
                this.formEx.from = row.from;
                this.formEx.to = row.to;
                this.formEx.projectName = row.projectName;
                this.formEx.cityId = this.queryCity;
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
                    $api.updateInsertInfo({
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

            //取消响应
            cancelInit(){
                this.editFormVisible = false;
            },

            // 翻页事件
            handleCurrentChange (val) {
                this.page_index = val;
                this.initRander();
            },

            // 编辑置顶楼盘 确认按钮
            editInsert () {
                const editParams = {};
                for (const key in this.formEdit) {
                    editParams[key] = this.formEdit[key];
                }
                if (!editParams.position) {
                    this.$message.error("位置不可以为空");
                    return;
                }
                if (!editParams.pid) {
                    this.$message.error("楼盘id不可以为空");
                    return;
                }
                if (!editParams.cityId) {
                    this.$message.error("楼盘不存在或已售罄");
                    return;
                }
                if (!editParams.from) {
                    this.$message.error("请选择生效日期");
                    return;
                }
                if (!editParams.to) {
                    this.$message.error("请选择过期日期");
                    return;
                }
                if (editParams.position > this.maxPosition){
                    this.$message.error("可干预楼盘列表位为: 1-10");
                    return;
                }
                if (editParams.cityId != this.queryCity){
                    this.$message.error("所添加楼盘为" + editParams.cityName+"楼盘");
                    return;
                }
                // 提交表单发送请求编辑用户
                $api.updateInsertInfo({
                    type: "update",
                    newInfo: {
                        position: this.formEdit.position,
                        pid: this.formEdit.pid,
                        cityId: this.formEdit.cityId,
                        projectName: this.formEdit.projectName,
                        from: new Date(this.formEdit.from).getTime(),
                        to: new Date(this.formEdit.to).getTime(),
                    },
                    exInfo: {
                        position: this.formEx.position,
                        pid: this.formEx.pid,
                        cityId: this.formEx.cityId,
                        projectName: this.formEx.projectName,
                        from: new Date(this.formEx.from).getTime(),
                        to: new Date(this.formEx.to).getTime(),
                    }
                }, res => {
                    if (res.msg == "success") {
                        this.$message("编辑成功");
                        this.initRander();
                        this.editFormVisible = false;
                        this.isChanged = false;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },

            // 时间格式化
            formatDate(date) {
                return $$util.dateFormat(new Date(date), "yyyy-MM-dd");
            },

            // 根据pid获取cityId cityName projectName
            getProjectInfo () {
                $api.getProjectInfo({
                    pid: this.formEdit.pid
                }, res => {
                    if (res.msg == "success") {
                        if (res.data.info.cityId === this.queryCity) {
                            this.formEdit.cityName = res.data.info.cityName;
                            this.formEdit.projectName = res.data.info.projName;
                            this.isChanged = true;
                        } else {
                            this.$message.error('当前城市没有该楼盘');
                            this.isChanged = false;
                        }
                    } else {
                        this.formEdit.cityName = "";
                        this.formEdit.projectName = "";
                        this.$message.error(res.msg);
                    }
                });
            },
            
            // 上移0 下移1
            updownChange (row, index, type) {
                if (type === 0) {
                    let lastRow = this.tableData[index - 1];
                    $api.exchangeInsertInfos({
                        lowerInfo: row,
                        upperInfo: lastRow
                    }, res => {
                        this.initRander();
                    });
                } else if (type === 1) {
                    let nextRow = this.tableData[index + 1];
                    $api.exchangeInsertInfos({
                        lowerInfo: nextRow,
                        upperInfo: row
                    }, res => {
                        this.initRander();
                    });
                };
            },
            
            // 切换省份清空城市
            refreshCity () {
                this.queryCity = '';
            },

            // 生效日期
            startDateChange (value) {
                if (value && new Date().getTime() - value.getTime() > 86400000) {
                    this.$message.error('生效日期不得小于今天');
                    this.formEdit.from = '';
                    this.isChanged = false;
                } else {
                    this.isChanged = true;
                };
            },

            // 过期日期
            endDateChange (value) {
                if (value && new Date(this.formEdit.from).getTime() - value.getTime() >= 86400000) {
                    this.$message.error('过期日期不得小于生效日期');
                    this.formEdit.to = '';
                    this.isChanged = false;
                } else {
                    this.isChanged = true;
                };
            },
        },

        watch: {
            multipleSelection (val, oldVal) {
                if (val.length > 0) {
                    this.hasChecked = true;
                } else {
                    this.hasChecked = false;
                }
            },
            queryCity (id) {
                this.formEdit.cityId = id;
            },
        },

        computed: {
            info () {
                let userInfo = this.$store.state.userInfo.info,
                    cityInfo = this.$store.state.cityInfo.info;
                if (userInfo.data) {
                    return cityInfo;
                };
            }
        }
    };
</script>

<style>
    /*编辑楼盘样式*/
    .editEstate .el-form-item__label {
        width: 90px;
        text-align: left;
    }
</style>

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
