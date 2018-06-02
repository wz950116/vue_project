<template lang="html">
    <div class="mt20" style="overflow: auto;">
        <div class="" style="overflow: auto;">
            <table class="loupan-table">
                <tr>
                    <th colspan="9">基础数据</th>
                    <th :colspan="projectNum" v-show="projectNum == 0 ? false: true">项目数据</th>
                    <th :colspan="sellNum" v-show="sellNum == 0 ? false: true">销售数据</th>
                    <th :colspan="adNum" v-show="adNum == 0 ? false: true">广告数据</th>
                </tr>
                <tr>
                    <th>楼盘名称</th>
                    <th>开发商</th>
                    <th>省份</th>
                    <th>城市</th>
                    <th>建议分区</th>
                    <th>区域</th>
                    <th>商圈</th>
                    <th>级别</th>
                    <th>负责人</th>
                    <th v-show="showData.time">开盘时间</th>
                    <th v-show="showData.state">销售状态</th>
                    <th v-show="showData.zdmj">项目占地总面积(平方米)</th>
                    <th v-show="showData.jzmj">建筑面积(平方米)</th>
                    <th v-show="showData.zts">总套数</th>
                    <th v-show="showData.xsmj2016">2016销售面积(平方米)</th>
                    <th v-show="showData.xsts2016">2016销售套数(套)</th>
                    <th v-show="showData.xse2016">2016销售额(万元)</th>
                    <th v-show="showData.jj2016">2016均价(元/平方米)</th>
                    <th v-show="showData.xsmj2017">2017销售面积(平方米)</th>
                    <th v-show="showData.xsts2017">2017销售套数(套)</th>
                    <th v-show="showData.xse2017">2017预计销售额(万元)</th>
                    <th v-show="showData.jj2017">2017均价(元/平方米)</th>
                    <th v-show="showData.jdgg2016">2016焦点广告和电商(元)</th>
                    <th v-show="showData.tf2017">2017拟投放金额(万元)</th>
                    <th v-show="showData.jdad2017Q1">2017Q1焦点广告(元)</th>
                    <th v-show="showData.jdad2017Q2">2017Q2焦点广告(元)</th>
                    <th v-show="showData.jdad2017Q3">2017Q3焦点广告(元)</th>
                    <th v-show="showData.jdad2017Q4">2017Q4焦点广告(元)</th>
                    <th v-show="showData.sfad2017Q1">2017Q1搜房广告(元)</th>
                    <th v-show="showData.sfad2017Q2">2017Q2搜房广告(元)</th>
                    <th v-show="showData.sfad2017Q3">2017Q3搜房广告(元)</th>
                    <th v-show="showData.sfad2017Q4">2017Q4搜房广告(元)</th>
                    <th v-show="showData.ljad2017Q1">2017Q1乐居广告(元)</th>
                    <th v-show="showData.ljad2017Q2">2017Q2乐居广告(元)</th>
                    <th v-show="showData.ljad2017Q3">2017Q3乐居广告(元)</th>
                    <th v-show="showData.ljad2017Q4">2017Q4乐居广告(元)</th>
                    <th v-show="showData.jdds2017Q1">2017Q1焦点电商(元)</th>
                    <th v-show="showData.jdds2017Q2">2017Q2焦点电商(元)</th>
                    <th v-show="showData.jdds2017Q3">2017Q3焦点电商(元)</th>
                    <th v-show="showData.jdds2017Q4">2017Q4焦点电商(元)</th>
                    <th v-show="showData.sfds2017Q1">2017Q1搜房电商(元)</th>
                    <th v-show="showData.sfds2017Q2">2017Q2搜房电商(元)</th>
                    <th v-show="showData.sfds2017Q3">2017Q3搜房电商(元)</th>
                    <th v-show="showData.sfds2017Q4">2017Q4搜房电商(元)</th>
                    <th v-show="showData.lfds2017Q1">2017Q1乐居电商(元)</th>
                    <th v-show="showData.lfds2017Q2">2017Q2乐居电商(元)</th>
                    <th v-show="showData.lfds2017Q3">2017Q3乐居电商(元)</th>
                    <th v-show="showData.lfds2017Q4">2017Q4乐居电商(元)</th>
                </tr>
                <tr v-for="item in tableData">
                    <td>{{ item[list[0]] }}</td>
                    <td>{{ item[list[1]] }}</td>
                    <td>{{ item[list[2]] }}</td>
                    <td>{{ item[list[3]] }}</td>
                    <td>{{ item[list[4]] }}</td>
                    <td>{{ item[list[5]] }}</td>
                    <td>{{ item[list[6]] }}</td>
                    <td>{{ item[list[7]] }}</td>
                    <td>{{ item[list[8]] }}</td>
                    <td v-show="showData.time">{{ item[list[9]] }}</td>
                    <td v-show="showData.state">{{ item[list[10]] }}</td>
                    <td v-show="showData.zdmj">{{ item[list[11]] }}</td>
                    <td v-show="showData.jzmj">{{ item[list[12]] }}</td>
                    <td v-show="showData.zts">{{ item[list[13]] }}</td>
                    <td v-show="showData.xsmj2016">{{ item[list[14]] }}</td>
                    <td v-show="showData.xsts2016">{{ item[list[15]] }}</td>
                    <td v-show="showData.xse2016">{{ item[list[16]] }}</td>
                    <td v-show="showData.jj2016">{{ item[list[17]] }}</td>
                    <td v-show="showData.xsmj2017">{{ item[list[18]] }}</td>
                    <td v-show="showData.xsts2017">{{ item[list[19]] }}</td>
                    <td v-show="showData.xse2017">{{ item[list[20]] }}</td>
                    <td v-show="showData.jj2017">{{ item[list[21]] }}</td>
                    <td v-show="showData.jdgg2016">{{ item[list[22]] }}</td>
                    <td v-show="showData.tf2017">{{ item[list[23]] }}</td>
                    <td v-show="showData.jdad2017Q1">{{ item[list[24]] }}</td>
                    <td v-show="showData.jdad2017Q2">{{ item[list[25]] }}</td>
                    <td v-show="showData.jdad2017Q3">{{ item[list[26]] }}</td>
                    <td v-show="showData.jdad2017Q4">{{ item[list[27]] }}</td>
                    <td v-show="showData.sfad2017Q1">{{ item[list[28]] }}</td>
                    <td v-show="showData.sfad2017Q2">{{ item[list[29]] }}</td>
                    <td v-show="showData.sfad2017Q3">{{ item[list[30]] }}</td>
                    <td v-show="showData.sfad2017Q4">{{ item[list[31]] }}</td>
                    <td v-show="showData.ljad2017Q1">{{ item[list[32]] }}</td>
                    <td v-show="showData.ljad2017Q2">{{ item[list[33]] }}</td>
                    <td v-show="showData.ljad2017Q3">{{ item[list[34]] }}</td>
                    <td v-show="showData.ljad2017Q4">{{ item[list[35]] }}</td>
                    <td v-show="showData.jdds2017Q1">{{ item[list[36]] }}</td>
                    <td v-show="showData.jdds2017Q2">{{ item[list[37]] }}</td>
                    <td v-show="showData.jdds2017Q3">{{ item[list[38]] }}</td>
                    <td v-show="showData.jdds2017Q4">{{ item[list[39]] }}</td>
                    <td v-show="showData.sfds2017Q1">{{ item[list[40]] }}</td>
                    <td v-show="showData.sfds2017Q2">{{ item[list[41]] }}</td>
                    <td v-show="showData.sfds2017Q3">{{ item[list[42]] }}</td>
                    <td v-show="showData.sfds2017Q4">{{ item[list[43]] }}</td>
                    <td v-show="showData.lfds2017Q1">{{ item[list[44]] }}</td>
                    <td v-show="showData.lfds2017Q2">{{ item[list[45]] }}</td>
                    <td v-show="showData.lfds2017Q3">{{ item[list[46]] }}</td>
                    <td v-show="showData.lfds2017Q4">{{ item[list[47]] }}</td>
                </tr>
            </table>
        </div>
        <div v-show="this.tableData.length == 0" class="no-data">
            暂无数据
        </div>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import $$loupan from "../../script/data/model/cityLoupan";
export default {
    name: "CityLoupanTable",
    data () {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            projectNum: 5,
            sellNum: 8,
            adNum: 26,
            showData: {},
            list: []
        };
    },
    methods: {
        handleCurrentChange (val) {
            this.currentPage = val;
            $$loupan.getLoupanDataByPage(val);
        },
        isProjectData: function (val) {
            const arr = ["time", "state", "zdmj", "jzmj", "zts"];
            if (arr.indexOf(val) != -1) {
                return true;
            } else {
                return false;
            }
        },
        isSellData: function (val) {
            const arr = ["xsmj2016", "xsts2016", "xse2016", "jj2016", "xsmj2017", "xsts2017", "xse2017", "jj2017"];
            if (arr.indexOf(val) != -1) {
                return true;
            } else {
                return false;
            }
        },
        isAdData: function (val) {
            const arr = ["jdgg2016", "tf2017", "jdad2017Q1", "jdad2017Q2", "jdad2017Q3", "jdad2017Q4", "sfad2017Q1", "sfad2017Q2", "sfad2017Q3", "sfad2017Q4", "ljad2017Q1", "ljad2017Q2", "ljad2017Q3", "ljad2017Q4", "jdds2017Q1", "jdds2017Q2", "jdds2017Q3", "jdds2017Q4", "sfds2017Q1", "sfds2017Q2", "sfds2017Q3", "sfds2017Q4", "lfds2017Q1", "lfds2017Q2", "lfds2017Q3", "lfds2017Q4"];
            if (arr.indexOf(val) != -1) {
                return true;
            } else {
                return false;
            }
        },
        showAllData: function () {
            const _this = this;
            const showList = ["time", "state", "zdmj", "jzmj", "zts", "xsmj2016", "xsts2016", "xse2016", "jj2016", "xsmj2017", "xsts2017", "xse2017", "jj2017",
                "jdgg2016", "tf2017", "jdad2017Q1", "jdad2017Q2", "jdad2017Q3", "jdad2017Q4", "sfad2017Q1", "sfad2017Q2", "sfad2017Q3", "sfad2017Q4", "ljad2017Q1", "ljad2017Q2", "ljad2017Q3", "ljad2017Q4", "jdds2017Q1", "jdds2017Q2", "jdds2017Q3", "jdds2017Q4", "sfds2017Q1", "sfds2017Q2", "sfds2017Q3", "sfds2017Q4", "lfds2017Q1", "lfds2017Q2", "lfds2017Q3", "lfds2017Q4"];
            showList.forEach(function (item) {
                _this.showData[item] = true;
            });
        }
    },
    beforeMount: function () {
        const _this = this;
        _this.showAllData();
        $$loupan.on("getProvinceList", function (data) {
            if (parseInt(data.code) == 200) {
                _this.list = data.data.list;
            } else {
                _this.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$loupan.on("getLoupanDataList", function (data) {
            if (data.code == 200) {
                _this.tableData = data.data.adEstateIndicesList;
                _this.total = data.data.total;
            } else {
                _this.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$loupan.on("changeShowData", function (data) {
            let projectNum = 0, sellNum = 0, adNum = 0;
            for (const i in _this.showData) {
                if (data.indexOf(i) != -1) {
                    _this.showData[i] = true;
                    if (_this.isProjectData(i)) {
                        projectNum++;
                    } else if (_this.isSellData(i)) {
                        sellNum++;
                    } else if (_this.isAdData(i)) {
                        adNum++;
                    }
                } else {
                    _this.showData[i] = false;
                }
            }
            _this.projectNum = projectNum;
            _this.sellNum = sellNum;
            _this.adNum = adNum;
        });
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

.el-table__header-wrapper {
    overflow-x: auto;
}

.loupan-table {
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border: 1px solid #e0e6ed;
    font-size: 14px;
    color: #1f2d3d;
    border-collapse: collapse;
}

.loupan-table tr:hover {
    background-color: #eff2f7;
}

.loupan-table th {
    overflow: hidden;
    background-color: #eff2f7;
    text-align: center;
    padding: 10px 0;
    border: 1px solid #e0e6ed;
    min-width: 100px;
}

.loupan-table td {
    overflow: hidden;
    text-align: center;
    border: 1px solid #e0e6ed;
    padding: 10px 0;
    min-width: 100px;
}

.no-data {
    border: 1px solid #e0e6ed;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
}
</style>
