<template>
    <div>
       <el-row :gutter="0" class="margin-top-20">
           <el-form ref="form" :model="customAgentForm" label-width="40px">
               <el-row type="flex" justify="space-between">
                   <el-form-item label="省份" class="form_item">
                       <el-select class="ad-header-item-value" filterable multiple v-model="customAgentForm.provinceValue"  @change="getCity" style="width: 220px;">
                           <el-option
                                   v-for="item in provinceOptions"
                                   :label="item.name"
                                   :value="item.areaCode">
                           </el-option>
                       </el-select>
                   </el-form-item>
                   <el-form-item label="城市" class="form_item">
                       <el-select class="ad-header-item-value" filterable multiple v-model="customAgentForm.cityValue" @change="getlist" style="width: 220px;">
                           <el-option
                                   v-for="item in cityOptions"
                                   :label="item.name"
                                   :value="item.areaCode">
                           </el-option>
                       </el-select>
                   </el-form-item>
                   <el-form-item label-width="40px">
                       <el-input placeholder="输入代理商名或ID" v-model="searchAgentId" style="width: 220px;margin-right: 15px;">
                           <el-button slot="append" icon="search" @click.native="searchAgent()">
                           </el-button>
                       </el-input>
                   </el-form-item>
               </el-row>
           </el-form>
       </el-row>
       <el-row :gutter="0">
           <el-button @click="dialogVisible('dialogAgentVisible')">新增代理</el-button>
           <el-button @click="dialogVisible('dialogKPIVisible')">设定KPI</el-button>
           <el-button @click="dialogVisible('dialogCreditVisible')">设定信用额度</el-button>
           <el-button @click='creditList'>数据导出</el-button>
       </el-row>
        <el-table :data="tableData" border style="width:100%" @selection-change="handleSelectionChange" v-loading.body="loading" class="margin-top-20">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="demanderId" label="代理ID"  align="center"> </el-table-column>
            <el-table-column prop="name" label="代理商名称" align="center" width='150'> </el-table-column>
            <el-table-column prop="creditLine" label="信用额度"  align="center"></el-table-column>
            <el-table-column prop="spendAmount" label="已用额度"  align="center"></el-table-column>
              <el-table-column prop="canUse" label="可用额度"  align="center"></el-table-column>
            <el-table-column prop="bill" label="本月账单"  align="center">
            </el-table-column>
            <el-table-column prop="outstandingDebt" label="未还欠款" align="center">
            </el-table-column>
            <el-table-column prop="kpi" label="KPI"  align="center">
            </el-table-column>
            <el-table-column prop="endDate" label="结算日期"  align="center">
            </el-table-column>
            <el-table-column prop="complete" label="完成度"  align="center">
            </el-table-column>
        </el-table>
        <el-dialog title="新增代理" v-model="dialogAgentVisible" class="staff_dialog" size="tiny">
            <el-form :model="agent" :rules="rule" ref="agent" class="staff_width">
                <div style="margin-bottom:15px;">
                    <span class="dialog-label">代理商ID</span>
                    <el-form-item prop="ID" class="dialog-input">
                        <el-input v-model="agent.ID" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click.native="dialogClose('dialogAgentVisible')">取 消</el-button>
                <el-button type="primary" @click.native="addDemander">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设定KPI" v-model="dialogKPIVisible" class="staff_dialog" size="tiny">
            <el-form :model="KPI" :rules="rule" ref="KPI" class="staff_width">
                <div style="margin-bottom:15px;">
                    <span class="dialog-label">任务额度</span>
                    <el-form-item prop="target" class="dialog-input">
                        <el-input v-model="KPI.target" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="dialog-label">结算日期</span>
                    <el-form-item prop="dateRange" class="dialog-input">
                        <el-date-picker
                                v-model="KPI.dateRange"
                                type="daterange"
                                placeholder="选择日期范围"
                                style="width: 200px">
                        </el-date-picker>
                    </el-form-item>
                </div>
              
            </el-form>
            <div slot="footer">
                <el-button @click.native="dialogClose('dialogKPIVisible')">取 消</el-button>
                <el-button type="primary" @click.native="setupKPI">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="设定信用额度" v-model="dialogCreditVisible" class="staff_dialog" size="tiny">
            <el-form :model="credit" :rules="rule" ref="agent" class="staff_width">
                <div style="margin-bottom:15px;">
                    <span class="dialog-label">信用额度</span>
                    <el-form-item prop="line" class="dialog-input">
                        <el-input v-model="credit.line" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click.native="dialogClose('dialogCreditVisible')">取 消</el-button>
                <el-button type="primary" @click.native="setupCredit">确 定</el-button>
            </div>
        </el-dialog>
        <div class="pagination" v-show="this.tableData.length>0">
            <el-pagination @current-change="handleCurrentChange" :current-page="pageIndex"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script src="./manage-agent.js"></script>
<style scoped src="./manage-agent.css"></style>
