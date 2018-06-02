<template>
    <div class="city-header">
        <div class="searchWrapper">
            <el-row type="flex" justify="space-between" style="margin-bottom:10px;">
                <div>
                    <span class="data-label">日期</span>
                    <el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期范围" style="width:220px;">
                    </el-date-picker>
                </div>
                <el-select v-model="selectCityList" filterable multiple  placeholder="请选择城市" @change="getCityList" style="width:300px;">
                    <el-option-group
                            v-for="group in cityOptions"
                            :label="group.label">
                        <el-option v-for="item in group.options" :label="item.label" :value="item.label">
                        </el-option>
                    </el-option-group>
                </el-select>

                <el-input placeholder="搜索城市" v-model="searchCity" style="width:220px;">
                    <el-button slot="append" icon="search" @click.native.prevent="searchCityFn"></el-button>
                </el-input>
            </el-row>
            <el-row style="margin-bottom:10px;">
                <el-button style="float: right;" @click.native.prevent="exportData()">数据导出</el-button>
                <el-button style="float: right;" @click.native.prevent="exportAllData()">导出所有城市数据</el-button>
            </el-row>
        </div>
    </div>
</template>
<style scoped>
.data-label {
    display: inline-block;
    width: 40px;
    text-align: left;
    font-size: 14px;
    color: #5e6d82;
}
</style>
<script>
    import $$city from "../../script/data/model/city";
    export default{
        data () {
            return {
                tag: false,
                selectCityList: [],
                cityOptions: [],
                dateRange: [],
                searchCity: "",
                allCitys: []
            };
        },
        watch: {
            dateRange: function (newValue) {
                if (newValue != " ") {
                    this.getCityList();
                }
            }
        },
        beforeMount: function () {
            const _this = this;

            $$city.getAdParams(function (res) {
                if (res.code === 0) {
                    _this.cityOptions = res.data.areaCodeList;
                }
            });

            // 数据加载
            $$city.getCityList(function (data) {
                if (data.errorCode === 0) {
                    _this.allCitys = data.cityList.items;

                    if (window.localStorage.getItem("ad_city_searchContent")) {
                        const storgeObj = JSON.parse(window.localStorage.getItem("ad_city_searchContent"));
                        _this.dateRange = [storgeObj.startDate, storgeObj.endDate];
                        _this.selectCityList = storgeObj.selectCityList;
                    } else {
                        const cityTemp = [];
                        data.cityList.items.forEach(function (item) {
                            if (item.name === "北京" || item.name === "上海" || item.name === "广州" || item.name === "深圳") {
                                cityTemp.push(item.name);
                            }
                        });
                        _this.selectCityList = cityTemp;

                        const startDate = new Date(new Date().getTime() - 86400000).toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
                        const endDate = new Date().toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
                        _this.dateRange = [startDate, endDate];
                    }
                    _this.tag = true;
                    _this.getCityList();
                }
            });
            // 导出所选城市
            $$city.on("getDownloadStatistics", function (data) {
                if (data.errorCode === 0) {
                    location.href = data.fileUrl;
                } else {
                    _this.$notify({
                        title: "数据导出失败",
                        message: "",
                        type: "error",
                        duration: 2000
                    });
                }
            });
            // 导出全部城市
            $$city.on("getDownloadAllStatistics", function (data) {
                if (data.errorCode === 0) {
                    _this.$notify({
                        title: "所有城市在所选日期的数据稍后将发送至您的公司邮箱，请注意查收",
                        message: "",
                        type: "success",
                        duration: 2000
                    });
                    // window.open(data.fileUrl);
                } else {
                    _this.$notify({
                        title: "数据导出失败",
                        message: "",
                        type: "error",
                        duration: 2000
                    });
                }
            });
        },
        methods: {
            isExistEmpty: function (param) {
                let result = true;
                for (const i in param) {
                    if (param[i] instanceof Array) {
                        if (param[i].length >= 0) {
                            result = result && true;
                        } else {
                            result = result && false;
                            return;
                        }
                    } else if (param[i].trim() !== "") {
                        result = result && true;
                    } else {
                        result = result && false;
                        return;
                    }
                }
                return result;
            },
            getCityList: function () {
                if (!this.tag) {
                    return;
                }
                const _this = this;
                const dataSubmit = {
                    "cities": _this.selectCityList,
                    "endDate": "",
                    "startDate": ""
                };
                const dateRange = _this.dateRange;
                dataSubmit.startDate = dateRange[0] ? new Date(new Date(dateRange[0])).toLocaleDateString().replace(/\//g, "-") + " 00:00:00" : "";
                dataSubmit.endDate = dateRange[1] ? new Date(dateRange[1]).toLocaleDateString().replace(/\//g, "-") + " 23:59:59" : "";
                if (!_this.isExistEmpty(dataSubmit)) {
                    return;
                }

                window.localStorage.setItem("ad_city_searchContent", JSON.stringify({
                    selectCityList: dataSubmit.cities,
                    startDate: dataSubmit.startDate,
                    endDate: dataSubmit.endDate
                }));

                $$city.getCityStaistics(dataSubmit);
            },
            exportData: function () {
                const _this = this;
                let cityTemp = [];
                cityTemp = _this.selectCityList;
                const dataSubmit = {
                    "cities": cityTemp,
                    "endDate": "",
                    "startDate": ""
                };
                const dateRange = _this.dateRange;
                dataSubmit.startDate = new Date(dateRange[0]).toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
                dataSubmit.endDate = new Date(dateRange[1]).toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
                $$city.getDownloadStatistics(dataSubmit);
            },
            exportAllData: function () {
                const _this = this;
                const dataSubmit = {
                    "endDate": "",
                    "startDate": ""
                };
                const dateRange = _this.dateRange;
                dataSubmit.startDate = new Date(dateRange[0]).toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
                dataSubmit.endDate = new Date(dateRange[1]).toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
                $$city.getDownloadAllStatistics(dataSubmit);
            },
            searchCityFn: function () {
                const _this = this;
                const dataSubmit = {
                    "cities": []
                };
                if (_this.searchCity.trim() === "") {
                    return;
                }
                dataSubmit.cities.push(_this.searchCity);
                dataSubmit.startDate = new Date(_this.dateRange[0]).toLocaleDateString().replace(/\//g, "-") + " 00:00:00";
                dataSubmit.endDate = new Date(_this.dateRange[1]).toLocaleDateString().replace(/\//g, "-") + " 23:59:59";
                if (!_this.isExistEmpty(dataSubmit)) {
                    return;
                }
                _this.selectCityList = [];
                $$city.getCityStaistics(dataSubmit);
            }
        }
    };
</script>
