<template>
    <div>
        <el-dialog title="锁定广告位" v-model="isStopuseDialogShow" label-width="80px" fit="true" @close="cancelStopUse">
            <el-form ref="formStopuse">
                <el-form-item label="锁定时间">
                    <el-date-picker class="edit-price-input" v-model="deletePriceDateRange"
                                    type="daterange"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div v-if="typeof testResultData === 'object' && testResultData.length > 0">
                <div class="tipInfo">
                    <span>成功：{{testResultCount.succ}} 个</span><span>失败：{{testResultCount.fail}} 个</span>
                </div>
                <el-table :data="testResultData">
                    <el-table-column prop="resourceId" label="广告位ID"></el-table-column>
                    <el-table-column prop="name" label="广告位名称"></el-table-column>
                    <el-table-column prop="city" label="所属城市"></el-table-column>
                    <el-table-column prop="date" label="锁定日期"></el-table-column>
                    <el-table-column prop="status" label="锁定结果"></el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                </el-table>
            </div>
            <div class="error-info" v-else-if="typeof testResultData !== 'object'">错误：{{testResultData}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancelStopUse">取 消</el-button>
                <el-button type="primary" v-show="showTest" @click.native="testStopUse();">测 试</el-button>
                <el-button type="primary" v-show="!showTest" @click.native="saveStopUse();">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
.edit-price-input {
    width: 220px;
}

.error-info {
    margin: 20px auto;
    word-break: break-all;
    color: #f00;
}

.tipInfo {
    float: right;
    color: #fdbb4d;
    padding: 0 20px 20px 0;
}

.tipInfo span {
    margin-right: 10px;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";
    export default{
        data () {
            return {
                isStopuseDialogShow: false,
                selectRow: [],
                formStopuse: "",
                deletePriceDateRange: [],
                testResultData: "",
                showTest: true,
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 24 * 3600 * 1000;
                    }
                },
                testResultCount: {
                    succ: "",
                    fail: ""
                }
            };
        },
        beforeMount: function () {
            const _this = this;
            $$model.on("showAdDialog", function (params) {
                if (params.type === "deletePrice") {
                    _this.selectRow = params.selectRow;
                    _this.testResultData = [];
                    _this.showTest = true;
                    if (params.selectRow.length === 0) {
                        _this.$message.error("请选择行！");
                        return false;
                    } else {
                        _this.isStopuseDialogShow = true;
                    }
                }
            });
        },
        methods: {
            cancelStopUse () {
                this.isStopuseDialogShow = false;
                this.deletePriceDateRange = [];
            },
            testStopUse () {
                const _this = this;
                const dateRange = _this.deletePriceDateRange;
                const beginDate = new Date(dateRange[0]).getTime();
                const endDate = new Date(dateRange[1]).getTime();
                if (dateRange.length === 0 || beginDate === 0 || endDate === 0) {
                    this.$notify.error({
                        title: "错误",
                        message: "请选择时间",
                        duration: 2000
                    });
                    return;
                }
                $$ad.deletePriceTest({
                    resourceIds: _this.selectRow,
                    beginDate: beginDate,
                    endDate: endDate
                }, function (data) {
                    if (data.code === 0) {
                        if (data.data.list.length > 0) {
                            _this.testResultData = data.data.list;
                            _this.testResultCount["succ"] = data.data.okNum;
                            _this.testResultCount["fail"] = data.data.noNum;
                        }
                        _this.showTest = false;
                    } else {
                        _this.testResultData = data.data;
                    }
                });
            },
            saveStopUse () {
                const _this = this;
                const dateRange = _this.deletePriceDateRange;
                const beginDate = new Date(dateRange[0]).getTime();
                const endDate = new Date(dateRange[1]).getTime();
                $$ad.deletePrice({
                    resourceIds: _this.selectRow,
                    beginDate: beginDate,
                    endDate: endDate
                }, function (data) {
                    if (data.code === 0) {
                        _this.$notify({
                            title: "锁定成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        $$ad.actionSuccess();
                        _this.showTest = true;
                    } else {
                        _this.$message({
                            type: "error",
                            message: "锁定失败"
                        });
                    }
                    _this.isStopuseDialogShow = false;
                    _this.deletePriceDateRange = [];
                    _this.selectRow = [];
                    $$model.clearRow();
                });
            }
        }
    };
</script>
