<template>
    <div class="ad-history">
        <div class="ad-history-header clearfix">
            <div class="header-right">
                <el-form :model="ruleForm" :inline="true" :rules="rules"  label-width="60px">
                    <el-form-item class="right-name" label="日期:" prop="date">
                        <el-date-picker size="small" v-model="date" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="right-name" label="名称:" prop="name">
                        <el-input size="small" v-model="ruleForm.nameLike">
                            <el-button @click="handleSearch" slot="append" icon="search"></el-button>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="ad-history-table">
            <el-table :data="tableData" border style="width:100%;" align="center">
                <el-table-column property="url" label="url" width="" align="center"></el-table-column>
                <el-table-column property="name" label="名称" width="" align="center"></el-table-column>
                <el-table-column label="操作" inline-template width="100">
                    <div>
                        <el-button type="text" size="small" @click="handleDetail(row)">查看</el-button>
                    </div>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagenation">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="ruleForm.pageIndex"
                :page-size="ruleForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import $$model_ad_history from "./model-ad-history-anonymity.js";
    import $$util from "../../lib/util.js";

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
                    return;
                }

                if (new Date(this.date).getTime() > new Date(row.time_point).getTime()) {
                    window.open(row.base_link_new + $$util.dateFormat(new Date(this.date), "yyyyMMdd") + row.detail_link + "?bedate=" + $$util.dateFormat(new Date(this.date), "yyyy-MM-dd"));
                } else {
                    window.open(row.base_link_pre + $$util.dateFormat(new Date(this.date), "yyyyMMdd") + row.detail_link + "?bedate=" + $$util.dateFormat(new Date(this.date), "yyyy-MM-dd"));
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
</script>

<style>
    .ad-history .el-form-item__content {
    line-height: 1;
}
</style>
<style scoped>
.clearfix {
    zoom: 1;
}

.clearfix::after {
    content: '';
    display: block;
    line-height: 0;
    visibility: hidden;
    clear: both;
}

.ad-history-header {
    margin: 20px 0 0 0;
}

.header-left {
    float: left;
}

.header-right {
    float: right;
}

.right-name {
    width: 250px;
}

.btn-gr {
    float: right;
    padding: 0 0 20px 0;
}

.pagenation {
    margin: 10px 0 0 0;
}
</style>

