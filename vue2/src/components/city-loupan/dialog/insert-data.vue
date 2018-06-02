<template>
    <div class="insert-data">
        <el-dialog :title="title" v-model="dialogVisble" size="tiny">
            <div class="insert-data-wrapper" v-loading="loading" element-loading-text="请稍等">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="65px">
                    <el-form-item label="姓名:" prop="name">
                        <el-input size="small" v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="公司:" prop="companyName">
                        <el-input size="small" v-model="ruleForm.companyName" placeholder="请输入公司名称"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="电话:" prop="phone">
                        <el-input size="small" v-model="ruleForm.phone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="邮箱:" prop="email">
                        <el-input size="small" v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="备注:" prop="desc">
                        <el-input size="small" v-model="ruleForm.desc" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-gr">
                    <el-button @click="dialogVisble = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :title="title" v-model="simpleDialog" size="tiny">
            <div class="insert-data-simple-dialog" v-loading="simpleLoading" element-loading-text="请稍等">
                <el-form :model="simpleForm" :rules="simpleRules" ref="simpleForm" label-width="100px">
                    <el-form-item :label="title + ':'" prop="name">
                        <el-input size="small" v-model="simpleForm.name" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-form>
                <div class="btn-gr">
                    <el-button @click="simpleDialog = false">取消</el-button>
                    <el-button type="primary" @click="simpleSave">确定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import $$model_cityLoupan from '../model/city-loupan.js';
import _ from '../../../lib/underscore.v1.4.4.min.js';
export default {
    name: 'insert-data',
    props: {
        cityId: Number
    },
    data() {
        return {
            loading: false,
            title: '数据',
            dialogVisble: false,
            type: 'simple', // simple代表当前字段只用添加
            edit: false, // 是否为编辑模式
            ruleForm: {
                id: '',
                cityId: '',
                estateId: '',
                name: '',
                companyName: '',
                phone: '',
                email: '',
                desc: '',
                type: ''
            },
            rules: {
                name: [{ required: true, message: '不能为空' }]
                // companyName: [{ required: true, message: '不能为空' }],
                // phone: [{ required: true, message: '不能为空' }],
                // email: [{ required: true, message: '不能为空' }],
                // desc: [{ required: true, message: '不能为空' }]
            },
            // 简单弹框
            simpleLoading: false,
            simpleDialog: false,
            simpleForm: {
                name: '',
                estateId: '',
                cityId: '',
                key: ''
            },
            simpleRules: {
                name: [{ required: true, message: '不能为空' }]
            }
        }
    },
    methods: {
       save() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (this.edit) {
                        $$model_cityLoupan.updatePositionInfo(this.ruleForm, res => {
                            this.loading = false;
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    } else {
                        let params = _.extend({}, this.ruleForm);
                        delete params.id;
                        $$model_cityLoupan.setPositionInfo(params, res => {
                            this.loading = false;
                            if (res.code === 200) {
                                location.reload();
                            } else {
                                this.$message.error(res.msg || 'server error');
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
       },
       simpleSave() {
            this.$refs.simpleForm.validate(valid => {
                if (valid) {
                    let params = _.extend({}, this.simpleForm);
                    params[params.key] = params.name;
                    delete params.name;delete params.key;
                    this.simpleLoading = true;
                    $$model_cityLoupan.insertUpdateData(params, res => {
                        this.simpleLoading = false;
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
            let ruleForm = this.ruleForm;
            if (val === true) {
                if (this.edit) {
                    // 编辑模式

                } else {
                    // 新增模式
                    // 初始化数据
                    for (let key in ruleForm) {
                        if (key !== 'estateId' && key !== 'type') {
                            ruleForm[key] = '';
                        }
                    }
                }
                ruleForm.cityId = this.cityId;
            }
        },
        simpleDialog(val) {
            // 简单字段
            let simpleForm = this.simpleForm;
            if (val === true) {
                if (this.edit) {
                    // 编辑模式
                } else {
                    // 新增模式
                    // 初始化数据
                    simpleForm.name = '';
                }
                simpleForm.cityId = this.cityId;
            }
        }
    }
}
</script>
<style scoped>
    .btn-gr {
        float: right;
        padding: 0 0 20px 0;
    }
</style>