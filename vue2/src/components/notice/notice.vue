<template>
    <div>
        <el-tabs type="card" class="tabs-wrap">
            <el-tab-pane label="批量发送">
                <el-form ref="batchruleForm" :model="batch_form" :rules="rules" label-width="120px"
                         label-position='left' class="noticeForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="选择城市" class="short form-item-width-notice" prop="ctid">
                                <el-select v-model="batch_form.ctid" multiple filterable :disabled='disable.typeMuti' @change="handleSelect">
                                    <el-option-group v-for="group in initDatas.cities" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="选择客户类型" class="short form-item-width-notice" prop="cstype">
                                <el-select v-model="batch_form.cstype" @change="handleSelect">
                                    <el-option v-for="item in initDatas.csTypes" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="选择通知类型" class="short form-item-width-notice" prop="nttype">
                                <el-select v-model="batch_form.nttype" @change="handleSelect">
                                    <el-option v-for="item in initDatas.ntTypes" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item prop="desc" label="消息内容">
                        <el-input type="textarea" v-model="batch_form.desc" :rows="6" @change="handleSelect">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click.native.prevent="handleSubmit_batch">确认发送
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="单独发送">
                <el-form 
                    ref="singleruleForm" 
                    :rules="rules" 
                    :model="single_Form" 
                    label-width="120px"
                    label-position='left' 
                    class="noticeForm">
                    <el-form-item label="输入客户ID" prop="cstid" label-width="120px" class="form-item-width-staff">
                        <el-row>
                            <el-col :span="18">
                                <el-input v-model="tmpCstid" @change="handleSelect2">
                                </el-input>
                            </el-col>
                            <el-col :span="4" :offset="2">
                                <el-button type="danger" @click.native.prevent="addCstid">添加</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-row>
                        <el-col :span="24" class="staff-tag-wrap">
                            <el-tag v-model="single_Form.cstid" v-for="tag in single_Form.cstid" type="gray"
                                    :closable="true" :close-transition="false" @close="delCstid(tag)" class="staff-tag">
                                {{tag}}
                            </el-tag>
                        </el-col>
                    </el-row>
                    <el-form-item label="选择通知类型" class="short form-item-width-staff" prop="nttype">
                        <el-select v-model="single_Form.nttype" @change="handleSelect2">
                            <el-option 
                                v-for="item in initDatas.ntTypes" 
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="desc" label="消息内容">
                        <el-input type="textarea" v-model="single_Form.desc" :rows="6" @change="handleSelect2">
                        </el-input>
                    </el-form-item>
                    <el-form-item style="float:right;">
                        <el-button type="primary" @click.native.prevent="handleSubmit">确认发送
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style scoped>
.el-form {
    padding: 0 20px 0 10px;
}

.el-tag {
    margin-right: 10px;
}

.tabs-wrap {
    margin-top: 20px;
    width: 100%;
}

.form-item-width {
    width: 210px;
}

.form-item-width-notice {
    width: 350px;
}

.form-item-width-staff {
    width: 350px;
}

.staff-tag {
    margin-bottom: 15px;
    font-size: 14px;
}

._notice-form_label-top .el-form-item__error {
    margin-left: -120px;
}

.staff-tag-wrap {
    padding: 0 120px;
}
</style>
<script>
    import $$notice from "../../script/data/model/message";
    const contentValidator = function (rule, value, callback) {
        if (value.trim() === "") {
            callback(new Error("内容不能为空"));
        } else {
            callback();
        }
    };
    export default {
        data () {
            return {
                msg: "notice",
                self_name: "notice-form",
                batch_form: {
                    ctid: [],
                    cstype: "",
                    nttype: "",
                    desc: ""
                },
                single_Form: {
                    cstid: [],
                    nttype: "",
                    desc: ""
                },
                initDatas: {
                    cities: [],
                    csTypes: [],
                    ntTypes: []
                },
                tmpCstid: "",
                disable: {
                    typeMuti: false,
                    typeOne: true
                },
                batchruleForm: {
                    ctid: [],
                    cstype: "",
                    nttype: "",
                    desc: ""
                },
                rules: {
                    ctid: [{
                        type: "array",
                        required: true,
                        message: "请选择城市",
                        trigger: "change"
                    }],
                    cstype: [{
                        required: true,
                        message: "请选择客户类型",
                        trigger: "change"
                    }],
                    nttype: [{
                        required: true,
                        message: "请选择通知类型",
                        trigger: "change"
                    }],
                    cstid: [{
                        type: "array",
                        required: true,
                        message: "请输入合法客户ID",
                        trigger: "blur"
                    }, {
                        type: "array",
                        required: true,
                        message: "请输入合法客户ID",
                        trigger: "change"
                    }],
                    desc: [{
                        required: true,
                        message: "请输入通知内容",
                        trigger: "blur",
                        validator: contentValidator
                    }]
                },
                singleruleForm: {
                    cstid: [],
                    nttype: "",
                    desc: ""
                }
            };
        },
        methods: {
            // 发送类型切换
            typeChange () {
                this.disable.typeMuti = !this.disable.typeMuti;
                this.disable.typeOne = !this.disable.typeOne;

                const noticeForm = this.$refs.noticeForm;
                const oldRules = this.form.type == 1 ? this.rulesOne : this.rulesMuti;
                // 干掉原校验错误信息
                for (const prop in oldRules) {
                    let field = "";
                    if (noticeForm.fields[prop]) {
                        field.error = "";
                    } else {
                        field = "";
                    }
                }
            },

            // 增加客户id
            addCstid () {
                if (this.single_Form.cstid.indexOf(this.tmpCstid) >= 0) {
                    return;
                }

                if (this.tmpCstid.trim().length == 0 || isNaN(this.tmpCstid)) {
                    return;
                }
                this.single_Form.cstid.push(this.tmpCstid);
                this.tmpCstid = "";
            },
            // 删除客户id
            delCstid (tag) {
                const i = this.single_Form.cstid.indexOf(tag);
                this.single_Form.cstid.splice(i, 1);
            },

            handleSubmit (ev) {
                const _self = this;
                this.$refs.singleruleForm.validate((valid) => {
                    if (valid) {
                        $$notice.sendMsgByUserId(_self.single_Form, function (res) {
                            if (res.code === 0) {
                                if (res.data.invalid > 0) {
                                    _self.$notify({
                                        title: "有" + res.data.invalid + "个用户id不合法",
                                        message: "",
                                        type: "error",
                                        duration: 2000
                                    });
                                } else {
                                    _self.$notify({
                                        title: "发送成功",
                                        message: "",
                                        type: "success",
                                        duration: 2000
                                    });
                                }
                                _self.single_Form.desc = "";
                            } else {
                                _self.$notify({
                                    title: "发送失败",
                                    message: res.msg,
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            handleSubmit_batch (ev) {
                const _self = this;

                this.$refs.batchruleForm.validate((valid) => {
                    const params = {
                        areaCodes: _self.batch_form.ctid,
                        messageContent: _self.batch_form.desc,
                        msgType: _self.batch_form.nttype,
                        userType: _self.batch_form.cstype
                    };

                    window.localStorage.setItem("ad_notice_searchContent", JSON.stringify(_self.batch_form));

                    for (let i = 0; i < this.batch_form.ctid.length; i++) {
                        if (this.batch_form.ctid[i] == -1) {
                            params.areaCodes = null;
                        }
                    }
                    if (valid) {
                        $$notice.sendMsgByCondition(params, function (res) {
                            if (res.code === 0) {
                                _self.$notify({
                                    title: "发送成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                _self.batch_form.desc = "";
                            } else {
                                _self.$notify({
                                    title: "发送失败",
                                    message: res.msg,
                                    type: "error",
                                    duration: 2000
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },

            // 批量发送内容监听事件
            handleSelect () {
                window.localStorage.setItem("ad_notice_searchContent", JSON.stringify(this.batch_form));
            },

            // 单独发送内容监听事件
            handleSelect2 () {
                window.localStorage.setItem("ad_notice_searchContent2", JSON.stringify({
                    nttype: this.single_Form.nttype,
                    desc: this.single_Form.desc,
                    tmpCstid: this.tmpCstid
                }));
            }
        },
        watch: {
            "$route": function () {
                const that = this;
                if (window.localStorage.getItem("ad_notice_searchContent")) {
                    const storageObj = JSON.parse(window.localStorage.getItem("ad_notice_searchContent"));
                    that.batch_form = storageObj;
                }
            }
        },
        beforeMount () {
            const that = this;
    
            // 请求已排序的城市列表
            $$notice.getAdParams(function (res) {
                if (res.code === 0) {
                    that.initDatas.cities = res.data.areaCodeList;
                    that.initDatas.cities.unshift({
                        label: "全部城市",
                        options: [{
                            value: "-1",
                            label: "全部城市"
                        }]
                    });
                }

                // 请求回数据后渲染
                if (window.localStorage.getItem("ad_notice_searchContent")) {
                    const storageObj = JSON.parse(window.localStorage.getItem("ad_notice_searchContent"));
                    that.batch_form = storageObj;
                }
            });

            $$notice.getMsgParams(function (res) {
                if (res.code === 0) {
                    let tmp = {};
                    for (const item in res.data.messageType) {
                        tmp.label = res.data.messageType[item];
                        tmp.value = item;
                        that.initDatas.ntTypes.push(tmp);
                        tmp = {};
                    }
                    for (const i in res.data.customerType) {
                        tmp.label = res.data.customerType[i];
                        tmp.value = i;
                        that.initDatas.csTypes.push(tmp);
                        tmp = {};
                    }

                    if (window.localStorage.getItem("ad_notice_searchContent2")) {
                        const storageObj = JSON.parse(window.localStorage.getItem("ad_notice_searchContent2"));
                        that.single_Form.nttype = storageObj.nttype;
                        that.single_Form.desc = storageObj.desc;
                        that.tmpCstid = storageObj.tmpCstid;
                    }
                }
            });
        }
    };
</script>
