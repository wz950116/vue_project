<template>
    <div class="chargeReview">
        <el-form ref="form" :model="reFormData" label-width="70px" @submit.prevent="onSubmit">
            <el-row type="flex" justify="space-around">
                <el-form-item label="申请日期">
                    <el-date-picker v-model="reFormData.date" type="daterange" placeholder="选择日期范围" style="width: 220px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="城市">
                    <el-select v-model="reFormData.areaCode" filterable style="width:217px;">
                        <el-option-group v-for="group in areaCodeList" :label="group.label">
                            <el-option v-for="city in group.options" :label="city.label" :value="city.value.toString()">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="reFormData.status" placeholder="请选择" style="width:217px;" >
                        <el-option v-for="option in statusList" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </el-form-item>
                <div class="el-form-item__content" style="padding-left:20px;">
                    <input class="el-input__inner" v-model="reFormData.extra" placeholder="请输入客户名称或客户ID" style="width:267px;" >
                    </input>
                </div>
            </el-row>
        </el-form>
        <el-table :data="tableData" border style="width:100%;" v-loading.body="loading">
            <el-table-column prop="demanderId" label="客户ID" width="180"> </el-table-column>
            <el-table-column prop="companyName" label="客户名称" width="180"> </el-table-column>
            <el-table-column prop="cityName" label="所在城市" width="180"> </el-table-column>
            <el-table-column prop="letterheads" label="汇款抬头" width="180"> </el-table-column>
            <el-table-column label="汇款日期" width="120" inline-template>
                <template>
                    {{formatDate(row.bookTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="amount" label="汇款金额" width="180"> </el-table-column>
            <el-table-column label="汇款凭证" width="180" inline-template>
                <template>
                    <el-button type="primary" size="small" v-on:click="showClick('payment',$index)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="申请日期" width="120" inline-template>
                <template>
                    {{formatDate(row.insertTime)}}
                </template>
            </el-table-column>
            <el-table-column prop="showstatus" label="状态" width="150"> </el-table-column>
            <el-table-column v-if="reFormData.status === 0" label="操作" width="180" inline-template>
                <template>
                    <el-button type="primary" size="small" @click.native="showClick('pass',$index)">通过</el-button>
                    <el-button type="danger" size="small" @click.native="showClick('refuse',$index)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="reFormData.pageIndex"
          :page-size="reFormData.pageSize*1"
          layout="total, prev, pager, next"
          :total="totalCount"
          class="pagination pageIndex">
        </el-pagination>
        <el-select class="pagination pageSize" v-model="reFormData.pageSize" placeholder="请选择">
            <el-option label="10条/每页" value="10"></el-option>
            <el-option label="20条/每页" value="20"></el-option>
            <el-option label="30条/每页" value="30"></el-option>
            <el-option label="40条/每页" value="40"></el-option>
        </el-select>
        <el-dialog title="汇款凭证" v-if="paymentShow" v-model="paymentShow">
            <img :src="tableData[targetIndex].bookLicenceUrl">
        </el-dialog>
        <el-dialog title="驳回理由" v-if="refuseShow" v-model="refuseShow">
            <textarea class="el-textarea__inner" placeholder="请输入驳回理由" v-model="refuseReason">
            </textarea>
            <el-button class="dialogButton" @click.native="closeDialog">取消</el-button>
            <el-button type="primary" class="dialogButton" @click.native="chargeAudit('refuse',tableData[targetIndex].rechargeId)">确认</el-button>
        </el-dialog>
        <el-dialog title="请再次确认汇款金额" v-if="passShow" v-model="passShow">
                <p class="chargeMessage">
                    <label class="label">客户名称</label>
                    <span class="content">{{tableData[targetIndex].companyName}}</span>
                </p>
                <p class="chargeMessage">
                    <label class="label">汇款抬头</label>
                    <span class="content">{{tableData[targetIndex].letterheads}}</span>
                </p>
                <p class="chargeMessage">
                    <label class="label">充值金额</label>
                    <span class="content">{{tableData[targetIndex].amount}}</span>
                </p>
                <p class="chargeMessage">
                    <label class="label">返点比例</label>
                    <span class="content">20%</span>
                </p>
                <p class="chargeMessage">
                    <label class="label">返点金额</label>
                    <span class="content">{{(tableData[targetIndex].amount*0.2).toFixed(2)}}</span>
                </p>
                <el-button class="dialogButton" @click.native="closeDialog">取消</el-button>
                <el-button type="primary" class="dialogButton" @click.native="chargeAudit('pass',tableData[targetIndex].rechargeId)">确认</el-button>
        </el-dialog>
    </div>
</template>
<style scoped>
.chargeReview {
    margin: 10px 0;
}

.chargeMessage {
    margin: 10px;
}

.label {
    text-align: right;
    width: 100px;
    margin-right: 50px;
    font-size: 14px;
}

.content {
    width: auto;
    text-align: left;
    font-size: 14px;
}

.dialogButton {
    float: right;
    margin: 15px;
}

.pagination {
    margin: 20px 0;
    float: right;
}

.pagination.pageSize {
    width: 120px;
}

.popover-close {
    position: absolute;
    right: -50px;
    width: 40px;
    height: 40px;
    background: white;
}

.popover-close-button {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    font-size: 20px;
    transform: translate(-50%, -50%);
}

.popover-close-button:hover {
    color: #20a0ff;
}
</style>
<script src="./charge-review.js"></script>
