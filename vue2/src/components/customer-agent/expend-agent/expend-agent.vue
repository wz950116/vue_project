<template>
    <div class="expendAgent">
        <div v-if="!detailShow">
            <el-form class="expend-header" ref="form" :model="expendForm" label-width="70px">
                <el-row type="flex" justify="space-between">
                    <el-form-item label="推广顾问">
                        <el-select 
                            v-model="expendForm.consultantStatus" 
                            multiple placeholder="请选择" style="width:217px">
                            <el-option 
                                v-for="item in Consultant" 
                                :label="item.name" 
                                :value="item.id"
                                :key="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-select v-model="expendForm.areaCode" filterable multiple placeholder="请选择" style="width:217px" >
                            <el-option-group v-for="group in areaCodeList" :label="group.label">
                                <el-option v-for="city in group.options" :label="city.label" :value="city.value.toString()">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期范围">
                        <el-date-picker v-model="expendForm.dateRange" type="daterange" placeholder="选择日期范围" style="width: 220px">
                        </el-date-picker>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="end">
                    <el-form-item>
                        <el-button type="primary" @click.native="download">下载</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-input 
                            v-model="expendForm.extra" 
                            placeholder="请输入代理商名称/代理商ID搜索" 
                            style="width:272px;">
                            <el-button slot="append" icon="search" @click='searchAgent'></el-button>
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-table class="expend-table" :data="tableData" border style="width:100%" v-loading.body="loading">
                <el-table-column prop="areaName" label="城市" width="100"></el-table-column>
                <el-table-column label="代理商ID" width="180" inline-template>
                    <span class="agentMsg" @click="showAgentDetail(row)">{{row.agentID}}</span>
                </el-table-column>
                <el-table-column label="代理商名称" width="180" inline-template>
                    <span class="agentMsg" @click="showAgentDetail(row)">{{row.agentName}}</span>
                </el-table-column>
                <el-table-column prop="numOfActiveGuests" label="活跃子客数" width="180"></el-table-column>
                <el-table-column prop="totalConsumption" label="总消耗" width="180"></el-table-column>
                <el-table-column prop="cashConsumption" label="现金消耗" width="180"></el-table-column>
                <el-table-column prop="grantConsumption" label="赠款消耗" width="180"></el-table-column>
                <el-table-column prop="creditConsumption" label="信用消耗" width="180"></el-table-column>
                <el-table-column prop="taskTarget" label="任务额" width="180"></el-table-column>
                <el-table-column prop="salesMan" label="推广顾问" width="180"></el-table-column>
            </el-table>
            <el-pagination
                @size-change.native="handleSizeChange"
                @current-change.native="handleCurrentChange"
                :current-page="expendForm.pageIndex*1"
                :page-size="expendForm.pageSize*1"
                layout="total, prev, pager, next"
                :total="totalCount"
                class="pagination pageIndex">
            </el-pagination>
            <el-select class="pagination pageSize" v-model="expendForm.pageSize" placeholder="请选择">
                <el-option label="10条/每页" value="10"></el-option>
                <el-option label="20条/每页" value="20"></el-option>
                <el-option label="30条/每页" value="30"></el-option>
                <el-option label="40条/每页" value="40"></el-option>
            </el-select>
        </div>
    </div>
</template>
<script src="./expend-agent.js"></script>
<style scoped>
.expendAgent {
    position: relative;
}

.agentMsg {
    cursor: pointer;
    color: blue;
}

.expendDetail {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
}

.pagination {
    margin: 20px 0;
    float: right;
}

.pagination.pageSize {
    width: 120px;
}
</style>
