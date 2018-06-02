<template>
    <div>
        <el-form ref="form" label-width="68px" :inline="true">
            <el-row type="flex" justify="space-between">
                <el-form-item label-width="0px" style="margin:0 0 10px 0;">
                    <el-checkbox v-model="submitTime" @change="submitChange">提交时间</el-checkbox>
                    <el-date-picker v-model="submitDateRangeForView" v-bind:disabled="submitTimeDisable"
                                    type="daterange" format="yyyy-MM-dd" placeholder="选择日期范围"
                                    style="width:220px;">
                                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="0px" style="margin:0 0 10px 0;">
                    <el-checkbox v-model="auditTime" @change="auditChange">审核时间</el-checkbox>
                    <el-date-picker v-model="auditDateRangeForView" v-bind:disabled="auditTimeDisable" type="daterange"
                                    format="yyyy-MM-dd" placeholder="选择日期范围" style="width:220px;">
                                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核状态" style="margin:0 0 10px 0;">
                    <el-select @change="sendParams" v-model="auditStateValue" style="width:220px;">
                        <el-option v-for="item in auditStateOptions" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
        <el-row style="margin-bottom:10px;">
            <el-button @click.prevent="exportData" style="float:right;">导出数据</el-button>
        </el-row>
    </div>
</template>
<script>
    import $$invoice from "../../script/data/model/invoice";
    import _ from "../../lib/underscore.v1.4.4.min";
    export default{
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                self_name: "qualification-header",
                submitTime: true,
                auditTime: "",
                submitTimeDisable: false,
                auditTimeDisable: true,
                auditStateValue: "0",
                submitDateRange: "",
                auditDateRange: "",
                submitDateRangeForView: [new Date(new Date().getTime() - 86400000), new Date()],
                auditDateRangeForView: "",
                customerQuery: "",
                dateFormat: "YYYY-MM-DD",
                auditStateOptions: [
                    { value: "0", label: "待审核" },
                    { value: "1", label: "通过" },
                    { value: "2", label: "未通过" }
                ]
            };
        },
        watch: {
            submitDateRangeForView: function (val) {
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.submitDateRange = val[0] && val[1] ? this._dateTimeFormatter(val[0], this.dateFormat) + " 00:00:00" + " - " +
                    this._dateTimeFormatter(val[1], this.dateFormat) + " 00:00:00" : "";
                }
                this.sendParams();
            },
            auditDateRangeForView: function (val) {
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.auditDateRange = val[0] && val[1] ? this._dateTimeFormatter(val[0], this.dateFormat) + " 00:00:00" + " - " +
                    this._dateTimeFormatter(val[1], this.dateFormat) + " 00:00:00" : "";
                }
                this.sendParams();
            }
        },
        beforeMount: function () {
            const _this = this;
            const insertStart = this._dateTimeFormatter(new Date(new Date().getTime() - 86400000), "YYYY-MM-DD") + " 00:00:00";
            const insertEnd = this._dateTimeFormatter(new Date(), "YYYY-MM-DD") + " 00:00:00";
            _this.submitDateRange = insertStart + " - " + insertEnd;

            $$invoice.getTaxpayer({
                status: this.auditStateValue,
                pageIndex: _this.currentPage,
                pageNum: _this.pageSize,
                insertStart: insertStart,
                insertEnd: insertEnd
            });

            $$invoice.on("getListByPage", function (page) {
                _this.currentPage = page;
                _this.sendParams("fromPage");
            });
        },
        methods: {
            submitChange: function () {
                if (this.submitTime === true) {
                    this.submitTimeDisable = false;
                    this.auditTimeDisable = true;
                    this.auditTime = false;
                } else {
                    this.submitTimeDisable = true;
                }
            },
            auditChange: function () {
                if (this.auditTime === true) {
                    this.auditTimeDisable = false;
                    this.submitTimeDisable = true;
                    this.submitTime = false;
                } else {
                    this.auditTimeDisable = true;
                }
            },
            sendParams: function (type) {
                $$invoice.getTaxpayer(this.getParams(type));
            },
            getParams: function (type) {
                const params = {
                    status: this.auditStateValue,
                    pageIndex: this.currentPage,
                    pageNum: this.pageSize
                };
                if (type != "fromPage") {
                    this.currentPage = 1;
                }
                if (!this.submitTimeDisable && this.submitDateRange != ""
                        && this.submitDateRangeForView.length > 0
                        && this.submitDateRangeForView[0]) {
                    _.extend(params, {
                        insertStart: this.submitDateRange.split(" - ")[0],
                        insertEnd: this.submitDateRange.split(" - ")[1]
                    });
                }
                if (!this.auditTimeDisable && this.auditDateRange != ""
                        && this.auditDateRangeForView.length > 0
                        && this.auditDateRangeForView[0]) {
                    _.extend(params, {
                        auditStart: this.auditDateRange.split(" - ")[0],
                        auditEnd: this.auditDateRange.split(" - ")[1]
                    });
                }

                return params;
            },
            exportData () {
                const that = this;
                $$invoice.on("downloadTaxpayer", function (data) {
                    if (data.errorCode === 0) {
                        that.$notify({
                            title: "数据导出成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        window.open(data.fileUrl);
                    } else {
                        _this.$notify({
                            title: "数据导出失败",
                            message: "",
                            type: "error",
                            duration: 2000
                        });
                    }
                });
                $$invoice.downloadTaxpayer(this.getParams());
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
        }
    };
</script>
