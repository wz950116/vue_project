<template>
    <div>
        <el-breadcrumb separator=">>" class="detailHeader">
          <el-breadcrumb-item :to="{ path: '/customer_agent' }">代理商消耗</el-breadcrumb-item>
          <el-breadcrumb-item>{{detailForm.agentName}}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form class="expend-header" ref="form" :model="detailForm" label-width="70px">
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期范围">
                    <el-date-picker 
                        v-model="detailForm.dateRange" 
                        type="daterange" 
                        placeholder="选择日期范围" 
                        style="width:220px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.native="download">导出</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-table class="expend-table" :data="tableData" border style="width:100%;" v-loading.body="loading">
            <el-table-column prop="date" label="日期" width="160"></el-table-column>
            <el-table-column prop="guest" label="广告主名称" width="180"></el-table-column>
            <el-table-column prop="order" label="广告单元" width="180"></el-table-column>
            <el-table-column prop="purchasingWay" label="采购途径" width="180"></el-table-column>
            <el-table-column prop="resourceType" label="资源属性" width="180"></el-table-column>
            <el-table-column prop="consumption" label="消耗金额" width="180"></el-table-column>
            <el-table-column prop="cashConsumption" label="消耗现金金额" width="180"></el-table-column>
            <el-table-column prop="grantConsumption" label="消耗赠款金额" width="180"></el-table-column>
            <el-table-column prop="creditConsumption" label="消耗信用金额" width="180"></el-table-column>
        </el-table>
        <el-pagination
            @size-change.native="handleSizeChange"
            @current-change.native="handleCurrentChange"
            :current-page="detailForm.pageIndex"
            :page-size="detailForm.pageSize*1"
            layout="total, prev, pager, next"
            :total="totalCount"
            class="pagination pageIndex">
        </el-pagination>
        <el-select class="pagination pageSize" v-model="detailForm.pageSize" placeholder="请选择">
            <el-option label="10条/每页" value="10"></el-option>
            <el-option label="20条/每页" value="20"></el-option>
            <el-option label="30条/每页" value="30"></el-option>
            <el-option label="40条/每页" value="40"></el-option>
        </el-select>
    </div>
</template>
<style scoped>
.detailHeader {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}

.pagination {
    margin: 20px 0;
    float: right;
}

.pagination.pageSize {
    width: 120px;
}
</style>

<script>
import $$customer from '../../script/data/model/customer';
export default {
    data () {
        return {
            detailForm: {
                dateRange: [],
                pageIndex: 1,
                pageSize: 10,
                agentName: "",
                agentId: ""
            },
            tableData: [],
            totalCount: 0
        };
    },
    watch: {
        '$route': function () {
            const query = this.$route.query;
            if (query.agentId) {
                this.detailForm.agentId = query.agentId;
            }
            if (query.agentName) {
              this.detailForm.agentName = decodeURI(query.agentName);  
            }
        },
        detailForm: {
            deep: true,
            handler (value) {
                this.searchDetail();
            }
        }
    },
    methods: {
        formatDate (date) {
            date = new Date(date);
            const year = date.getFullYear();
            const month = date.getMonth().toString().length == 1 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            const day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate();
            return year + "-" + month + "-" + day;
        },
        download () {
            // 参数与筛选相同，返回一个链接然后打开
            const that = this;
            const params = that.getDetailParams(true);
            $$customer.searchDetail(params, data => {
                if (data.code != 0) {
                    that.$message({
                        showClose: true,
                        message: data.msg,
                        type: 'error'
                    });
                    return;
                } else {
                    window.open(data.data);
                }
            })
        },
        handleSizeChange (val) {
            this.detailForm.pageSize = val;
        },
        handleCurrentChange (val) {
            this.detailForm.pageIndex = val;
        },
        searchDetail () {
            const that = this;
            const params = that.getDetailParams();

            that.tableData = [];

            // 请求符合条件的代理商消耗明细
            $$customer.searchDetail(params, data => {
                if(data.code !== 0) {
                    that.$message({
                        showClose: true,
                        message: data.msg,
                        type: 'error'
                    });
                    return;
                } else {
                    let newData = data.data.mapList;
                    newData.forEach(item => {
                        item.grantConsumption = item.grantConsumption == 'null' ? '暂无' : item.grantConsumption;
                        item.creditConsumption = item.creditConsumption == 'null' ? '暂无' : item.creditConsumption;
                    });
                    that.tableData = newData;
                    that.totalCount = data.data.totalCount;
                }
            })
        },
        getDetailParams (download) {
            const that = this;
            const params = {
                agentId: that.detailForm.agentId,
                startDate: that.formatDate(that.detailForm.dateRange[0]),
                endDate: that.formatDate(that.detailForm.dateRange[1]),
                pageIndex: that.detailForm.pageIndex + '',
                pageSize: that.detailForm.pageSize + ''
            };
            if (download) {
                params.export = 'true';
            }
            return params;
        }
    },
    beforeMount () {
        const query = this.$route.query;
        this.detailForm.agentId = query.agentId;
        this.detailForm.agentName = decodeURI(query.agentName);
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        this.detailForm.dateRange.push(startDate, endDate);
    }
};
</script>