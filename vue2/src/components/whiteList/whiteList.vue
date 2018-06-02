<template lang="html">
    <div class="wrap">
        <el-form class="mt20" ref="form" label-width="40px" @submit.prevent="onSubmit" :inline="true">
            <el-form-item label="城市">
                <el-select @change="changeCity" v-model="areaCodes" multiple filterable placeholder="请选择负责城市">
                    <el-option-group v-for="group in cityList" :key="group.label" :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value"
                      >
                    </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="账户ID" label-width="60px">
                <el-input placeholder="输入账户ID" @change="clearUserID" v-model="userID"
                          style="width: 200px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="手机号" label-width="60px">
                <el-input placeholder="输入手机号" @change="clearMobile" v-model="mobile"
                          style="width: 200px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </el-form-item>
            <el-button :plain="true" type="success" class="button_right" @click.native="exportData">导出全部数据
            </el-button>
            <el-button :plain="true" type="success" @click.native="showDialog"
                       class="button_right" style="margin-right:9px;margin-left: 0;">
                添加账号
            </el-button>
            <el-row>
                <el-form-item label="权限等级" label-width="70px">
                    <el-select @change="changeLevel" v-model="level" filterable placeholder="请选择权限等级">
                        <el-option v-for="item in levelList"
                          :label="item.label"
                          :value="item.option">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
        <div>
            <el-table :data="tableData" border style="width:100%;">
                <el-table-column property="demanderName" label="广告主名称" align="center"></el-table-column>
                <el-table-column property="mobile" label="手机号" align="center"></el-table-column>
                <el-table-column property="email"  label="邮箱" align="center"></el-table-column>
                <el-table-column property="cityName" label="负责城市" align="center"></el-table-column>
                <el-table-column property="operatorTypeName" label="权限类别" align="center"></el-table-column>
                <el-table-column property="accessLevel" label="权限等级" align="center"></el-table-column>
                <el-table-column inline-template label="操作" align="center">
                    <span><el-button type="text" @click="del(row)">删除</el-button></span>
                </el-table-column>
            </el-table>
            <div class="pagination" v-show="this.tableData.length>0">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                               layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加白名单" v-model="dialogFormVisible" size="tiny">
            <el-form :model="whiteData" :rules="rule" ref="staff" class="staff_width">
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">账户ID</span>
                    <el-form-item class="staff_item">
                        <el-input v-model="whiteData.userID" placeholder="请输入账户ID" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">手机号</span>
                    <el-form-item class="staff_item">
                        <el-input v-model="whiteData.mobile" placeholder="请输入手机号" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">邮箱</span>
                    <el-form-item class="staff_item">
                        <el-input v-model="whiteData.email" placeholder="请输入邮箱" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">负责城市</span>
                    <el-select v-model="whiteData.selectedCity" multiple filterable placeholder="请选择负责城市">
                        <el-option-group v-for="group in cityList" :key="group.label" :label="group.label">
                            <el-option
                              v-for="item in group.options"
                              :key="item.value" 
                              :label="item.label" 
                              :value="item.value"
                              >
                            </el-option>
                        </el-option-group>
                    </el-select>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">权限类别</span>
                    <el-radio-group v-model="whiteData.levelType" @change="changeType">
                        <el-radio label="0">直营</el-radio>
                        <el-radio label="1">加盟</el-radio>
                    </el-radio-group>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">权限等级</span>
                    <el-select v-model="whiteData.selectedLevel" :disabled="whiteData.disableSelect" filterable placeholder="请选择权限等级">
                        <el-option
                          v-for="item in levelList"
                          :label="item.label"
                          :value="item.option">
                        </el-option>
                    </el-select>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click.native="dialogFormVisible=false">取 消</el-button>
                <el-button type="primary" @click.native="submit">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import $$whiteList from "../../script/data/model/whiteList";
    let isRequire = false;
    export default {
        name: "WhiteList",
        data () {
            return {
                userID: null,
                mobile: null,
                areaCodes: [],
                level: null,
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                dialogFormVisible: false,
                delId: -1,
                delAreaCode: -1,
                whiteData: {
                    userID: "",
                    mobile: "",
                    email: "",
                    selectedCity: [],
                    selectedLevel: "",
                    levelType: "",
                    disableSelect: false
                },
                cityList: [],
                levelList: []
            };
        },
        methods: {
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getWhiteList();
            },
            getWhiteList () {
                const _this = this;
                if (!isRequire) return;
                window.localStorage.setItem("ad_whiteList_searchContent", JSON.stringify({
                    areaCodes: _this.areaCodes,
                    accessLevel: _this.level
                }));

                $$whiteList.getWhiteList({
                    "demanderId": _this.userID || null,
                    "mobile": _this.mobile || null,
                    "areaCodes": _this.areaCodes,
                    "pageSize": _this.pageSize,
                    "pageIndex": _this.currentPage,
                    "accessLevel": _this.level
                });
            },
            del: function (item) {
                const that = this;
                this.$confirm("确认删除该条数据吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    that.delId = item.demanderId;
                    that.delAreaCode = item.areaCode;
                    $$whiteList.delWhiteList({
                        demanderId: item.demanderId,
                        areaCode: item.areaCode
                    });
                }).catch(function () {
                    that.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
            },
            exportData () {
                $$whiteList.exportWhiteList();
            },
            showDialog () {
                this.dialogFormVisible = true;
                this.whiteData = {
                    mobile: "",
                    email: "",
                    userID: "",
                    selectedCity: [],
                    selectedLevel: "",
                    levelType: "",
                    disableSelect: false
                };
            },
            changeCity () {
                this.search();
            },
            changeLevel () {
                this.search();
            },
            changeType () {
                if (this.whiteData.levelType == "1") {
                    this.whiteData.disableSelect = true;
                    this.whiteData.selectedLevel = "S";
                } else {
                    this.whiteData.selectedLevel = "";
                    this.whiteData.disableSelect = false;
                }
            },
            search () {
                let searchMobile = this.mobile;
                if (!searchMobile) {
                    searchMobile = null;
                } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(searchMobile))) {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入格式正确的手机号",
                        duration: 2000
                    });
                    return false;
                }
                this.handleCurrentChange(1);
            },
            clearMobile () {
                if (!this.mobile) {
                    this.handleCurrentChange(1);
                }
            },
            clearUserID () {
                if (!this.userID) {
                    this.handleCurrentChange(1);
                }
            },
            submit () {
                const mobile = this.whiteData.mobile.trim(),
                    userID = this.whiteData.userID.trim(),
                    email = this.whiteData.email.trim(),
                    selectedCity = this.whiteData.selectedCity,
                    levelType = this.whiteData.levelType,
                    selectedLevel = this.whiteData.selectedLevel;
                if (!mobile && !userID) {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入账号ID或手机号",
                        duration: 2000
                    });
                    return;
                }
                if (mobile && !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入格式正确的手机号",
                        duration: 2000
                    });
                    return false;
                }
                if (!email) {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入邮箱",
                        duration: 2000
                    });
                    return;
                }
                if (!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email))) {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入格式正确的邮箱",
                        duration: 2000
                    });
                    return;
                }
                if (!selectedCity.length) {
                    this.$notify.error({
                        title: "错误",
                        message: "请选择负责城市",
                        duration: 2000
                    });
                    return;
                }
                if (levelType === "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请选择等级类别",
                        duration: 2000
                    });
                    return;
                }
                if (!selectedLevel) {
                    this.$notify.error({
                        title: "错误",
                        message: "请选择权限等级",
                        duration: 2000
                    });
                    return;
                }
                $$whiteList.addWhiteList({
                    demanderId: userID ? parseInt(userID) : null,
                    mobile: mobile,
                    email: email,
                    areaCodes: selectedCity,
                    demanderOperatorType: parseInt(levelType),
                    accessLevel: selectedLevel
                });
            }
        },
        beforeMount: function () {
            const _this = this;
            _this.getWhiteList();

            $$whiteList.on("getAdParams", data => {
                _this.cityList = data.data.areaCodeList;
                _this.levelList = data.data.cityOperatorLevel;

                if (window.localStorage.getItem("ad_whiteList_searchContent")) {
                    const storageObj = JSON.parse(window.localStorage.getItem("ad_whiteList_searchContent"));
                    _this.areaCodes = storageObj.areaCodes;
                    _this.level = storageObj.accessLevel;
                }

                isRequire = true;
            });
            $$whiteList.getAdParams();

            $$whiteList.on("getWhiteList", function (data) {
                if (data.code === 200) {
                    _this.tableData = data.data.items;
                    _this.total = data.data.count;
                } else {
                    _this.$notify.error({
                        title: "提示",
                        message: data.msg,
                        duration: 2000
                    });
                    _this.tableData = [];
                    _this.total = 0;
                }
            });

            $$whiteList.on("addWhiteList", function (data) {
                if (parseInt(data.code) === 200) {
                    _this.$notify({
                        title: "成功",
                        message: "添加白名单成功",
                        type: "success",
                        duration: 2000
                    });
                    _this.dialogFormVisible = false;
                    _this.getWhiteList();
                } else {
                    _this.$notify.error({
                        title: "错误",
                        message: data.msg,
                        duration: 2000
                    });
                }
            });

            $$whiteList.on("delWhiteList", function (data) {
                if (parseInt(data.code) === 200) {
                    _this.$notify({
                        title: "成功",
                        message: "删除数据成功",
                        type: "success",
                        duration: 2000
                    });
                    // 更新数据
                    _this.tableData.forEach(function (item, index) {
                        if (item.demanderId == _this.delId && item.areaCode == _this.delAreaCode) {
                            _this.tableData.splice(index, 1);
                            _this.total -= 1;
                        }
                    });
                } else {
                    _this.$notify.error({
                        title: "错误",
                        message: "删除数据失败",
                        duration: 2000
                    });
                }
                _this.delId = -1;
                _this.delAreaCode = -1;
            });

            $$whiteList.on("exportWhiteList", function (data) {
                if (parseInt(data.code) === 200) {
                    _this.$notify({
                        title: "成功",
                        message: "正在下载列表数据",
                        type: "success",
                        duration: 2000
                    });
                    location.href = data.data.fileUrl;
                } else {
                    _this.$notify.error({
                        title: "错误",
                        message: "下载列表数据失败",
                        duration: 2000
                    });
                }
            });
        }
    };
</script>
<style scoped>
.clearfix::after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.mt20 {
    margin-top: 20px;
}

.button_left {
    float: left;
}

.button_right {
    float: right;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.add-staff-title {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 20px;
}

.staff_item {
    margin-bottom: 0;
    display: inline-block;
}

.el-input {
    width: 200px;
}

.el-select {
    display: inline-block;
    position: relative;
    width: 200px;
}
</style>
