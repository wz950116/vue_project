import $$ad from "../../script/data/model/ad";
import _ from "../../lib/underscore.v1.4.4.min";
export default {
    data () {
        return {
            adFormData: {
                areaCode: "",
                platForm: "",
                date: [],
                firstColumn: [],
                secondColumn: [],
                pageNum: [],
                ideaType: [],
                operation: [], // 是否对外
                extra: "" // 输入框内容
            },
            areaCodeList: [],
            platForm: {},
            firstColumn: {},
            allSecondColumn: {},
            firstSecondRelation: {},
            pageNum: {},
            ideaType: {},
            tableData: [],
            dateList: []
        };
    },
    watch: {
        adFormData: {
            deep: true,
            handler: function (value) {
                this.searchData();
            }
        },
        "$route": function () {
            const _this = this;
            if (window.localStorage.getItem("ad_schedule_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("ad_schedule_searchContent"));
                if (storageObj.area && storageObj.area.length > 0) {
                    _.extend(_this.adFormData, {
                        areaCode: storageObj.area
                    });
                }
                if (storageObj.platform && storageObj.platform.length > 0) {
                    _.extend(_this.adFormData, {
                        platForm: storageObj.platform
                    });
                }
                // 日期
                if (storageObj.firstDay && storageObj.lastDay) {
                    _.extend(_this.adFormData, {
                        date: [new Date(), new Date()]
                    });
                }
                if (storageObj.firstCols && storageObj.firstCols.length > 0) {
                    _.extend(_this.adFormData, {
                        firstColumn: storageObj.firstCols
                    });
                }
                if (storageObj.secondCols && storageObj.secondCols.length > 0) {
                    _.extend(_this.adFormData, {
                        secondColumn: storageObj.secondCols
                    });
                }
                if (storageObj.pages && storageObj.pages.length > 0) {
                    _.extend(_this.adFormData, {
                        pageNum: storageObj.pages
                    });
                }
                if (storageObj.ideas && storageObj.ideas.length > 0) {
                    _.extend(_this.adFormData, {
                        ideaType: storageObj.ideas
                    });
                }
                if (storageObj.operations && storageObj.operations.length > 0) {
                    _.extend(_this.adFormData, {
                        operation: storageObj.operations
                    });
                }
            }
        }
    },
    computed: {
        getSecondColumn: function () {
            const secondColumn = {};
            const self = this;
            if (self.adFormData.firstColumn && self.adFormData.firstColumn.length > 0) {
                self.adFormData.firstColumn.forEach(function (item, index, array) {
                    self.firstSecondRelation[item] && self.firstSecondRelation[item].forEach(function (item, index, array) {
                        secondColumn[item] = self.allSecondColumn[item];
                    });
                });
            }
            return secondColumn;
        },
        getDateList: function () {
            const self = this;
            const startTime = new Date(self.adFormData.date[0]);
            const endTime = new Date(self.adFormData.date[1]);
            const allDate = [];
            while ((endTime.getTime() - startTime.getTime()) >= 0) {
                const year = startTime.getFullYear();
                const month = startTime.getMonth() > 8 ? startTime.getMonth() + 1 : "0" + (startTime.getMonth() + 1);
                const day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
                allDate.push(year + "-" + month + "-" + day);
                startTime.setDate(startTime.getDate() + 1);
            }
            return allDate;
        }
    },
    methods: {
        isShow: function (param, item) {
            if (param) {
                return true;
            } else {
                return false;
            }
        },
        checkDetail: function (id) {
            this.$router.push({
                name: "ad-list",
                query: {
                    "id": id,
                    "select": "orderId"
                }
            });
        },
        getClass: function (param) {
            return param ? (param === "true" ? "whiteUser" : "generalUser") : "123";
        },
        searchData: function () {
            const self = this;
            const startTime = self.changeDate(self.adFormData.date[0]);
            const endTime = self.changeDate(self.adFormData.date[1]);
            const params = {
                "area": self.adFormData.areaCode,
                "firstDay": startTime,
                "lastDay": endTime,
                "platform": self.adFormData.platForm,
                "firstCols": self.adFormData.firstColumn && self.adFormData.firstColumn.length > 0 ? self.adFormData.firstColumn : null,
                "secondCols": self.adFormData.secondColumn && self.adFormData.secondColumn.length > 0 ? self.adFormData.secondColumn : null,
                "pages": self.adFormData.pageNum && self.adFormData.pageNum.length > 0 ? self.adFormData.pageNum : null,
                "ideas": self.adFormData.ideaType && self.adFormData.ideaType.length > 0 ? self.adFormData.ideaType : null,
                "operations": self.adFormData.operation && self.adFormData.operation.length > 0 ? self.adFormData.operation : null,
                "extra": self.adFormData.extra == "" ? null : self.adFormData.extra
            };

            window.localStorage.setItem("ad_schedule_searchContent", JSON.stringify(params));

            $$ad.getAdPosSched(params, function (data) {
                if (data.code != 0) {
                    self.$message({
                        showClose: true,
                        message: data.msg,
                        type: "error"
                    });
                } else {
                    self.tableData = data.data;
                }
            });
        },
        changeDate: function (date) {
            date = new Date(date);
            const year = date.getFullYear();
            const month = date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
            const day = date.getDate().toString().length == 1 ? "0" + date.getDate() : date.getDate();
            return year + "-" + month + "-" + day;
        },
        download: function () {
            const self = this;
            const startTime = self.changeDate(self.adFormData.date[0]);
            const endTime = self.changeDate(self.adFormData.date[1]);
            const params = {
                "area": self.adFormData.areaCode,
                "firstDay": startTime,
                "lastDay": endTime,
                "platform": self.adFormData.platForm,
                "firstCols": self.adFormData.firstColumn.length == 0 ? null : self.adFormData.firstColumn,
                "secondCols": self.adFormData.secondColumn.length == 0 ? null : self.adFormData.firstColumn,
                "pages": self.adFormData.pageNum.length == 0 ? null : self.adFormData.firstColumn,
                "ideas": self.adFormData.ideaType.length == 0 ? null : self.adFormData.firstColumn,
                "operations": self.adFormData.operation.length == 0 ? null : self.adFormData.firstColumn,
                "extra": self.adFormData.extra == "" ? null : self.adFormData.extra
            };
            $$ad.downloadAdPosSched(params, function (data) {
                if (data.code != 0) {
                    self.$message({
                        showClose: true,
                        message: data.msg,
                        type: "error"
                    });
                } else {
                    window.open(data.data);
                }
            });
        }
    },
    beforeMount: function () {
        const _this = this;
        // 数据加载
        $$ad.on("getAdParams", function (data) {
            if (data.code != 0) {
                _this.$message({
                    showClose: true,
                    message: data.msg,
                    type: "error"
                });
                return;
            }
            _this.areaCodeList = data.data.areaCodeList;
            _this.platForm = data.data.platform;
            _this.firstColumn = data.data.firstColumn;
            _this.allSecondColumn = data.data.secondColumn;
            _this.firstSecondRelation = data.data.firstSecondRelation;
            _this.pageNum = data.data.pageNum;
            _this.ideaType = data.data.ideaType;
            // 发出初始数据请求
            const areaOptions = data.data.areaCode;
            const areaArray = [];
            for (const key in areaOptions) {
                areaArray.push({
                    id: key,
                    value: areaOptions[key]
                });
            }

            const platFormOptions = data.data.platform;
            const platFormArray = [];
            for (const item in platFormOptions) {
                platFormArray.push({
                    id: item,
                    value: platFormOptions[item]
                });
            }
            const date = new Date();
            const startTime = _this.changeDate(date);
            const endTime = _this.changeDate(date.setDate(date.getDate() + 7));
            _this.adFormData = {
                areaCode: areaArray[0].id,
                platForm: platFormArray[0].id,
                date: [startTime, endTime],
                firstColumn: [],
                secondColumn: [],
                pageNum: [],
                ideaType: [],
                operation: [], // 是否对外
                extra: "" // 输入框内容
            };

            // 本地存储
            if (window.localStorage.getItem("ad_schedule_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("ad_schedule_searchContent"));
                if (storageObj.area && storageObj.area.length > 0) {
                    _.extend(_this.adFormData, {
                        areaCode: storageObj.area
                    });
                }
                if (storageObj.platform && storageObj.platform.length > 0) {
                    _.extend(_this.adFormData, {
                        platForm: storageObj.platform
                    });
                }
                // 日期
                if (storageObj.firstDay && storageObj.lastDay) {
                    _.extend(_this.adFormData, {
                        date: [new Date(), new Date()]
                    });
                }
                if (storageObj.firstCols && storageObj.firstCols.length > 0) {
                    _.extend(_this.adFormData, {
                        firstColumn: storageObj.firstCols
                    });
                }
                if (storageObj.secondCols && storageObj.secondCols.length > 0) {
                    _.extend(_this.adFormData, {
                        secondColumn: storageObj.secondCols
                    });
                }
                if (storageObj.pages && storageObj.pages.length > 0) {
                    _.extend(_this.adFormData, {
                        pageNum: storageObj.pages
                    });
                }
                if (storageObj.ideas && storageObj.ideas.length > 0) {
                    _.extend(_this.adFormData, {
                        ideaType: storageObj.ideas
                    });
                }
                if (storageObj.operations && storageObj.operations.length > 0) {
                    _.extend(_this.adFormData, {
                        operation: storageObj.operations
                    });
                }
            }
        });
        $$ad.getAdParams();
    }
};
