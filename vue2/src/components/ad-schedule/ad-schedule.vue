<template>
    <div class="adPosSched">
        <el-form ref="form" :model="adFormData" label-width="70px" @submit.prevent="onSubmit">
            <el-row type="flex" justify="space-around">
                <el-form-item label="城市">
                    <el-select v-model="adFormData.areaCode" style="width:217px;" filterable>
                        <el-option-group v-for="group in areaCodeList" :label="group.label">
                            <el-option v-for="city in group.options" :label="city.label" :value="city.value.toString()">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select v-model="adFormData.platForm" placeholder="请选择" style="width:217px;">
                        <el-option v-for="(value,key) in platForm" :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="一级栏目">
                    <el-select v-model="adFormData.firstColumn" multiple placeholder="请选择" style="width:217px;" >
                        <el-option v-for="(value,key) in firstColumn" :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级栏目">
                    <el-select v-model="adFormData.secondColumn" multiple placeholder="请选择" style="width:217px;">
                        <el-option v-for="(value,key) in getSecondColumn" :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row type="flex" justify="space-around">
                <el-form-item label="屏次">
                    <el-select v-model="adFormData.pageNum" multiple placeholder="请选择" style="width:217px;">
                        <el-option v-for="(value,key) in pageNum" :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告形式">
                    <el-select v-model="adFormData.ideaType" multiple placeholder="请选择" style="width:217px;" >
                        <el-option v-for="(value,key) in ideaType" :label="value" :value="key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否对外">
                    <el-select v-model="adFormData.operation" multiple placeholder="请选择" style="width:217px;" >
                        <el-option label="是" value="0">
                        </el-option>
                        <el-option label="否" value="1">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="el-form-item__content" style="padding-left:20px;">
                    <input class="el-input__inner" v-model="adFormData.extra" placeholder="请输入广告位ID或广告位名称" style="width:267px;" >
                    </input>
                </div>
            </el-row>
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期选择">
                    <el-date-picker v-model="adFormData.date" type="daterange" placeholder="选择日期范围" style="width:220px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button @click="download">下载</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        
        <el-table :data="tableData" border style="width:100%;" v-loading.body="loading">
            <el-table-column prop="posName" label="广告位名称" width="180" inline-template>
                <template>
                    <p>{{row.posName}}</p>
                    <p>打底图：{{row.biStatus}}{{row.biHealthy === "false"? "(有错误)":''}}</p>
                </template>
            </el-table-column>
            <el-table-column v-for="(item,index) in getDateList" :label="item" style="width:200px;padding:0;" inline-template>
                <div 
                    v-if="row.rowCells[getDateList[index]]" 
                    :class="getClass(row.rowCells[getDateList[index]] ? row.rowCells[getDateList[index]].cellDemanderWhite : '')">
                    <p>订单ID：
                        <span 
                            class="table-href" 
                            @click="checkDetail(row.rowCells[getDateList[index]].cellOrderId)">
                            {{row.rowCells[getDateList[index]].cellOrderId}}
                        </span>
                    </p>
                    <p>客户ID：
                        <router-link :to="'customer-detail?id=' + row.rowCells[getDateList[index]].cellDemanderId">
                            {{row.rowCells[getDateList[index]].cellDemanderId}}
                        </router-link>
                    </p>
                    <p>正在投放：{{row.rowCells[getDateList[index]].cellNumPassedShowingIdeas}}</p>
                </div> 
            </el-table-column>
        </el-table>
    </div>
</template>
<script src='./ad-schedule.js'></script>
<style scoped>
    .adPosSched {
    margin-top: 10px;
}

.whiteUser {
    width: 100%;
    height: 100%;
    padding: 0 18px;
    background-color: rgba(0, 245, 255, 0.5);
    margin-left: -18px;
}

.generalUser {
    width: 100%;
    height: 100%;
    padding: 0 18px;
    background-color: rgba(255, 48, 48, 0.5);
    margin-left: -18px;
}

.table-href {
    color: #00f;
}

.table-href:hover {
    cursor: pointer;
}
</style>