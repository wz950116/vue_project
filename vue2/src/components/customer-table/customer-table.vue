<template>
    <div>
        <el-table :data="tableData" border style="width:100%;">
            <el-table-column label="客户ID" width="120" inline-template align="center">
                <span class="table-href">
                    <router-link v-bind:to="getUrl(row.id,row.name)">{{row.id}}</router-link>
                </span>
            </el-table-column>
            <el-table-column property="name" label="客户名称" min-width="110" align="center"></el-table-column>
            <el-table-column property="type" label="客户类型" width="110" align="center"></el-table-column>
            <el-table-column property="status" label="客户状态" width="140" align="center"></el-table-column>
            <el-table-column property="level" label="客户等级" width="110" align="center"></el-table-column>
            <el-table-column label="省份及城市" inline-template width="130" align="center"><span>{{row.province}} {{row.city}}</span>
            </el-table-column>
            <el-table-column property="connector" label="联系人" width="110" align="center"></el-table-column>
            <el-table-column property="mobile" label="联系电话" width="130" align="center"></el-table-column>
            <el-table-column property="address" label="联系地址" min-width="150" align="center"></el-table-column>
            <el-table-column property="prePayThisMonth" sortable width="120" :formatter="formattercharge" label="本月充值" align="center"></el-table-column>
            <el-table-column property="prePayAddup" sortable width="120" :formatter="formatterallCharge" label="累计充值" align="center"></el-table-column>
            <el-table-column property="costThisMonth" width="120" sortable :formatter="formatterspell" label="本月消耗" align="center"></el-table-column>
            <el-table-column label="销售" width="120" inline-template align="center">
                <span class="table-href">
                    <router-link :to="row.salesmanUrlsuf">
                        {{row.salesmanName}}
                    </router-link>
                </span>
            </el-table-column>
        </el-table>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
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
    import $$customer from "../../script/data/model/customer";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                self_name: "customer-table",
                tableData: [],
                total: 0
            };
        },
        methods: {
            formatterspell (row, column) {
                return row.costThisMonth;
            },
            formattercharge (row, column) {
                return row.prePayThisMonth;
            },
            formatterallSpell (row, column) {
                return row.costAddup;
            },
            formatterallCharge (row, column) {
                return row.prePayAddup;
            },
            getUrl (id, name) {
                return "customer-detail?id=" + id + "&name=" + name;
            },
            handleCurrentChange (val) {
                $$customer.getCustomerByPage(val);
            },
            salesCheck (row, column) {
                return row.salesmanName;
            }
        },
        beforeMount: function () {
            const that = this;
            // 数据加载
            $$customer.on("getCustomerList", function (data) {
                if (data.errorCode === 0) {
                    that.tableData = data.customerList;
                    that.total = data.totalCount;
                    that.currentPage = data.currentPage;
                }
            });
        }
    };
</script>
