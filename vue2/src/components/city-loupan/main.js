import _ from "../../lib/underscore.v1.4.4.min.js";
import $$model_city from "../../script/data/model/city";
import $$searchParamsSuggest from "./search-params-suggest.js";
import $$model_user from "../../script/data/model/user";
import $$tableDataFilter from "./table-data-filter.js";
import $$util from "../../lib/util.js";

const CityLoupan = {
    name: "CityLoupan",
    data () {
        let data = {};
        data = _.extend(data, {
            loading: false,
            // ROLE_BE_STAFF_ESTATE_VIEW只具有查看权限
            role: "ROLE_BE_STAFF_ESTATE_VIEW",
            thead: [],
            forMatThead: {
                one: [],
                two: [],
                three: []
            },
            listData: [],
            compelteData: [],
            columns: [],
            ruleForm: {
                cityId: 1, // 城市id
                estateId: "", // 楼盘id
                estateCompanyId: "", // 开发商id
                estateOperatingPrincipalEmail: "", // 运营负责人名称
                estateSalesPrincipalEmail: "", // 销售负责人名称
                // estatePrincipalName: '', // 运营负责人名称
                // estateSalesName:'', // 销售负责人名称
                ecologicalDataStartDate: "", // 生态数据起始日期
                ecologicalDataEndDate: "", // 生态数据结束日期
                saleDataYear: new Date().getFullYear().toString(), // 销售数据年份
                saleDataQuarter: 1, // 销售数据季度
                adsDataYear: new Date().getFullYear().toString(), // 广告数据年份
                adsDataQuarter: 1 // 广告数据季度
            },
            searchType: "estate",
            cityList: [],
            estateAdsSaleYearList: [],
            estateAdsDataYearList: [],
            dateRange: ""
        });
        // 搜索类型数据扩展
        data = _.extend(data, $$searchParamsSuggest.data);
        data = _.extend(data, $$tableDataFilter.data);
        return data;
    },
    computed: {
        cityName () {
            if (this.cityList.length) {
                return _.find(this.cityList, item => item.id === this.ruleForm.cityId).name;
            } else {
                return "";
            }
        },
        cityListOptions () {
            return require("../../lib/sortByIndex")(this.cityList, "name");
        }
    },
    components: {
        adjustColumnDialog: require("./dialog/adjust-column.vue"),
        editBasicData: require("./dialog/edit-basic-data.vue"),
        cityDutyPerson: require("./dialog/city-duty-person.vue"),
        addSalesInfo: require("./dialog/add-sales-info.vue"),
        addLoupan: require("./dialog/add-loupan.vue"),
        insertData: require("./dialog/insert-data.vue")
    },
    methods: {
        cityCache () {
            // 缓存城市列表
            try {
                localStorage.setItem("ad-admin-city-id", this.ruleForm.cityId);
            } catch (e) {

            }
        },
        addParent (data) {
            if (data.children && data.children.length) {
                data.children.forEach(item => {
                    item.parent = data;
                    this.addParent(item);
                });
            }
        },
        getDeep (data) {
            // 获取当前根节点深度
            let deep = 1;
            const recursion = (data) => {
                if (data.parent && data.parent.parent) {
                    deep = 3;
                } else if (data.parent) {
                    deep = 2;
                }
                if (data.children && data.children.length) {
                    data.children.forEach(item => {
                        recursion(item);
                    });
                }
            };
            recursion(data);
            return deep;
        },
        getLeafs (data) {
            const leafs = [0, 0];
            const recursion = data => {
                if (data.parent && data.parent.parent) {
                    deep = 3;
                    leafs[1]++;
                } else if (data.parent) {
                    deep = 2;
                    leafs[0]++;
                }
                if (data.children && data.children.length) {
                    data.children.forEach(item => {
                        recursion(item);
                    });
                }
            };
            recursion(data);
            if (leafs[1]) {
                return leafs[1];
            } else {
                return leafs[0];
            }
        },
        getLevelData (data) {
            const list = [data];
            let i = 0;
            while (i <= 1) {
                if (list[i].length) {
                    list[i + 1] = [];
                    list[i].forEach(item => {
                        if (item.children && item.children.length) {
                            item.children.forEach(it => {
                                list[i + 1].push(it);
                            });
                        }
                    });
                }
                i++;
            }
            list.forEach(item => {
                item.forEach(it => {
                    it.colspan = this.getLeafs(it);
                });
            });
            return list;
        }
    },
    watch: {
        dateRange (val) {
            this.ruleForm.ecologicalDataStartDate = $$util.dateFormat(val[0], "yyyy-MM-dd");
            this.ruleForm.ecologicalDataEndDate = $$util.dateFormat(val[1], "yyyy-MM-dd");
        },
        thead: {
            deep: true,
            handler () {
                this.thead.forEach(item => {
                    this.addParent(item);
                });
                const levelData = this.getLevelData(this.thead);
                _.extend(this.forMatThead, {
                    one: levelData[0],
                    two: levelData[1],
                    three: levelData[2]
                });
                window.setTimeout(() => {
                    const $table = document.querySelector(".table-wrapper table"),
                        $th = document.querySelectorAll(".table-wrapper .item-header");
                    $table.style.width = $th.length * 120 + "px";
                }, 1);
            }
        },
        ruleForm: {
            deep: true,
            handler () {
                this.handleSearch();
            }
        }
    },
    beforeMount () {
        $$model_user.on("disableTab", roles => {
            const rolesArr = _.pluck(roles, "name");
            if (rolesArr.some(item => item === "ROLE_BE_STAFF_ESTATE_MANAGE")) {
                this.role = "ROLE_BE_STAFF_ESTATE_MANAGE";
            }

            if (rolesArr.some(item => item === "ROLE_BE_STAFF_SUPER_ADMIN")) {
                this.role = "ROLE_BE_STAFF_SUPER_ADMIN";
            }
        });
        try {
            if (localStorage.getItem("ad-admin-city-id")) {
                this.ruleForm.cityId = parseInt(localStorage.getItem("ad-admin-city-id")) || 1;
            }
        } catch (e) {

        }
        $$model_city.getCityList((res) => {
            if (res.errorCode === 0) {
                this.cityList = res.cityList.items;
            }
        });

        this.handleSearch();
    }
};

// 参数搜索逻辑
CityLoupan.methods = _.extend(CityLoupan.methods, $$searchParamsSuggest.methods);
// 表格数据筛选逻辑
CityLoupan.computed = _.extend(CityLoupan.computed, $$tableDataFilter.computed);
CityLoupan.methods = _.extend(CityLoupan.methods, $$tableDataFilter.methods);
CityLoupan.watch = _.extend(CityLoupan.watch, $$tableDataFilter.watch);

export default CityLoupan;
