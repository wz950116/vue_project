<template>
    <div>
        <el-table :data="tableData" border style="width:100%;" align="center">
            <el-table-column property="date" label="时间" width="" align="center"></el-table-column>
            <el-table-column property="averagePV" label="日均pv" width="" align="center"></el-table-column>
            <el-table-column property="averageUV" label="日均uv" width="" align="center"></el-table-column>
            <el-table-column property="click" label="点击量" width="" align="center"></el-table-column>
            <el-table-column property="price" label="价格" width="" align="center"></el-table-column>
            <el-table-column property="adOrder" label="广告状态" width="" align="center"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
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
    import $$ad from "../../script/data/model/ad";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "ad-detail-table",
                tableData: []
            };
        },
        methods: {
            handleCurrentChange (val) {
                $$ad.getAdDetailInfoByPage(val);
            }
        },
        beforeMount: function () {
            const _this = this;
            // 数据加载
            $$ad.on("getAdDetail", function (data) {
                if (data.code !== 0) {
                    return;
                }
                _this.tableData = data.data.adData;
                _this.total = data.data.totalNum;
                _this.currentPage = data.currentPage;
            });
        }
    };
</script>
