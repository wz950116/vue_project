<template>
    <div>
        <el-dialog title="编辑广告位价格" v-model="edtidAdPriceDialog" label-width="80px" size="tiny" @close="closeEditPrice">
            <el-form ref="editForm" :model="formAdPrice" :rules="rules">
                <el-form-item prop="normalPrice" label="普通价格">
                    <el-input class="edit-price-input" type="text" placeholder="请输入普通价格"
                              v-model="formAdPrice.normalPrice"></el-input>
                </el-form-item>
                <el-form-item prop="weekPrice" label="周末价格">
                    <el-input class="edit-price-input" type="text" placeholder="请输入周末价格"
                              v-model="formAdPrice.weekPrice"></el-input>
                </el-form-item>
                <el-form-item prop="priceDateRange" label="生效时间">
                    <el-date-picker class="edit-price-input" v-model="formAdPrice.priceDateRange" type="daterange"
                                    placeholder="选择日期范围" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div v-show="editTestShow">测试成功,请确认</div>
            <div v-show="editTestErrorShow" class="error-info">错误：{{editTestError}}</div>
            <div v-show="testResultData.length > 0">
                <div class="tipInfo">
                    <span>空ID：{{testResultCount.succ}} 个</span><span>成功：{{testResultCount.succ}} 个</span><span>失败：{{testResultCount.fail}} 个</span>
                </div>
                <el-table :data="testResultData">
                    <el-table-column prop="resourceId" label="广告位ID"></el-table-column>
                    <el-table-column prop="name" label="广告位名称"></el-table-column>
                    <el-table-column prop="city" label="所属城市"></el-table-column>
                    <el-table-column prop="date" label="生效日期"></el-table-column>
                    <el-table-column prop="price" label="价格"></el-table-column>
                    <el-table-column prop="sheet" label="属性"></el-table-column>
                    <el-table-column prop="status" label="状态"></el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                </el-table>
            </div>
            <div slot="footer">
                <el-button @click.native="closeEditPrice">取 消</el-button>
                <el-button type="primary" v-show="savePriceTestFailed" @click.native="savePriceTest();">测 试</el-button>
                <el-button type="primary" v-show="savePriceTestSuccess" @click.native="savePrice();">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
    .edit-price-input {
    width: 220px;
    display: inline-block;
}

.error-info {
    color: red;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";

    export default{
        name: "AdDialogEditPrice",
        data () {
            return {
                edtidAdPriceDialog: false,
                formAdPrice: {
                    normalPrice: "",
                    weekPrice: "",
                    priceDateRange: "",
                    resourceIds: []
                },
                savePriceTestSuccess: false,
                savePriceTestFailed: true,
                editTestShow: false,
                editTestError: "",
                editTestErrorShow: false,
                rules: {
                    normalPrice: [{
                        type: "string",
                        required: true,
                        message: "请输入价格",
                        trigger: "blur"
                    }, {
                        type: "string",
                        required: true,
                        message: "请输入价格",
                        trigger: "change"
                    }],
                    weekPrice: [{
                        type: "string",
                        required: false,
                        message: "请输入价格",
                        trigger: "blur"
                    }, {
                        type: "string",
                        required: false,
                        message: "请输入价格",
                        trigger: "change"
                    }],
                    priceDateRange: [{
                        type: "array",
                        required: true,
                        message: "请选择时间",
                        trigger: "blur"
                    }, {
                        type: "array",
                        required: true,
                        message: "请选择时间",
                        trigger: "change"
                    }]
                },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 24 * 3600 * 1000;
                    }
                },
                testResultCount: {
                    succ: 1,
                    fail: 1,
                    empty: 1
                },
                testResultData: []
            };
        },
        methods: {
            closeEditPrice: function () {
                this.edtidAdPriceDialog = false;
                this.formAdPrice = {
                    normalPrice: "",
                    weekPrice: "",
                    priceDateRange: "",
                    resourceIds: []
                };
                this.savePriceTestSuccess = false;
                this.savePriceTestFailed = true;
                this.editTestShow = false;
                this.editTestErrorShow = false;
            },
            savePriceTest () {
                const _this = this;
                // _this.savePriceTestFailed = false;
                // _this.savePriceTestSuccess = true;
                const dateRange = this.formAdPrice.priceDateRange;
                if (!dateRange[0] && !dateRange[1]) {
                    return;
                }
                const $params = {
                    "generalPrice": parseInt(this.formAdPrice.normalPrice),
                    "weekendPrice": parseInt(this.formAdPrice.weekPrice),
                    "resourceIds": this.selectRow,
                    "beginDate": dateRange[0].getTime(),
                    "endDate": dateRange[1].getTime()
                };

                this.$refs.editForm.validate(function (valid) {
                    if (valid) {
                        $$ad.editPriceTest($params, function (data) {
                            if (data.code === 0 && data.data.list.length === 0) {
                                _this.savePriceTestSuccess = true;
                                _this.savePriceTestFailed = false;
                                _this.editTestShow = true;
                            } else if (data.code === 0 && data.data.list.length > 0) {
                                // show table
                                _this.testResultData = data.data.list;
                                _this.testResultCount["succ"] = data.data.okNum;
                                _this.testResultCount["fail"] = data.data.noNum;
                                _this.testResultCount["empty"] = data.data.emptyNum;
                                _this.savePriceTestSuccess = true;
                                _this.savePriceTestFailed = false;
                            } else if (data.code === 1) {
                                _this.editTestErrorShow = true;
                                _this.editTestError = data.msg;
                            }
                        });
                    }
                });
            },
            savePrice () {
                const _this = this;
                if (this.formAdPrice.priceDateRange === "") {
                    return;
                }
                const that = this;
                const $params = {
                    "beginDate": "",
                    "endDate": "",
                    "generalPrice": parseInt(this.formAdPrice.normalPrice),
                    "weekendPrice": parseInt(this.formAdPrice.weekPrice),
                    "resourceIds": this.selectRow
                };
                const dateRange = this.formAdPrice.priceDateRange;
                $params.beginDate = dateRange[0].getTime();
                $params.endDate = dateRange[1].getTime();
                $$ad.editPrice($params, function (data) {
                    if (data.code === 0) {
                        that.$notify({
                            title: "编辑价格成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        _this.formAdPrice = {
                            normalPrice: "",
                            weekPrice: "",
                            priceDateRange: "",
                            resourceIds: []
                        };
                        $$ad.actionSuccess();
                    } else {
                        that.$message({
                            type: "error",
                            message: "操作失败"
                        });
                    }
                    that.editTestShow = false;
                    that.edtidAdPriceDialog = false;
                    that.selectRow = [];
                    $$model.clearRow();
                });
            }
        },
        beforeMount: function () {
            const _this = this;
            $$model.on("showAdDialog", function (params) {
                if (params.type === "editPrice") {
                    _this.selectRow = params.selectRow;
                    if (params.selectRow.length === 0) {
                        _this.$message.error("请选择行！");
                        return false;
                    } else {
                        _this.testResultData = [];
                        _this.edtidAdPriceDialog = true;
                    }
                }
            });
        }
    };
</script>
