<template>
    <div class="ad-upload">
        <el-dialog title="上传预览图" v-model="uploadPic" label-width="80px" size="tiny" @close="closeUpload">
            <div style="margin: 0 auto;position:relative;">
                <el-upload ref="uploadPic" :action="getUrl" :multiple="false" :before-upload="handlePicPreview" :on-remove="handlePicRemove" :on-success="uploadPicSuccess" :with-credentials="true" :show-upload-list="true" :default-file-list="filePicList">
                    <el-button type="primary">点击上传</el-button>
                    <div class="el-upload__tip" slot="tip">只能上传图片文件</div>
                </el-upload>
            </div>
            <div class="info-area" v-show="showPicInfo">
                <p v-if="uploadPicSuccessTip">上传成功</p>
                <p v-if="hasFilePicTip">已有文件,请先移除</p>
                <p v-if="uploadPicFailedTip">上传失败,请重试</p>
            </div>
            <div v-show="showUploadPicForm">
                <el-form ref="uploadFormPic" label-width="90px" :model="uploadPicForm" :rules="rules"
                         class="demo-dynamic">
                    <el-form-item prop="uploadFormPic" label="广告图片">
                        <el-input v-model="uploadPicForm.uploadFormPic"></el-input>
                    </el-form-item>
                    <el-form-item prop="uploadFormLink" label="广告链接">
                        <el-input v-model="uploadPicForm.uploadFormLink"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="closeUpload">取 消</el-button>
                <el-button type="primary" @click.native="savePic">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="预览图" v-model="imageViewOpen" size="tiny">
            <div class="image-container">
                <img v-bind:src="curImageView" style="max-width:100%;max-height:100%;">
                <a class="add-url" :href="adUrl" target="_blank">链接:{{adUrl}}</a>
            </div>
        </el-dialog>

        <el-form ref="form" :model="adHeaderForm" label-width="70px">
            <el-row type="flex" justify="space-between">
                <el-form-item label="一级栏目">
                    <el-select 
                        class="ad-header-item-value" 
                        multiple v-model="adHeaderForm.lvl1Value" 
                        style="width:217px;" @change="getLvl2">
                        <el-option 
                            v-for="(value, key) in lvl1Options"
                            :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="二级栏目">
                    <el-select 
                        class="ad-header-item-value" multiple 
                        v-model="adHeaderForm.lvl2Value"
                        @change="getData()" style="width:217px;">
                        <el-option 
                            v-for="(value, key) in lvl2Options"
                            :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="屏次" label-width="40px">
                    <el-select 
                        class="ad-header-item-value" 
                        multiple v-model="adHeaderForm.screenValue"
                        @change="getData()" style="width:217px;">
                        <el-option 
                            v-for="(value, key) in screenOptions"
                            :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告形式">
                    <el-select 
                        class="ad-header-item-value" multiple 
                        v-model="adHeaderForm.adTypeValue"
                        @change="getData()" style="width:220px;">
                        <el-option 
                            v-for="(value, key) in adTypeOptions"
                            :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row type="flex" justify="end" style="margin-bottom:22px;">
                <el-button 
                    @click.native="exportAllAd">
                    导出符合条件的所有广告位
                </el-button>
                <el-button 
                    @click.native="exportSelectAd">
                    导出选中广告位
                </el-button>
                <el-button 
                    @click.native="banUse">
                    禁用已选
                </el-button>
                <el-button 
                    @click.native="resloveBanUse">
                    解除已选禁用
                </el-button>
            </el-row>
        </el-form>

        <el-table 
            :data="tableData" 
            border style="width:100%;" 
            ref="multipleTable" 
            @select-all="selectAll" 
            @select="select"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
            <el-table-column property="posId" min-width="190" label="资源ID(不含area code)" align="center"></el-table-column>
            <el-table-column property="adName" min-width="200" label="广告位名称" align="center"></el-table-column>
            <el-table-column property="platformType" width="110" label="所属平台" align="center"></el-table-column>
            <el-table-column property="firstColumn" width="110" label="一级栏目" align="center"></el-table-column>
            <el-table-column property="secondColumn" width="110" label="二级栏目" align="center"></el-table-column>
            <el-table-column property="pageNum" width="110" label="屏次" align="center"></el-table-column>
            <el-table-column property="businessType" width="110" label="计费方式" align="center"></el-table-column>
            <el-table-column property="ideaType" width="110" label="广告形式" align="center"></el-table-column>
            <el-table-column property="material" :formatter="formateGroupNames" label="创意样式" width="120" align="center"></el-table-column>
            <el-table-column property="material" :formatter="formateShowNames" label="创意形式" width="120" align="center"></el-table-column>
            <el-table-column property="material" :formatter="formates" label="规格" width="120" align="center"></el-table-column>
            <el-table-column property="material" :formatter="formateSizes" label="大小" width="120" align="center"></el-table-column>
            <el-table-column property="previewImage" width="80" label="预览图" align="center"></el-table-column>
            <el-table-column v-if="tableData.length === 0" label="操作" fixed="right" min-width="180" align="center">
            </el-table-column>
            <el-table-column v-if="tableData.length > 0" inline-template label="操作" min-width="180" fixed="right" align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="success" size="small" v-if="row.previewImageStatus==1" @click="uploadPicDialog(row.posId,row.adName)">上传
                    </el-button>
                    <el-button type="success" size="small" v-if="row.previewImageStatus==2" @click="showPic(row.previewImageResource,row.link)">预览
                    </el-button>
                    <el-button type="danger" size="small" v-if="row.previewImageStatus==2" @click="uploadPicDialog(row.posId,row.adName)">重新上传
                    </el-button>
                </div>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span v-if="showBanDialog">是否确定禁用已选地区广告位</span>
            <span v-else>是否确定解除已选地区广告位的禁用</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelBanPlan">取 消</el-button>
                <el-button type="primary" @click="banPlan">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style>
.ad-upload .el-upload__btn-delete {
    display: block;
}
</style>
<style scoped>
.ad-upload {
    margin-top: 20px;
}

.info-area {
    margin: 20px auto;
    word-break: break-all;
    color: #f00;
}

.info-area-tips {
    color: #f00;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$upload from "./model-adUpload.js";
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
                lvl1Options: [],
                lvl2Options: [],
                screenOptions: [],
                adTypeOptions: [],
                adHeaderForm: {
                    lvl1Value: [],
                    lvl2Value: [],
                    screenValue: [],
                    adTypeValue: []
                },
                imageViewOpen: false,
                curImageView: "",
                tableData: [],
                editDateDialog: false,
                formDate: {
                    "openDate": ""
                },
                uploadPic: false,
                showInfo: false,
                currentRid: "",
                getUrl: "",
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
                    }]
                },
                uploadPicSuccessTip: false,
                uploadPicFailedTip: false,
                showPicInfo: false,
                showUploadPicForm: false,
                filePicList: [],
                hasFile: false,
                hasFileTip: false,
                hasFilePic: false,
                hasFilePicTip: false,
                uploadPicParams: {},
                uploadPicForm: {
                    uploadFormPic: "",
                    uploadFormLink: "",
                    resourceId: ""
                },
                adUrl: "",
                currentPage: 1,
                pageSize: 10,
                total: 0,
                dialogVisible: false,
                showBanDialog: true,
                multipleSelection: [],
                selectRow: [],
                isRequire: false
            };
        },
        methods: {
            handleSelectionChange (val) {
                const _this = this;
                if (val.length == _this.tableData.length) {
                    this.multipleSelection = val;
                }
            },
            formateGroupNames (row, column) {
                const material = row.material,
                    arr = [];
                material.forEach(function (item) {
                    arr.push(item.groupName);
                });
                return arr.join(",");
            },
            formateShowNames (row, column) {
                const material = row.material,
                    resultArr = [];
                material.forEach(function (item) {
                    const arr = [];
                    item.showList.forEach(function (val) {
                        arr.push(val.showName);
                    });
                    resultArr.push("(" + arr.join(",") + ")");
                });
                return resultArr.join(",");
            },
            formates (row, column) {
                const material = row.material,
                    resultArr = [];
                material.forEach(function (item) {
                    const arr = [];
                    item.showList.forEach(function (val) {
                        arr.push(val.format);
                    });
                    resultArr.push("(" + arr.join(",") + ")");
                });
                return resultArr.join(",");
            },
            formateSizes (row, column) {
                const material = row.material,
                    resultArr = [];
                material.forEach(function (item) {
                    const arr = [];
                    item.showList.forEach(function (val) {
                        arr.push(val.size);
                    });
                    resultArr.push("(" + arr.join(",") + ")");
                });
                return resultArr.join(",");
            },
            getData (pageIndex) {
                if (!this.isRequire) return;

                if (pageIndex === undefined) pageIndex = 1;
                const _this = this;
                _this.currentPage = pageIndex;
                // 数据加载
                const params = {
                    pageIndex: _this.currentPage,
                    limit: _this.pageSize
                };

                if (_this.adHeaderForm.lvl1Value && _this.adHeaderForm.lvl1Value.length > 0) {
                    _.extend(params, {
                        firstColumns: _this.adHeaderForm.lvl1Value
                    });
                }
                if (_this.adHeaderForm.lvl2Value && _this.adHeaderForm.lvl2Value.length > 0) {
                    _.extend(params, {
                        secondColumns: _this.adHeaderForm.lvl2Value
                    });
                }
                if (_this.adHeaderForm.screenValue && _this.adHeaderForm.screenValue.length > 0) {
                    _.extend(params, {
                        pageNums: _this.adHeaderForm.screenValue
                    });
                }
                if (_this.adHeaderForm.adTypeValue && _this.adHeaderForm.adTypeValue.length > 0) {
                    _.extend(params, {
                        ideaTypes: _this.adHeaderForm.adTypeValue
                    });
                }

                window.localStorage.setItem("ad_upload_searchContent", JSON.stringify(params));

                $$ad.getAdForPic(params, function (data) {
                    if (data.code !== 0) {
                        return;
                    }
                    _this.tableData = data.data.adPosData;
                    _this.total = parseInt(data.data.totalNum);

                    // 分页后显示已勾选
                    const tmpArr = [];
                    _this.tableData.forEach(function (value) {
                        tmpArr.push(value.posId);
                    });

                    setTimeout(function () {
                        _this.selectRow.forEach(function (value) {
                            if (tmpArr.indexOf(value) >= 0) {
                                const index = tmpArr.indexOf(value);
                                _this.$refs.multipleTable.toggleRowSelection(_this.tableData[index]);
                            }
                        });
                    }, 0);
                });
            },
            uploadPicDialog (id, name) {
                this.uploadPic = true;
                this.uploadPicForm.resourceId = id;
                this.getUrl = window.location.protocol + "//ad-manage.focus" + urlType + ".cn/adPosInfo/editPreviewTest/" + id;
            },
            showPic (src, url) {
                this.curImageView = src;
                this.imageViewOpen = true;
                this.adUrl = url;
            },
            closeUpload () {
                this.uploadPic = false;
                this.uploadPicForm = {
                    uploadFormPic: "",
                    uploadFormLink: "",
                    resourceId: ""
                };
                this.showPicInfo = false;
                this.showUploadPicForm = false;
                this.adUrl = "";
                this.picUrl = "";
                this.$refs.uploadPic.clearFiles();
                this.hasFilePic = false;
            },
            savePic () {
                const that = this;
                if (that.picUrl === "") {
                    that.$message.error("请添加文件！");
                    return;
                }
                const params = {
                    previewLink: this.uploadPicForm.uploadFormLink,
                    previewImageResource: this.uploadPicForm.uploadFormPic,
                    resourceId: this.uploadPicForm.resourceId
                };
                this.$refs.uploadFormPic.validate(function (valid) {
                    if (valid) {
                        $$ad.setPreviewPic(params, function (data) {
                            if (data.code === 0) {
                                that.$notify({
                                    title: "操作成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                that.getData(that.currentPage);
                                that.uploadPic = false;
                                that.hasFilePic = false;
                                that.uploadPicForm = {
                                    uploadFormPic: "",
                                    uploadFormLink: "",
                                    resourceId: ""
                                };
                            } else {
                                that.$message({
                                    type: "error",
                                    message: data.msg
                                });
                            }
                        });
                    } else {
    
                    }
                });
            },
            uploadPicSuccess (data) {
                if (data.code === 0) {
                    this.uploadPicSuccessTip = true;
                    this.picUrl = data.data.url;
                    this.uploadPicForm.uploadFormPic = data.data.url;
                    this.hasFilePic = true;
                    this.showUploadPicForm = true;
                    this.uploadPicParams = data.data;
                } else {
                    this.uploadPicFailedTip = true;
                }
                this.showPicInfo = true;
            },
            handlePicRemove () {
                this.uploadPicSuccessTip = false;
                this.hasFilePicTip = false;
                this.hasFilePic = false;
            },
            handlePicPreview () {
                if (this.hasFilePic) {
                    this.uploadPicSuccessTip = false;
                    this.hasFilePicTip = true;
                    return false;
                }
            },
            handleCurrentChange (val) {
                this.getData(val);
            },
            getLvl2: function (ids) {
                const that = this;
                const relation = that.firstSecondRelation;
                const lvl2Options = {};
                let matchedLvl2Ids = [];

                ids.forEach(function (id) {
                    if (relation && relation.hasOwnProperty(id)) {
                        matchedLvl2Ids = matchedLvl2Ids.concat(relation[id]);
                    }
                });

                matchedLvl2Ids.forEach(function (lvl2) {
                    if (that.secondColumn.hasOwnProperty(lvl2)) {
                        matchedLvl2Ids.forEach(function (lvl2) {
                            lvl2Options[lvl2] = that.secondColumn[lvl2];
                        });
                    }
                });

                that.lvl2Options = lvl2Options;

                const arrTmp = [];
                that.adHeaderForm.lvl2Value.forEach(item => {
                    if (matchedLvl2Ids.indexOf(item) >= 0) {
                        arrTmp.push(item);
                    }
                });
                that.adHeaderForm.lvl2Value = arrTmp;

                that.getData();
            },

            // 禁用处理
            selectAll: function (val) {
                const tempArr = [],
                    len = val.length;
                if (len === 0) {
                    this.selectRow = [];
                    return;
                }
                for (let i = 0; i < len; i++) {
                    tempArr.push(val[i].posId);
                }
                this.selectRow = Array.from(new Set(this.selectRow.concat(tempArr)));
            },
            select (selection, row) {
                const _this = this,
                    tempArr = [];
                selection.forEach(val => {
                    if (val.posId) {
                        tempArr.push(val.posId);
                    }
                });

                if (_this.selectRow.includes(row.posId)) {
                    _this.selectRow.splice(_this.selectRow.indexOf(row.posId), 1);
                }
                _this.selectRow = Array.from(new Set(_this.selectRow.concat(tempArr)));
            },
            banUse () {
                if (this.selectRow.length > 0) {
                    this.dialogVisible = true;
                }
            },
            resloveBanUse () {
                if (this.selectRow.length > 0) {
                    this.dialogVisible = true;
                    this.showBanDialog = false;
                }
            },
            banPlan () {
                this.dialogVisible = false;
                if (this.showBanDialog) {
                    // 禁用
                    this.handlerBan(1);
                } else {
                    // 解除禁用
                    this.handlerBan(0);
                }
            },
            cancelBanPlan () {
                this.dialogVisible = false;
            },
            handlerBan (status) {
                const _this = this;
                if (_this.selectRow.length > 0) {
                    const params = {
                        "posIds": _this.selectRow,
                        "status": status
                    };
                    $$ad.banPlan(params, res => {
                        if (res.code === 0) {
                            _this.$message({
                                message: "操作成功",
                                duration: 1000
                            });
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        }
                    });
                }
            },

            // 导出所有广告位
            exportAllAd () {
                const params = {
                    firstColumns: this.adHeaderForm.lvl1Value.length ? this.adHeaderForm.lvl1Value : null,
                    secondColumns: this.adHeaderForm.lvl2Value.length ? this.adHeaderForm.lvl2Value : null,
                    pageNums: this.adHeaderForm.screenValue.length ? this.adHeaderForm.screenValue : null,
                    ideaTypes: this.adHeaderForm.adTypeValue.length ? this.adHeaderForm.adTypeValue : null
                };
                this.handlerAdExport(params);
            },
            // 导出选中广告位
            exportSelectAd () {
                if (this.selectRow.length > 0) {
                    const params = {
                        "adPosIdList": this.selectRow
                    };
                    this.handlerAdExport(params);
                } else {
                    this.$message("请选中您要导出的广告位");
                }
            },

            handlerAdExport (params) {
                $$upload.exportAd(params, res => {
                    if (res.code === 0 && res.msg === "success") {
                        this.$message("导出文件正在发送至您的邮箱...");
                        this.$refs.multipleTable.clearSelection();
                        this.selectRow = [];
                    }
                });
            }
        },
        watch: {
            "$route": function () {
                const _this = this;
                const storageObj = JSON.parse(window.localStorage.getItem("ad_upload_searchContent"));
                if (storageObj) {
                    _this.adHeaderForm.lvl1Value = storageObj.firstColumns || [];
                    _this.adHeaderForm.lvl2Value = storageObj.secondColumns || [];
                    _this.adHeaderForm.screenValue = storageObj.pageNums || [];
                    _this.adHeaderForm.adTypeValue = storageObj.ideaTypes || [];
                }
            }
        },
        mounted: function () {
            const _this = this;
            // filter数据加载
            $$ad.on("getAdParams", function (data) {
                const array = [];
                const platForm = data.data.platform;
                for (const i in platForm) {
                    array.push({
                        id: parseInt(i, 10),
                        name: platForm[i]
                    });
                }
                const cityArr = [];
                const cityOptions = data.data.areaCode;
                for (const m in cityOptions) {
                    cityArr.push({
                        id: parseInt(m, 10),
                        name: cityOptions[m]
                    });
                }
                _this.lvl1Options = data.data.firstColumn;
                _this.secondColumn = data.data.secondColumn;
                _this.screenOptions = data.data.pageNum;
                _this.adTypeOptions = data.data.ideaType;
                _this.firstSecondRelation = data.data.firstSecondRelation;

                if (_this.adHeaderForm.lvl1Value.length > 0) {
                    _this.getLvl2(_this.adHeaderForm.lvl1Value);
                }

                const storageObj = JSON.parse(window.localStorage.getItem("ad_upload_searchContent"));
                if (storageObj) {
                    _this.adHeaderForm.lvl1Value = storageObj.firstColumns || [];
                    _this.adHeaderForm.lvl2Value = storageObj.secondColumns || [];
                    _this.adHeaderForm.screenValue = storageObj.pageNums || [];
                    _this.adHeaderForm.adTypeValue = storageObj.ideaTypes || [];
                }

                _this.isRequire = true;

                _this.getData(1);
            });

            $$ad.getAdParams();
        }
    };
</script>
