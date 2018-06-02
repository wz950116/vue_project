<template>
    <div class="wrapper">
        <div class="header-thrid" style="clear: both;float:right;margin-bottom:-10px;position: relative;top: -16px;">
            <el-button :plain="true" type="primary" @click.native="stopUse">锁定广告位</el-button>
            <el-button :plain="true" type="danger" @click.native="showEdtidAdPriceDialog">编辑选中价格</el-button>
            <el-button :plain="true" type="success" @click.native="downloadTable">下载定价模板</el-button>
            <el-button :plain="true" type="success" @click.native="showUploadTableDialog">上传表格</el-button>
            <el-button :plain="true" type="success" @click.native="exportData">导出数据</el-button>
            <el-button @click.native="banUse">
                禁用已选
            </el-button>
            <el-button @click.native="resloveBanUse">
                解除已选禁用
            </el-button>
        </div>
        <deleDialog></deleDialog>
        <editDialog></editDialog>
        <uploadExcelDialog></uploadExcelDialog>
        <uploadPreviewDialog></uploadPreviewDialog>
        <uploadAdImage></uploadAdImage>
        <uploadAdImagePreview type="Ad"></uploadAdImagePreview>
        <el-table 
            :data="tableData" 
            border style="width:100%;" 
            @select-all="selectAll" 
            @select="select"
            @selection-change="handleSelectionChange"
            ref="multipleTable">

            <el-table-column type="selection" v-if="tableData && tableData.length > 0" width="50" align="center" fixed></el-table-column>
            <el-table-column v-if="tableData && tableData.length === 0" type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="资源ID" v-if="tableData && tableData.length > 0" inline-template width="140" align="center" fixed style="text-align:center;">
                <div>
                    <el-button type="text" size="small" @click="handleDetail(row)">{{ row.resourceId }}</el-button>
                </div>
            </el-table-column>
            <el-table-column v-if="tableData && tableData.length === 0" label="资源ID" width="140" align="center"></el-table-column>
            <el-table-column prop="adName" label="广告位名称" width="170" align="center"></el-table-column>
            <el-table-column prop="platformType" label="所属平台" width="110" align="center"></el-table-column>
            <el-table-column prop="areaCode" label="所属城市" width="110" align="center"></el-table-column>
            <el-table-column prop="firstColumn" label="一级栏目" width="110" align="center"></el-table-column>
            <el-table-column prop="secondColumn" label="二级栏目" width="110" align="center"></el-table-column>
            <el-table-column prop="pageNum" label="屏次" width="110" align="center"></el-table-column>
            <el-table-column prop="businessType" label="计费方式" width="110" align="center"></el-table-column>
            <el-table-column prop="ideaType" label="广告形式" width="110" align="center"></el-table-column>
            <el-table-column prop="material" :formatter="formateGroupNames" label="创意样式" width="120" align="center"></el-table-column>
            <el-table-column prop="material" :formatter="formateShowNames" label="创意形式" width="120" align="center"></el-table-column>
            <el-table-column prop="material" :formatter="formates" label="规格" width="120" align="center"></el-table-column>
            <el-table-column prop="material" :formatter="formateSizes" label="大小" width="120" align="center"></el-table-column>
            <el-table-column prop="pv" sortable :formatter="formatterpv" label="日均pv" width="110" align="center"></el-table-column>
            <el-table-column prop="uv" sortable :formatter="formatteruv" label="日均uv" width="110" align="center"></el-table-column>
            <el-table-column prop="click" sortable :formatter="formatterclick" label="点击量" width="110" align="center"></el-table-column>
            <el-table-column prop="price" sortable :formatter="formatterprice" label="价格" width="135" align="center"></el-table-column>
            <el-table-column prop="saleRate" sortable :formatter="formatterrate" label="售出率" width="110" align="center"></el-table-column>
            <el-table-column prop="supportType" label="支持类型" width="110" align="center"></el-table-column>
            <el-table-column prop="operationType" label="是否对外" width="110" align="center"></el-table-column>
            <el-table-column prop="baseIdea" label="打底图规则" width="110" align="center"></el-table-column>
            <el-table-column prop="authority" label="权限" width="110" align="center"></el-table-column>
            
            <el-table-column v-if="baseIdeaStatus!=0" inline-template label="操作" fixed="right" width="180" align="center">
                <div class="action" style="text-align:center;">
                    <el-button type="success" size="small" v-if="row.baseIdeaStatus == 1" @click="uploadAdImage(row)">上传
                    </el-button>
                    <el-button type="success" size="small" v-if="row.baseIdeaStatus == 2" @click="showPic(row)">预览
                    </el-button>
                    <el-button type="danger" size="small" v-if="row.baseIdeaStatus == 2" @click="uploadAdImage(row)">重新上传
                    </el-button>
                </div>
            </el-table-column>
        </el-table>

        <div class="pagination" v-show="tableData && tableData.length > 0">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span v-if="showBanDialog">是否确定禁用已选广告位</span>
            <span v-else>是否确定解除已选广告位的禁用</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelBanPlan">取 消</el-button>
                <el-button type="primary" @click="banPlan">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<style>
.wrapper {
    margin-top: 15px;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.add-url {
    margin: 10px auto;
    display: block;
}

.el-dialog--large {
    width: 60%;
}
    
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";
    import deleDialog from "../ad-dialog-deletePrice/ad-dialog-deletePrice";
    import editDialog from "../ad-dialog-editPrice/ad-dialog-editPrice";
    import uploadExcelDialog from "../ad-dialog-uploadExcel/ad-dialog-uploadExcel";
    import uploadPreviewDialog from "../ad-dialog-uploadPreview/ad-dialog-uploadPreview";
    import uploadAdImage from "../ad-dialog-uploadAdImage/ad-dialog-uploadAdImage";
    import uploadAdImagePreview from "../ad-dialog-uploadAdImagePreview/ad-dialog-uploadAdImagePreview";
    export default {
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                self_name: "ad-table",
                tableData: [],
                selectRow: [],
                imageViewOpen: false,
                adUrl: "",
                picUrl: "",
                ideaTypeCode: "",
                adText: "",
                curImageView: "",
                baseIdeaStatus: -1,
                dialogVisible: false,
                showBanDialog: true,
                multipleSelection: []
            };
        },
        components: {
            deleDialog,
            editDialog,
            uploadExcelDialog,
            uploadPreviewDialog,
            uploadAdImage,
            uploadAdImagePreview
        },
        methods: {
            handleDetail: function (row) {
                const adId = row.resourceId,
                    name = row.adName;
                this.$router.push("/ad-detail?adId=" + adId + "&name=" + name);
            },
            formateGroupNames: function (row, column) {
                const material = row.material,
                    arr = [];
                material.forEach(function (item) {
                    arr.push(item.groupName);
                });
                return arr.join(",");
            },
            formateShowNames: function (row, column) {
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
            formates: function (row, column) {
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
            formatterpv: function (row, column) {
                return row.averagePV;
            },
            formatteruv: function (row, column) {
                return row.averageUV;
            },
            formatterclick: function (row, column) {
                return row.click;
            },
            formatterprice: function (row, column) {
                return row.price;
            },
            formatterrate: function (row, column) {
                return row.saleRate;
            },
            handleCurrentChange: function (val) {
                this.currentPage = val;
                $$ad.getAdInfoByPage(val);
            },
            showUploadTableDialog: function () {
                $$model.showAdDialog({
                    type: "uploadExcel"
                });
            },
            showEdtidAdPriceDialog: function () {
                const _this = this;
                $$model.showAdDialog({
                    selectRow: _this.selectRow,
                    type: "editPrice"
                });
            },
            exportData: function () {
                $$ad.getAdDownloadParams(res => {
                    // console.log(res);
                });
            },
            stopUse: function () {
                const _this = this;
                $$model.showAdDialog({
                    selectRow: _this.selectRow,
                    type: "deletePrice"
                });
            },
            uploadPicDialog: function (row) {
                $$model.showAdDialog({
                    row: row,
                    type: "uploadPreview"
                });
            },
            uploadAdImage: function (row) {
                $$model.showUploadAdImageDialog({
                    row: row,
                    type: "uploadAdImage"
                });
            },
            showPic: function (row) {
                $$model.showUploadAdImagePreviewDialog(row, "Ad");
            },
            hideImageView: function () {
                this.adUrlLinkShow = false;
                this.imageViewOpen = false;
                this.adTextShow = false;
                this.adImgShow = false;
            },
            getAdUrl: function (adId, name) {
                return "/ad-detail?adId=" + adId + "&name=" + name;
            },
            selectAll: function (val) {
                const tempArr = [];
                const len = val.length;
                if (len === 0) {
                    this.selectRow = [];
                    return;
                }
                for (let i = 0; i < len; i++) {
                    tempArr.push(val[i].resourceId);
                }
                this.selectRow = tempArr; // 用于记录禁用项
            },
            select: function (selection, row) {
                const _this = this,
                    tempArr = [];
                selection.forEach(val => {
                    if (val.resourceId) {
                        tempArr.push(val.resourceId);
                    }
                });

                if (_this.selectRow.includes(row.resourceId)) {
                    _this.selectRow.splice(_this.selectRow.indexOf(row.resourceId), 1);
                }
                _this.selectRow = Array.from(new Set(_this.selectRow.concat(tempArr)));
            },

            // 计划禁用事件
            banUse: function () {
                if (this.selectRow.length > 0) {
                    this.dialogVisible = true;
                }
            },
            resloveBanUse: function () {
                if (this.selectRow.length > 0) {
                    this.dialogVisible = true;
                    this.showBanDialog = false;
                }
            },
            banPlan: function () {
                this.dialogVisible = false;
                if (this.showBanDialog) {
                    this.handlerBan(1);
                } else {
                    this.handlerBan(0);
                }
            },
            cancelBanPlan: function () {
                this.dialogVisible = false;
            },
            handlerBan: function (status) {
                const _this = this;
                if (_this.selectRow.length > 0) {
                    const params = {
                        "resourceIds": _this.selectRow,
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

            // 下载表格
            downloadTable: function () {
                $$ad.downloadTableModel(res => {
                    if (res.code === 0 && res.msg === "success") {
                        const url = res.data.adPosPrice_excel_template;
                        window.open(url);
                    }
                });
            },

            toggleSelection (rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange (val) {
                const _this = this;
                if (val.length == _this.tableData.length) {
                    this.multipleSelection = val;
                }
            }
        },
        beforeMount: function () {
            const _this = this;
            // 数据加载
            $$ad.on("getAdInfo", function (data) {
                if (data.code !== 0) {
                    _this.$message.error("加载失败");
                    _this.tableData = [];
                    return;
                }
                if (data.data.totalNum == 0) {
                    _this.tableData = [];
                    return;
                }
                _this.tableData = data.data.adPosData;
                _this.uplaodUrl = data.uplaodUrl;
                _this.total = data.data.totalNum;
                _this.currentPage = data.currentPage;

                // 分页后保存勾选
                const tmpArr = [];
                if (_this.tableData && _this.tableData.length > 0) {
                    _this.tableData.forEach(function (value) {
                        tmpArr.push(value.resourceId);
                    });
                }

                setTimeout(function () {
                    _this.selectRow.forEach(function (value) {
                        if (tmpArr.indexOf(value) >= 0) {
                            const index = tmpArr.indexOf(value);
                            _this.$refs.multipleTable.toggleRowSelection(_this.tableData[index]);
                        }
                    });
                }, 0);
            });
            $$model.on("clearRow", function () {
                _this.selectRow = [];
            });
        }
    };
</script>

