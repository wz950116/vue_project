<template>
    <div>
        <el-dialog title="上传文件" v-model="uploadTableDialog" label-width="80px" size="tiny" @close="hideUpload">
            <div style="margin:0 auto;position:relative;">
                <el-upload
                        ref="uploadExcel"
                        :action="type"
                        :before-upload="handlePreview"
                        :on-error="handleError"
                        :on-remove="handleRemove"
                        :with-credentials="true"
                        :on-success="uploadSuccess"
                        :default-file-list="fileList">
                    <el-button type="primary">点击上传</el-button>
                    <div class="el-upload__tip " slot="tip">只能上传excel文件</div>
                </el-upload>
            </div>
            <p style="margin:10px auto;color:#f00;" v-if="hasFileTip">已有文件,请先移除</p>
            <div class="info-area">
                <div class="info-area-tips" v-show="testResult">{{result}}</div>
            </div>
            <div class="info-area" v-show="showInfo">
                <h5>表格信息</h5>
                <div class="info-area-ele">
                    <div class="info-area-tips">{{regularInValidRow}}</div>
                    <ul>
                        <li v-for="(v,k) in regularAreaGroup">
                            <label class="info-area-title">{{k}}:</label>{{v}}
                        </li>
                    </ul>
                </div>
                <div class="info-area-ele">
                    <div class="info-area-tips">{{specialInValidRow}}</div>
                    <ul>
                        <li v-for="(v,k) in specialAreaGroup">
                            <label class="info-area-title">{{k}}:</label>{{v}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="info-area" v-show="showUploadInfo">{{showUploadErrorInfo}}</div>
            <div slot="footer">
                <el-button @click.native="hideUpload">取 消</el-button>
                <el-button type="primary" @click.native="saveTable">确 定</el-button>
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

.info-area-ele {
    margin-bottom: 10px;
}

.info-area-tips {
    color: #f00;
}
</style>
<script>
    import $$recharge from "../../script/data/model/recharge";
    import $$model from "../../script/data/model/interaction";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }
    export default {
        data () {
            return {
                uploadTableDialog: false,
                showInfo: false,
                testResult: false,
                hasFile: false,
                hasFileTip: false,
                regularAreaGroup: {},
                specialAreaGroup: {},
                showUploadInfo: false,
                fileUrl: "",
                fileList: [],
                regularInValidRow: "",
                result: "",
                specialInValidRow: "",
                showUploadErrorInfo: "",
                regularKey: "",
                specialKey: "",
                showRegular: false,
                showSpecial: false
            };
        },
        computed: {
            type: function () {
                return "//ad-manage.focus" + urlType + ".cn/operation/recharge/rechargeExcelTest";
            }
        },
        methods: {
            hideUpload () {
                this.$refs.uploadExcel.clearFiles();
                this.uploadTableDialog = false;
                this.newPicUrl = "";
                this.fileName = "";
                this.fileUrl = "";
                this.showInfo = false;
                this.testResult = false;
                this.hasFileTip = false;
                this.hasFile = false;
                this.showUploadInfo = false;
                this.showSpecial = false;
                this.showRegular = false;
            },
            handlePreview () {
                if (this.hasFile) {
                    this.hasFileTip = true;
                    return false;
                }
            },
            handleError () {
                this.hasFile = true;
                this.showUploadInfo = true;
            },
            handleRemove () {
                this.hasFileTip = false;
                this.hasFile = false;
                this.showInfo = false;
                this.testResult = false;
                this.hasFileTip = false;
                this.showUploadInfo = false;
                this.showSpecial = false;
                this.showRegular = false;
            },
            uploadSuccess (data) {
                const that = this;
                if (data.code === 0) {
                    that.testResult = true;
                    that.result = data.data.testResult;
                    that.fileUrl = data.data.url;
                } else {
                    this.showUploadInfo = true;
                    this.showUploadErrorInfo = data.msg;
                }
                this.hasFile = true;
            },
            saveTable () {
                const that = this;
                if (!that.hasFile) {
                    that.$message.error("请添加文件！");
                    return;
                }
                if (that.result != "Success") {
                    that.$message.error("文件格式出错！");
                    return;
                }
                $$recharge.rechargeByExcelFile({
                    url: that.fileUrl
                }, function (data) {
                    if (data.code === 0) {
                        that.$notify({
                            title: "操作成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        $$recharge.actionSuccess();
                    } else {
                        that.$message({
                            type: "error",
                            message: data.msg
                        });
                    }
                });
                this.hideUpload();
                this.selectRow = [];
            }
        },
        beforeMount: function () {
            const _this = this;
            $$model.on("showAdDialog", function (params) {
                if (params.type === "batchRecharge") {
                    _this.uploadTableDialog = true;
                }
            });
        }
    };
</script>
