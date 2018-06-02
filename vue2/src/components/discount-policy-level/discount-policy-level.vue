<template>
<div class="discount-policy-cash mt20">
    <h2 class="discount-policy-cash-h">
        等级折扣
        <el-button type="primary" class="add-btn" @click="add">添加优惠</el-button>
    </h2>
    <el-table :data="tableData" border align="center" style="width: 100%;margin-top: 20px;">
        <el-table-column prop="levelName" label="等级名称" align="center">
        </el-table-column>
        <el-table-column prop="updateStd" label="升级标准" align="center">
        </el-table-column>
        <el-table-column prop="bjStd" label="保级标准" align="center">
        </el-table-column>
        <el-table-column prop="discount" label="充值折扣" align="center">
        </el-table-column>
        <el-table-column inline-template label="操作" align="center">
            <span><el-button type="text" @click="del(row)">删除</el-button></span>
        </el-table-column>
    </el-table>

    <!--dialog-->
    <el-dialog title="添加等级优惠" v-model="dialogFormVisible" size="tiny">
        <el-form :model="discountForm" label-width="60px">
            <el-select v-model="discountForm.level" placeholder="请选择等级">
                <el-option
                  v-for="item in levelList"
                  :label="item.name"
                  :value="item.id">
                </el-option>
            </el-select>
            <el-input v-model="discountForm.promotionLevel" placeholder="输入升级金额" auto-complete="off" class="mt20"></el-input>
            <el-input v-model="discountForm.maintainLevel" placeholder="输入保级金额" auto-complete="off" class="mt20"></el-input>
            <el-input v-model="discountForm.discount" placeholder="输入等级折扣" auto-complete="off" class="mt20"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addLevelDiscount">保 存</el-button>
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
                level: "",
                promotionLevel: "",
                maintainLevel: "",
                discount: ""
            },
            levelList: [],
            delId: ""
        };
    },
    methods: {
        add: function () {
            this.dialogFormVisible = true;
            this.discountForm = {
                level: "",
                promotionLevel: "",
                maintainLevel: "",
                discount: ""
            };
        },
        addLevelDiscount: function () {
            if (this.discountForm.level === "") {
                this.$notify.error({
                    title: "错误",
                    message: "请选择等级",
                    duration: 2000
                });
                return;
            }
            if (this.discountForm.promotionLevel.trim() == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入升级金额",
                    duration: 2000
                });
                return;
            }
            if (isNaN(+this.discountForm.promotionLevel)) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入数值类型",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.promotionLevel) < 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入大于0的数值",
                    duration: 2000
                });
                return;
            }
            if (this.discountForm.maintainLevel.trim() == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入保级金额",
                    duration: 2000
                });
                return;
            }
            if (isNaN(+this.discountForm.maintainLevel)) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入数值类型",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.maintainLevel) < 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入大于0的数值",
                    duration: 2000
                });
                return;
            }
            if (this.discountForm.discount.trim() == "") {
                this.$notify.error({
                    title: "错误",
                    message: "请输入等级折扣",
                    duration: 2000
                });
                return;
            }
            if (isNaN(+this.discountForm.discount)) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入数值类型",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.discount) < 0) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入大于0的数值",
                    duration: 2000
                });
                return;
            }
            if ((+this.discountForm.discount) > 1) {
                this.$notify.error({
                    title: "错误",
                    message: "请输入不大于1的数值",
                    duration: 2000
                });
                return;
            }
            // 优惠提交
            $$discount.addLevelDiscount({
                level: this.discountForm.level,
                updateStd: this.discountForm.promotionLevel,
                bjStd: this.discountForm.maintainLevel,
                discount: this.discountForm.discount
            });
        },
        del: function (item) {
            const that = this;
            this.$confirm("确认删除该条优惠吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                that.delId = item.levelDiscountId;
                $$discount.delLevelDiscount({
                    levelDiscountId: item.levelDiscountId
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
        $$discount.getLevelDiscountList({});
        $$discount.getLevelList({});
        $$discount.on("getLevelDiscountList", function (res) {
            that.tableData = res.data;
        });
        $$discount.on("getLevelList", function (res) {
            that.levelList = res.data;
        });
        $$discount.on("addLevelDiscount", function (data) {
            if (parseInt(data.code) === 0) {
                that.dialogFormVisible = false;
                that.$notify({
                    title: "成功",
                    message: "添加优惠成功",
                    type: "success",
                    duration: 2000
                });
                $$discount.getLevelDiscountList({});
            } else {
                that.$notify.error({
                    title: "错误",
                    message: data.msg,
                    duration: 2000
                });
            }
        });
        $$discount.on("delLevelDiscount", function (data) {
            if (parseInt(data.code) === 0) {
                that.$notify({
                    title: "成功",
                    message: "删除数据成功",
                    type: "success",
                    duration: 2000
                });
                // 更新数据
                that.tableData.forEach(function (item, index) {
                    if (item.levelDiscountId == that.delId) {
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
