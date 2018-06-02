import manageAgent from "./manage-agent/manage-agent.vue";
// import expendAgent from "./expend-agent/expend-agent.vue";
import $$customer from "../../script/data/model/customer";
import $$model_agent from "./model-agent.js";

export default {
    data () {
        return {
            headerData: [
                {
                    name: "代理商管理",
                    selected: true,
                    content: "manage-agent"
                },
                // {
                //     name: "代理商消耗",
                //     selected: false,
                //     content: "expend-agent"
                // }
            ],
            currentView: "manage-agent"
        };
    },
    components: {
        "manage-agent": manageAgent,
        // "expend-agent": expendAgent
    },
    methods: {
        selectTag (selectIndex) {
            this.headerData.forEach(function (item, index) {
                item.selected = (index === selectIndex);
            });
            this.currentView = this.headerData[selectIndex].content;
        }
    },
    beforeMount () {
        if (localStorage.getItem("costomer_agent") && localStorage.getItem("costomer_agent").currentView) {
            this.currentView = JSON.parse(localStorage.getItem("costomer_agent")).currentView;
        }
    },
    watch: {
        "$route": function () {
            const that = this;
            if (window.localStorage.getItem("customer_agent_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("customer_agent_searchContent"));
                if (storageObj.provinceCodes && storageObj.provinceCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        provinceValue: storageObj.provinceCodes
                    });
                }
                if (storageObj.cityCodes && storageObj.cityCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        cityValue: storageObj.cityCodes
                    });
                }
            }
        }
    },
    mounted () {
        const that = this;
        $$customer.getCustomerParams(function (data) {
            that.provinceOptions = data.provinceList;

            // 本地存储历史记录
            if (window.localStorage.getItem("customer_agent_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("customer_agent_searchContent"));
                if (storageObj.provinceCodes && storageObj.provinceCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        provinceValue: storageObj.provinceCodes
                    });
                }
                if (storageObj.cityCodes && storageObj.cityCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        cityValue: storageObj.cityCodes
                    });
                }
            } else {
                $$model_agent.list({
                    pageIndex: that.pageIndex,
                    pageSize: that.pageSize,
                    keyword: that.$route.query.id || "",
                    cityCodes: [],
                    provinceCodes: []
                }, res => {
                    if (res.code == 200) {
                        that.tableData = res.data.customerList;
                        that.total = res.data.totalCount;
                    }
                });
            }
            that.isRequire = true;
        });
    },
    beforeDestroy () {
        localStorage.setItem("costomer_agent", JSON.stringify({ currentView: this.currentView }));
    }
};
