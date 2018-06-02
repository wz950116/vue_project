<template>
    <div class="ad-history">
        <div class="ad-history-header clearfix">
            <div class="header-left">
                <el-button size="small" @click="dialogVisible = true">新建</el-button>
            </div>
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
        <div class="ad-history-table" v-loading.body="loading" element-loading-text="数据加载中">
            <el-table :data="tableData" border style="width:100%;" align="center">
                <el-table-column property="url" label="url" width="" align="center"></el-table-column>
                <el-table-column property="name" label="名称" width="" align="center"></el-table-column>
                <el-table-column label="操作" inline-template width="100" align="center">
                    <div style='text-align:center;'>
                        <el-button type="text" size="small" @click="handleDetail(row)">查看</el-button>
                        <el-button type="text" size="small" @click="handleDel(row)" v-if='showDel'>删除</el-button>
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
        <el-dialog title="新建url" size="tiny" v-model="dialogVisible">
            <el-form :model="addForm" :rules="addRules"  label-width="60px">
                <el-form-item required label="url:" prop="name">
                    <el-input size="small" v-model="addForm.url" placeholder="需要抓取的页面的url"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input size="small" v-model="addForm.name" placeholder="需要抓取的页面的名称"></el-input>
                </el-form-item>
            </el-form>
            <div class="btn-gr">
                <el-button type="primary" @click="handleAdd">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script src="./main.js"></script>
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