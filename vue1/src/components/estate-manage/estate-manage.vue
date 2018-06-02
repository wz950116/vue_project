<template>
    <div class="seller-list-main">
        <!-- 顶部按钮、搜索组件 -->
        <div class="header">
            <el-row>
                <el-button class="header-btns" type="primary" @click="addFormVisible = true">
                    <i class="el-icon-plus" style="margin-right:10px;"></i>新增
                </el-button>
                <el-button class="header-btns" type="primary" @click="clickEditBtn" :disabled="!hasChecked">
                    <i class="el-icon-edit" style="margin-right:10px;"></i>编辑
                </el-button>
                <el-button class="header-btns" type="primary" @click="clickDeleteBtn" :disabled="!hasChecked">
                    <i class="el-icon-delete" style="margin-right:10px;"></i>删除
                </el-button>
                <!-- upload Excel List -->
                <el-select 
                    v-model="uploadType" 
                    placeholder="请选择" 
                    style="width:140px;float:left;margin-right:.5px;">
                    <el-option
                        v-for="excel in updateExcelApi"
                        :label="excel.label" :key='excel.label' :value='excel.option' 
                        :saveUploadLabel="excel.label">
                    </el-option>
                </el-select>
                <el-upload 
                    :action="uploadUrl" 
                    :show-file-list = "false"
                    :with-credentials = "true" 
                    :before-upload="beforeUpload" 
                    :on-success="uploadSuccess"
                    style='float:left;'>
                    <el-button class="header-btns" type="primary" :disabled='uploadType == ""'>
                        <i class="el-icon-upload" style="margin-right:10px;"></i>
                        {{ saveUploadLabel }}
                    </el-button>
                </el-upload>
            </el-row>
            
            <el-row style="margin-top:20px;">
                <el-input 
                    :placeholder="queryTip"
                    v-model="searchContent" 
                    style="float:right;width:240px;">
                    <el-button 
                        slot="append" 
                        icon="el-icon-search" 
                        @click='clickSearchBtn'
                        :disabled='!queryContent'>
                    </el-button>
                </el-input>
                <el-select 
                    v-model="queryContent" 
                    placeholder="请选择" 
                    style="width:140px;float:right;margin-right:.5px;">
                    <el-option
                        v-for="item in estateQueryList"
                        :label="item.label" :key='item.label' :value='item.option'>
                    </el-option>
                </el-select>
                <el-select 
                    v-model="queryCity" 
                    style="float:right;width:180px;margin-right:20px;"
                    filterable
                    @change='initRander'>
                    <el-option-group>
                        <el-option label='全部城市' value=''></el-option>
                    </el-option-group>
                    <el-option-group>
                        <el-option label='全国' value='100000'></el-option>
                    </el-option-group>
                    <el-option-group
                        v-for="group in cityOptions"
                        :label="group.label" :key='group.label'>
                        <el-option 
                            v-for="item in group.options" 
                            :label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-row>
        </div>

        <!-- table表格 -->
        <div class="table-content">
            <el-table 
                :data="tableData" 
                border style="width: 100%;" 
                @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="estateId" label="楼盘ID" align='center' width='95'></el-table-column>
                <el-table-column prop="estateName" label="楼盘名称" align='center' width='110'></el-table-column>
                <el-table-column prop="cityName" label="城市" align='center'></el-table-column>
                <el-table-column prop="saler" label="销售负责人" align='center'></el-table-column>
                <el-table-column prop="operator" label="运营负责人" align='center'></el-table-column>
                <el-table-column label="投放额度（万）" align='center' style='color:rgb(32, 160, 255);'>
                    <template slot-scope="scope">
                        <router-link :to="{ name: 'estate-money', params: {id: scope.row.estateId}, query: {name: scope.row.estateName} }">
                            {{ scope.row.adMoney }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="thisWeekTarget" label="本周400目标" align='center' width='110'></el-table-column>
                <el-table-column prop="nextWeekTarget" label="下周400目标" align='center' width='110'></el-table-column>
                <el-table-column prop="thisMonthTarget" label="本月400目标" align='center' width='110'></el-table-column>
                <el-table-column prop="nextMonthTarget" label="下月400目标" align='center' width='110'></el-table-column>
            </el-table>
        </div>

        <!-- 分页组件 -->
        <div class="footer">
            <el-pagination @current-change="handleCurrentChange" :page-size="page_size" layout="total,prev,pager,next,jumper" :total="totalCount">
            </el-pagination>
        </div>

        <!-- 新增楼盘模态框 -->
        <el-dialog title="新增楼盘" :visible.sync="addFormVisible">
            <el-form :model="formAdd" style="padding:0 60px;">
                <el-form-item label="楼盘ID :">
                    <el-input 
                        v-model="formAdd.estateId" 
                        placeholder="请输入楼盘ID" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="销售邮箱 :">
                    <el-input 
                        v-model="formAdd.salerEmail" 
                        placeholder="请输入销售负责人邮箱" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="运营邮箱 :">
                    <el-input 
                        v-model="formAdd.operatorEmail" 
                        placeholder="请输入运营负责人邮箱" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="本周400目标 :">
                    <el-input 
                        v-model="formAdd.thisWeekTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="下周400目标 :">
                    <el-input 
                        v-model="formAdd.nextWeekTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="本月400目标 :">
                    <el-input 
                        v-model="formAdd.thisMonthTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="下月400目标 :">
                    <el-input 
                        v-model="formAdd.nextMonthTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addEstate">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑员工模态框 -->
        <el-dialog title="编辑员工" :visible.sync="editFormVisible">
            <el-form :model="formEdit" style="padding:0 60px;">
                <el-form-item label="楼盘ID:">
                    <el-input 
                        v-model="formEdit.estateId" 
                        placeholder="请输入楼盘ID" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="销售邮箱:">
                    <el-input 
                        v-model="formEdit.salerEmail" 
                        placeholder="请输入销售负责人邮箱" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="运营邮箱:">
                    <el-input 
                        v-model="formEdit.operatorEmail" 
                        placeholder="请输入运营负责人邮箱" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="本周400目标:">
                    <el-input 
                        v-model="formEdit.thisWeekTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="下周400目标:">
                    <el-input 
                        v-model="formEdit.nextWeekTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="本月400目标:">
                    <el-input 
                        v-model="formEdit.thisMonthTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="下月400目标:">
                    <el-input 
                        v-model="formEdit.nextMonthTarget" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="editEstate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import $api from "./model.js";
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
                estateQueryList: [],
                page_size: 10,
                page_index: 1,
                totalCount: 0,
                queryTip: "输入楼盘名称或楼盘Id",
                queryContent: "",
                searchContent: "",
                queryCity: "",
                uploadUrl: "",
                uploadType: "",
                multipleSelection: [],
                addFormVisible: false,
                editFormVisible: false,
                hasChecked: false,
                // 新增
                formAdd: {
                    estateId: "",
                    salerEmail: "",
                    operatorEmail: "",
                    thisWeekTarget: "",
                    nextWeekTarget: "",
                    thisMonthTarget: "",
                    nextMonthTarget: ""
                },
                // 编辑
                formEdit: {
                    estateId: "",
                    salerEmail: "",
                    operatorEmail: "",
                    thisWeekTarget: "",
                    nextWeekTarget: "",
                    thisMonthTarget: "",
                    nextMonthTarget: ""
                },
                leaderList: [],
                cityOptions: [],
                updateExcelApi: [
                    {
                        label: "导入楼盘",
                        option: "/salesManage/estateList/createByExcel"
                    },
                    {
                        label: "导入KPI",
                        option: "/salesManage/estateKpi/createByExcel"
                    },
                    {
                        label: "导入楼盘信息",
                        option: "/salesManage/estateInfo/createByExcel"
                    },
                    {
                        label: "上传投放金额",
                        option: "/admoney/manager/createInfoByExcel"
                    },
                    {
                        label: "上传投放目标",
                        option: "/admoney/manager/createTargetByExcel"
                    }
                ],
                saveUploadLabel: ""
            };
        },

        watch: {
            multipleSelection (val, oldVal) {
                if (val.length > 0) {
                    this.hasChecked = true;
                } else {
                    this.hasChecked = false;
                }
            },
            uploadType (value) {
                this.updateExcelApi.forEach(item => {
                    if (item.option === value) {
                        this.saveUploadLabel = item.label;
                        this.uploadUrl = "//productivity.focus" + urlType + ".cn/api" + item.option;
                    }
                })
            },
            queryContent (value) {
                this.queryTip = "请输入" + (value == 10 ? "楼盘名称" : "楼盘Id");
            }
        },

        methods: {
            initRander () {
                // 获取列表数据
                $api.getListData({
                    estateName: this.queryContent == 10 ? (this.searchContent == "" ? null : this.searchContent) : null,
                    estateId: this.queryContent == 11 ? (this.searchContent == "" ? null : this.searchContent) : null,
                    areaCode: this.queryCity,
                    pageIndex: this.page_index,
                    limit: this.page_size
                }, res => {
                    this.tableData = res.data.resultList ? res.data.resultList : [];
                    this.totalCount = res.data.count ? res.data.count * 1 : 0;
                });
            },

            // 选择table中的checkbox事件
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            // 编辑按钮点击事件
            clickEditBtn () {
                const that = this;
                that.editFormVisible = true;
                // 默认编辑第一个
                if (that.multipleSelection.length >= 1) {
                    that.formEdit.estateId = that.multipleSelection[0].estateId;
                    that.formEdit.salerEmail = that.multipleSelection[0].salerEmail;
                    that.formEdit.operatorEmail = that.multipleSelection[0].operatorEmail;
                    that.formEdit.thisWeekTarget = that.multipleSelection[0].thisWeekTarget;
                    that.formEdit.nextWeekTarget = that.multipleSelection[0].nextWeekTarget;
                    that.formEdit.thisMonthTarget = that.multipleSelection[0].thisMonthTarget;
                    that.formEdit.nextMonthTarget = that.multipleSelection[0].nextMonthTarget;
                }
            },

            // 点击删除按钮事件
            clickDeleteBtn () {
                const that = this;
                let deleteIdList = ''; 
                that.multipleSelection.forEach((item, index) => {
                    deleteIdList += item.estateId + ',';
                });
                deleteIdList = deleteIdList.substring(0, deleteIdList.length - 1);

                that.$confirm("确定要删除吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    $api.deleteEstate({
                        estateIds: deleteIdList
                    }, res => {
                        if (res.msg == "success") {
                            that.$message(res.data.resultMes);
                            that.initRander();
                        } else {
                            that.$message({
                                type: "error",
                                message: res.msg
                            });
                        }
                    });
                }).catch(e => {
                    // console.log(e);
                });
            },

            // 翻页事件
            handleCurrentChange (val) {
                this.page_index = val;
                this.initRander();
            },

            // 提交新增楼盘 确认按钮
            addEstate () {
                const that = this;
                const params = {
                    type: "create",
                    estateId: that.formAdd.estateId * 1,
                    adMoney: 0,
                    salerEmail: that.formAdd.salerEmail,
                    operatorEmail: that.formAdd.operatorEmail,
                    thisWeekTarget: that.formAdd.thisWeekTarget * 1,
                    nextWeekTarget: that.formAdd.nextWeekTarget * 1,
                    thisMonthTarget: that.formAdd.thisMonthTarget * 1,
                    nextMonthTarget: that.formAdd.nextMonthTarget * 1,
                };
                if (!params.estateId) {
                    that.$message.error("楼盘ID不可以为空");
                    return;
                }
                if (!params.salerEmail && !params.operatorEmail) {
                    that.$message.error("销售和运营邮箱至少填写一个");
                    return;
                } else if (params.salerEmail && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(params.salerEmail))) {
                    that.$message.error("销售邮箱格式错误");
                    return;
                } else if (params.operatorEmail && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(params.operatorEmail))) {
                    that.$message.error("运营邮箱格式错误");
                    return;
                } else {
                    // 提交表单发送请求新建用户
                    $api.createEstate(params, res => {
                        if (res.msg == "success") {
                            that.$message("添加成功");
                            that.initRander();
                            that.addFormVisible = false;
                            that.formAdd = {
                                estateId: "",
                                sellEmail: "",
                                operateEmail: "",
                                thisWeek400: "",
                                nextWeek400: "",
                                thisMonth400: "",
                                nextMonth400: ""
                            };
                        } else {
                            that.$message.error(res.msg);
                        }
                    });
                }
            },

            // 编辑新建 确认按钮
            editEstate () {
                const that = this;
                const editParams = {
                    type: "edit",
                    estateId: that.formEdit.estateId && that.formEdit.estateId * 1,
                    adMoney: 0,
                    salerEmail: that.formEdit.salerEmail,
                    operatorEmail: that.formEdit.operatorEmail,
                    thisWeekTarget: that.formEdit.thisWeekTarget && that.formEdit.thisWeekTarget * 1,
                    nextWeekTarget: that.formEdit.nextWeekTarget && that.formEdit.nextWeekTarget * 1,
                    thisMonthTarget: that.formEdit.thisMonthTarget && that.formEdit.thisMonthTarget * 1,
                    nextMonthTarget: that.formEdit.nextMonthTarget && that.formEdit.nextMonthTarget * 1,
                };
                if (!editParams.salerEmail && !editParams.operatorEmail) {
                    that.$message.error("销售和运营邮箱至少填写一个");
                    return;
                } else if (editParams.salerEmail && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(editParams.salerEmail))) {
                    that.$message.error("销售邮箱格式错误");
                    return;
                } else if (editParams.operatorEmail && !(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(editParams.operatorEmail))) {
                    that.$message.error("运营邮箱格式错误");
                    return;
                } else {
                    // 提交表单发送请求编辑用户
                    $api.editEstate(editParams, res => {
                        if (res.msg == "success") {
                            that.$message("编辑成功");
                            that.initRander();
                            that.editFormVisible = false;
                        } else {
                            that.$message.error(res.msg);
                        }
                    });
                }
            },

            // 搜索
            clickSearchBtn () {
                const that = this;
                that.initRander();
            },

            // 上传前判断格式
            beforeUpload (file) {
                const fileName = file.name;
                const index = fileName.lastIndexOf(".");
                const fileType = fileName.substring(index + 1, fileName.length);
                if (fileType == "xlsx" || fileType == "xls") {
                    return true;
                } else {
                    this.$message.error("只能上传Excel文件");
                    return false;
                }
            },

            // 上传成功，刷新页面
            uploadSuccess (res) {
                if (res.msg == "success") {
                    this.$message.success(res.msg);
                } else {
                    this.$message.error(res.msg);
                }
            }
        },

        beforeMount () {
            const that = this;
            // 获取必要参数
            $api.getParameters({}, res => {
                that.estateQueryList = res.data.estateQueryList; // 级别
                that.cityOptions = res.data.areaCodeList; // 城市列表
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
