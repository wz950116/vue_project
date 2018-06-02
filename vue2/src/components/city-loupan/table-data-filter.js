/**
* @Description: 表格数据处理
*/

import $$model_cityLoupan from "./model/city-loupan.js";
import _ from "../../lib/underscore.v1.4.4.min.js";

// 需要插入的字段
const editColumns = [
    "parentCompany", // 母公司(特殊)
    "estateDirector", // 董事
    "estatePresident", // 总经理
    "estateProjectDirector", // 项目总监
    "estatePlanningDirector", // 策划总监
    "estateSalesDirector", // 营销总监
    "estateSalesAddress", // 售楼处地址(特殊)
    "estatePlanningManager", // 策划经理
    "estateSalesManager", // 营销经理
    "propertyConsultant", // 置业顾问
    "estateSecurityGuard", // 保安
    "estateCleaning", // 清洁
    "estateInvestors", // 投资商名称
    "estateAgent", // 代理商
    "estateCourtier" // 经济公司
];

export default {
    data: {
        tableList: [],
        columnsNameMap: {},
        isSelectAll: false,
        // 销售状态
        estateSaleStatusList: [],
        saleStatus: [],

        // 运营负责小组
        operatingGroupList: [],
        operating: [],

        // 销售负责小组
        salesGroupList: [],
        salesGroup: [],

        // 销售负责人
        salesPrincipalNameSelect: [],
        salesPrincipalNameOption: [],

        // 运营负责人
        operatingPrincipalNameSelect: [],
        operatingPrincipalNameOption: []
    },
    watch: {
        listData (val) {
            const newList = [];

            val.forEach(item => {
                const single = {
                    list: []
                };
                this.columns.forEach(it => {
                    // 可以自定义添加的字段
                    if (editColumns.indexOf(it) >= 0) {
                        let innerItem = {};

                        if (item[it] && item[it].name) {
                            innerItem = _.extend(item[it], {
                                title: this.columnsNameMap[it],
                                key: it,
                                edit: true,
                                estateId: item.estateId
                            });
                        } else {
                            innerItem = {
                                name: item[it] || "",
                                title: this.columnsNameMap[it],
                                key: it,
                                edit: true,
                                estateId: item.estateId
                            };
                        }

                        // 简单编辑模式[母公司, 售楼处地址]
                        if (it === "parentCompany" || it === "estateSalesAddress") {
                            innerItem.simple = true;
                        }
                        single.list.push(innerItem);
                    } else {
                        single.list.push(item[it] || "");
                    }
                });
                // 是否写入数据库
                single.isSavedInDB = item.isSavedInDB;
                single.isSelect = false;
                single.estateId = item.estateId;

                newList.push(single);
            });
            this.tableList = newList;
        }
    },
    methods: {
        columnSelectAll () {
            if (this.isSelectAll === true) {
                this.tableList.forEach(item => {
                    item.isSelect = true;
                });
            } else {
                this.tableList.forEach(item => {
                    item.isSelect = false;
                });
            }
        },
        columnSelect () {
            if (this.tableList.every(item => item.isSelect === true)) {
                this.isSelectAll = true;
            } else {
                this.isSelectAll = false;
            }
        },
        resetSearch () {
            this.ruleForm = _.extend(this.ruleForm, {
                estateId: "",
                estateCompanyId: "",
                estatePrincipalName: "",
                estateSalesName: ""
            });
        },
        feFilter (data) {
            this.listData = this.compelteData.filter(item => {
                let flag = true;

                // 销售状态筛选
                if (item.saleStatus) {
                    if (this.saleStatus.indexOf(item.saleStatus.id) < 0) {
                        flag = false;
                    }
                }

                // 运营负责小组筛选
                if (item.estateOperatingGroup) {
                    if (this.operating.indexOf(item.estateOperatingGroup.id) < 0) {
                        flag = false;
                    }
                }

                // // 销售负责小组筛选
                if (item.estateSalesGroup) {
                    if (this.salesGroup.indexOf(item.estateSalesGroup.id) < 0) {
                        flag = false;
                    }
                }

                // 运营负责人筛选
                if (item.operatingPrincipalName) {
                    if (this.operatingPrincipalNameSelect.indexOf(item.operatingPrincipalName.id) < 0) {
                        flag = false;
                    }
                }

                // // 销售负责人筛选
                if (item.salesPrincipalName) {
                    if (this.salesPrincipalNameSelect.indexOf(item.salesPrincipalName.id) < 0) {
                        flag = false;
                    }
                }
                return flag;
            });
        },
        dialogInsertDataShow (data) {
            // 新增模式
            const $insertData = this.$refs.insertData;
            $insertData.title = data.title;
            $insertData.edit = false;
            if (data.simple) {
                $insertData.simpleDialog = true;
                $insertData.simpleForm.estateId = data.estateId;
                $insertData.simpleForm.key = data.key;
            } else {
                $insertData.dialogVisble = true;
                $insertData.ruleForm.estateId = data.estateId;
                $insertData.ruleForm.type = data.key;
            }
        },
        dialogInsertDataShowEdit (data) {
            // 编辑模式
            const $insertData = this.$refs.insertData;
            $insertData.title = data.title;
            $insertData.edit = true;
            if (data.simple) {
                $insertData.simpleDialog = true;
                _.extend($insertData.simpleForm, {
                    estateId: data.estateId,
                    key: data.key,
                    name: data.name
                });
            } else {
                $insertData.dialogVisble = true;
                _.extend($insertData.ruleForm, {
                    id: data.id,
                    estateId: data.estateId,
                    type: data.key,
                    name: data.name,
                    companyName: data.companyName,
                    phone: data.phone,
                    email: data.email,
                    desc: data.desc
                });
            }
        },
        handleSearch () {
            const doSearch = () => {
                this.loading = true;
                $$model_cityLoupan.getTableData(this.ruleForm, res => {
                    this.loading = false;
                    if (res.code === 200) {
                        this.listData = res.data || [];
                        this.compelteData = res.data || [];
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });

                // 获取销售负责人列表
                $$model_cityLoupan.getPrincipalNameListByGroupList({ groupIdList: _.pluck(this.salesGroupList, "id") }, res => {
                    if (res.code === 200) {
                        this.salesPrincipalNameOption = res.data.adEstatePrincipalGroupList;
                        this.salesPrincipalNameSelect = _.pluck(this.salesPrincipalNameOption, "email");
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });

                // 获取运营负责人列表
                $$model_cityLoupan.getPrincipalNameListByGroupList({ groupIdList: _.pluck(this.operatingGroupList, "id") }, res => {
                    if (res.code === 200) {
                        this.operatingPrincipalNameOption = res.data.adEstatePrincipalGroupList;
                        this.operatingPrincipalNameSelect = _.pluck(this.operatingPrincipalNameOption, "email");
                    } else {
                        this.$message.error(res.msg || "server error");
                    }
                });
            };

            // 活动
            $$model_cityLoupan.getTheadData({ cityId: this.ruleForm.cityId }, res => {
                if (res.code === 200) {
                    const data = require("./deal-thead-data.js")(res.data.treeMapList);
                    this.thead = data;
                    this.estateAdsSaleYearList = res.data.estateAdsSaleYearList; // 初始化销售数据年限选项
                    this.estateAdsDataYearList = res.data.estateAdsDataYearList; // 初始化广告数据年限选项
                    this.estateSaleStatusList = res.data.estateSaleStatusList; // 初始化销售状态选项[默认需要全选]
                    this.saleStatus = _.pluck(res.data.estateSaleStatusList, "id");
                    this.operatingGroupList = res.data.operatingGroupList; // 初始化运营负责小组选项[默认需要全选]
                    this.operating = _.pluck(res.data.operatingGroupList, "id");
                    this.salesGroupList = res.data.salesGroupList; // 初始化销售负责小组选项[默认需要全选]
                    this.salesGroup = _.pluck(res.data.salesGroupList, "id");
                    this.columns = res.data.columns;
                    this.columnsNameMap = res.data.columnsNameMap;
                    doSearch();
                } else {
                    this.$message.error(res.msg || "server error");
                }
            });
        }
    },
    computed: {

    }
};
