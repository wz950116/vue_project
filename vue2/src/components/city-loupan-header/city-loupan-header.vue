<template lang="html">
    <el-form class="mt20" ref="form" label-width="40px" @submit.prevent="onSubmit" :inline="true">
        <el-form-item label="省份">
            <el-select @change="changeProvince" v-model="provinceName" filterable placeholder="请选择省份">
                <el-option
                  v-for="item in provinceList"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="城市">
            <el-select @change="changeCity" v-model="cityName" filterable placeholder="请选择城市">
                <el-option
                  v-for="item in cityList"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="分区">
            <el-select @change="changePart" v-model="areaName" filterable placeholder="请选择分区">
                <el-option
                  v-for="item in areaList"
                  :label="item"
                  :value="item">
                </el-option>
            </el-select>
        </el-form-item>
        <el-popover ref="popover4" placement="bottom" width="500" trigger="click">
            <div class="pop-content">
                <el-checkbox-group @change="changeShowData" v-model="showData">
                    <h4>项目数据</h4>
                    <el-checkbox label="time">开盘时间</el-checkbox>
                    <el-checkbox label="state">销售状态</el-checkbox>
                    <el-checkbox label="zdmj">占地面积</el-checkbox>
                    <el-checkbox label="jzmj">建筑面积</el-checkbox>
                    <el-checkbox label="zts">总套数</el-checkbox>
                    <h4>销售数据</h4>
                    <el-checkbox label="xsmj2016">2016销售面积</el-checkbox>
                    <el-checkbox label="xsts2016">2016销售套数</el-checkbox>
                    <el-checkbox label="xse2016">2016销售额</el-checkbox>
                    <el-checkbox label="jj2016">2016均价</el-checkbox>
                    <br>
                    <el-checkbox label="xsmj2017">2017销售面积</el-checkbox>
                    <el-checkbox label="xsts2017">2017销售套数</el-checkbox>
                    <el-checkbox label="xse2017">2017预计销售额</el-checkbox>
                    <el-checkbox label="jj2017">2017均价</el-checkbox>
                    <h4>广告数据</h4>
                    <el-checkbox label="jdgg2016">2016焦点广告和电商</el-checkbox>
                    <el-checkbox label="tf2017">2017拟投放金额(万元)</el-checkbox>
                    <br>
                    <el-checkbox label="jdad2017Q1">2017Q1焦点广告</el-checkbox>
                    <el-checkbox label="jdad2017Q2">2017Q2焦点广告</el-checkbox>
                    <el-checkbox label="jdad2017Q3">2017Q3焦点广告</el-checkbox>
                    <el-checkbox label="jdad2017Q4">2017Q4焦点广告</el-checkbox>
                    <br>
                    <el-checkbox label="sfad2017Q1">2017Q1搜房广告</el-checkbox>
                    <el-checkbox label="sfad2017Q2">2017Q2搜房广告</el-checkbox>
                    <el-checkbox label="sfad2017Q3">2017Q3搜房广告</el-checkbox>
                    <el-checkbox label="sfad2017Q4">2017Q4搜房广告</el-checkbox>
                    <br>
                    <el-checkbox label="ljad2017Q1">2017Q1乐居广告</el-checkbox>
                    <el-checkbox label="ljad2017Q2">2017Q2乐居广告</el-checkbox>
                    <el-checkbox label="ljad2017Q3">2017Q3乐居广告</el-checkbox>
                    <el-checkbox label="ljad2017Q4">2017Q4乐居广告</el-checkbox>
                    <br>
                    <el-checkbox label="jdds2017Q1">2017Q1焦点电商</el-checkbox>
                    <el-checkbox label="jdds2017Q2">2017Q2焦点电商</el-checkbox>
                    <el-checkbox label="jdds2017Q3">2017Q3焦点电商</el-checkbox>
                    <el-checkbox label="jdds2017Q4">2017Q4焦点电商</el-checkbox>
                    <br>
                    <el-checkbox label="sfds2017Q1">2017Q1搜房电商</el-checkbox>
                    <el-checkbox label="sfds2017Q2">2017Q2搜房电商</el-checkbox>
                    <el-checkbox label="sfds2017Q3">2017Q3搜房电商</el-checkbox>
                    <el-checkbox label="sfds2017Q4">2017Q4搜房电商</el-checkbox>
                    <br>
                    <el-checkbox label="lfds2017Q1">2017Q1乐居电商</el-checkbox>
                    <el-checkbox label="lfds2017Q2">2017Q2乐居电商</el-checkbox>
                    <el-checkbox label="lfds2017Q3">2017Q3乐居电商</el-checkbox>
                    <el-checkbox label="lfds2017Q4">2017Q4乐居电商</el-checkbox>
                </el-checkbox-group>
            </div>
        </el-popover>
        <el-button class="button_right" v-popover:popover4 style="margin-right: 160px;">自定义列</el-button>
        <div class="clearfix">
            <div class="input-style">
                <el-input placeholder="请输入楼盘名称" v-model="loupanName" @change="clearLoupan"
                          style="width: 200px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </div>
            <div class="input-style">
                <el-input placeholder="请输入开发商名称" v-model="builderName" @change="clearBuilder"
                          style="width: 200px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </div>
            <div class="input-style">
                <el-input placeholder="请输入负责人名称" v-model="fzName" @change="clearFz"
                          style="width: 200px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </div>
        </div>
    </el-form>
</template>

<script>
import $$loupan from "../../script/data/model/cityLoupan";
export default {
    name: "CityLoupanHeader",
    data () {
        return {
            provinceList: [],
            cityList: [],
            areaList: [],
            provinceName: "",
            cityName: "",
            areaName: "",
            loupanName: "",
            builderName: "",
            fzName: "",
            showData: ["time", "state", "zdmj", "jzmj", "zts", "xsmj2016", "xsts2016", "xse2016", "jj2016", "xsmj2017", "xsts2017", "xse2017", "jj2017",
                "jdgg2016", "tf2017", "jdad2017Q1", "jdad2017Q2", "jdad2017Q3", "jdad2017Q4", "sfad2017Q1", "sfad2017Q2", "sfad2017Q3", "sfad2017Q4", "ljad2017Q1", "ljad2017Q2", "ljad2017Q3", "ljad2017Q4", "jdds2017Q1", "jdds2017Q2", "jdds2017Q3", "jdds2017Q4", "sfds2017Q1", "sfds2017Q2", "sfds2017Q3", "sfds2017Q4", "lfds2017Q1", "lfds2017Q2", "lfds2017Q3", "lfds2017Q4"],
            currentPage: 1,
            pageSize: 10
        };
    },
    methods: {
        changeProvince: function () {
            $$loupan.getCityList({
                provinceName: this.provinceName
            });
            this.search();
        },
        changeCity: function () {
            $$loupan.getAreaList({
                provinceName: this.provinceName,
                cityName: this.cityName
            });
            this.search();
        },
        changePart: function () {
            this.search();
        },
        changeShowData: function () {
            $$loupan.changeShowData(this.showData);
        },
        clearLoupan () {
            if (!this.loupanName) {
                this.search();
            }
        },
        clearBuilder () {
            if (!this.builderName) {
                this.search();
            }
        },
        clearFz () {
            if (!this.fzName) {
                this.search();
            }
        },
        search: function () {
            $$loupan.getLoupanDataList({
                provinceName: this.provinceName == "全部省份" ? "" : this.provinceName,
                cityName: this.cityName == "全部城市" ? "" : this.cityName,
                areaName: this.areaName == "全部分区" ? "" : this.areaName,
                estateName: this.loupanName,
                estateCompanyName: this.builderName,
                principalName: this.fzName,
                pageLimit: this.pageSize,
                pageIndex: this.currentPage
            });
        }
    },
    beforeMount: function () {
        const _this = this;
        $$loupan.on("getProvinceList", function (data) {
            if (parseInt(data.code) == 200) {
                _this.provinceList = data.data.provinceNames;
                _this.provinceList.unshift("全部省份");
            } else {
                _this.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$loupan.on("getCityList", function (data) {
            if (parseInt(data.code) == 200) {
                _this.cityList = data.data.cityNames;
                _this.cityList.unshift("全部城市");
                _this.cityName = "";
            } else {
                _this.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$loupan.on("getAreaList", function (data) {
            if (parseInt(data.code) == 200) {
                _this.areaList = data.data.areaNames;
                _this.areaList.unshift("全部分区");
                _this.areaName = "";
            } else {
                _this.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$loupan.on("getLoupanDataByPage", function (page) {
            _this.currentPage = page;
            _this.search();
        });
        $$loupan.getProvinceList({});
        this.search();
    }
};
</script>

<style scoped lang="css">
.clearfix::after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.mt20 {
    margin-top: 20px;
}

.button_left {
    float: left;
}

.button_right {
    float: right;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.add-staff-title {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 20px;
}

.staff_item {
    margin-bottom: 0;
    display: inline-block;
}

.el-input {
    width: 200px;
}

.el-select {
    display: inline-block;
    position: relative;
    width: 200px;
}

.input-style {
    display: inline-block;
    margin-right: 20px;
}

.pop-content h4 {
    font-size: 15px;
    line-height: 2.5;
}

.el-checkbox {
    margin-left: 0;
    margin-right: 15px;
    margin-bottom: 5px;
}

.el-checkbox+
.el-checkbox {
    margin-left: 0;
}
</style>
