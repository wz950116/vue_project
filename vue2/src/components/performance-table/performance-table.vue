<template>
    <div>
        <el-table :data="tableData" border style="width:100%;">
            <el-table-column inline-template property="employee_phone" label="手机号" align="center">
                <span>
                    <router-link
                            :to="{ path:'/performance-detail', query: { employee_id: row.employee_id, name: row.name, employee_email: row.employee_email, employee_phone: row.employee_phone}}">
                        <el-button type="text" size="small">{{row.employee_id}}</el-button>
                    </router-link>
                </span>
            </el-table-column>
            <el-table-column property="name" label="姓名" align="center"></el-table-column>
            <el-table-column property="city" label="城市" align="center"></el-table-column>
            <el-table-column property="sales_code" label="推广码" align="center"></el-table-column>
            <el-table-column property="binding_clients" label="绑定客户数量" align="center"></el-table-column>
            <el-table-column property="this_month_prepay" sortable :formatter="formattercharge" label="本月充值" 
            align="center"></el-table-column>
            <el-table-column property="total_prepay" sortable :formatter="formatterallCharge" label="累计充值" 
            align="center"></el-table-column>
        </el-table>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange" 
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
    import $$performance from "../../script/data/model/performance";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "performance-table",
                tableData: []
            };
        },
        methods: {
            handleCurrentChange (val) {
                $$performance.getPerByPage(val);
            },
            formattercharge (row, column) {
                return row.this_month_prepay;
            },
            formatterallCharge (row, column) {
                return row.total_prepay;
            }
        },
        beforeMount: function () {
            const _this = this;

            // 数据加载
            $$performance.on("getPerformance", function (data) {
                if (data.errorCode !== 0) {
                    return;
                }
                _this.tableData = data.dataArray;
                _this.total = data.totalNum;
                if (data.serchFromPage) {
                    _this.currentPage = data.currentPage;
                }
            });
        }
    };
</script>
