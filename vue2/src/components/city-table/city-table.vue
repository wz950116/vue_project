<template>
    <div>
        <el-table :data="tableData" border>
            <el-table-column label="城市" width="110" inline-template align="center">
                <router-link v-bind:to="getCityUrl(row.city)">
                <span class="city">{{row.city}}
                </span>
                </router-link>
            </el-table-column>
            <el-table-column property="average_pv" label="日均pv" align="center"></el-table-column>
            <el-table-column property="average_uv" label="日均uv" align="center"></el-table-column>
            <el-table-column property="registered_users" label="注册用户数" width="110" align="center"></el-table-column>
            <el-table-column property="logged_in_users" label="登录用户数" align="center"></el-table-column>
            <el-table-column property="all_ads" label="广告位数量" align="center"></el-table-column>
            <el-table-column property="sold_ads" label="售出量" align="center"></el-table-column>
            <el-table-column property="sold_rate" label="售出率" width="110" align="center"></el-table-column>
            <el-table-column property="pre_pay" label="充值" align="center"></el-table-column>
            <el-table-column property="reward" label="收入" align="center"></el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}
</style>
<script>
    import $$city from "../../script/data/model/city";
    import _ from "../../lib/underscore.v1.4.4.min";
    export default {
        data () {
            return {
                self_name: "city-table",
                tableData: [],
                cityList: []
            };
        },
        beforeMount: function () {
            const _this = this;
            // city list
            $$city.on("getCityList", function (data) {
                if (data.errorCode !== 0) {
                    return;
                }
                _this.cityList = data.cityList.items;

                $$city.on("getCityStaistics", function (data) {
                    if (data.errorCode !== 0) {
                        return;
                    }
                    _this.tableData = data.dataArray;
                });
            });
        },
        methods: {
            getCityUrl: function (city) {
                const _this = this;
                const cityItem = _.find(_this.cityList, function (item) {
                    return item.name === city;
                });
                return cityItem ? "/city-detail?cityId=" + cityItem.id + "&name=" + cityItem.name : "";
            }
        }
    };
</script>
