<template>
    <div class="add-loupan">
        <el-dialog title="新增楼盘" v-model="dialogVisble" size="tiny">
            <el-form v-loading="loading" element-loading-text="操作中" ref="form" :model="ruleForm" :rules="rules" label-width="80px">
                <el-form-item label="楼盘ID:" prop="estateId">
                    <el-input size="small" v-model="ruleForm.estateId"></el-input>
                </el-form-item>
                <div class="btn-gr">
                    <el-button @click="dialogVisble = false">取消</el-button>
                    <el-button type="primary" @click="sureInsert">确认</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import $$model_cityLoupan from '../model/city-loupan.js';

export default {
    name: 'add-loupan',
    props: {
        cityId: Number
    },
    data() {
        return {
            loading: false,
            dialogVisble: false,
            ruleForm: {
                estateId: ''
            },
            rules: {
                estateId: [{ required: true, message: '请输入楼盘id', trigger: 'blur' }]
            }
        }
    },
    methods: {
        sureInsert() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.loading = true;
                    $$model_cityLoupan.getEstateInfoById(this.ruleForm, res => {
                        this.loading = false;
                        if (res.code === 200) {
                            this.$confirm('是否添加'+ res.data.name +'?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.loading = true;
                                $$model_cityLoupan.insertLoupan({cityId: this.cityId, estateId: this.ruleForm.estateId}, res => {
                                    this.loading = false;
                                    if (res.code === 200) {
                                        window.location.reload();
                                    } else {
                                        this.$message.error(res.msg || 'server error');
                                    }
                                })
                            }).catch(() => {});
                        } else {
                            this.$message.error(res.msg || 'server error');
                        }
                    });
                } else {
                    return false;
                }
            });
            
        }
    }
}
</script>