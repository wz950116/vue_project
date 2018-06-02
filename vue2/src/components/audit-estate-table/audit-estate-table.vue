<template>
    <div>
        <el-table @sort-change="sortChange" :data="tableData" border style="width:100%;" selection-mode="multiple"
                  align="center">
            <el-table-column v-if="tableData.length>0" property="demander_id" label="客户ID" inline-template fixed width="160" align="center">
                <span class="table-href" @click="getUrl(row.demander_id,row.demander_name)">
                    {{row.demander_id}}
                </span>
            </el-table-column>
            <el-table-column v-if="tableData.length===0" property="demander_id" label="客户ID" width="160" align="center"></el-table-column>
            <el-table-column property="demander_name" label="客户名称" min-width="140" align="center"></el-table-column>
            <el-table-column property="estate_id" label="楼盘ID" min-width="120"></el-table-column>
            <el-table-column property="estate_name" label="楼盘名称" min-width="120" align="center"></el-table-column>
            <el-table-column property="developer_name" label="开发商名称" min-width="120" align="center"></el-table-column>
            <el-table-column inline-template label="营业执照" min-width="120" align="center">
                <span>
                    <span style="cursor:pointer;color:blue;" v-if="row.business_license"
                          @click="viewImage(row.business_license)">
                        查看
                    </span>
                    <span v-show="!row.business_license">无</span>
                </span>
            </el-table-column>
            <el-table-column inline-template label="房地产资质等级标准或销售许可证或预售许可证" min-width="210" align="center">
                <span>
                    <span style="cursor:pointer;color:blue;" v-if="row.sales_certificate"
                          @click="viewImage(row.sales_certificate)">
                        查看
                    </span>
                    <span v-show="!row.sales_certificate">无</span>
                </span>
            </el-table-column>
            <el-table-column property="submit_time" sortable label="提交时间" min-width="200"
                             align="center"></el-table-column>
            <el-table-column property="audit_status_text" label="当前状态" min-width="120" align="center"></el-table-column>
            <el-table-column property="audit_time" label="审核时间" min-width="200" align="center"></el-table-column>
            <el-table-column v-if="tableData.length>0" inline-template label="操作" fixed="right" width="160"
                             align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="success" size="small" v-show="row.audit_status!=1" @click="setAudit(row, 1)">通过
                    </el-button>
                    <el-button type="danger" size="small" v-show="row.audit_status!=2" @click="setAudit(row, 2)">驳回
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
        <el-dialog title="查看图片" v-model="imageViewOpen" size="tiny">
            <div class="image-container">
                <img v-bind:src="curImageView" style="max-width:100%;max-height:100%;">
            </div>
        </el-dialog>
        <audit-reject-dialog type="Estate"></audit-reject-dialog>
    </div>
</template>
<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}

.table-href {
    color: #00f;
}

.table-href:hover {
    cursor: pointer;
}
</style>
<script>
    import $$audit from "../../script/data/model/audit";
    import AuditRejectDialog from "../audit-reject-dialog/audit-reject-dialog";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                self_name: "audit-building-table",
                tableData: [],
                auditStates: { 0: "待审核", 1: "通过", 2: "未通过" },
                imageViewOpen: false,
                curImageView: "",
                total: 0
            };
        },
        methods: {
            handleCurrentChange (val) {
                $$audit.getAuditByPage(val);
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
            viewImage: function (src) {
                this.curImageView = src;
                this.imageViewOpen = true;
            },
            sortChange: function (sortdata) {
                if (sortdata.prop === "insert_time") {
                    $$audit.getAudit("estate", {
                        time_order: sortdata.order === "ascending" ? 0 : 1
                    });
                }
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
                    $$audit.showRejectDialog({ "type": "estate", "row": row });
                    // this.$refs.rejectDialog.open()
                } else {
                    this.$confirm("确认" + (state == 1 ? "通过" : "驳回") + "吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(function () {
                        $$audit.setAudit("estate", {
                            demander_id: row.demander_id,
                            estate_id: row.estate_id,
                            audit_status: state
                        }, function (data) {
                            if (data.code === 0) {
                                that.$notify({
                                    title: "操作成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                            } else {
                                that.$message({
                                    type: "error",
                                    message: "操作失败"
                                });
                            }
                        });
                        that.removeRow(row);
                        that.total--;
                    });
                }
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
            },
            getUrl (id, name) {
                const hostName = location.hostname;
                window.open("http://" + hostName + "/ecology-ad-admin/#/customer-detail?id=" + id + "&name=" + name);
            }
        },
        beforeMount: function () {
            const _this = this;
            $$audit.on("getAuditEstate", function (data) {
                if (data.code === 0) {
                    const list = data.data.items;
                    for (let i = 0, len = list.length; i < len; i++) {
                        list[i].audit_status_text = _this.auditStates[list[i].audit_status];
                    }
                    _this.tableData = list;
                    _this.total = data.data.count;
                    _this.currentPage = data.currentPage;
                }
            });
            $$audit.on("deleteEstate", function (data) {
                _this.removeRow(data);
                _this.total--;
            });
        },
        components: {
            AuditRejectDialog
        }
    };
</script>
