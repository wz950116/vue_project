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
                <div class="info-area-tips" v-if="showRegular">regularKey:false</div>
                <div class="info-area-tips" v-if="showSpecial">specialKey:false</div>
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
            <div v-if="errorList.length > 0 && hasFile">
                <h5 style="line-height: 40px;font-size: 14px;">上传结果</h5>
                <el-table :data="errorList" border style="width:100%;">
                    <el-table-column property="sheet" label="表格名称" align="center"></el-table-column>
                    <el-table-column property="resourceId" label="广告位ID" align="center"></el-table-column>
                    <el-table-column property="note" label="错误信息" align="center"></el-table-column>
                </el-table>
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
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }
    export default{
        data () {
            return {
                uploadTableDialog: false,
                showInfo: false,
                hasFile: false,
                hasFileTip: false,
                regularAreaGroup: {},
                specialAreaGroup: {},
                showUploadInfo: false,
                fileUrl: "",
                fileList: [],
                regularInValidRow: "",
                specialInValidRow: "",
                showUploadErrorInfo: "",
                regularKey: "",
                specialKey: "",
                showRegular: false,
                showSpecial: false,
                errorList: []
            };
        },
        computed: {
            type: function () {
                return "//ad-manage.focus" + urlType + ".cn/adPosInfo/editPriceByExcelTest";
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
                this.hasFileTip = false;
                this.showUploadInfo = false;
                this.showSpecial = false;
                this.showRegular = false;
            },
            uploadSuccess (data) {
                const that = this;
                if (data.code === 0) {
                    if (data.data.specialKey) {
                        that.specialAreaGroup = data.data.specialDetail.areaGroup;
                        that.specialInValidRow = JSON.stringify(data.data.specialDetail);
                        that.showInfo = true;
                    }
                    if (data.data.regularKey) {
                        that.regularAreaGroup = data.data.regularDetail.areaGroup;
                        that.regularInValidRow = JSON.stringify(data.data.regularDetail.inValidRow);
                        that.showInfo = true;
                    }
                    that.$message({
                        message: "表格不完整行数" + data.data.emptyNum + "\r\n更新失败行数" + data.data.noNum + "\r\n操作成功行数" + data.data.okNum
                    });
                    // if (!data.data.specialKey) {
                    //     that.showSpecial = true;
                    // }
                    // if (!data.data.regularKey) {
                    //     that.showRegular = true;
                    // }
                    that.errorList = data.data.list;
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
                $$ad.editPriceExcel({
                    url: that.fileUrl
                }, function (data) {
                    if (data.code === 0) {
                        that.$notify({
                            title: "上传成功，后台系统正在处理",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        $$ad.actionSuccess();
                    } else {
                        that.$message({
                            type: "error",
                            message: "上传失败"
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
                if (params.type === "uploadExcel") {
                    _this.uploadTableDialog = true;
                }
            });
        }
    };
</script>
