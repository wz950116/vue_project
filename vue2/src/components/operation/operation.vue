<template>
    <div style="padding-top:20px;">
        <operation-header ref="logHead"></operation-header>
        <el-table :data="tableData" border style="width:100%;" selection-mode="multiple" align="center">
            <el-table-column prop="time" :formatter="formattertime" label="操作时间"
                             align="center" min-width="150px"></el-table-column>
            <el-table-column prop="targetTypeId" label="操作对象" align="center" min-width="150px"></el-table-column>
            <el-table-column prop="operationActionType" label="操作内容" align="center" min-width="150px"></el-table-column>
            <el-table-column prop="detail" label="操作详情" align="center" inline-template min-width="300px">
                <p v-for="(value,key) in row.detail" style="text-align:left;" :title="key"> {{key}} : {{value}} </p>
            </el-table-column>
        </el-table>
        <div class="pagination"  v-show="this.tableData.length>0">
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
    import $$operation from "../../script/data/model/operation";
    import operationHeader from "../operation-header/operation-header";
    export default{
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "operation",
                tableData: [],
                targetType: ""
            };
        },
        components: {
            operationHeader
        },
        methods: {
            handleCurrentChange (val) {
                $$operation.getOpByPage(val);
            },
            formattertime (row, column) {
                return this._format(new Date(row.time), "yyyy-MM-dd");
            },
            _format (time, format) {
                const date = {
                    "M+": time.getMonth() + 1,
                    "d+": time.getDate(),
                    "h+": time.getHours(),
                    "m+": time.getMinutes(),
                    "s+": time.getSeconds(),
                    "q+": Math.floor((time.getMonth() + 3) / 3),
                    "S+": time.getMilliseconds()
                };
                if (/(y+)/i.test(format)) {
                    format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (const k in date) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                    }
                }
                return format;
            },
            getTargetType (type) {
                const that = this;
                that.targetType.forEach(function (item) {
                    if (item.id == type) {
                        return item.name;
                    }
                });
            }
        },
        beforeMount: function () {
            const that = this;
            $$operation.on("getTargetType", function (data) {
                const targetMap = {};
                data.forEach(function (item) {
                    targetMap[item.id] = item.name;
                });
                that.targetType = targetMap;
            });

            // 数据加载
            $$operation.on("getOperationList", function (data) {
                if (data.code === 0 && data.data.operationHistory.length >= 0) {
                    const tmp = data.data.operationHistory;

                    tmp.forEach(function (item) {
                        item.targetTypeId = that.targetType[item.targetType];
                    });
                    that.tableData = tmp;
                    that.total = data.data.totalNum;
                    that.currentPage = data.currentPage;
                }
            });
        }
    };
</script>
