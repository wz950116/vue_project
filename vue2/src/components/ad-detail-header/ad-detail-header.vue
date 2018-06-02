<template>
    <div class="ad-detail-header">
        <div class="block">
            <span class="font-style">日期：</span>
            <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    placeholder="选择日期范围"
                    style="width: 220px;">
            </el-date-picker>
            <el-button style="float:right;" :plain="true" type="success" @click="exportData">导出数据</el-button>
            <p class="font-style" style="float:right;margin-right:10px;">售出率：{{soldRate}}</p>
        </div>
    </div>
</template>
<style scoped>
    .ad-detail-header {
    margin: 10px 0 20px 0;
    line-height: 36px;
}

.ad-detail-header .font-style {
    font-size: 14px;
    color: #5e6d82;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import _ from "../../lib/underscore.v1.4.4.min";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                self_name: "ad-detail-header",
                dateRange: [new Date(), new Date()],
                soldRate: "0%"
            };
        },
        methods: {
            isExistEmpty: function (param) {
                let result = true;
                for (const i in param) {
                    if (param[i] !== "") {
                        result = result && true;
                    } else {
                        result = result && false;
                        return;
                    }
                }
                return result;
            },
            getAdDetailList: function (type) {
                const _this = this;
                if (type != "fromPage") {
                    _this.currentPage = 1;
                }
                const data = {
                    "resourceId": _this.$route.query.adId,
                    "beginDate": _this.dateRange[0] ? _this.dateRange[0].getTime() : "",
                    "endDate": _this.dateRange[1] ? _this.dateRange[1].getTime() : "",
                    "limit": _this.pageSize,
                    "pageIndex": _this.currentPage
                };
                if (!_this.isExistEmpty(data)) {
                    return;
                }
                $$ad.getAdDetail(data, function (data) {
                    if (data.code !== 0) {
                        return;
                    }
                    _this.soldRate = data.data.saleRate;
                });
            },
            exportData: function () {
                const _this = this;
                $$ad.downLoadAdDetail({
                    "resourceId": _this.$route.query.adId,
                    "beginDate": _this.dateRange[0] ? _this.dateRange[0].getTime() : "",
                    "endDate": _this.dateRange[1] ? _this.dateRange[1].getTime() : ""
                }, function (data) {
                    if (data.code === 0) {
                        _this.$notify({
                            title: "数据导出成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        window.open(data.data.fileUrl);
                    } else {
                        _this.$notify({
                            title: "数据导出失败",
                            message: "",
                            type: "error",
                            duration: 2000
                        });
                    }
                });
            }
        },
        watch: {
            dateRange: function () {
                this.getAdDetailList();
            }
        },
        beforeMount: function () {
            const _this = this;

            const params = {
                "beginDate": _this.dateRange[0].getTime(),
                "endDate": _this.dateRange[1].getTime(),
                "limit": _this.pageSize,
                "pageIndex": _this.currentPage
            };

            $$ad.on("getIdAndGetDetail", function (id) {
                _.extend(params, {
                    "resourceId": id
                });
                $$ad.getAdDetail(params, function (data) {
                    if (data.code !== 0) {
                        return;
                    }
                    _this.soldRate = data.data.saleRate;
                });
            });

            $$ad.on("getAdDetailInfoByPage", function (page) {
                _this.currentPage = page;
                _this.getAdDetailList("fromPage");
            });
        }
    };
</script>
