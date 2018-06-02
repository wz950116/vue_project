<template>
    <div>
        <el-form ref="form" label-width="68px">
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期范围" style="margin-bottom:10px;">
                    <el-date-picker v-model="dateRangeForView" type="daterange" format="yyyy-MM-dd" placeholder="选择日期范围" style="width:220px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="城市" style="margin-bottom:10px;">
                    <el-select v-model="areaCode" filterable style="width:220px;" @change="sendParams">
                        <el-option label="全部" value="0"></el-option>
                        <el-option-group v-for="group in areaCodeList" :label="group.label">
                            <el-option v-for="city in group.options" :label="city.label" :value="city.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" style="margin-bottom:10px;">
                    <el-select @change="sendParams" v-model="auditStateValue" style="width:220px;">
                        <el-option v-for="item in auditStateOptions" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-bottom:10px;" class="search-input">
                    <el-input placeholder="输入客户ID或客户名称" v-model="customerQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="searchQuery"></el-button>
                    </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="" v-if="auditStateValue === '1'" style="margin:0 0 5px -68px;">
                    <el-checkbox-group v-model="timeType" style="width:500px;">
                        <el-checkbox @change="checkChange(1)" label="1">近十天提交</el-checkbox>
                        <el-checkbox @change="checkChange(2)" label="2">近三十天提交</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<style>
.search-input .el-form-item__content {
    margin-left: 48px !important;
}
</style>
<script>
    import $$audit from "../../script/data/model/audit";
    import _ from "../../lib/underscore.v1.4.4.min";
    export default{
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                self_name: "audit-account-header",
                auditStateValue: "1",
                dateRange: "",
                dateRangeForView: "",
                customerQuery: "",
                timeType: ["1"],
                areaCode: "0",
                areaCodeList: [],
                dateFormat: "YYYY-MM-DD",
                auditStateOptions: [
                    { value: "1", label: "待审核" },
                    { value: "2", label: "通过" },
                    { value: "3", label: "未通过" }
                ],
                isRequire: false
            };
        },
        watch: {
            dateRangeForView: function (val) {
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.dateRange = this._dateTimeFormatter(val[0], this.dateFormat) + " - " + this._dateTimeFormatter(val[1], this.dateFormat);
                }
                this.sendParams();
            }
        },
        beforeMount: function () {
            const _this = this;

            this.checkChange(1);

            $$audit.on("getAuditByPage", function (page) {
                _this.currentPage = page;
                _this.sendParams("fromPage");
            });

            $$audit.on("actionSuccess", function () {
                _this.sendParams();
            });

            // 获取排序城市列表
            $$audit.getParameters({}, function (res) {
                if (res.code === 0) {
                    _this.areaCodeList = res.data.areaCodeList;

                    // 读取本地存储
                    if (window.localStorage.getItem("audit_account_searchContent")) {
                        const storageObj = JSON.parse(window.localStorage.getItem("audit_account_searchContent"));
                        _this.areaCode = storageObj.area_code || "";
                        _this.auditStateValue = storageObj.audit_status || "1";
                    } else {
                        $$audit.getAudit("account", _this.getParams());
                    }
    
                    _this.isRequire = true;
                } else {
                    _this.$message.error(res.msg);
                }
            });
        },
        methods: {
            getBeforeDate (m) {
                const n = m, curDay = [];
                const d = new Date();
                let year = d.getFullYear();
                let mon = d.getMonth() + 1;
                let day = d.getDate();
                curDay.push(year + "-" + (mon < 10 ? ("0" + mon) : mon) + "-" + day);
                if (day <= n) {
                    if (mon > 1) {
                        mon = mon - 1;
                    } else {
                        year = year - 1;
                        mon = 12;
                    }
                }
                d.setDate(d.getDate() - n);
                year = d.getFullYear();
                mon = d.getMonth() + 1;
                day = d.getDate();
                curDay.push(year + "-" + (mon < 10 ? ("0" + mon) : mon) + "-" + (day < 10 ? ("0" + day) : day));
                return curDay;
            },
            checkChange: function (type) {
                const arr = [], that = this;
                let beforTime;
                if (this.timeType.length > 0) {
                    this.timeType.forEach(function (item) {
                        if (item == type) {
                            arr.push(item);
                            if (type == 1) {
                                beforTime = that.getBeforeDate(10);
                            } else if (type == 2) {
                                beforTime = that.getBeforeDate(30);
                            }
                        }
                    });
                    that.timeType = arr;
                    this.dateRangeForView = [new Date(beforTime[1]), new Date(beforTime[0])];
                } else {
                    this.dateRangeForView = [];
                    this.dateRange = false;
                }
            },
            searchQuery: function () {
                if (this.customerQuery === "") {
                    return;
                }
                this.sendParams();
            },
            sendParams: function (type) {
                if (!this.isRequire) return;
                $$audit.getAudit("account", this.getParams(type));
            },
            getParams: function (type) {
                if (!this.dateRange) this.dateRange = false;
                if (!this.dateRange) this.dateRange = " - ";
                if (type != "fromPage") {
                    this.currentPage = 1;
                }

                const params = {
                    audit_status: this.auditStateValue,
                    demander: this.customerQuery,
                    time_order: 1,
                    page_index: this.currentPage,
                    limit: this.pageSize,
                    area_code: parseInt(this.areaCode)
                };
                if (this.dateRangeForView.length > 0 && this.dateRangeForView[0] && this.dateRange.split(" - ")[0] != "") {
                    _.extend(params, {
                        from_date: this.dateRange.split(" - ")[0],
                        to_date: this.dateRange.split(" - ")[1]
                    });
                }

                // 设置本地存储
                window.localStorage.setItem("audit_account_searchContent", JSON.stringify({
                    "area_code": params.area_code,
                    "from_date": params.from_date,
                    "to_date": params.to_date,
                    "audit_status": params.audit_status
                }));

                return params;
            },
            changeTimeType: function (value) {
                this.dateRange = this._dateTimeFormatter(this._getDateBefore(value == 0 ? 10 : 30), this.dateFormat) + " - " + this._dateTimeFormatter(new Date(), this.dateFormat);
                this.sendParams();
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
            _getDateBefore: function (duration) {
                const now = new Date();
                now.setDate(now.getDate() - duration);
                return now;
            }
        }
    };
</script>
