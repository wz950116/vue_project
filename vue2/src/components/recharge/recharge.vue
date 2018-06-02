<template>
    <div>
        <div class="recharge-search">
            <div>
                <span class="data-label">日期</span>
                <el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期范围" style="width:220px;">
                </el-date-picker>
                <el-button type="primary" class="add-btn" @click="showCreateRechargeDialog">新增配额</el-button>
                <el-button type="primary" class="add-btn" @click="notyet">批量增加</el-button>
            </div>
        </div>
        <batchRechargeDialog></batchRechargeDialog>
        <div class="manage-list">
            <el-table :data="tableData" border style="width:100%;" align="center">
                <el-table-column property="actionId" label="记录ID" width="" align="center"></el-table-column>
                <el-table-column property="demanderId" label="客户ID" width="" align="center"></el-table-column>
                <el-table-column property="demanderName" label="客户名称" width="" align="center"></el-table-column>
                <el-table-column property="amount" label="充值/撤销金额" width="" align="center"></el-table-column>
                <el-table-column property="actionTime" label="操作时间" width="" align="center"></el-table-column>
                <el-table-column property="operatorName" label="操作人" width="" align="center"></el-table-column>
                <el-table-column  inline-template label="撤销配额" align="center">
                    <span>
                        <em v-if="row.actionType==14"><el-button type="text" @click="cancelRechargeById(row)">撤销</el-button></em>
                        <em v-else-if="row.actionType==15">已撤销</em>
                    </span>
                </el-table-column>
            </el-table>
            <div class="pagination" v-show="this.tableData.length>0">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                               layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>


        <!--dialog-->
        <el-dialog title="新增配额" v-model="createRechargeDialog" size="tiny">
            <el-form :model="rechargeForm" label-width="70px" >
                <el-form-item label="手机号">
                    <el-input placeholder="请输入手机号"  v-model="rechargeForm.phone" auto-complete="off" class="width1"></el-input>
                </el-form-item>
                <el-form-item label="账户ID">
                    <el-input placeholder="请输入账户ID" v-model="rechargeForm.demanderId" auto-complete="off" class="width1"></el-input>
                </el-form-item>
                <el-form-item placeholder="请输入充值金额" label="充值金额">
                    <el-input v-model="rechargeForm.amount" auto-complete="off" class="width1"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createRechargeDialog = false">取 消</el-button>
                <!--<el-button type="primary" @click="addManForm">确 定</el-button>-->
                <el-button type="primary" @click="createRecharge">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}

.width1 {
    width: 200px;
}

.add-btn {
    width: 80px;
}

.recharge-search {
    margin: 10px 0 25px 0;
    overflow: hidden;
}

.manage-list {
    margin-bottom: 25px;
}

.dialog-footer {
    margin-top: -20px;
    text-align: center;
}
</style>
<script>
    import $$model from "../../script/data/model/interaction";
    import $$recharge from "../../script/data/model/recharge";
    import batchRechargeDialog from "../ad-dialog-batchRecharge/ad-dialog-batchRecharge";
    export default
    {
        data () {
            return {
                self_name: "recharge",
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                dateRange: [new Date(), new Date()],
                rechargeForm: {
                    phone: "",
                    demanderId: "",
                    amount: 0
                },
                createRechargeDialog: false
            };
        },
        components: {
            batchRechargeDialog
        },
        watch: {
            dateRange: function () {
                this.search();
            }
        },
        methods: {
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.search();
            },
            notyet: function () {
                $$model.showAdDialog({
                    type: "batchRecharge"
                });
            },
            showCreateRechargeDialog: function () {
                this.createRechargeDialog = true;
            },
            isExistEmpty: function (param) {
                let result = true;
                for (const i in param) {
                    if (param[i] instanceof Array) {
                        if (param[i].length >= 0) {
                            result = result && true;
                        } else {
                            result = result && false;
                            return;
                        }
                    } else if (param[i].trim() !== "") {
                        result = result && true;
                    } else {
                        result = result && false;
                        return;
                    }
                }
                return result;
            },

            add: function () {
                this.dialogFormVisible = true;
                this.rechargeForm = {
                    phone: -1,
                    demanderId: -1,
                    amount: 0
                };
            },
            verifyPhone: function (value) {
                if (value.trim() !== "") {
                    if (/^1[34578]\d{9}$/.test(value)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            createRecharge: function () {
                const that = this;
                // 判断用户编号
                if (this.rechargeForm.phone == "" && this.rechargeForm.demanderId == "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请填写手机号或者账户ID",
                        duration: 2000
                    });
                    return;
                }
                if (this.rechargeForm.phone != "" && !that.verifyPhone(this.rechargeForm.phone)) {
                    this.$notify.error({
                        title: "错误",
                        message: "请填写合法手机号",
                        duration: 2000
                    });
                    return;
                }
                // 判断分配数额,TODO:需要判断数额有效性
                if (this.rechargeForm.amount == "") {
                    this.$notify.error({
                        title: "错误",
                        message: "请输入分配数额",
                        duration: 2000
                    });
                    return;
                }

                // 提交
                $$recharge.addRechargeById({
                    phone: this.rechargeForm.phone,
                    demanderId: this.rechargeForm.demanderId,
                    amount: this.rechargeForm.amount
                }, function (data) {
                    if (data.code === 0) {
                        that.$notify({
                            title: "操作成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        // todo: 应该动态添加一行,但不会,先刷新算了
                        that.createRechargeDialog = false;
                        that.search();
                    } else {
                        that.$message({
                            type: "error",
                            message: data.msg
                        });
                    }
                });
            },
            search () {
                const _this = this;
                const dataSubmit = {
                    "endDate": "",
                    "startDate": ""
                };
                const currentPage = _this.currentPage;
                const dateRange = _this.dateRange;
                dataSubmit.startDate = dateRange[0] ? new Date(new Date(dateRange[0]).getTime()).toLocaleDateString().replace(/\//g, "-") + " 00:00:00" : "";
                dataSubmit.endDate = dateRange[1] ? new Date(dateRange[1]).toLocaleDateString().replace(/\//g, "-") + " 23:59:59" : "";
                if (!_this.isExistEmpty(dataSubmit)) {
                    return;
                }

                window.localStorage.setItem("ad_recharge_searchContent", JSON.stringify({
                    startDate: dataSubmit.startDate,
                    endDate: dataSubmit.endDate
                }));
    
                $$recharge.getRechargeList({
                    startTime: dataSubmit.startDate,
                    endTime: dataSubmit.endDate,
                    pageIndex: currentPage,
                    pageSize: 10
                });
            },
            _findIndexByRow: function (row) {
                for (let i = 0, len = this.tableData.length; i < len; i++) {
                    if (this.tableData[i] === row) return i;
                }
                return null;
            },
            _removeRowByIndex: function (i) {
                if (i == null) return;
                this.tableData = this.tableData.slice(0, i)
                    .concat(this.tableData.slice(i + 1, this.tableData.length));
            },
            removeRow: function (row) {
                this._removeRowByIndex(this._findIndexByRow(row));
            },
            // 撤销配额
            cancelRechargeById: function (row) {
                const that = this;
                this.$confirm("确认取消该配额分配吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    $$recharge.cancelRechargeById({
                        actionId: row.actionId
                    }, function (data) {
                        if (parseInt(data.code) === 0) {
                            // 更新数据
                            that._removeRowByIndex(that._findIndexByRow(row));
                            that.$notify({
                                title: "成功",
                                message: "撤销成功",
                                type: "success",
                                duration: 2000
                            });
                        } else {
                            that.$notify.error({
                                title: "错误",
                                message: "撤销失败",
                                duration: 2000
                            });
                        }
                    });
                });
            }
        },
        activated: function () {
            // this.search();
            const that = this;
            // 获取配额列表
            $$recharge.on("getRechargeList", function (data) {
                if (parseInt(data.code) === 0) {
                    that.tableData = data.data.list;
                    that.total = data.data.totalCount;
                }
            });
        },
        beforeMount: function () {
            const that = this;
            // 初始化
            const startDate = new Date(new Date().getTime() - 86400000).toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
            const endDate = new Date().toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
            that.dateRange = [startDate, endDate];

            if (window.localStorage.getItem("ad_recharge_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("ad_recharge_searchContent"));
                that.dateRange = [new Date(storageObj.startDate), new Date(storageObj.endDate)];
            }

            // 获取配额列表
            $$recharge.getRechargeList({
                startTime: startDate,
                endTime: endDate,
                pageIndex: 1,
                pageSize: 10
            }, function (data) {
                if (parseInt(data.code) === 0) {
                    that.tableData = data.data.list;
                    that.total = data.data.totalCount;
                } else {
                    that.$notify.error({
                        title: "错误",
                        message: data.msg,
                        duration: 2000
                    });
                }
            });
            $$recharge.on("actionSuccess", function (page) {
                that.search();
            });
        }
    };
</script>
