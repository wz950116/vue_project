<template>
    <div>
        <el-form ref="form" label-width="90px" :inline="true">
            <el-row>
                <el-form-item label="日期范围" class="order-form-item">
                    <el-date-picker v-model="dateRangeForView" type="daterange" format="yyyy-MM-dd" placeholder="选择日期范围" style="width:220px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="城市" style="margin-bottom:10px;">
                    <el-select v-model="areaCode" filterable style="width:220px;">
                        <el-option label="全部" value="0"></el-option>
                        <el-option-group v-for="group in areaCodeList" :label="group.label">
                            <el-option v-for="city in group.options" :label="city.label" :value="city.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" class="order-form-item">
                    <el-select @change="sendParams" v-model="auditStateValue" style="width:120px;">
                        <el-option v-for="item in auditStateOptions" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="白名单筛选" class="order-form-item">
                    <el-select @change="sendParams" v-model="whiteStatus" style="width:120px;">
                        <el-option v-for="item in whiteOptions" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item class="order-form-item">
                    <el-input placeholder="输入客户ID或客户名称" v-model="customerQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="searchQuery"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="order-form-item">
                    <el-input placeholder="输入订单ID" v-model="orderQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="orderSearch"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="order-form-item">
                    <el-input placeholder="输入创意ID" v-model="creativeQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="creativeSearch"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item class="order-form-item">
                    <el-input placeholder="输入计划名称" v-model="planQuery" style="width:220px;">
                        <el-button slot="append" icon="search" v-on:click="planSearch"></el-button>
                    </el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="" v-if="auditStateValue === '0'" style="margin:0 0 5px -68px;">
                    <el-checkbox-group v-model="timeType" style="width:500px;">
                        <el-checkbox @change="checkChange(1)" label="1">近十天提交</el-checkbox>
                        <el-checkbox @change="checkChange(2)" label="2">近三十天提交</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<style scoped>
    .order-form-item {
    margin-bottom: 10px;
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
                self_name: "audit-idea-header",
                auditStateValue: "0",
                dateRange: "",
                dateRangeForView: [],
                customerQuery: "",
                orderQuery: "",
                creativeQuery: "",
                searchType: "",
                areaCode: "0",
                areaCodeList: [],
                timeType: ["1"],
                dateFormat: "YYYY-MM-DD",
                auditStateOptions: [
                    { value: "0", label: "待审核" },
                    { value: "1", label: "通过" },
                    { value: "2", label: "未通过" }
                ],
                whiteStatus: "2",
                whiteOptions: [
                    { value: "2", label: "全部" },
                    { value: "1", label: "白名单" },
                    { value: "0", label: "非白名单" }
                ],
                planQuery: ""
            };
        },
        watch: {
            dateRangeForView (val) {
                if (!val[0] || !val[1]) {
                    return;
                }
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.dateRange = this._dateTimeFormatter(val[0], this.dateFormat) + " - " + this._dateTimeFormatter(val[1], this.dateFormat);
                    const beforTime = this.getBeforeDate(10), beforTime2 = this.getBeforeDate(30);
                    if (this._dateTimeFormatter(val[0], this.dateFormat) == beforTime[1] && this._dateTimeFormatter(val[1], this.dateFormat) == beforTime[0]) {
                        // 所选日期正好为近十天
                        this.timeType = ["1"];
                    } else if (this._dateTimeFormatter(val[0], this.dateFormat) == beforTime2[1] && this._dateTimeFormatter(val[1], this.dateFormat) == beforTime2[0]) {
                        // 所选日期正好为近三十天
                        this.timeType = ["2"];
                    } else {
                        this.timeType = [];
                    }
                }
                this.sendParams();
            },
            areaCode (val) {
                this.sendParams();
            }
        },
        beforeMount () {
            const _this = this, beforTime = _this.getBeforeDate(10);

            $$audit.on("getAuditByPage", page => {
                _this.currentPage = page;
                _this.sendParams("fromPage");
            });

            // 请求排序城市数据
            $$audit.getParameters({}, res => {
                if (res.code === 0) {
                    _this.areaCodeList = res.data.areaCodeList;

                    const storageObj = JSON.parse(window.localStorage.getItem("audit_order_searchContent"));
                    if (storageObj) {
                        _this.auditStateValue = storageObj.audit_status;
                        _this.areaCode = storageObj.area_code || "0";
                        _this.whiteStatus = storageObj.is_white || "2";
                        _this.dateRangeForView = [new Date(storageObj.from_date), new Date(storageObj.to_date)];
                    } else {
                        _this.dateRangeForView = [new Date(beforTime[1]), new Date(beforTime[0])];
                    }
                } else {
                    _this.$message.error(res.msg);
                }

                _this.isRequire = true;
            });
        },
        methods: {
            getBeforeDate (m) {
                const n = m, curDay = [];
                const d = new Date();
                let year = d.getFullYear();
                let mon = d.getMonth() + 1;
                let day = d.getDate();
                curDay.push(year + "-" + (mon < 10 ? ("0" + mon) : mon) + "-" + (day < 10 ? ("0" + day) : day));
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
            checkChange (type) {
                const arr = [], that = this;
                let beforTime;
                if (this.timeType.length > 0) {
                    this.timeType.forEach(item => {
                        if (item == type) {
                            arr.push(item);
                            if (type == 1) {
                                beforTime = that.getBeforeDate(10);
                            } else if (type == 2) {
                                beforTime = that.getBeforeDate(30);
                            }
                        }
                    });
                    this.dateRangeForView = [new Date(beforTime[1]), new Date(beforTime[0])];
                } else {
                    this.dateRangeForView = [];
                    this.dateRange = false;
                }
                that.timeType = arr;
            },
            planSearch () {
                if (this.planQuery === "") {
                    return;
                }
                this.customerQuery = "";
                this.orderQuery = "";
                this.creativeQuery = "";
                this.searchType = "plan";
                this.sendParams();
            },
            searchQuery () {
                if (this.customerQuery === "") {
                    return;
                }
                this.planQuery = "";
                this.orderQuery = "";
                this.creativeQuery = "";
                this.searchType = "customer";
                this.sendParams();
            },
            orderSearch () {
                if (this.orderQuery === "") {
                    return;
                }
                this.planQuery = "";
                this.customerQuery = "";
                this.creativeQuery = "";
                this.searchType = "order";
                this.sendParams();
            },
            creativeSearch () {
                if (this.creativeQuery === "") {
                    return;
                }
                this.planQuery = "";
                this.customerQuery = "";
                this.orderQuery = "";
                this.searchType = "creative";
                this.sendParams();
            },
            sendParams (type) {
                if (!this.isRequire) return;
                $$audit.getAudit("order", this.getParams(type));
            },
            getParams (type) {
                if (type != "fromPage") {
                    this.currentPage = 1;
                }
                const params = {
                    audit_status: this.auditStateValue,
                    time_order: 1,
                    page_index: this.currentPage,
                    limit: this.pageSize,
                    area_code: parseInt(this.areaCode)
                };
                if (this.whiteStatus !== "2") {
                    _.extend(params, {
                        is_white: this.whiteStatus
                    });
                }
                if (this.searchType === "customer" && this.customerQuery !== "") {
                    _.extend(params, {
                        demander: this.customerQuery
                    });
                } else if (this.searchType === "order" && this.orderQuery !== "") {
                    _.extend(params, {
                        order_id: this.orderQuery
                    });
                } else if (this.searchType === "creative" && this.creativeQuery !== "") {
                    _.extend(params, {
                        idea_id: this.creativeQuery
                    });
                } else if (this.searchType === "plan" && this.planQuery !== "") {
                    _.extend(params, {
                        plan_name: this.planQuery
                    });
                }
                if (this.dateRangeForView.length > 0 && this.dateRangeForView[0] && this.dateRange.split(" - ")[0] != "") {
                    _.extend(params, {
                        from_date: this.dateRange.split(" - ")[0],
                        to_date: this.dateRange.split(" - ")[1]
                    });
                }

                window.localStorage.setItem("audit_order_searchContent", JSON.stringify({
                    "from_date": params.from_date,
                    "to_date": params.to_date,
                    "audit_status": params.audit_status,
                    "area_code": params.area_code,
                    "is_white": params.is_white
                }));

                return params;
            },
            changeTimeType: function (value) {
                this.dateRange = this._dateTimeFormatter(this._getDateBefore(value == 0 ? 10 : 30), this.dateFormat) + " - " +
                        this._dateTimeFormatter(new Date(), this.dateFormat);
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
