<template>
    <div class="edit-basic-data">
        <el-dialog title="基本数据" v-model="dialogVisble" size="tiny">
            <div class="edit-basic-data-wrapper" v-loading="loading" element-loading-text="请稍等">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item v-if="type === 1" label="运营组" prop="operatingGroupId">
                        <el-select @change="groupChange('operate')" size="small" v-model="ruleForm.operatingGroupId" placeholder="请选择运营小组">
                            <el-option v-for="item in operatingGroupList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="type === 1" label="运营负责人" prop="operatingPrincipalEmail">
                        <el-select size="small" v-model="ruleForm.operatingPrincipalEmail" placeholder="请选择运营负责人">
                            <el-option v-for="item in operatingPrincipalNameOption" :label="item.name" :value="item.email"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="type === 2" size="small" label="销售组" prop="salesGroupId">
                        <el-select @change="groupChange('sales')" v-model="ruleForm.salesGroupId" placeholder="请选择销售组">
                            <el-option v-for="item in salesGroupList" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="type === 2" size="small" label="销售负责人" prop="salesPrincipalEmail">
                        <el-select v-model="ruleForm.salesPrincipalEmail" placeholder="请选择销售负责人">
                            <el-option v-for="item in salesPrincipalNameOption" :label="item.name" :value="item.email"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="btn-gr">
                    <el-button @click="dialogVisble = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import $$model_cityLoupan from '../model/city-loupan.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';
export default {
    name: 'edit-basic-data',
    props: {
        cityId: Number
    },
    data() {
        return {
            type: 1, // 1: 运营 2: 销售
            loading: false,
            dialogVisble: false,
            ruleForm: {
                operatingGroupId: '',
                salesGroupId: '',
                operatingPrincipalEmail: '',
                salesPrincipalEmail: ''
            },
            rules: {
                operatingGroupId: [{ required: true, message: '不能为空' }],
                salesGroupId: [{ required: true, message: '不能为空' }],
                operatingPrincipalEmail: [{ required: true, message: '不能为空' }],
                salesPrincipalEmail: [{ required: true, message: '不能为空' }]
            },
            operatingGroupList: [],
            salesGroupList: [],
            salesPrincipalNameOption: [],
            operatingPrincipalNameOption: []
        }
    },
    methods: {
        save() {
            let estateIdList = _.pluck(this.$parent.tableList.filter(item => item.isSelect === true), 'estateId');
            if (!estateIdList.length) {
                this.$message.error('请先选择楼盘再进行操作');
                return;
            }
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    let params = {cityId: this.cityId, estateIdList: estateIdList, type: this.type};
                    if (this.type === 1) {
                        // 运营
                        params = _.extend(params, {
                            id: this.ruleForm.operatingGroupId,
                            email: this.ruleForm.operatingPrincipalEmail
                        });
                    } else {
                        params = _.extend(params, {
                            id: this.ruleForm.salesGroupId,
                            email: this.ruleForm.salesPrincipalEmail
                        });
                    }

                    $$model_cityLoupan.setBasicData(params, res => {
                        this.loading = false;
                        if (res.code === 200) {
                            window.location.reload();
                        } else {
                            this.$message.error(res.msg || 'server error');
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        groupChange(type) {
            let ruleForm = this.ruleForm;
            if (type === 'operate') {
                // 运营组
                ruleForm.operatingPrincipalEmail = '';
                this.operatingPrincipalNameOption = this.$parent.operatingPrincipalNameOption.filter(item => item.groupId === ruleForm.operatingGroupId);
            } else {
                // 销售组
                ruleForm.salesPrincipalEmail = '';
                this.salesPrincipalNameOption = [];
                this.salesPrincipalNameOption = this.$parent.salesPrincipalNameOption.filter(item => item.groupId === ruleForm.salesGroupId);
            }
        }
    },
    watch: {
        dialogVisble(val) {
            if (val === true) {
                this.operatingGroupList = this.$parent.operatingGroupList;
                this.salesGroupList = this.$parent.salesGroupList;
            }
        }

    }
}
</script>
<style scoped>
.btn-gr {
    text-align: right;
}
</style>