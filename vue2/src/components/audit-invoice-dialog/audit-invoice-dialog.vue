<template>
    <div>
        <el-dialog title="联系人信息" v-model="dialogVisible" size="tiny">
            <el-form v-model="info">
                <el-form-item label="联系人姓名">
                    <el-input v-model="info.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="info.tel" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人地址">
                    <el-input v-model="info.address" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="快递公司">
                    <el-input v-model="info.expressCompany" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="info.expressNumber" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style>

</style>
<script>
    import $$invoice from "../../script/data/model/invoice";
    export default{
        data () {
            return {
                self_name: "audit-invoice-dialog",
                dialogVisible: false,
                info: {
                    name: "",
                    tel: "",
                    address: "",
                    expressCompany: "",
                    expressNumber: ""
                }
            };
        },
        beforeMount: function () {
            const _this = this;
            $$invoice.on("showInvoiceDialog", function (data) {
                const params = {
                    invoiceId: data.invoiceId
                };
                $$invoice.getInvoiceContact(params, function (e) {
                    if (e.errorCode === 0) {
                        _this.dialogVisible = true;
                        _this.info.name = e.data.contact_name;
                        _this.info.tel = e.data.contact_phone;
                        _this.info.address = e.data.contact_address;
                        _this.info.expressCompany = e.data.expressCompany ? e.data.expressCompany : "";
                        _this.info.expressNumber = e.data.expressNumber ? e.data.expressNumber : "";
                    } else if (e.errorCode === 403) {
                        _this.$message({
                            type: "error",
                            message: "没有权限!"
                        });
                    }
                });
            });
        }
    };
</script>
