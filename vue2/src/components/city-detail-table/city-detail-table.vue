<template>
<div>
    <el-table :data="tableData" border selection-mode="multiple">
        <el-table-column property="time" label="日期" width="200" align="center"></el-table-column>
        <el-table-column property="average_pv" label="日均pv" sortable width="130" align="center" min-width="130"></el-table-column>
        <el-table-column property="average_uv" label="日均uv" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="registered_users" label="注册用户" min-width="130" sortable align="center"></el-table-column>
        <el-table-column property="logged_in_users" label="登录用户" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="all_ads" label="广告位数量" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="sold_ads" label="售出量" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="sold_rate" label="售出率" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="pre_pay" label="充值" sortable min-width="130" align="center"></el-table-column>
        <el-table-column property="reward" label="收入" sortable min-width="130" align="center"></el-table-column>
    </el-table>
    <div class="pagination" v-show="this.tableData.length>0">
        <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>
<style scoped>
.pagination {
    margin-top: 20px;
    text-align: right;
}
</style>
<script>
import $city from "../../script/data/model/city";
export default {
    data () {
        return {
            currentPage: 1,
            pageSize: 10,
            self_name: "city-detail-table",
            tableData: [],
            total: 0
        };
    },
    methods: {
        handleCurrentChange (val) {
            this.currentPage = val;
            $city.getCityDetailByPage(val);
        }
    },
    activated: function () {
        const _this = this;
        $city.on("getCityDetailStaistics", function (data) {
            _this.tableData = data.dataArray;
            _this.total = data.data.totalNum;
            _this.currentPage = data.currentPage;
        });
    },
    beforeMount: function () {
        const _this = this;
        $city.on("getCityDetailStaistics", function (data) {
            if (data.errorCode == 0) {
                _this.tableData = data.dataArray;
                _this.total = data.allSize;
                _this.currentPage = data.currentPage;
            } else if (data.errorCode == 1) {
                _this.tableData = [];
            }
        });
    }
};
</script>
