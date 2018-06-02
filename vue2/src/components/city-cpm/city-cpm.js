import $$model_cpm from "./model-cpm.js";
import _ from "../../lib/underscore.v1.4.4.min.js";
export default {
    components: {
        popDialog: require("./pop-dialog/pop-dialog.vue"),
        popResource: require("./pop-dialog/pop-resource.vue")
    },
    data () {
        const end = new Date().getTime(),
            start = end - 86400000;
        return {
            dateRange: [new Date(start), new Date(end)],
            platformType: "0",
            options: [],
            resourcesId: [],
            tableData: [],
            page: {
                pageSize: "10", // 每页显示数目
                pageIndex: 1// 当前页码
            },
            totalCount: 0, // 总数据条数
            columns: [
                {
                    prop: "name",
                    label: "资源名称",
                    width: 100
                }, {
                    prop: "platformName",
                    label: "所属平台",
                    width: 100
                }, {
                    prop: "costTypeName",
                    label: "计费方式",
                    width: 100
                }, {
                    prop: "ideaType",
                    label: "广告形式",
                    width: 100
                }, {
                    prop: "ideaStyle",
                    label: "创意样式",
                    width: 100
                }, {
                    prop: "ideaForm",
                    label: "创意形式",
                    width: 200
                }, {
                    prop: "format",
                    label: "规格",
                    width: 400
                }, {
                    prop: "size",
                    label: "大小",
                    width: 300
                }, {
                    prop: "supportType",
                    label: "支持类型",
                    width: 100
                }, {
                    prop: "inventory",
                    label: "CPM库存",
                    width: 100
                }, {
                    prop: "used",
                    label: "CPM消耗",
                    width: 100
                }, {
                    prop: "saleRate",
                    label: "CPM售出率",
                    width: 100
                }, {
                    prop: "floorPrice",
                    label: "CPM底价",
                    width: 100
                }, {
                    prop: "income",
                    label: "CPM收入",
                    width: 100
                }, {
                    prop: "status",
                    label: "资源状态",
                    width: 100
                }
            ]
        };
    },
    watch: {
        dateRange: function (newValue, oldValue) {
            if (newValue != "") {
                if ((oldValue == "") || (oldValue[0].valueOf() != newValue[0].valueOf())) {
                    this.getResourceList();
                }
            }
        },
        page: {
            deep: true,
            handler () {
                this.getResourceList();
            }
        }
    },
    methods: {
        format (row, col) {
            const property = col.property;
            switch (property) {
            case "format":
                const data = row[property];
                return data.join("\n");
            case "ideaForm":
                col.isColumnGroup = true;
                let a = "";
                row[property].forEach(function (item) {
                    a += item + "&lt;br&gt;";
                });
                return a;
            case "ideaStyle":
                return row[property].join("\n");
            default:
                return row[property];
            }
        },
        // 选择平台类型
        selectPlatformType (val) {
            this.platformType = val;
            this.getResourceList();
        },
        // 获取资源列表
        getResourceList () {
            const startTime = this.formatDate(this.dateRange[0]) + " 00:00:00";
            const endTime = this.formatDate(this.dateRange[1]) + " 23:59:59";
            const params = {
                platformType: this.platformType,
                startTime: startTime,
                endTime: endTime,
                pageSize: parseInt(this.page.pageSize),
                pageIndex: parseInt(this.page.pageIndex)
            };

            window.localStorage.setItem("ad_cityCpm_searchContent", JSON.stringify({
                platformType: params.platformType,
                startTime: params.startTime,
                endTime: params.endTime
            }));

            $$model_cpm.getResourceList(params, res => {
                if (res.code === 200) {
                    this.tableData = res.data.resources;
                    this.totalCount = res.data.totalCount;
                } else {
                    this.$message.error(res.code);
                }
            });
        },
        // 选择资源
        handleSelectionChange (val) {
            this.resourcesId = [];
            val.forEach((item) => {
                this.resourcesId.push(item.resourcesId);
            });
        },
        // 预览图弹框
        dialogShow (row) {
            this.$refs.popDialog.popShow = true;
            this.$refs.popDialog.resourcesId = row.resourcesId;
        },
        // 修改预览图
        modifyPreview (row, item) {
            this.$refs.popDialog.resourcesId = row.resourcesId;
            this.$refs.popDialog.preview = _.extend({}, item);
            this.$refs.popDialog.fileList.push({ name: "预览图", url: item.url });
            this.$refs.popDialog.popShow = true;
        },
        //
        deletePreview (resourcesId, previewId) {
            this.$confirm("此操作将删除该预览图?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                $$model_cpm.deletePreview({ resourceId: resourcesId, previewId: previewId }, res => {
                    if (res.code !== 200) {
                        this.$message.error(res.msg);
                    } else {
                        this.$message({
                            type: "success",
                            message: "删除成功！"
                        });
                        setTimeout(function () {
                            location.reload();
                        }, 400);
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        // 新增资源弹框
        addResourceShow () {
            this.$refs.popResource.popShow = true;
        },
        // 停止使用资源
        resourcePause () {
            const params = {
                resourceId: this.resourcesId,
                status: 1
            };

            $$model_cpm.changeResourceStatus(params, res => {
                if (res.code === 200) {
                    setTimeout(function () {
                        location.reload();
                    }, 400);
                    this.$message({
                        message: "停止资源成功",
                        type: "success"
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 开启使用资源
        resourceStart () {
            const params = {
                resourceId: this.resourcesId,
                status: 0
            };

            $$model_cpm.changeResourceStatus(params, res => {
                if (res.code === 200) {
                    this.$message({
                        message: "开启资源成功",
                        type: "success"
                    });
                    setTimeout(function () {
                        location.reload();
                    }, 400);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 刷新函数
        reload () {
            location.reload();
        },
        // 新建资源
        addResource (val) {
            $$model_cpm.addResource(val, res => {
                if (res.code === 200) {
                    location.reload();
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        formatDate (date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return "" + year + "-" + month + "-" + day;
        },
        handleSizeChange (val) {
            this.page.pageSize = val;
        },
        handleCurrentChange (val) {
            this.page.pageIndex = val;
        }
    },
    beforeMount () {
        const params = {
            platformType: 0,
            startTime: "2017-5-2 23:59:59",
            endTime: "2017-5-4 23:59:59",
            pageSize: parseInt(this.page.pageSize),
            pageIndex: parseInt(this.page.pageIndex)
        };
        $$model_cpm.getResourceList(params, res => {
            if (res.code !== 200) {
                this.$message.error(res.msg);
            } else {
                this.tableData = res.data.resources;
                this.totalCount = res.data.totalCount;
            }
        });
        $$model_cpm.getPlatform({}, res => {
            if (res.code === 200) {
                this.options = [];
                for (const key in res.data) {
                    this.options.push({ label: res.data[key], value: key });
                }
            } else {
                this.$message(res.msg);
            }

            if (window.localStorage.getItem("ad_cityCpm_searchContent")) {
                const storageObj = JSON.parse(window.localStorage.getItem("ad_cityCpm_searchContent"));
                this.dateRange = [new Date(storageObj.startTime), new Date(storageObj.endTime)];
                this.platformType = storageObj.platformType;
            }
        });
    }
};
