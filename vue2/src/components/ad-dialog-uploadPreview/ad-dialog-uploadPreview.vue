<template>
    <div>
        <el-dialog title="上传打底图" v-model="uploadPic" label-width="80px" size="tiny" @close="hideUploadPic">
            <div v-show="ideaTypeCode!=0" style="margin:0 auto;position: relative;">
                <el-upload
                        ref="uploadPic"
                        :action="getUrl"
                        :multiple="false"
                        :on-error="handlePicError"
                        :before-upload="handlePicPreview"
                        :on-remove="handlePicRemove"
                        :on-success="uploadPicSuccess"
                        :with-credentials="true"
                        :show-upload-list="true"
                        :default-file-list="filePicList"
                >
                    <el-button type="primary">点击上传</el-button>
                    <div class="el-upload__tip" slot="tip">只能上传尺寸{{picSize}}的图片文件</div>
                </el-upload>
            </div>
            <div class="info-area" v-show="showPicInfo">
                <p v-if="uploadPicSuccessTip">上传成功</p>
                <p v-if="hasFilePicTip">已有文件,请先移除</p>
                <p v-if="uploadPicFailedTip">{{uploadErrorMsg}}</p>
            </div>
            <div style="margin-top: 10px;">
                <el-form ref="uploadFormPic" label-width="90px" :model="uploadPicForm" :rules="rules"
                         class="demo-dynamic">
                    <el-form-item v-if="ideaTypeCode!=0" prop="uploadFormPic" label="广告图片">
                        <el-input v-model="uploadPicForm.uploadFormPic"></el-input>
                    </el-form-item>
                    <el-form-item prop="uploadFormLink" label="广告链接">
                        <el-input v-model="uploadPicForm.uploadFormLink"></el-input>
                    </el-form-item>
                    <el-form-item v-if="ideaTypeCode==0||ideaTypeCode==4" prop="uploadFormDesc" label="广告文案">
                        <el-input v-model="uploadPicForm.uploadFormDesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideUploadPic">取 消</el-button>
                <el-button type="primary" @click.native="savePic">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
    .info-area {
    margin: 20px auto;
    word-break: break-all;
    color: #f00;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";
    import _ from "../../lib/underscore.v1.4.4.min";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }
    const contentValidator = function (rule, value, callback) {
        if (value.trim() === "") {
            callback(new Error("内容不能为空"));
        } else {
            callback();
        }
    };
    export default{
        data () {
            return {
                ideaTypeCode: "",
                uploadPic: false,
                getUrl: "",
                showPicInfo: false,
                uploadPicForm: {
                    uploadFormPic: "",
                    uploadFormLink: "",
                    uploadFormDesc: "",
                    resourceId: ""
                },
                rules: {
                    uploadFormLink: [{
                        type: "string",
                        required: true,
                        message: "广告链接不能为空",
                        trigger: "blur",
                        validator: contentValidator
                    }],
                    uploadFormPic: [{
                        type: "string",
                        required: true,
                        message: "广告图片不能为空",
                        trigger: "blur",
                        validator: contentValidator
                    }],
                    uploadFormDesc: [{
                        type: "string",
                        required: true,
                        message: "广告文案不能为空",
                        trigger: "blur",
                        validator: contentValidator
                    }]
                },
                hasFilePicTip: false,
                hasFilePic: false,
                showUploadPicForm: false,
                filePicList: [],
                picSize: "",
                uploadPicSuccessTip: false,
                uploadPicFailedTip: ""
            };
        },
        methods: {
            hideUploadPic () {
                this.uploadPic = false;
                this.showPicInfo = false;
                this.showUploadPicForm = false;
                this.uploadPicForm = {
                    uploadFormPic: "",
                    uploadFormLink: "",
                    uploadFormDesc: "",
                    resourceId: ""
                };
                this.picUrl = "";
                this.hasFilePic = false;
                this.$refs.uploadPic.clearFiles();
            },
            handlePicError () {
                this.hasFilePic = true;
            },
            handlePicPreview () {
                if (this.hasFilePic) {
                    this.hasFilePicTip = true;
                    return false;
                }
            },
            handlePicRemove () {
                this.uploadPicSuccessTip = false;
                this.hasFilePicTip = false;
                this.hasFilePic = false;
                this.uploadPicFailedTip = false;
            },
            uploadPicSuccess (data) {
                if (data.code === 0) {
                    this.uploadPicSuccessTip = true;
                    this.showUploadPicForm = true;
                    this.picUrl = data.data.url;
                    this.uploadPicForm.uploadFormPic = data.data.url;
                    this.uploadPicParams = data.data;
                    this.uploadPicFailedTip = false;
                } else {
                    this.uploadPicFailedTip = true;
                    this.uploadErrorMsg = data.msg;
                }
                this.hasFilePic = true;
                this.showPicInfo = true;
            },
            savePic () {
                const that = this;
                if (that.picUrl === "" && that.ideaTypeCode > 0) {
                    that.$message.error("请添加文件！");
                    return;
                }
                const params = {
                    baseIdeaLink: this.uploadPicForm.uploadFormLink,
                    description: this.uploadPicForm.uploadFormDesc,
                    resourceId: this.uploadPicForm.resourceId
                };
                _.extend(params, this.uploadPicParams);
                this.$refs.uploadFormPic.validate(function (valid) {
                    if (valid) {
                        $$ad.setPic(params, function (data) {
                            if (data.code === 0) {
                                that.$notify({
                                    title: "操作成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                $$ad.actionSuccess();
                            } else {
                                that.$message({
                                    type: "error",
                                    message: data.msg
                                });
                            }
                            that.uploadPic = false;
                            that.selectRow = [];
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        beforeMount: function () {
            const _this = this;
            $$model.on("showAdDialog", function (params) {
                if (params.type === "uploadPreview") {
                    const row = params.row;
                    _this.uploadPic = true;
                    _this.picSize = row.size;
                    _this.uploadPicForm.resourceId = row.resourceId;
                    _this.ideaTypeCode = row.ideaTypeCode;
                    _this.getUrl = "http://ad-manage.focus" + urlType + ".cn/adPosInfo/editBaseIdeaTest/" + row.resourceId;
                }
            });
        }
    };
</script>