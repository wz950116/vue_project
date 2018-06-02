<template>
    <el-dialog ref="rejectDialog" title="驳回" size="tiny">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="驳回理由">
                <el-input v-model="form.reason" placeholder="请输入驳回理由"></el-input>
            </el-form-item>
            <el-form-item label="详细说明">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入详细说明" v-model="form.detail"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="cancel">取消</el-button>
                <el-button type="primary" @click="doReject">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    import $$audit from "../../script/data/model/audit";
    export default {
        name: "AuditRejectDialog",
        data () {
            return {
                auditData: {},
                form: {
                    reason: "",
                    detail: ""
                },
                num: 0
            };
        },
        props: ["type"],
        beforeMount: function () {
            const _this = this;
            $$audit.on("showReject" + _this.type + "Dialog", function (data) {
                _this.auditData = data;
                _this.$refs.rejectDialog.open();
            });
        },
        methods: {
            doReject: function () {
                const that = this;
                if (!this.form.reason.trim()) {
                    that.$message({
                        type: "error",
                        message: "请填写驳回理由"
                    });
                    return;
                }
                let params = {
                    demander_id: this.auditData.row.demander_id,
                    audit_status: (this.auditData.type === "account") ? 3 : 2,
                    review_comment: this.form.reason + ";" + this.form.detail
                };
                if (this.auditData.type === "order") {
                    params = {
                        idea_id: this.auditData.row.idea_id,
                        audit_status: 2,
                        review_comment: this.form.reason + ";" + this.form.detail
                    };
                }
                if (this.auditData.type === "estate") {
                    params = {
                        demander_id: this.auditData.row.demander_id,
                        estate_id: this.auditData.row.estate_id,
                        audit_status: 2,
                        review_comment: this.form.reason + ";" + this.form.detail
                    };
                }
                $$audit.setAudit(this.auditData.type, params, function (data) {
                    if (data.code === 0) {
                        that.$notify({
                            title: "操作成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        that.$refs.rejectDialog.close();
                        that.deleteRow(that.auditData.type, that.auditData.row);
                    } else {
                        that.$message({
                            type: "error",
                            message: "操作失败"
                        });
                    }
                });
            },
            deleteRow: function (type, row) {
                $$audit.deleteRow(type, row);
            },
            cancel: function () {
                this.form = {
                    reason: "",
                    detail: ""
                };
                this.$refs.rejectDialog.close();
            }
        }
    };
</script>
