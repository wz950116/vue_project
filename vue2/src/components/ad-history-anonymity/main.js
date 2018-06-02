import $$model_ad_history from "./model-ad-history-anonymity.js";

export default {
    name: "ad-history-anonymity",
    data () {
        return {
            dialogVisible: false,
            date: "",
            ruleForm: {
                nameLike: "",
                pageIndex: 1,
                pageSize: 10
            },
            totalCount: 10,
            rules: {

            },
            addForm: {
                url: "",
                name: ""
            },
            addRules: {

            },
            tableData: []
        };
    },
    methods: {
        handleSearch () {
            debugger;
            $$model_ad_history.getUrlList(this.ruleForm, res => {
                const info = res.data;
                if (res.errorCode === 0) {
                    this.tableData = info.dataList;
                    this.ruleForm.pageIndex = info.pageIndex;
                    this.ruleForm.pageSize = info.pageSize;
                    this.totalCount = info.totalCount;
                } else {
                    this.$message({
                        message: res.errorDescription || "server error",
                        type: "warning"
                    });
                }
            });
        },
        handleDetail (row) {
            if (!this.date) {
                this.$message({
                    message: "请先选择日期",
                    type: "warning"
                });
            }
        },
        handleSizeChange (val) {
            this.ruleForm.pageSize = val;
            this.handleSearch();
        },
        handleCurrentChange (val) {
            this.ruleForm.pageIndex = val;
            this.handleSearch();
        }
    },
    beforeMount () {
        this.handleSearch();
    }
};
