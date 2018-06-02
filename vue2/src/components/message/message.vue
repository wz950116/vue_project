<template>
    <div>
        <el-row :gutter="0">
            <el-form ref="form" label-width="60px" :inline="true">
                <el-form-item label="时间区间" label-width="68px">
                    <el-date-picker v-model="time" type="daterange" placeholder="选择日期范围" style="width:220px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="操作者" style="margin-left:10px;">
                    <el-select placeholder="请选择" class="ad-header-item-value" v-model="operator">
                        <el-option v-for="item in operatorList" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="24">
                <el-table :data="tableData" width="100%" border>
                    <el-table-column prop="sendType" label="发送类型" align="center">
                    </el-table-column>
                    <el-table-column prop="receiverList" label="接受者" align="center">
                    </el-table-column>
                    <el-table-column prop="msgType" label="消息类型" align="center">
                    </el-table-column>
                    <el-table-column prop="msgContent" label="通知内容" align="center">
                    </el-table-column>
                    <el-table-column prop="date" label="操作时间" align="center">
                    </el-table-column>
                    <el-table-column prop="operatorName" label="操作人" align="center">
                    </el-table-column>
                </el-table>
                <div class="pagination" v-show="this.tableData.length>0">
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage"
                                   :page-size="pageSize"
                                   layout="total, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}

.el-row:first-child {
    margin-top: 20px;
}

.el-button--primary {
    background-color: #fff;
    border: 1px solid #e0e6ed;
    color: #1f2d3d;
}

.select {
    display: inline-block;
}

.select_label {
    width: 70px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #5e6d82;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
}
</style>

<script>
    import $$msg from "../../script/data/model/message";
    const search = function (vm) {
        if (!vm.time[0] && !vm.time[1]) {
            return;
        }
        const beginDate = new Date(vm.time[0]).getTime();
        let endDate = new Date(vm.time[1]).getTime();
        if (beginDate == endDate) {
            endDate = new Date(beginDate + 86400000).getTime();
        }
        const params = {
            beginDate: beginDate,
            endDate: endDate,
            limit: vm.pageSize,
            pageIndex: vm.currentPage,
            operatorId: vm.operator || null
        };

        window.localStorage.setItem("ad_message_searchContent", JSON.stringify(params.operatorId));

        $$msg.getMsgList(params);
    };
    export default {
        data () {
            return {
                time: [new Date(new Date().getTime() - 86400000), new Date()],
                operator: "",
                operatorList: [],
                tableData: [],
                pageSize: 10,
                currentPage: 1,
                total: 0
            };
        },
        watch: {
            time: function () {
                search(this);
            },
            operator: function () {
                search(this);
            }
        },
        methods: {
            handleCurrentChange: function (val) {
                this.currentPage = val;
                search(this);
            }
        },
        beforeMount: function () {
            const _this = this;
            // 数据加载
            $$msg.getMsgParams(function (res) {
                if (res.code !== 0) {
                    return;
                }
                let tmp = {};
                for (const item in res.data.operator) {
                    tmp.id = item;
                    tmp.name = res.data.operator[item];
                    _this.operatorList.push(tmp);
                    tmp = {};
                }
                const storageObj = JSON.parse(window.localStorage.getItem("ad_message_searchContent"));
                if (storageObj !== null) {
                    _this.operator = storageObj;
                }
            });

            $$msg.on("getMsgList", function (data) {
                if (data.code !== 0) {
                    return;
                }
                _this.tableData = data.data.messageHistory;
                data.data.messageHistory.forEach(function (item) {
                    item.receiverList = item.receiver.join(",");
                });
                _this.total = data.data.totalNum;
            });
        }
    };
</script>
