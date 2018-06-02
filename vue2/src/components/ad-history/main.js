import $$model_ad_history from "./model-ad-history.js";
import $$util from "../../lib/util.js";
import userModel from "../../script/data/model/user";

export default {
    name: "ad-history",
    data () {
        return {
            loading: false,
            dialogVisible: false,
            date: new Date(),
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
            tableData: [],
            showDel: false
        };
    },
    methods: {
        handleAdd () {
            this.loading = true;
            $$model_ad_history.addPage(this.addForm, res => {
                this.loading = false;
                if (res.errorCode === 0) {
                    location.reload();
                } else {
                    this.$message({
                        message: res.errorDescription || "server error",
                        type: "warning"
                    });
                }
            });
        },
        handleSearch () {
            this.loading = true;
            $$model_ad_history.getUrlList(this.ruleForm, res => {
                this.loading = false;
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
                return;
            }

            if (new Date(this.date).getTime() > new Date(row.time_point).getTime()) {
                window.open(row.base_link_new + $$util.dateFormat(new Date(this.date), "yyyyMMdd") + row.detail_link + "?bedate=" + $$util.dateFormat(new Date(this.date), "yyyy-MM-dd"));
            } else {
                window.open(row.base_link_pre + $$util.dateFormat(new Date(this.date), "yyyyMMdd") + row.detail_link + "?bedate=" + $$util.dateFormat(new Date(this.date), "yyyy-MM-dd"));
            }
        },
        handleDel (row) {
            this.$confirm("是否删除此url?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                $$model_ad_history.delPage({ id: row.id }, res => {
                    this.loading = false;
                    if (res.errorCode === 0) {
                        window.location.reload();
                    } else {
                        this.$message({
                            message: res.errorDescription || "server error",
                            type: "warning"
                        });
                    }
                });
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
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
        // 只有超级管理员有权限删除
        userModel.getUserInfo(res => {
            if (res.data.roles[0].description === "后台系统超级管理员") {
                this.showDel = true;
            }
        });
        this.handleSearch();
    }
};
