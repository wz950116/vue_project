<template>
    <div style="padding-top:20px;">
        <qualification-header></qualification-header>
        <el-table :data="tableData" border style="width:100%;" selection-mode="multiple">
            <el-table-column property="company" label="开票单位" min-width="120" align="center"></el-table-column>
            <el-table-column property="taxpayer_code" label="纳税人识别号" min-width="140" align="center"></el-table-column>
            <el-table-column property="bank" label="开户行" min-width="120" align="center"></el-table-column>
            <el-table-column property="account" label="账号" min-width="130" align="center"></el-table-column>
            <el-table-column property="addr_phone" label="地址及电话" min-width="200" align="center"></el-table-column>
            <el-table-column inline-template label="纳税资质" min-width="120" align="center">
                <span>
                    <span 
                        style="cursor:pointer;color:blue;" 
                        v-if="row.taxpayerCertMd5"
                        @click="viewImage(row.taxpayerCertMd5)">
                        查看
                    </span>
                    <span v-show="!row.taxpayerCertMd5">无</span>
                </span>
            </el-table-column>
            <el-table-column property="insert_time" label="提交时间" min-width="200" align="center"></el-table-column>
            <el-table-column property="audit_status_text" label="当前状态" min-width="120" align="center"></el-table-column>
            <el-table-column property="audit_time" label="审核时间" min-width="200" align="center"></el-table-column>
            <el-table-column v-if="tableData.length>0" inline-template label="操作" fixed="right" width="160"
                             align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="success" size="small" v-show="row.status==0" @click="setAudit(row, 1)">通过
                    </el-button>
                    <el-button type="danger" size="small" v-show="row.status==0" @click="setAudit(row, 2)">驳回
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column v-if="tableData.length===0" label="操作" width="160" align="center">
            </el-table-column>
        </el-table>
        <el-dialog title="纳税资质" v-model="imageViewOpen" size="tiny">
            <div class="image-container">
                <img v-bind:src="curImageView" style="max-width:100%;max-height:100%;">
            </div>
        </el-dialog>
        <el-dialog title="驳回" v-model="rejectDialogVisible" size="tiny">
            <el-form ref="form" label-width="80px">
                <el-form-item label="驳回理由">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入驳回理由" v-model="rejectReason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="cancel">取消</el-button>
                    <el-button type="primary" @click="doReject">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div class="pagination">
            <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped>
.pagination {
    margin-top: 20px;
    text-align: right;
}
</style>
<script>
    import $$invoice from "../../script/data/model/invoice";
    import qualificationHeader from "../audit-taxpayer-header/audit-taxpayer-header";
    export default{
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "qualification",
                tableData: [],
                auditStates: { 0: "待审核", 1: "通过", 2: "未通过" },
                imageViewOpen: false,
                curImageView: "",
                rejectDialogVisible: false,
                curRejectTaxpayerId: -1,
                curRejectRow: null
            };
        },
        components: {
            qualificationHeader
        },
        methods: {
            viewImage: function (src) {
                this.curImageView = src;
                this.imageViewOpen = true;
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                $$invoice.getListByPage(val);
            },
            timeFormatter1 (row, column) {
                if (!row.insert_time) return "";
                const dt = new Date();
                dt.setTime(row.insert_time);
                return this._dateTimeFormatter(dt, "YYYY-MM-DD hh:mm:ss");
            },
            timeFormatter2 (row, column) {
                if (!row.audit_time) return "";
                const dt = new Date();
                dt.setTime(row.audit_time);
                return this._dateTimeFormatter(dt, "YYYY-MM-DD hh:mm:ss");
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
            setAudit: function (row, state) {
                const that = this;
                if (state === 2) {
                    that.rejectReason = "";
                    that.rejectDialogVisible = true;
                    that.curRejectTaxpayerId = row.taxpayer_id;
                    that.curRejectRow = row;
                } else {
                    this.$confirm("确认" + (state == 1 ? "通过" : "驳回") + "吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(function () {
                        $$invoice.auditTaxpayer({
                            taxpayerId: row.taxpayer_id,
                            auditStatus: state
                        }, function (data) {
                            if (data.errorCode === 0) {
                                that.$notify({
                                    title: "操作成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                that.removeRow(row);
                                that.total--;
                            } else {
                                that.$message({
                                    type: "error",
                                    message: "操作失败"
                                });
                            }
                        });
                    });
                }
            },
            doReject: function () {
                const that = this;
                if (!that.rejectReason.trim()) {
                    that.$message({
                        type: "error",
                        message: "请填写驳回理由"
                    });
                    return;
                }
                $$invoice.auditTaxpayer({
                    taxpayerId: that.curRejectTaxpayerId,
                    auditStatus: 2,
                    comment: that.rejectReason
                }, function (data) {
                    if (data.errorCode === 0) {
                        that.$notify({
                            title: "操作成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        that.removeRow(that.curRejectRow);
                        that.total--;
                        that.rejectDialogVisible = false;
                    } else {
                        that.$message({
                            type: "error",
                            message: "操作失败"
                        });
                        that.rejectDialogVisible = false;
                    }
                });
            },
            cancel: function () {
                this.rejectDialogVisible = false;
            },
            _dateTimeFormatter: function (dt, format) {
                return format.replace(/([a-z]+)/ig, function (a, b, c, d) {
                    if (/Y{2,}/.test(b)) {
                        return b.length === 4 ? dt.getFullYear() : ("" + dt.getFullYear()).substr(2);
                    } else if (/M{2}/.test(b)) {
                        return (dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
                    } else if (/D{2}/.test(b)) {
                        return (dt.getDate()) < 10 ? "0" + dt.getDate() : dt.getDate();
                    } else if (/h{2}/.test(b)) {
                        return dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours();
                    } else if (/m{2}/.test(b)) {
                        return dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes();
                    } else if (/s{2}/.test(b)) {
                        return dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds();
                    } else {
                        return 0;
                    }
                });
            }
        },
        beforeMount: function () {
            const _this = this;
            $$invoice.on("getTaxpayer", function (data) {
                if (data.errorCode === 0) {
                    const list = data.dataArray;
                    for (let i = 0, len = list.length; i < len; i++) {
                        list[i].audit_status_text = _this.auditStates[list[i].status];
                    }
                    _this.tableData = list;
                    _this.total = data.totalNum;
                    _this.currentPage = data.currentPage;
                }
            });
        }
    };
</script>
