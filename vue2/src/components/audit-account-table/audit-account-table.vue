<template>
    <div>
        <el-table @sort-change="sortChange" :data="tableData" border style="width:100%;" selection-mode="multiple">
            <el-table-column label="客户ID" width="160" align="center" inline-template v-if="tableData.length > 0">
                <span class="table-href" @click="checkDetail(row.demander_id)">
                    {{row.demander_id}}
                </span>
            </el-table-column>
            <el-table-column v-if="tableData.length === 0" property="demander_id" label="客户ID" width="160" align="center"></el-table-column>

            <el-table-column property="account_type" label="账户类型" min-width="120" align="center"></el-table-column>
            <el-table-column property="contract_code" label="合同编号" min-width="120" align="center"></el-table-column>
            <el-table-column property="industry" label="所属行业" min-width="120" align="center"></el-table-column>
            <el-table-column property="demander_name" label="客户名称" min-width="140" align="center"></el-table-column>
            <el-table-column inline-template label="营业执照" min-width="120" align="center">
                <span>
                    <span style="cursor:pointer;color:blue;" v-if="row.business_license"
                          @click="viewImage(row.business_license)">
                        查看
                    </span>
                    <span v-show="!row.business_license">无</span>
                </span>
            </el-table-column>
            <el-table-column property="submit_time" sortable label="提交时间" min-width="200" align="center"></el-table-column>
            <el-table-column property="audit_status_text" label="当前状态" min-width="120" align="center"></el-table-column>
            <el-table-column property="audit_time" label="审核时间" min-width="200" align="center"></el-table-column>
            
            <!-- 新增 -->
            <el-table-column label="省份及城市" min-width="200" align="center" inline-template>
                <div>
                    <span>{{row.province_name}}</span>
                    -
                    <span>{{row.city_name}}</span>
                </div>
            </el-table-column>
            <el-table-column  
                label="所属代理" 
                min-width="200" align="center" 
                inline-template>
                <div>
                    <router-link :to="{path: '/customer_agent', query: {id: row.agent_id}}">
                        {{row.agent_name}}
                    </router-link>
                </div>
            </el-table-column>
            <el-table-column label="联系人" min-width="200" align="center" inline-template>
                <div>
                    <span>{{row.contact_name}}</span>
                    <br />
                    <span>{{row.mobile}}</span>
                </div>
            </el-table-column>

            <el-table-column v-if="tableData.length>0" inline-template label="操作" fixed="right" width="200" align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="info" size="small" v-show="!row.contract_code||row.contract_code==''" @click="addContract(row.demander_id)">添加
                    </el-button>
                    <el-button type="success" size="small" v-show="row.audit_status!=2" @click="setAudit(row, 2)">通过
                    </el-button>
                    <el-button type="danger" size="small" v-show="row.audit_status!=3" @click="setAudit(row, 3)">驳回
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column v-if="tableData.length===0" label="操作" width="160" align="center"></el-table-column>
        </el-table>
        <el-dialog title="查看图片" v-model="imageViewOpen" size="tiny">
            <div class="image-container">
                <img v-bind:src="curImageView" style="max-width:100%;max-height:100%;">
            </div>
        </el-dialog>
        <el-dialog title="添加合同编号" v-model="isAddContractShow" label-width="80px" size="tiny">
            <el-form ref="contractForm" :model="contractNumForm" :rules="rules">
                <el-form-item prop="contractNum" label="合同编号">
                    <el-input class="edit-price-input" type="text" placeholder="请输入合同编号" v-model="contractNumForm.contractNum" style="display:inline-block;">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancelContract">取 消</el-button>
                <el-button type="primary" @click.native="confirmContract">确 定</el-button>
            </div>
        </el-dialog>
        <div class="pagination">
            <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <audit-reject-dialog type="Account"></audit-reject-dialog>
    </div>
</template>
<style scoped>
.pagination {
    margin-top: 20px;
    text-align: right;
}

.edit-price-input {
    width: 220px;
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
    const contentValidator = function (rule, value, callback) {
        if (value.trim() === "") {
            callback(new Error("合同编号不能为空"));
        } else {
            callback();
        }
    };

    const accountMap = {
        0: "直客",
        1: "代理商",
        2: "子客"
    };

    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "audit-account-table",
                tableData: [],
                auditStates: { 1: "待审核", 2: "通过", 3: "未通过" },
                imageViewOpen: false,
                curImageView: "",
                rules: {
                    contractNum: [{
                        type: "string",
                        required: true,
                        message: "合同编号不能为空",
                        trigger: "blur",
                        validator: contentValidator
                    }]
                },
                isAddContractShow: false,
                contractNumForm: {
                    contractNum: ""
                },
                selectId: "",
                currentRow: {}
            };
        },
        methods: {
            checkDetail (id) {
                this.$router.push(`customer-detail?id=${id}`);
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
            viewImage: function (src) {
                this.curImageView = src;
                this.imageViewOpen = true;
            },
            sortChange: function (sortdata) {
                if (sortdata.prop === "submit_time") {
                    $$audit.getAudit("account", {
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
                this.tableData = this.tableData.slice(0, i).concat(this.tableData.slice(i + 1, this.tableData.length));
            },
            removeRow: function (row) {
                this._removeRowByIndex(this._findIndexByRow(row));
            },
            setAudit: function (row, state) {
                const that = this;
                this.currentRow = row;
                if (state === 3) {
                    $$audit.showRejectDialog({ "type": "account", "row": this.currentRow });
                    // this.$refs.rejectDialog.open()
                } else {
                    this.$confirm("确认" + (state === 2 ? "通过" : "驳回") + "吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(function () {
                        $$audit.setAudit("account", {
                            demander_id: row.demander_id,
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
            addContract: function (id) {
                this.contractNumForm.contractNum = "";
                this.selectId = id;
                this.isAddContractShow = true;
            },
            cancelContract: function () {
                this.contractNum = "";
                this.isAddContractShow = false;
            },
            confirmContract: function () {
                const that = this;
                this.$refs.contractForm.validate(function (valid) {
                    if (valid) {
                        $$audit.submitContractCode({
                            demander_id: that.selectId,
                            contract_code: that.contractNumForm.contractNum
                        }, function (data) {
                            if (data.code === 0) {
                                that.$notify({
                                    title: "添加成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                $$audit.actionSuccess();
                            } else {
                                that.$message({
                                    type: "error",
                                    message: "添加失败"
                                });
                            }
                            that.isAddContractShow = false;
                            that.contractNum = "";
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        beforeMount: function () {
            const _this = this;
            $$audit.on("getAuditAccount", function (data) {
                if (data.code === 0) {
                    const list = data.data.items;
                    for (let i = 0, len = list.length; i < len; i++) {
                        list[i].audit_status_text = _this.auditStates[list[i].audit_status];
                        list[i].account_type = accountMap[list[i].demander_type];
                    }
                    _this.tableData = list;
                    _this.total = data.data.count;
                    _this.currentPage = data.currentPage;
                }
            });
            $$audit.on("deleteAccount", function (data) {
                _this.removeRow(data);
                _this.total--;
            });
        },
        components: {
            AuditRejectDialog
        }
    };
</script>
