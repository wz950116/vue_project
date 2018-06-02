<template>
    <div>
        <el-table @sort-change="sortChange" :data="tableData" border style="width:100%;" selection-mode="multiple">

            <el-table-column property="order_id" label="订单ID" min-width="140" align="center" inline-template v-if="tableData.length > 0">
                <span class="table-href" @click="checkDetail(row.order_id)">
                    {{row.order_id}}
                </span>
            </el-table-column>
            <el-table-column v-if="tableData.length === 0" property="order_id" label="订单ID" width="160" align="center"></el-table-column>

            <el-table-column property="demander_id" label="客户ID" min-width="140" align="center" inline-template v-if="tableData.length > 0">
                <span class="table-href" @click="getUrl(row.demander_id,row.demander_name)">
                    {{row.demander_id}}
                </span>
            </el-table-column>
            <el-table-column property="demander_name" label="客户名称" min-width="140" align="center"></el-table-column>
            <el-table-column property="support_type" label="推广类型" min-width="120" align="center"></el-table-column>
            <el-table-column :formatter="supportContent" label="推广内容" min-width="120" align="center"></el-table-column>
            <el-table-column property="idea_id" label="创意ID" min-width="120" align="center"></el-table-column>
            <el-table-column inline-template label="创意" min-width="120" align="center">
                <span>
                    <span style="cursor:pointer;color:blue;" @click="viewImage(row)">
                        查看创意
                    </span>
                </span>
            </el-table-column>
            <el-table-column property="plan_name" label="计划名称" min-width="120" align="center"></el-table-column>
            <el-table-column property="city_name" label="广告位城市" min-width="120" align="center"></el-table-column>
            <el-table-column property="ad_pos_name" label="广告位名称" min-width="120" align="center"></el-table-column>
            <el-table-column inline-template label="订购日期" min-width="220" align="center">
                <div>
                    <p v-for="item in row.days">{{item}}</p>
                </div>
            </el-table-column>
            <el-table-column property="submit_time" label="提交时间" min-width="200" align="center"></el-table-column>
            <el-table-column property="audit_status_text" label="审核状态" min-width="120" align="center"></el-table-column>
            <el-table-column property="audit_time" label="审核时间" min-width="200" align="center"></el-table-column>
            <el-table-column inline-template label="操作" fixed="right" width="160" align="center" v-if="tableData.length > 0">
                <div class="action" style="text-align:center;">
                    <el-button type="success" v-show="row.audit_status!=1" size="small" @click="setAudit(row, 1)">通过</el-button>
                    <el-button type="danger" v-show="row.audit_status!=2" size="small" @click="setAudit(row, 2)">驳回</el-button>
                </div>
            </el-table-column>
            <el-table-column v-if="tableData.length === 0" label="操作" width="160" align="center">
            </el-table-column>
        </el-table>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <uploadAdImagePreview type="Order"></uploadAdImagePreview>
        <audit-reject-dialog type="Order"></audit-reject-dialog>
    </div>
</template>
<style>
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

.el-dialog--large {
    width: 60%;
}
</style>
<script>
    import $$audit from "../../script/data/model/audit";
    import $$model from "../../script/data/model/interaction";
    import AuditRejectDialog from "../audit-reject-dialog/audit-reject-dialog";
    import uploadAdImagePreview from "../ad-dialog-uploadAdImagePreview/ad-dialog-uploadAdImagePreview";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "audit-idea-table",
                tableData: [],
                orderTypes: {
                    0: "楼盘广告",
                    1: "品牌广告"
                },
                linkTypes: {
                    0: "楼盘",
                    1: "外链"
                },
                orderStates: {
                    0: "待付款",
                    1: "准备投放",
                    2: "投放中",
                    3: "投放完成",
                    4: "投放中断"
                },
                auditStates: {
                    0: "待审核",
                    1: "通过",
                    2: "未通过"
                },
                imageViewOpen: false,
                curImageView: ""
            };
        },
        methods: {
            supportContent (row, column) {
                const ideaContent = row.idea_content;
                let result;
                if (ideaContent) {
                    switch (ideaContent.type_id) {
                    case "live":
                        result = ideaContent.name + "  " + ideaContent.link;
                        break;
                    case "estate":
                        result = ideaContent.name;
                        break;
                    case "web":
                        result = ideaContent.link;
                        break;
                    default:
                        result = ideaContent.name + "  " + ideaContent.link;
                    }
                    return result;
                }
                return "";
            },
            getUrl (id, name) {
                const hostName = location.hostname;
                window.open("http://" + hostName + "/ecology-ad-admin/#/customer-detail?id=" + id + "&name=" + name);
            },
            checkDetail (id) {
                this.$router.push({
                    name: "ad-list",
                    query: {
                        "id": id,
                        "select": "orderId"
                    }
                });
            },
            handleCurrentChange (val) {
                $$audit.getAuditByPage(val);
            },
            timeFormatter1 (row, column) {
                if (!row.submit_time) return "";
                const dt = new Date();
                dt.setTime(row.submit_time);
                return this._dateTimeFormatter(dt, "YYYY-MM-DD hh:mm:ss");
            },
            timeFormatter2 (row, column) {
                if (!row.audit_time) return "";
                const dt = new Date();
                dt.setTime(row.audit_time);
                return this._dateTimeFormatter(dt, "YYYY-MM-DD hh:mm:ss");
            },
            viewImage: function (row) {
                $$model.showUploadAdImagePreviewDialog(row, "Order");
            },
            sortChange: function (sortdata) {
                if (sortdata.prop === "submit_time") {
                    $$audit.getAudit("order", {
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
                    $$audit.showRejectDialog({ "type": "order", "row": row });
                    // this.$refs.rejectDialog.open()
                } else {
                    this.$confirm("确认" + (state == 1 ? "通过" : "驳回") + "吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(function () {
                        $$audit.setAudit("order", {
                            idea_id: row.idea_id,
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
            }
        },
        beforeMount: function () {
            const _this = this;
            $$audit.on("getAuditOrder", function (data) {
                if (data.code === 0) {
                    const list = data.data.items;
                    for (let i = 0, len = list.length; i < len; i++) {
                        list[i].order_time = list[i].start_date.split("-").join(".") + " - " + list[i].end_date.split("-").join(".");
                        list[i].order_type_text = _this.orderTypes[list[i].order_type];
                        list[i].order_status_text = _this.orderStates[list[i].order_status];
                        list[i].audit_status_text = _this.auditStates[list[i].audit_status];
                    }

                    _this.tableData = list;
                    _this.total = data.data.count;
                    _this.currentPage = data.currentPage;
                }
            });
            $$audit.on("deleteOrder", function (data) {
                _this.removeRow(data);
                _this.total--;
            });
        },
        components: {
            AuditRejectDialog,
            uploadAdImagePreview
        }
    };
</script>
