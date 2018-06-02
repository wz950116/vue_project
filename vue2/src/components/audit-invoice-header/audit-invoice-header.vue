<template>
    <div>
        <el-form ref="form" label-width="68px" :inline="true">
            <el-row type="flex">
                <el-form-item label-width="0px" style="margin:0 50px 10px 0;">
                    <el-checkbox v-model="submitTime" @change="submitChange">提交时间</el-checkbox>
                    <el-date-picker v-model="submitDateRangeForView" v-bind:disabled="submitTimeDisable"
                                    type="daterange" format="yyyy-MM-dd" placeholder="选择日期范围"
                                    style="width:220px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="审核状态" style="margin:0 0 10px 0;">
                    <el-select @change="sendParams" v-model="auditStateValue" style="width:220px;">
                        <el-option v-for="item in auditStateOptions" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label-width="0px" style="margin:0 50px 10px 0;">
                    <el-checkbox v-model="auditTime" @change="auditChange">审核时间</el-checkbox>
                    <el-date-picker v-model="auditDateRangeForView" v-bind:disabled="auditTimeDisable" type="daterange"
                                    format="yyyy-MM-dd" placeholder="选择日期范围" style="width:220px;"></el-date-picker>
                </el-form-item>
                <el-form-item label-witdh="0px" style="margin:0 0 10px 0;">
                    <el-input placeholder="输入客户ID" v-model="customerQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="searchInvoic"></el-button>
                    </el-input>
                </el-form-item>
            </el-row>
        </el-form>
        <el-row style="margin-bottom:10px;">
            <el-button @click.prevent="exportData" style="float:right;">导出数据</el-button>
        </el-row>
    </div>
</template>
<style>

</style>
<script>
    import $$invoice from "../../script/data/model/invoice";
    import _ from "../../lib/underscore.v1.4.4.min";

    export default{
        data () {
            return {
                tag: false,
                self_name: "audit-invoice-header",
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
                ],
                currentPage: 1,
                pageSize: 10,
                isRequire: false
            };
        },
        watch: {
            submitDateRangeForView: function (val) {
                if (!this.tag) {
                    return;
                }
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.submitDateRange = this._dateTimeFormatter(val[0], this.dateFormat) + " 00:00:00" + " - " +
                            this._dateTimeFormatter(val[1], this.dateFormat) + " 23:59:59";
                }
                this.sendParams();
            },
            auditDateRangeForView: function (val) {
                if (!this.tag) {
                    return;
                }
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.auditDateRange = this._dateTimeFormatter(val[0], this.dateFormat) + " 00:00:00" + " - " +
                            this._dateTimeFormatter(val[1], this.dateFormat) + " 23:59:59";
                }
                this.sendParams();
            }
        },
        beforeMount: function () {
            const _this = this;
            const defaultStart = this._dateTimeFormatter(new Date(new Date().getTime() - 86400000), "YYYY-MM-DD") + " 00:00:00";
            const defaultEnd = this._dateTimeFormatter(new Date(), "YYYY-MM-DD") + " 23:59:59";
            this.submitDateRange = defaultStart + " - " + defaultEnd;
            $$invoice.getInvoices({
                status: _this.auditStateValue,
                pageIndex: _this.currentPage,
                pageNum: _this.pageSize,
                insertStart: defaultStart,
                insertEnd: defaultEnd
            }, function () {
                _this.tag = true;
            });

            $$invoice.on("getInvoiceListByPage", function (page) {
                _this.currentPage = page;
                _this.sendParams("fromPage");
            });

            if (window.localStorage.getItem("audit_invoice_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("audit_invoice_searchContent"));
                _this.auditStateValue = storageObj.status;
                if (storageObj.insertStart && storageObj.insertEnd) {
                    _this.submitDateRangeForView = [new Date(storageObj.insertStart), new Date(storageObj.insertEnd)];
                    _this.submitTimeDisable = false;
                    _this.auditTimeDisable = true;
                    _this.submitTime = true;
                    _this.auditTime = "";
                } else if (storageObj.auditStart && storageObj.auditEnd) {
                    _this.auditDateRangeForView = [new Date(storageObj.auditStart), new Date(storageObj.auditEnd)];
                    _this.submitTimeDisable = true;
                    _this.auditTimeDisable = false;
                    _this.submitTime = "";
                    _this.auditTime = true;
                }
            }

            _this.isRequire = true;
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
            searchInvoic: function () {
                if (this.customerQuery === "") {
                    return;
                }
                $$invoice.getInvoices(this.getParams());
            },
            sendParams: function (type) {
                if (!this.isRequire) return;
                $$invoice.getInvoices(this.getParams(type));
            },
            getParams: function (type) {
                if (type != "fromPage") {
                    this.currentPage = 1;
                }
                const params = {
                    status: this.auditStateValue,
                    pageIndex: this.currentPage,
                    pageNum: this.pageSize
                };
                if (this.customerQuery) {
                    _.extend(params, {
                        demander: this.customerQuery
                    });
                }
                if (!this.submitTimeDisable && this.submitDateRange
                        && this.submitDateRangeForView.length > 0
                        && this.submitDateRangeForView[0]) {
                    _.extend(params, {
                        insertStart: this.submitDateRange.split(" - ")[0],
                        insertEnd: this.submitDateRange.split(" - ")[1]
                    });
                }
                if (!this.auditTimeDisable && this.auditDateRange
                        && this.auditDateRangeForView.length > 0
                        && this.auditDateRangeForView[0]) {
                    _.extend(params, {
                        auditStart: this.auditDateRange.split(" - ")[0],
                        auditEnd: this.auditDateRange.split(" - ")[1]
                    });
                }

                window.localStorage.setItem("audit_invoice_searchContent", JSON.stringify({
                    "status": params.status,
                    "insertStart": params.insertStart,
                    "insertEnd": params.insertEnd,
                    "auditStart": params.auditStart,
                    "auditEnd": params.auditEnd
                }));

                return params;
            },
            getDownLoadParams: function () {
                const params = {
                    status: this.auditStateValue
                };
                if (this.customerQuery) {
                    _.extend(params, {
                        demander: this.customerQuery
                    });
                }
                if (!this.submitTimeDisable && this.submitDateRange) {
                    _.extend(params, {
                        insertStart: this.submitDateRange.split(" - ")[0],
                        insertEnd: this.submitDateRange.split(" - ")[1]
                    });
                }
                if (!this.auditTimeDisable && this.auditDateRange) {
                    _.extend(params, {
                        auditStart: this.auditDateRange.split(" - ")[0],
                        auditEnd: this.auditDateRange.split(" - ")[1]
                    });
                }
                return params;
            },
            exportData () {
                const that = this;
                const downloadParams = this.getDownLoadParams();
                $$invoice.downloadInvoices(downloadParams, function (data) {
                    if (data.errorCode === 0) {
                        that.$notify({
                            title: "数据导出成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        location.href = data.fileUrl;
                    } else {
                        that.$notify({
                            title: "数据导出失败",
                            message: "",
                            type: "error",
                            duration: 2000
                        });
                    }
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
        }
    };
</script>
