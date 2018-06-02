<template>
    <div>
        <el-form ref="form" label-width="68px" class="clearfix" :inline="true">
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期范围">
                    <el-date-picker v-model="dateRangeForView" type="daterange" placeholder="选择日期范围"
                                    style="width: 220px; "></el-date-picker>
                </el-form-item>
                <el-form-item label="操作者">
                    <el-select @change="sendParams" v-model="operatorId" placeholder="请选择" style="width: 220px;">
                        <el-option v-for="item in operatorIds" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作对象">
                    <el-select @change="sendParams" v-model="targetType" placeholder="请选择" style="width: 220px;">
                        <el-option v-for="item in targetTypes" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<style scoped>
.clearfix {
    zoom: 1;
}

.clearfix::after {
    content: '';
    display: block;
    line-height: 0;
    visibility: hidden;
    clear: both;
}
</style>
<script>
    import $$operation from "../../script/data/model/operation";
    import _ from "../../lib/underscore.v1.4.4.min";
    let firstInit = true;
    export default{
        data () {
            return {
                self_name: "operation-header",
                dateRangeForView: [],
                operatorId: "",
                operatorIds: [],
                targetType: "",
                dateFormat: "YYYY-MM-DD",
                targetTypes: [],
                dateRange: "",
                currentPage: 1,
                pageSize: 10,
                isRequire: false
            };
        },
        watch: {
            dateRangeForView: function (val) {
                if (Object.prototype.toString.call(val) === "[object Array]") {
                    this.dateRange = val[0] && val[1] ? this._dateTimeFormatter(val[0], this.dateFormat) + " - " +
                    this._dateTimeFormatter(val[1], this.dateFormat) || "" : "";
                    this.sendParams();
                }
            }
        },
        methods: {
            sendParams: function (type) {
                if (firstInit) {
                    return;
                }
                if (!this.dateRange) {
                    return;
                }

                const params = this.getParams(type);
                $$operation.getOperationList(params);
            },
            getParams: function (type) {
                if (type != "fromPage") {
                    this.currentPage = 1;
                }
                const params = {
                    operatorId: parseInt(this.operatorId),
                    dateFrom: this.dateRange ? this.dateRange.split(" - ")[0] : "",
                    dateTo: this.dateRange ? this.dateRange.split(" - ")[1] : "",
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize
                };
                if (this.targetType) {
                    _.extend(params, {
                        targetType: parseInt(this.targetType)
                    });
                }
                // 本地存储设置
                window.localStorage.setItem("ad_operation_searchContent", JSON.stringify({
                    "operatorId": params.operatorId,
                    "dateFrom": params.dateFrom,
                    "dateTo": params.dateTo,
                    "targetType": params.targetType
                }));

                return params;
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
            $$operation.on("getOperationIndex", function (data) {
                if (data.code == 0) {
                    _this.operatorIds = data.data.operatorIds;
                    _this.targetTypes = data.data.targetTypes;
                    _this.operatorId = data.data.operatorIds[0].id;
                    const dateFrom = new Date(new Date().getTime() - 86400000);
                    const dateTo = new Date();
                    _this.dateRangeForView = [dateFrom, dateTo];

                    $$operation.getTargetType(data.data.targetTypes);
                    _this.targetTypes.forEach(function (i) {
                        i.id = i.id.toString();
                    });

                    if (window.localStorage.getItem("ad_operation_searchContent")) {
                        const storageObj = JSON.parse(window.localStorage.getItem("ad_operation_searchContent"));
                        _this.operatorId = storageObj.operatorId;
                        _this.targetType = storageObj.targetType + "";
                        _this.dateRangeForView = [new Date(storageObj.dateFrom), new Date(storageObj.dateTo)];
                    } else {
                        $$operation.getOperationList({
                            operatorId: parseInt(data.data.operatorIds[0].id),
                            dateFrom: _this._dateTimeFormatter(dateFrom, "YYYY-MM-DD"),
                            dateTo: _this._dateTimeFormatter(dateTo, "YYYY-MM-DD"),
                            pageSize: 10,
                            pageIndex: 1
                        });
                    }
                    firstInit = false;
                }
            });

            $$operation.getOperationIndex();

            $$operation.on("getOpByPage", function (page) {
                _this.currentPage = page;
                _this.sendParams("fromPage");
            });
        }
    };
</script>
