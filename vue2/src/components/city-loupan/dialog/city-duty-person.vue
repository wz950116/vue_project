<template>
    <div class="city-duty-person">
        <el-dialog title="设定城市负责人" v-model="dialogVisble" size="tiny">
            <el-form v-loading="loading" element-loading-text="请稍后" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="85px">
                <el-form-item label="城市">
                    <span>{{cityName}}</span>
                    <!-- <el-button :disabled="true" type="text">{{cityName}}</el-button> -->
                </el-form-item>
                <el-form-item label="运营负责" prop="operatorName">
                    <el-input size="small" v-model="ruleForm.operatorName" placeholder="请输入运营负责人"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="operatorEmali">
                    <el-input size="small" v-model="ruleForm.operatorEmali" placeholder="请输入运营负责人邮箱"></el-input>
                </el-form-item>
                <el-form-item label="销售负责" prop="salerName">
                    <el-input size="small" v-model="ruleForm.salerName" placeholder="请输入销售负责人"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="salerEmali">
                    <el-input size="small" v-model="ruleForm.salerEmali" placeholder="请输入销售负责人邮箱"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-gr">
                <el-button @click="dialogVisble = false">取消</el-button>
                <el-button type="primary" @click="setCityPerson">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import $$model_cityLoupan from '../model/city-loupan.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';
export default {
    name: 'city-duty-person',
    props: {
        cityId: Number,
        cityName: String
    },
    data() {
        return {
            loading: false,
            dialogVisble: false,
            ruleForm: {
                operatorName: '',
                operatorEmali: '',
                salerName: '',
                salerEmali: ''
            },
            rules: {
                operatorName: [{ required: true, message: '请输入运营负责人', trigger: 'blur' }],
                operatorEmali: [{ required: true, message: '请输入运营负责人邮箱', trigger: 'blur' }],
                salerName: [{ required: true, message: '请输入运营负责人', trigger: 'blur' }],
                salerEmali: [{ required: true, message: '请输入运营负责人邮箱', trigger: 'blur' }]
            }
        }
    },
    methods: {
        setCityPerson() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let params = _.extend({cityId: this.cityId}, this.ruleForm);
                    this.loading = true;
                    $$model_cityLoupan.setCityPrincipal(params, res => {
                        this.loading = false;
                        if (res.code === 200) {
                            location.reload();
                        } else {
                            this.$message.error(res.msg || 'server error');
                        }
                    });
                } else {
                    return false;
                }
            });
        }
    },
    watch: {
        dialogVisble(val) {
            if (val === true) {
                this.loading = true;
                $$model_cityLoupan.getCityPrincipal({cityId: this.cityId}, res => {
                    this.loading = false;
                    if (res.code === 200) {
                        this.ruleForm = _.extend(this.ruleForm, res.data);
                    } else {
                        this.$message.error(res.msg || 'server error');
                    }
                });
            }
        }
    },
    beforeMount() {
        let params = {
            cityId: this.cityId,
            name: this.bane
        };
        // $$model_cityLoupan.getBusinesseLeaderList({}, res => {
            
        // });
    },
    mounted() {}
}
</script>
<style scoped>
    .btn-gr {
        text-align: right;
    }
</style>