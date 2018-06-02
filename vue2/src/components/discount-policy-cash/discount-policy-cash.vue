<template>
<div class="discount-policy-cash mt20">
    <h2 class="discount-policy-cash-h">
        返现优惠
        <el-button type="primary" class="add-btn" @click="add">添加优惠</el-button>
    </h2>
    <el-table :data="tableData" border align="center" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="minRecharge" label="最低充值" align="center">
        </el-table-column>
        <el-table-column prop="cashback" label="返现金额" align="center">
        </el-table-column>
        <el-table-column prop="receiveAmount" label="实得金额" align="center">
        </el-table-column>
        <el-table-column prop="discount" label="换算折扣" align="center">
        </el-table-column>
        <el-table-column inline-template label="操作" align="center">
            <span><el-button type="text" @click="del(row)">删除</el-button></span>
        </el-table-column>
    </el-table>

    <!--dialog-->
    <el-dialog title="添加返现优惠" v-model="dialogFormVisible" size="tiny">
        <el-form :model="discountForm" label-width="60px">
            <el-input v-model="discountForm.cash" placeholder="输入最低充值金额" auto-complete="off"></el-input>
            <el-input v-model="discountForm.cashBack" placeholder="输入返现金额" auto-complete="off" class="mt20"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCashDiscount">保 存</el-button>
        </div>
    </el-dialog>
</div>
</template>
<style scoped>
.discount-policy-cash-h {
    position: relative;
}

.mt20 {
    margin-top: 20px;
}

.add-btn {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>
<script>
import $$discount from "../../script/data/model/discount";
export default {
    data () {
        return {
            tableData: [],
            dialogFormVisible: false,
            discountForm: {
                cash: "",
                cashBack: ""
            },
            delId: ""
        };
    },
    methods: {
        add: function () {
            this.dialogFormVisible = true;
            this.discountForm = {
                cash: "",
                cashBack: ""
            };
        },
        addCashDiscount: function (data) {
            if (this.discountForm.cash.trim() == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入最低充值金额\"",
                    duration: 2000
                });
                return;
            }
            if (isNaN(+this.discountForm.cash)) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入数值类型",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.cash) < 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入大于0的数值",
                    duration: 2000
                });
                return;
            }
            if (this.discountForm.cashBack.trim() == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入返现金额",
                    duration: 2000
                });
                return;
            }
            if (isNaN(+this.discountForm.cashBack)) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入数值类型",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.cashBack) < 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入大于0的数值",
                    duration: 2000
                });
                return;
            }
            // 优惠提交
            $$discount.addCashDiscount({
                minRecharge: this.discountForm.cash,
                cashback: this.discountForm.cashBack
            });
        },
        del: function (item) {
            const that = this;
            this.$confirm("确认删除该条优惠吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                that.delId = item.cashbackId;
                $$discount.delCashDiscount({
                    cashbackId: item.cashbackId
                });
            }).catch(function () {
                that.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        }
    },
    beforeMount: function () {
        const that = this;
        $$discount.getCashBackList({});
        $$discount.on("getCashBackList", function (res) {
            that.tableData = res.data;
        });
        $$discount.on("addCashDiscount", function (data) {
            if (parseInt(data.code) === 0) {
                that.dialogFormVisible = false;
                that.$notify({
                    title: "成功",
                    message: "添加优惠成功",
                    type: "success",
                    duration: 2000
                });
                $$discount.getCashBackList({});
            } else {
                that.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$discount.on("delCashDiscount", function (data) {
            if (parseInt(data.code) === 0) {
                that.$notify({
                    title: "成功",
                    message: "删除数据成功",
                    type: "success",
                    duration: 2000
                });
                // 更新数据
                that.tableData.forEach(function (item, index) {
                    if (item.cashbackId == that.delId) {
                        that.tableData.splice(index, 1);
                    }
                });
            } else {
                that.$notify.error({
                    title: "错误",
                    message: "删除数据失败",
                    duration: 2000
                });
            }
            that.delId = -1;
        });
    }
};
</script>
