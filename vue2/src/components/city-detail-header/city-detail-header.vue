<template>
    <div class="city-detail-header">
        <div class="date-wrapper">
            <span class="demonstration">日期：</span>
            <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    placeholder="选择日期范围"
                    style="width:220px;">
            </el-date-picker>
        </div>
        <el-button style="float: right;margin-left: 20px;" @click.native.prevent="exportData()">数据导出</el-button>
    </div>
</template>
<style scoped>
    .city-detail-header {
    margin: 10px 0;
    overflow: hidden;
}

.city-detail-header .date-wrapper {
    display: inline-block;
    font-size: 14px;
    color: #5e6d82;
}
</style>
<script>
    import $$city from "../../script/data/model/city";
    import _ from "../../lib/underscore.v1.4.4.min";

    export default{
        data () {
            return {
                dateRange: [new Date(new Date().getTime() - 86400000), new Date()],
                cityId: "",
                cityName: "",
                currentPage: 1,
                pageSize: 10,
                cityOptions: []
            };
        },
        activated: function () {
            const _this = this;
            $$city.on("getCityList", function (data) {
                if (data.errorCode !== 0) {
                    return;
                }
                _this.cityOptions = data.cityList.items;
                _this.cityId = _this.$route.query.cityId;

                const cityItem = _.find(_this.cityOptions, function (item) {
                    return item.id == _this.cityId;
                });
                if (cityItem) {
                    _this.cityName = cityItem.name;
                }
                _this.getDetailList();
            });

            $$city.getCityList();
        },
        beforeMount: function () {
            const _this = this;
            $$city.on("getCityList", function (data) {
                if (data.errorCode !== 0) {
                    return;
                }
                _this.cityOptions = data.cityList.items;
                _this.cityId = _this.$route.query.cityId;
                const cityItem = _.find(_this.cityOptions, function (item) {
                    return item.id == _this.cityId;
                });
                if (cityItem) {
                    _this.cityName = cityItem.name;
                }
                _this.getDetailList();
            });

            $$city.getCityList();

            $$city.on("getCityDetailByPage", function (page) {
                _this.currentPage = page;
                _this.getDetailList("fromPage");
            });

            $$city.on("getCityDetailAgain", function () {
                _this.getDetailList();
            });
        },
        watch: {
            dateRange: function (newValue) {
                if (newValue != " ") {
                    this.getDetailList();
                }
            }
        },
        methods: {
            exportData: function () {
                const _this = this;
                const params = {
                    "city": this.cityName,
                    startDate: this.dateRange[0].toLocaleDateString().replace(/\//g, "-") + " 00:00:00",
                    endDate: this.dateRange[1].toLocaleDateString().replace(/\//g, "-") + " 23:59:59"
                };

                $$city.on("getDownloadDetailStatistic", function (data) {
                    if (data.errorCode === 0) {
                        _this.$notify({
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
                $$city.getDownloadDetailStatistic(params);
            },
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
            getDetailList: function (type) {
                const _this = this;
                const params = {
                    "city": _this.cityName,
                    "pageIndex": _this.currentPage,
                    "eachPageNum": _this.pageSize
                };
                if (type != "fromPage") {
                    _this.currentPage = 1;
                }
                params.startDate = _this.dateRange[0] ? _this.dateRange[0].toLocaleDateString().replace(/\//g, "-") + " 00:00:00" : "";
                params.endDate = _this.dateRange[1] ? _this.dateRange[1].toLocaleDateString().replace(/\//g, "-") + " 23:59:59" : "";
                if (!_this.isExistEmpty(params)) {
                    return;
                }
                $$city.getCityDetailStaistics(params);
            }
        }
    };
</script>
