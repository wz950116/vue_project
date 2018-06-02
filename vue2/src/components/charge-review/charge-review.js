import $$invoice from "../../script/data/model/invoice";

export default {
    data () {
        return {
            reFormData: {
                date: [], // 查询日期
                areaCode: "", // 选择城市
                status: "", // 审核状态
                extra: "", // 输入框内容
                pageSize: "10", // 每页显示数目
                pageIndex: 1 // 当前页码
            },
            statusList: [{
                label: "审核中",
                value: 0
            }, {
                label: "已通过",
                value: 1
            }, {
                label: "未通过",
                value: 2
            }, {
                label: "已撤回",
                value: 3
            }],
            areaCodeList: [], // 城市列表
            tableData: [],
            refuseReason: "", // 驳回原因
            refuseShow: false, // 驳回弹窗是否显示
            passShow: false, // 通过弹窗是否显示
            paymentShow: false, // 汇款凭证弹窗是否显示
            targetIndex: 0, // 当前操作数据的index
            totalCount: 0, // 总数据条数
            uploading: false // 函数节流
        };
    },
    watch: {
        reFormData: {
            deep: true,
            handler: function (newVal) {
                this.searchData(newVal);
            }
        }
    },
    methods: {
        showClick (type, index) {
            this.targetIndex = index;
            switch (type) {
            case "pass":
                this.passShow = true;
                break;
            case "refuse":
                this.refuseShow = true;
                break;
            case "payment":
                this.paymentShow = true;
                break;
            }
        },
        closeDialog () {
            this.passShow = false;
            this.refuseShow = false;
            this.refuseReason = "";
        },
        formatDate (date) {
            if (!date || date === "" || date === "NaN-NaN-NaN") return "";
            date = new Date(date);
            const year = date.getFullYear();
            const month = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            return year + "-" + month + "-" + day;
        },
        searchData (data) {
            const that = this;
            const params = {
                "page_index": data.pageIndex,
                "page_size": parseInt(data.pageSize),
                "area_code": parseInt(data.areaCode),
                "keyword": data.extra,
                "status": data.status || 0,
                "start_date": that.formatDate(data.date[0]),
                "end_date": that.formatDate(data.date[1])
            };
            $$invoice.chargeReviewList(params, function (data) {
                that.tableData = data.data.list;
                that.totalCount = data.data.totalCount;
            });

            // 本地存储设置
            window.localStorage.setItem("charge_review_searchContent", JSON.stringify({
                "status": params.status,
                "area_code": params.area_code,
                "start_date": params.start_date,
                "end_date": params.end_date
            }));
        },
        chargeAudit (type, rechargeId) {
            const that = this;
            if (that.uploading !== false) {
                return;
            }
            switch (type) {
            case "refuse":
                const params = {
                    recharge_comments: that.refuseReason,
                    recharge_id: rechargeId,
                    status: 2
                };
                that.uploading = true;
                $$invoice.chargeReviewAudit(params, function (data) {
                    that.uploading = false;
                    if (data.code !== 0) return;
                    if (data.data.updateresult !== 1) {
                        that.$message.error(data.msg);
                    } else {
                        that.$message({
                            message: "此充值已驳回",
                            type: "success"
                        });
                        that.closeDialog();
                        that.searchData(that.reFormData);
                    }
                });
                break;
            case "pass":
                const _params = {
                    recharge_comments: "",
                    recharge_id: rechargeId,
                    status: 1
                };
                that.uploading = true;
                $$invoice.chargeReviewAudit(_params, function (data) {
                    that.uploading = false;
                    if (data.code !== 0) return;
                    if (data.data.updateresult !== 1) {
                        that.$message.error(data.msg);
                    } else {
                        that.$message({
                            message: "此充值已通过",
                            type: "success"
                        });
                        that.closeDialog();
                        that.searchData(that.reFormData);
                    }
                });
                break;
            }
        },
        handleSizeChange (val) {
            this.reFormData.pageSize = val;
        },
        handleCurrentChange (val) {
            this.reFormData.pageIndex = val;
        }
    },
    beforeMount () {
        const that = this;
        $$invoice.getParameters({}, function (data) {
            if (data.code != 0) {
                that.$message({
                    showClose: true,
                    message: data.msg,
                    type: "error"
                });
                return;
            }
            that.areaCodeList = data.data.areaCodeList;
            const date = new Date();
            const endTime = that.formatDate(date);
            const startTime = that.formatDate(date.setDate(date.getDate() - 10));
            that.reFormData.areaCode = Object.keys(data.data.areaCode)[0];
            // that.reFormData.date.push(startTime,endTime);

            if (window.localStorage.getItem("charge_review_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("charge_review_searchContent"));
                that.reFormData.status = storageObj.status;
                that.reFormData.areaCode = storageObj.area_code + "";
                if (storageObj.start_date && storageObj.start_date !== "NaN-NaN-NaN") {
                    that.reFormData.date = [storageObj.start_date, storageObj.end_date];
                } else {
                    that.reFormData.date = [startTime, endTime];
                }
            }
            that.searchData(that.reFormData);
        });
    }
};
