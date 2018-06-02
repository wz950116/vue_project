<template>
    <div>
        <el-form 
            ref="form" 
            :model="adHeaderForm" label-width="70px" 
            @submit.prevent="onSubmit">
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期">
                    <el-date-picker 
                        v-model="dateRange" 
                        type="daterange" placeholder="选择日期范围"
                        style="width:217px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="平台" label-width="40px">
                    <el-select 
                        class="ad-header-item-value" 
                        v-model="adHeaderForm.platformValue" 
                        @change="getAdInfoList"
                        style="width:217px;">
                        <el-option v-for="item in platformOptions"
                                   :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所在城市">
                    <el-select 
                        class="ad-header-item-value" 
                        v-model="adHeaderForm.cityValue" 
                        @change="getAdInfoList"
                        style="width:217px;" filterable>
                        <el-option-group
                                v-for="group in cityOptions"
                                :label="group.label">
                            <el-option v-for="item in group.options" :label="item.label" :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级栏目">
                    <el-select 
                        class="ad-header-item-value" 
                        multiple v-model="adHeaderForm.lvl1Value" 
                        @change="getLvl2"
                        style="width:217px;">
                        <el-option v-for="(value, key) in lvl1Options"
                                   :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-form-item label="二级栏目">
                    <el-select class="ad-header-item-value" multiple v-model="adHeaderForm.lvl2Value"
                               @change="getAdInfoList" style="width:217px;">
                        <el-option v-for="(value, key) in lvl2Options"
                                   :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="屏次" label-width="40px">
                    <el-select class="ad-header-item-value" multiple v-model="adHeaderForm.screenValue"
                               @change="getAdInfoList" style="width:217px;">
                        <el-option v-for="(value, key) in screenOptions"
                                   :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告形式">
                    <el-select 
                        class="ad-header-item-value" 
                        multiple v-model="adHeaderForm.adTypeValue" 
                        @change="getAdInfoList" 
                        style="width:220px;">
                        <el-option v-for="(value, key) in adTypeOptions"
                                   :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-input placeholder="搜索资源ID或广告位名称" v-model="searchContent" style="width:240px;">
                    <el-button slot="append" icon="search" v-on:click="searchIconClick"></el-button>
                </el-input>
            </el-row>
            <el-row type="flex" justify="start">
                <el-form-item label="打底图规则" label-width="85px">
                    <el-select 
                        class="ad-header-item-value" 
                        multiple 
                        v-model="currentIdeaStatus" 
                        @change="getAdInfoList"
                        style="width:217px;">
                        <el-option 
                            v-for="(value, key) in baseIdeaStatus"
                            :value="value"
                            :label="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="定价情况">
                    <el-select 
                        class="ad-header-item-value" 
                        v-model="currentPriceStatus" 
                        @change="getAdInfoList"
                        style="width:217px;">
                        <el-option 
                            v-for="(value, key) in showPrice"
                            :value="key"
                            :label="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告状态">
                    <el-select 
                        class="ad-header-item-value" 
                        v-model="adPosAreaStatus" 
                        @change="getAdInfoList"
                        style="width:217px;" 
                        multiple>
                        <el-option 
                            v-for="(value, key) in areaStatus"
                            :value="value"
                            :label="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>
<style scoped>
    .ad-header-item {
    width: 150px;
    display: inline-block;
    overflow: hidden;
}

.ad-header-item-label {
    float: left;
}

.ad-header-item-value {
    float: left;
}

.header-thrid {
    margin-bottom: 10px;
    text-align: right;
}

.query-btn {
    display: inline-block;
    float: right;
    padding: 10px 15px;
    background: #8492a6;
    color: #fff;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 22px;
}

.query-btn:hover {
    background: #324057;
}

.el-date-editor {
    width: 100%;
}
</style>
<script>
    import $$ad from "../../script/data/model/ad";
    import _ from "../../lib/underscore.v1.4.4.min";
    let isFirst = true;
    export default {
        data () {
            return {
                self_name: "ad-header",
                adHeaderForm: {
                    platformValue: "",
                    cityValue: "",
                    lvl1Value: [],
                    lvl2Value: [],
                    screenValue: [],
                    adTypeValue: []
                },
                dateRange: [new Date(), new Date()],
                platformOptions: [],
                cityOptions: [],
                lvl1Options: [],
                allLvl2Options: [],
                lvl2Options: [],
                screenOptions: [],
                adTypeOptions: [],
                edtidAdPriceDialog: false,
                formAdPrice: {
                    normalPrice: "",
                    weekPrice: "",
                    priceDateRange: ""
                },
                uploadTableDialog: false,
                currentPage: 1,
                limit: 10,
                currentIdeaStatus: [],
                showPrice: {
                    "0": "仅显示未定价",
                    "1": "仅显示定价",
                    "2": "全部"
                },
                currentPriceStatus: "",
                adPosAreaStatus: "",
                searchContent: ""
            };
        },
        methods: {
            isExistEmpty: function (param) {
                let result = true;
                for (const i in param) {
                    if (param[i] instanceof Array) {
                        if (param[i].length > 0) {
                            result = result && true;
                        } else {
                            result = result && false;
                            return;
                        }
                    } else if (param[i] !== "") {
                        result = result && true;
                    } else {
                        result = result && false;
                        return;
                    }
                }
                return result;
            },
            showEdtidAdPriceDialog: function () {
                this.edtidAdPriceDialog = true;
            },
            showUploadTableDialog: function () {
                this.uploadTableDialog = true;
            },
            getLvl2: function (ids) {
                const that = this;
                const relation = this.firstSecondRelation;
                const lvl2Options = {};

                let matchedLvl2Ids = [];
                ids.forEach(function (id) {
                    if (relation && relation.hasOwnProperty(id)) {
                        matchedLvl2Ids = matchedLvl2Ids.concat(relation[id]);
                    }
                });

                matchedLvl2Ids.forEach(function (lvl2) {
                    if (that.secondColumn && that.secondColumn.hasOwnProperty(lvl2)) {
                        matchedLvl2Ids.forEach(function (lvl2) {
                            lvl2Options[lvl2] = that.secondColumn[lvl2];
                        });
                    }
                });

                this.lvl2Options = lvl2Options;

                const arrTmp = [];
                that.adHeaderForm.lvl2Value.forEach(item => {
                    if (matchedLvl2Ids.indexOf(item) >= 0) {
                        arrTmp.push(item);
                    }
                });
                that.adHeaderForm.lvl2Value = arrTmp;
    
                this.getAdInfoList();
            },
            getAdInfoList: function (type) {
                if (isFirst) {
                    return;
                }
                if (type !== "fromPage") {
                    this.currentPage = 1;
                }
                const _this = this;
                const subData = {
                    "platformType": _this.adHeaderForm.platformValue,
                    "areaCode": _this.adHeaderForm.cityValue,
                    "beginDate": _this.dateRange[0] ? _this.dateRange[0].getTime() : "",
                    "endDate": _this.dateRange[1] ? _this.dateRange[1].getTime() : "",
                    "pageIndex": _this.currentPage,
                    "limit": _this.limit
                };

                if (_this.adHeaderForm.lvl1Value && _this.adHeaderForm.lvl1Value.length > 0) {
                    _.extend(subData, {
                        "firstColumns": _this.adHeaderForm.lvl1Value
                    });
                }
                if (_this.adHeaderForm.lvl2Value && _this.adHeaderForm.lvl2Value.length > 0) {
                    _.extend(subData, {
                        "secondColumns": _this.adHeaderForm.lvl2Value
                    });
                }
                if (_this.adHeaderForm.screenValue && _this.adHeaderForm.screenValue.length > 0) {
                    _.extend(subData, {
                        "pageNums": _this.adHeaderForm.screenValue
                    });
                }
                if (_this.adHeaderForm.adTypeValue && _this.adHeaderForm.adTypeValue.length > 0) {
                    _.extend(subData, {
                        "ideaTypes": _this.adHeaderForm.adTypeValue
                    });
                }
                if (_this.currentIdeaStatus && _this.currentIdeaStatus.length > 0) {
                    _.extend(subData, {
                        "baseIdeaStatus": _this.currentIdeaStatus.map(function (value) {
                            return value + "";
                        })
                    });
                }
                if (_this.currentPriceStatus && _this.currentPriceStatus.length > 0) {
                    _.extend(subData, {
                        "ifPrice": _this.currentPriceStatus
                    });
                }
                if (_this.adPosAreaStatus && _this.adPosAreaStatus.length > 0) {
                    _.extend(subData, {
                        "adPosAreaStatus": _this.adPosAreaStatus
                    });
                }

                window.localStorage.setItem("ad_manage_searchContent", JSON.stringify(subData));

                $$ad.getAdInfo(subData);
            },
            searchIconClick () {
                const _this = this;
                const subData = {
                    "areaCode": _this.adHeaderForm.cityValue,
                    "beginDate": _this.dateRange[0] ? _this.dateRange[0].getTime() : " ",
                    "endDate": _this.dateRange[1] ? _this.dateRange[1].getTime() : " ",
                    "limit": _this.limit,
                    "searchContent": _this.searchContent
                };
                $$ad.getAdInfo(subData);
            }
        },
        watch: {
            dateRange: {
                deep: true,
                handler: function () {
                    this.getAdInfoList();
                }
            },
            "$route": function () {
                const _this = this;
                if (localStorage.getItem("ad_manage_searchContent")) {
                    const params = JSON.parse(localStorage.getItem("ad_manage_searchContent"));
                    // 本地存储保存历史勾选项
                    _this.adHeaderForm.platformValue = params["platformType"];
                    _this.adHeaderForm.cityValue = params["areaCode"];
                    _this.adHeaderForm.lvl1Value = params["firstColumns"] ? params["firstColumns"] : [];
                    _this.adHeaderForm.lvl2Value = params["secondColumns"] ? params["secondColumns"] : [];
                    _this.adHeaderForm.screenValue = params["pageNums"] ? params["pageNums"] : [];
                    _this.adHeaderForm.adTypeValue = params["ideaTypes"] ? params["ideaTypes"] : [];
                    _this.currentIdeaStatus = params["baseIdeaStatus"] ? params["baseIdeaStatus"].map(function (item) { return item * 1; }) : [];
                    _this.currentPriceStatus = params["ifPrice"] ? params["ifPrice"] : [];
                    _this.adPosAreaStatus = params["adPosAreaStatus"] ? params["adPosAreaStatus"] : [];
                }
            }
        },
        beforeMount: function () {
            const _this = this;
            // 数据加载
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
                _this.platformOptions = array;
                _this.cityOptions = data.data.areaCodeList;
                _this.lvl1Options = data.data.firstColumn;
                _this.secondColumn = data.data.secondColumn;
                _this.screenOptions = data.data.pageNum;
                _this.adTypeOptions = data.data.ideaType;
                _this.firstSecondRelation = data.data.firstSecondRelation;
                _this.allLvl2Options = data.data.secondColumn;
                _this.adHeaderForm.cityValue = cityArr[0].id;
                _this.adHeaderForm.platformValue = array[0].id;
                _this.baseIdeaStatus = data.data.baseIdeaStatus;
                _this.areaStatus = data.data.adPosAreaStatus;

                let params = {
                    "platformType": _this.adHeaderForm.platformValue,
                    "areaCode": _this.adHeaderForm.cityValue,
                    "beginDate": _this.dateRange[0].getTime(),
                    "endDate": _this.dateRange[1].getTime(),
                    "pageIndex": 1,
                    "limit": _this.limit
                };

                if (localStorage.getItem("ad_manage_searchContent")) {
                    params = JSON.parse(localStorage.getItem("ad_manage_searchContent"));
                }

                // 本地存储保存历史勾选项
                _this.adHeaderForm.platformValue = params["platformType"];
                _this.adHeaderForm.cityValue = params["areaCode"];
                _this.adHeaderForm.lvl1Value = params["firstColumns"] ? params["firstColumns"] : [];
                _this.adHeaderForm.lvl2Value = params["secondColumns"] ? params["secondColumns"] : [];
                _this.adHeaderForm.screenValue = params["pageNums"] ? params["pageNums"] : [];
                _this.adHeaderForm.adTypeValue = params["ideaTypes"] ? params["ideaTypes"] : [];
                _this.currentIdeaStatus = params["baseIdeaStatus"] ? params["baseIdeaStatus"].map(function (item) { return item * 1; }) : [];
                _this.currentPriceStatus = params["ifPrice"] ? params["ifPrice"] : [];
                _this.adPosAreaStatus = params["adPosAreaStatus"] ? params["adPosAreaStatus"] : [];

                $$ad.getAdInfo(params, function () {
                    isFirst = false;
                });
            });

            $$ad.getAdParams();

            $$ad.on("getAdDownloadParams", function (data) {
                const params = {
                    "platformType": _this.adHeaderForm.platformValue,
                    "areaCode": _this.adHeaderForm.cityValue,
                    "beginDate": _this.dateRange[0].getTime(),
                    "endDate": _this.dateRange[1].getTime()
                };
                if (_this.adHeaderForm.lvl1Value && _this.adHeaderForm.lvl1Value.length > 0) {
                    _.extend(params, {
                        "firstColumns": _this.adHeaderForm.lvl1Value
                    });
                }
                if (_this.adHeaderForm.lvl2Value && _this.adHeaderForm.lvl2Value.length > 0) {
                    _.extend(params, {
                        "secondColumns": _this.adHeaderForm.lvl2Value
                    });
                }
                if (_this.adHeaderForm.screenValue && _this.adHeaderForm.screenValue.length > 0) {
                    _.extend(params, {
                        "pageNums": _this.adHeaderForm.screenValue
                    });
                }
                if (_this.adHeaderForm.adTypeValue && _this.adHeaderForm.adTypeValue.length > 0) {
                    _.extend(params, {
                        "ideaTypes": _this.adHeaderForm.adTypeValue
                    });
                }

                $$ad.on("downloadAd", function (data) {
                    if (data.code === 0) {
                        _this.$notify({
                            title: "数据导出成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        window.open(data.data.fileUrl);
                    } else {
                        _this.$notify({
                            title: "数据导出失败",
                            message: "",
                            type: "error",
                            duration: 2000
                        });
                    }
                });
                $$ad.downloadAd(params);
            });

            $$ad.on("getAdUploadParams", function (data) {
                // const params = {
                //     "beginDate": _this.dateRange[0].getTime(),
                //     "endDate": _this.dateRange[1].getTime(),
                //     "inputStream": data.inputStream
                // };
            });

            $$ad.on("stopUse", function (data) {
                const params = {
                    resourceIds: data.ids,
                    beginDate: _this.dateRange[0].getTime(),
                    endDate: _this.dateRange[1].getTime()
                };
                $$ad.disableAdTest(params, function (data) {
                    if (data.code === 0) {
                        $$ad.disableAd(params, function (data) {
                            if (data.code === 0) {
                                _this.$message({
                                    type: "success",
                                    message: "禁用成功!"
                                });
                            } else {
                                _this.$message({
                                    type: "error",
                                    message: "操作失败"
                                });
                            }
                        });
                    } else if (data.code == 403) {
                        _this.$message({
                            type: "error",
                            message: "没有权限"
                        });
                    } else {
                        _this.$message({
                            type: "error",
                            message: "操作失败"
                        });
                    }
                });
            });

            $$ad.on("actionSuccess", function (data) {
                _this.getAdInfoList("fromPage");
            });

            $$ad.on("getAdInfoByPage", function (page) {
                _this.currentPage = page;
                _this.getAdInfoList("fromPage");
            });
        }
    };
</script>
