<template lang="html">
    <div class="city-loupan">
        <div class="filter-wrapper">
            <el-form :inline="true" :model="ruleForm" class="demo-form-inline">
                <el-form-item label="城市" label-width="40px">
                    <el-select @change="cityCache" class="city-option" size="small" filterable v-model="ruleForm.cityId" placeholder="选择城市">
                        <el-option-group v-for="group in cityListOptions" :label="group.label">
                            <el-option v-for="item in group.data" :label="item.name" :value="item.cityId">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索类型" label-width="70px">
                    <el-select class="city-option" size="small" v-model="searchType" placeholder="选择类型">
                        <el-option label="楼盘" value="estate"></el-option>
                        <el-option label="开发商" value="estateCompanyId"></el-option>
                        <el-option label="运营负责人" value="estatePrincipalName"></el-option>
                        <el-option label="销售负责人" value="estateSalesName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="searchType === 'estate'">
                    <el-select size="small" v-model="ruleForm.estateId" placeholder="请输入楼盘名称" filterable :loading="estateOptionLoading" remote :remote-method="getLoupanSuggest">
                        <el-option
                          v-for="item in estateOption"
                          :label="item.estateName"
                          :value="item.estateId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="searchType === 'estateCompanyId'">
                    <el-select size="small" v-model="ruleForm.estateCompanyId" placeholder="请输入开发商名称" filterable :loading="companyOptionLoading" remote :remote-method="getCompanySuggest">
                        <el-option
                          v-for="item in companyOption"
                          :label="item.name"
                          :value="item.developerId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="searchType === 'estatePrincipalName'">
                    <el-select size="small" v-model="ruleForm.estateOperatingPrincipalEmail" placeholder="请输入运营负责人邮箱" filterable :loading="estatePrincipalNameLoading" remote :remote-method="getPrincipalNameSuggest">
                        <el-option
                          v-for="item in estatePrincipalNameOption"
                          :label="item.name"
                          :value="item.email">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="searchType === 'estateSalesName'">
                    <el-select size="small" v-model="ruleForm.estateSalesPrincipalEmail" placeholder="请输入销售负责人邮箱" filterable :loading="estateSalesNameLoading" remote :remote-method="getSalesNameSuggest">
                        <el-option
                          v-for="item in estateSalesNameOption"
                          :label="item.name"
                          :value="item.email">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetSearch" type="primay" size="small">清空</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button @click="handleSearch" type="primay" size="small">搜索</el-button>
                </el-form-item> -->
            </el-form>
            <div class="btn-gr">
                <template v-if="role !== 'ROLE_BE_STAFF_ESTATE_VIEW'">
                    <!-- 第一期不包括自定义列 -->
                    <!-- <el-button size="small" class="filter-btn" @click="$refs.adjustColumnDialog.dialogVisble = true">自定义列</el-button> -->
                    <el-button style="width: 116px;" size="small" class="filter-btn" @click="$refs.editBasicData.dialogVisble = true;$refs.editBasicData.type = 2;">编辑销售基本数据</el-button>
                    <el-button style="width: 116px;" size="small" class="filter-btn" @click="$refs.editBasicData.dialogVisble = true;$refs.editBasicData.type = 1;">编辑运营基本数据</el-button>
                    <el-button v-if="role === 'ROLE_BE_STAFF_SUPER_ADMIN'" size="small" class="filter-btn" @click="$refs.cityDutyPerson.dialogVisble = true">设定城市负责人</el-button>
                    <el-button size="small" class="filter-btn" @click="$refs.addSalesInfo.type = 'operat';$refs.addSalesInfo.dialogVisble = true">录入运营信息</el-button>
                    <el-button size="small" class="filter-btn" @click="$refs.addSalesInfo.type = 'sales';$refs.addSalesInfo.dialogVisble = true">录入销售信息</el-button>
                    <el-button size="small" class="filter-btn" @click="$refs.addLoupan.dialogVisble = true">新增楼盘</el-button>
                </template>
            </div>
        </div>
        <div class="table-wrapper" v-loading.body="loading" element-loading-text="加载中">
            <table cellspacing="0" cellpadding="0" border="0"> 
                <thead>
                    <tr>
                        <th class="table-th" :rowspan="3">
                            <el-checkbox @change="columnSelectAll" v-model="isSelectAll"></el-checkbox>
                        </th>
                        <th class="table-th" v-show="item.visible" v-for="(item, index) in forMatThead.one" :colspan="item.colspan">
                            {{item.label}}
                            <template v-if="item.date && item.value === 'ecologyAdsData'">
                                <!-- 广告数据 -->
                                <el-select class="filter-item" size="mini" v-model="ruleForm.adsDataYear" placeholder="年份">
                                    <el-option v-for="item in estateAdsDataYearList" :label="item" :value="item"></el-option>
                                </el-select>
                                <el-select class="filter-item" size="mini" v-model="ruleForm.adsDataQuarter" placeholder="季度">
                                    <el-option v-for="i in 4" :label="'第' + i + '季度'" :value="i"></el-option>
                                </el-select>
                            </template>
                        </th>
                    </tr>
                    <tr>
                        <th class="table-th" v-show="item.visible" width="120" v-for="(item, index) in forMatThead.two" :colspan="item.colspan" :rowspan="4 - getDeep(item)">
                            {{item.label}}
                            <template v-if="item.date && item.value === 'salesData'">
                                <!-- 销售数据 -->
                                <el-select class="filter-item" size="mini" v-model="ruleForm.saleDataYear" placeholder="年份">
                                    <el-option v-for="item in estateAdsSaleYearList" :label="item" :value="item"></el-option>
                                </el-select>
                                <el-select class="filter-item" size="mini" v-model="ruleForm.saleDataQuarter" placeholder="季度">
                                    <el-option v-for="i in 4" :label="'第' + i + '季度'" :value="i"></el-option>
                                </el-select>
                            </template>
                            <template v-if="item.dateRange && item.value === 'ecologyInfoData'">
                                <!-- 生态数据 -->
                                <el-date-picker
                                    size="mini"
                                    v-model="dateRange"
                                    type="daterange"
                                    placeholder="选择日期范围"
                                    style="width:220px;">
                                </el-date-picker>
                            </template>
                            <template v-if="item.value === 'estateOperatingGroup'">
                                <!-- 运营负责小组 -->
                                <i class="el-icon-caret-bottom"></i>
                                <el-select @change="feFilter" class="filter-drop colsapn2" multiple size="mini" v-model="operating" placeholder="运营负责小组">
                                    <el-option v-for="item in operatingGroupList" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </template>
                            <template v-if="item.value === 'estateSalesGroup'">
                                <!-- 销售负责小组 -->
                                <i class="el-icon-caret-bottom"></i>
                                <el-select @change="feFilter" class="filter-drop colsapn2" multiple size="mini" v-model="salesGroup" placeholder="销售负责小组">
                                    <el-option v-for="item in salesGroupList" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </template>
                            <template v-if="item.value === 'operatingPrincipalName'">
                                <!-- 运营负责人 -->
                                <i class="el-icon-caret-bottom"></i>
                                <el-select @change="feFilter" class="filter-drop colsapn2" multiple size="mini" v-model="operatingPrincipalNameSelect" placeholder="运营负责人">
                                    <el-option v-for="item in operatingPrincipalNameOption" :label="item.name" :value="item.email"></el-option>
                                </el-select>
                            </template>
                            <template v-if="item.value === 'salesPrincipalName'">
                                <!-- 销售负责人 -->
                                <i class="el-icon-caret-bottom"></i>
                                <el-select @change="feFilter" class="filter-drop colsapn2" multiple size="mini" v-model="salesPrincipalNameSelect" placeholder="销售负责人">
                                    <el-option v-for="item in salesPrincipalNameOption" :label="item.name" :value="item.email"></el-option>
                                </el-select>
                            </template>
                        </th>
                    </tr>
                    <tr v-show="forMatThead.three.length">
                        <th v-show="item.visible" class="item-header table-th" width="120" v-for="(item, index) in forMatThead.three">
                            {{item.label}}
                            <template v-if="item.value === 'saleStatus'">
                                <!-- 销售状态 -->
                                <i class="el-icon-caret-bottom"></i>
                                <el-select @change="feFilter" class="filter-drop" multiple size="mini" v-model="saleStatus" placeholder="销售状态">
                                    <el-option v-for="item in estateSaleStatusList" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </template>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tableList">
                        <td class="table-td" width="100" v-if="role !== 'ROLE_BE_STAFF_ESTATE_VIEW'">
                            <el-checkbox @change="columnSelect" v-model="item.isSelect"></el-checkbox>
                        </td>
                        <td class="table-td" width="100" v-for="(it, index) in item.list">
                            <template v-if="it.edit && role !== 'ROLE_BE_STAFF_ESTATE_VIEW'">
                                <template v-if="it.name">
                                    <el-button @click="dialogInsertDataShowEdit(it)" size="mini" type="text">{{it.name}}</el-button>
                                </template>
                                <template v-else>
                                    <el-button @click="dialogInsertDataShow(it)" size="mini" type="primary" icon="plus"></el-button>
                                </template>
                            </template>
                            <template v-else>
                                {{(typeof it.name === 'string') ? it.name : it}}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <adjustColumnDialog ref="adjustColumnDialog"></adjustColumnDialog>
        <editBasicData :cityId="ruleForm.cityId" ref="editBasicData"></editBasicData>
        <cityDutyPerson :cityId="ruleForm.cityId" :cityName="cityName" ref="cityDutyPerson"></cityDutyPerson>
        <addSalesInfo :cityId="ruleForm.cityId" :cityName="cityName" ref="addSalesInfo"></addSalesInfo>
        <addLoupan :cityId="ruleForm.cityId" ref="addLoupan"></addLoupan>
        <insertData :cityId="ruleForm.cityId" ref="insertData"></insertData>
    </div>
</template>
<script src="./main.js"></script>
<style scoped>
.city-loupan {
    margin: 20px 0 0 0;
}

.city-option {
    width: 100px;
}

.city-filters {
    width: 130px;
}

.btn-gr button[type~=button] {
    width: 100px;
}

.el-form-item {
    margin-bottom: 0;
}

.table-wrapper {
    overflow-x: scroll;
    margin: 20px 0 0 0;
}

.table-wrapper table {
    width: 1800px;
    overflow: hidden;
}

.table-wrapper tr {
    background-color: #fff;
}

.table-wrapper tr th {
    border: 1px solid #e0e6ed;
    height: 25px;
    min-width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: #eff2f7;
}

.filter-item {
    width: 120px;
    display: inline-block;
}

.table-th {
    width: 150px;
    position: relative;
}

.table-td {
    border: 1px solid #e0e6ed;
    text-align: center;
}

.filter-drop {
    position: absolute;
    opacity: 0;
    width: 100%;
    top: 0;
}
</style>
<style>
.city-loupan .table-wrapper .filter-drop .el-input__inner {
    height: 22px !important;
}

.city-loupan .table-wrapper .filter-drop.colsapn2 .el-input__inner {
    height: 50px !important;
}

.city-loupan .filter-wrapper .el-form-item__content {
    line-height: 1;
}
</style>