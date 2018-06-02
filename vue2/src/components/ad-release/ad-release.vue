<template>
    <div class="ad-release">
        <div>
            <el-select class="city-select" v-model="selectCityList" multiple placeholder="请选择城市" @change="getCityList" filterable>
                <el-option-group
                        v-for="group in cityOptions"
                        :label="group.label">
                    <el-option v-for="item in group.options" :label="item.label" :value="item.value">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-button style="float:right;" @click="batchRelease">批量修改</el-button>
        </div>
        <el-table ref="adTable" :data="tableData" border style="width:100%;" selection-mode="multiple" @select-all="handleSelecAll" @select="handleSelection">
             <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column property="cityName" label="城市" align="center"></el-table-column>
            <el-table-column property="date" label="开放日期至" align="center"></el-table-column>
            <el-table-column label="操作" inline-template align="center">
                <a href="javascript:;" @click="showDateDialog(row.areaCode)">修改</a>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination v-show="this.tableData.length>0" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="修改时间" v-model="editDateDialog" size="tiny">
            <el-form :model="formDate">
                <el-form-item label="开放日期至">
                    <el-date-picker v-model="formDate.openDate" type="date" placeholder="选择日期" style="z-index: 1002;">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div class="realseResult" v-if="typeof releaseResult === 'object' && releaseResult.length > 0">
                <div class="tipInfo">
                    <span>释放失败广告位： {{releaseResult.length}} 个</span>
                </div>
                <el-table :data="releaseResult">
                    <el-table-column prop="resourceId" label="广告位ID"></el-table-column>
                    <el-table-column prop="name" label="广告位名称"></el-table-column>
                    <el-table-column prop="city" label="所属城市"></el-table-column>
                    <el-table-column prop="date" label="锁定日期"></el-table-column>
                    <el-table-column prop="status" label="锁定结果"></el-table-column>
                    <el-table-column prop="note" label="备注"></el-table-column>
                </el-table>
            </div>
            <div class="error-info" v-else-if="typeof releaseResult !== 'object'">错误：{{releaseResult}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editDateDialog = false">取 消</el-button>
                <el-button type="primary" @click.native="releaseAd()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
    .pagination {
    margin-top: 20px;
    text-align: right;
}

.ad-release {
    margin-top: 20px;
}

.search {
    display: inline-block;
    margin-bottom: 20px;
    width: 300px;
    overflow: hidden;
}

.city-select {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
    overflow: hidden;
}

.realseResult {
    max-height: 300px;
    overflow: auto;
}
</style>

<script>
    import $$ad from "../../script/data/model/ad";
    export default {
        name: "AdRelease",
        data () {
            return {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                tableData: [],
                editDateDialog: false,
                formDate: {
                    "openDate": ""
                },
                msg: "ad",
                operAreaCode: [],
                cityOptions: [],
                selectCityList: [],
                searchContent: "",
                cityNameAreaCode: {},
                releaseResult: [],
                releaseType: "single",
                singleReleaseAreaCode: 0,
                isRequire: false
            };
        },
        methods: {
            getReleaseData: function (areaCodeList) {
                if (!this.isRequire) return;
                const _this = this,
                    params = {
                        pageIndex: _this.currentPage,
                        limit: _this.pageSize
                    };
                if (areaCodeList && areaCodeList.length > 0) {
                    params.areaCodeList = areaCodeList;
                }
                window.localStorage.setItem("ad_release_searchContent", JSON.stringify({
                    "areaCodeList": areaCodeList
                }));

                $$ad.getReleaseInfo(params, data => {
                    if (data.code !== 0) {
                        return;
                    }
                    _this.total = data.data.totalNum;
                    _this.tableData = data.data.areaData;
                });
            },
            handleCurrentChange: function (val) {
                this.currentPage = val;
                const areaCodeList = this.selectCityList;
                this.getReleaseData(areaCodeList);
            },
            isExistEmpty: function (param) {
                let result = true;

                if (!(param instanceof Object)) {
                    if (param === "") {
                        return false;
                    }
                }
                for (const i in param) {
                    if (param[i] !== "") {
                        result = result && true;
                    } else {
                        result = result && false;
                        return;
                    }
                }
                return result;
            },
            showDateDialog: function (areaCode) {
                this.releaseType = "single";
                this.singleReleaseAreaCode = [areaCode];
                this.editDateDialog = true;
                this.releaseResult = [];
            },
            handleSelection: function (selection, raw) {
                this.operAreaCode = selection.map(function (item) {
                    return item.areaCode;
                });
            },
            handleSelecAll: function (selection) {
                this.operAreaCode = selection.map(function (item) {
                    return item.areaCode;
                });
            },
            releaseAd: function () {
                if (this.releaseResult.length > 0) {
                    this.editDateDialog = false;
                    return;
                }
                const _this = this;
                const subData = {
                    areaCodeList: _this.operAreaCode,
                    date: ""
                };
                if (_this.releaseType === "single") {
                    subData["areaCodeList"] = _this.singleReleaseAreaCode;
                }
                if (!_this.isExistEmpty(_this.formDate.openDate)) {
                    return;
                }
                subData.date = _this.formDate.openDate.getTime();
                if (!_this.isExistEmpty(subData)) {
                    return;
                }
                $$ad.releaseAd(subData, function (res) {
                    if (res.code === 0) {
                        // _this.$notify({
                        //     title: res.data,
                        //     message: '',
                        //     type: 'success',
                        //     duration: 2000
                        // });
                        _this.releaseResult = res.data.list;
                        $$ad.getReleaseInfo({
                            pageIndex: 1,
                            limit: 10
                        });
                    } else {
                        _this.$message({
                            type: "error",
                            message: "操作失败  " + res.msg
                        });
                    }
                });
            },
            getCityList: function () {
                this.getReleaseData(this.selectCityList);
            },
            batchRelease: function () {
                if (this.operAreaCode.length === 0) {
                    this.$message.error("请选择行！");
                    return;
                }
                this.releaseType = "batch";
                this.releaseResult = [];
                this.editDateDialog = true;
            },
            searchAds: function (value) {
                if (this.cityNameAreaCode[value]) {
                    this.getReleaseData([this.cityNameAreaCode[value]]);
                }
            }
        },
        watch: {
            "$route": function () {
                const _this = this;
                if (window.localStorage.getItem("ad_release_searchContent")) {
                    _this.selectCityList = JSON.parse(window.localStorage.getItem("ad_release_searchContent")).areaCodeList;
                }
            }
        },
        beforeMount: function () {
            const _this = this;
            $$ad.getAdParams();
            $$ad.on("getAdParams", function (data) {
                const cityArr = [];
                const cityOptions = data.data.areaCode;
                for (const i in cityOptions) {
                    cityArr.push({
                        id: parseInt(i, 10),
                        name: cityOptions[i]
                    });
                    _this.cityNameAreaCode[cityOptions[i]] = i;
                }
                _this.cityOptions = data.data.areaCodeList;

                // 本地存储
                const storgeObj = JSON.parse(window.localStorage.getItem("ad_release_searchContent"));
                if (storgeObj) {
                    _this.selectCityList = storgeObj.areaCodeList;
                }
                _this.isRequire = true;
                // 数据初始化
                _this.getReleaseData(_this.selectCityList);
            });
        }
    };
</script>
