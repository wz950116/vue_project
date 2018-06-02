<template>
    <div class="city-cpm">
        <el-row :gutter="0">
            <el-form label-width="60px;" :inline="true">
                <el-form-item label="日期范围" label-width="68px">
                    <el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期" style="width:220px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择平台" label-width="68px">
                    <el-select placeholder="请选择" v-model="platformType" @change='selectPlatformType'>
                        <el-option v-for="item in options" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row :gutter="0">
            <el-button @click="addResourceShow">新建资源</el-button>
            <el-button @click="resourcePause">停用资源</el-button>
            <el-button @click="resourceStart">启动资源</el-button>
        </el-row>
        <el-table :data="tableData" border style="width:100%;" @selection-change="handleSelectionChange" v-loading.body="loading">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="name" label="资源名称" width="100" align="center"> </el-table-column>
            <el-table-column prop="platformName" label="所属平台" width="100" align="center"> </el-table-column>
            <el-table-column prop="costTypeName" label="计费方式" width="100" align="center"></el-table-column>
            <el-table-column prop="ideaType" label="广告形式" width="100" align="center"></el-table-column>
            <el-table-column prop="ideaStyle" label="创意样式" width="100" align="center" inline-template>
                <template v-for="data in row.ideaStyle">
                   <p :title="data" style="width:100; overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"> {{data}} </p>
                </template>
            </el-table-column>
            <el-table-column prop="ideaForm" label="创意形式" width="150" align="center" inline-template>
                <template v-for="data in row.ideaForm">
                     <p :title="data" style="width:100; overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"> {{data}} </p>
                </template>
            </el-table-column>
            <el-table-column prop="format" label="规格" width="200" align="center" inline-template>
                <template v-for="data in row.format">
                    <p :title="data" style="width:100; overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"> {{data}} </p>
                </template>
            </el-table-column>
            <el-table-column prop="size" label="大小" width="200" align="center" inline-template>
                <template v-for="data in row.size">
                   <p :title="data" style="width:100; overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"> {{data}} </p>
                </template>
            </el-table-column>
            <el-table-column prop="supportType" label="支持类型" width="100" align="center">
            </el-table-column>
            <el-table-column prop="inventory" label="CPM库存" width="100" align="center">
            </el-table-column>
            <el-table-column prop="used" label="CPM消耗" width="100" align="center">
            </el-table-column>
            <el-table-column prop="saleRate" label="CPM售出率" width="100" align="center">
            </el-table-column>
            <el-table-column prop="floorPrice" label="CPM底价" width="100" align="center">
            </el-table-column>
            <el-table-column prop="income" label="CPM收入" width="100" align="center">
            </el-table-column>
            <el-table-column prop="status" label="资源状态" width="100" align="center">
            </el-table-column>
            <el-table-column label="预览图" inline-template fixed="right" width="300">
                <div class="preview">
                    <ul v-if="row.preview.size">
                        <li v-for="item in row.preview.preview">
                            <div>{{item.description}}
                            <el-button size="small" style="margin-left:10px;" @click="modifyPreview(row,item)">修改</el-button>
                            <el-button size="small" @click="deletePreview(row.resourcesId,item.id)">删除</el-button>
                            </div>
                        </li>
                    </ul>
                    <el-button size="small" @click="dialogShow(row)">新增预览图</el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.pageIndex*1"
          :page-size="page.pageSize*1"
          layout="total, prev, pager, next"
          :total="totalCount"
          class="pagination pageIndex">
        </el-pagination>
        <el-select class="pagination pageSize" v-model="page.pageSize" placeholder="请选择">
            <el-option label="10条/每页" value="10"></el-option>
            <el-option label="20条/每页" value="20"></el-option>
            <el-option label="30条/每页" value="30"></el-option>
            <el-option label="40条/每页" value="40"></el-option>
        </el-select>
        <popDialog ref="popDialog" @reload="reload"></popDialog>
        <popResource ref="popResource" @addResource='addResource'></popResource>
    </div>
</template>
<script src="./city-cpm.js"></script>
<style scoped>
    .el-row:first-child {
    margin-top: 20px;
}

.el-table {
    margin-top: 20px;
}

.preview {
    padding-bottom: 10px;
}

.preview ul {
    padding: 10px;
    list-style: none;
}

.preview ul li {
    list-style: none;
    margin-bottom: 10px;
}

.preview ul li:last-child {
    margin-bottom: 0;
}

.preview ul li div {
    display: inline-block;
    width: 200px;
}

.pagination {
    margin: 20px 0;
    float: right;
}

.pagination.pageSize {
    width: 120px;
}
</style>