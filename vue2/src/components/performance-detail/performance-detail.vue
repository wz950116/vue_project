<template>
    <div>
        <el-breadcrumb separator=">>" class="bread_crumb">
            <el-breadcrumb-item :to="{ path: '/performance' }">{{breadCrumbList.level1}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadCrumbList.level2}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="info">
            <p class='info-tell'>电话：<span>{{ breadCrumbList.tel }}</span></p>
            <p class='info-email'>邮箱：<span>{{ breadCrumbList.email }}</span></p>
        </div>
        <el-table :data="tableData" border style="width:100%;">
            <el-table-column property="demander_id" label="客户ID" align="center"></el-table-column>
            <el-table-column property="company" label="客户名称" align="center"></el-table-column>
            <el-table-column property="city" label="城市" align="center"></el-table-column>
            <el-table-column property="this_month_prepay" sortable :formatter="formattercharge" label="本月充值" align="center"></el-table-column>
            <el-table-column property="total_prepay" sortable :formatter="formatterallCharge" label="累计充值" align="center"></el-table-column>
            <el-table-column property="this_month_consume" sortable :formatter="formatterspell" label="本月消耗" align="center"></el-table-column>
            <el-table-column property="total_consume" sortable :formatter="formatterallSpell" label="累计消耗" align="center"></el-table-column>
        </el-table>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<style scoped>
    .bread_crumb {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.info {
    line-height: 28px;
    font-size: 14px;
}
</style>
<script>
    import $$performance from "../../script/data/model/performance";

    const getQuery = function () {
        const uri = window.location.href, data = {};
        if (uri.split("?").length === 1) {
            return null;
        }
        const query = uri.split("?")[1];
        const paramArr = query.split("&");
        paramArr.forEach(function (item) {
            data[item.split("=")[0]] = item.split("=")[1];
        });
        return data;
    };

    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "performance-detail",
                tableData: [],
                breadCrumbList: {
                    level1: "绩效",
                    level2: "",
                    path: "/performance",
                    email: "",
                    tel: ""
                },
                employeeId: 0
            };
        },
        methods: {
            formatterspell (row, column) {
                return row.this_month_consume;
            },
            formattercharge (row, column) {
                return row.this_month_prepay;
            },
            formatterallSpell (row, column) {
                return row.total_consume;
            },
            formatterallCharge (row, column) {
                return row.total_prepay;
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getPerformanceDetail();
            },
            getPerformanceDetail () {
                const _this = this;
                $$performance.getPerformanceDetail({
                    "eachPageNum": _this.pageSize,
                    "pageIndex": _this.currentPage,
                    "employee_id": _this.employeeId
                });
            }
        },
        activated: function () {
            const employee_id = getQuery() && getQuery().employee_id;
            const name = getQuery() && window.decodeURIComponent(getQuery().name);
            this.employeeId = employee_id;
            this.level2 = name;
            this.breadCrumbList.level2 = this.$route.query.name;
            this.breadCrumbList.email = this.$route.query.employee_email;
            this.breadCrumbList.tel = this.$route.query.employee_phone;
            this.getPerformanceDetail();
        },
        beforeMount: function () {
            // 数据加载
            const _this = this;
            $$performance.on("getPerformanceDetail", function (data) {
                _this.tableData = data.dataArray;
                _this.total = data.totalNum;
            });
        }
    };
</script>
