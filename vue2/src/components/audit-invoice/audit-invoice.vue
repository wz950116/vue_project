<template>
    <div style="padding-top:20px;">
        <audit-invoice-header></audit-invoice-header>

        <el-table :data="tableData" border style="width:100%;" selection-mode="multiple">
            <el-table-column v-if="tableData.length>0" inline-template label="发票ID" fixed width="170">
                <span>
                    <span v-if="row.invoice" class="invoice-index" @click="showInfo(row)">{{row.invoice}}</span>
                    <span v-if="!row.invoice" @click="showInfo(row)">undefined</span>
                </span>
            </el-table-column>
            <el-table-column v-if="tableData.length===0" label="发票ID" width="170">
            </el-table-column>
            <el-table-column property="demander" label="客户ID" min-width="120" align="center"></el-table-column>
            <el-table-column property="company" label="客户名称" min-width="140" align="center"></el-table-column>
            <el-table-column property="contract_code" label="合同编号" min-width="120" align="center"></el-table-column>
            <el-table-column property="invoice_type_text" label="发票种类" min-width="120" align="center"></el-table-column>
            <el-table-column property="item_name" label="服务项目" min-width="120" align="center"></el-table-column>
            <el-table-column property="title" label="开票单位" min-width="200" align="center"></el-table-column>
            <el-table-column property="amount" label="开票金额" min-width="120" align="center"></el-table-column>
            <el-table-column property="supplier_name" label="开票公司" min-width="200" align="center"></el-table-column>
            <el-table-column property="insert_time" :formatter="timeFormatter1" label="提交时间"
                             min-width="200" align="center"></el-table-column>
            <el-table-column property="audit_status_text" label="当前状态" min-width="120" align="center"></el-table-column>
            <el-table-column property="audit_time" label="审核时间" :formatter="timeFormatter2"
                             min-width="200" align="center"></el-table-column>
            <el-table-column v-if="tableData.length>0" inline-template label="操作" fixed="right" width="200" align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="info" v-if="row.status==1 && !row.review_comment" size="small" @click="openDialog(row)">
                        添加
                    </el-button>
                    <el-button type="info" v-else-if="row.status==1 && row.review_comment" size="small" @click="openDialog(row)">
                        修改
                    </el-button>
                    <el-button type="success" v-show="row.status==0" size="small" @click="setAudit(row, 1)">开票
                    </el-button>
                    <el-button type="danger" v-show="row.status==0" size="small" @click="setAudit(row, 2)">驳回
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column v-if="tableData.length===0" label="操作" width="160" align="center">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <audit-invoice-dialog ref="dialog"></audit-invoice-dialog>
        <el-dialog title="开票" v-model="dialogInvoiceVisible" size="tiny">
            <div>
                <span>快递公司：</span>
                <el-input v-model="expressName" placeholder="请填写快递公司名称" class="audit-input"></el-input>
            </div>
            <div>
                <span>快递单号：</span>
                <el-input v-model="courierId" placeholder="请填写快递单号" class="audit-input"></el-input>
            </div>
            <el-button type="primary" @click="makeInvoice" class="audit-button">确 定</el-button>
            <el-button @click="dialogInvoiceVisible = false" class="audit-button">取 消</el-button>
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
    </div>
</template>
<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}

.invoice-index {
    cursor: pointer;
    color: blue;
}

.audit-input {
    width: 250px;
    margin-top: 10px;
    display: inline-block;
}

.audit-button {
    float: right;
    margin: 10px;
}
</style>
<script>
    import $$invoice from "../../script/data/model/invoice";
    import auditInvoiceHeader from "../audit-invoice-header/audit-invoice-header";
    import auditInvoiceDialog from "../audit-invoice-dialog/audit-invoice-dialog";
    export default{
        name: "AuditInvoice",
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "audit-invoice",
                invoiceTypes: { 0: "增值税普通发票", 1: "增值税专用发票" },
                auditStates: { 0: "待审核", 1: "通过", 2: "未通过" },
                tableData: [],
                imageViewOpen: false,
                curImageView: "",
                dialogInvoiceVisible: false,
                rejectDialogVisible: false,
                curRejectInvoiceId: -1,
                curRejectRow: null,
                rejectReason: "",
                currentAudit: 0,
                expressName: "",
                courierId: ""
            };
        },
        components: {
            auditInvoiceHeader,
            auditInvoiceDialog
        },
        methods: {
            handleCurrentChange (val) {
                $$invoice.getInvoiceListByPage(val);
            },
            timeFormatter1 (row, column) {
                if (!row.insert_time) return "";
                const dt = new Date();
                dt.setTime(row.insert_time);
                return row.insert_time;
            },
            timeFormatter2 (row, column) {
                if (!row.audit_time) return "";
                const dt = new Date();
                dt.setTime(row.audit_time);
                return row.audit_time;
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
                    that.curRejectInvoiceId = row.invoice;
                    that.curRejectRow = row;
                } else {
                    this.$confirm("确认" + (state == 1 ? "开票" : "驳回") + "吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(function () {
                        $$invoice.auditInvoice({
                            invoiceId: row.invoice,
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
                $$invoice.auditInvoice({
                    invoiceId: that.curRejectInvoiceId,
                    auditStatus: 2,
                    rejectReason: that.rejectReason
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
            openDialog: function (row) {
                this.currentAudit = row;
                if (!row.review_comment) {
                    this.expressName = "";
                    this.courierId = "";
                } else {
                    const review_comment = JSON.parse(row.review_comment);
                    this.expressName = review_comment.expressCompany;
                    this.courierId = review_comment.expressNumber;
                }
                this.dialogInvoiceVisible = true;
            },
            makeInvoice: function () {
                // TODO 开发票
                const that = this;
                const data = {
                    invoiceId: that.currentAudit.invoice,
                    auditStatus: 3,
                    expressCompany: that.expressName,
                    expressNumber: that.courierId
                };
                if (!that.expressName.trim()) {
                    that.$message({
                        type: "error",
                        message: "请填写快递公司名称"
                    });
                }
                if (!that.courierId.trim()) {
                    that.$message({
                        type: "error",
                        message: "请填写快递单号"
                    });
                }
                $$invoice.auditInvoice(data, function (data) {
                    if (data.errorCode === 0) {
                        that.$notify({
                            title: "操作成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        that.dialogInvoiceVisible = false;
                        that.handleCurrentChange(that.currentPage);
                    } else {
                        that.$message({
                            type: "error",
                            message: "操作失败"
                        });
                    }
                });
            },
            showInfo: function (row) {
                $$invoice.showInvoiceDialog({
                    invoiceId: row.invoice
                });
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
            $$invoice.on("getInvoices", function (data) {
                if (data.errorCode !== 0) {
                    return;
                }
                const list = data.dataArray;
                for (let i = 0, len = list.length; i < len; i++) {
                    list[i].invoice_type_text = _this.invoiceTypes[list[i].type];
                    list[i].audit_status_text = _this.auditStates[list[i].status];
                }
                _this.tableData = list;
                _this.total = data.totalNum;
                _this.currentPage = data.currentPage;
            });
        }
    };
</script>
