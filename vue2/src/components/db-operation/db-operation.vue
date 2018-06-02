<template>
    <div class="db-operation">
        <div class="db-header">
            <span v-for="(item,index) in headerData" class="db-header-text" v-bind:class="{'db-header-selected':item.selected}" @click="selectTag(index)">
                {{item.name}}
            </span>
        </div>
        <div class="db-content">
            <el-form ref="form" :model="reFormData" v-if="currentView === 'ad-template'" label-width="100px" @submit.prevent="onSubmit">
                <el-form-item label="广告位ID">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 6, maxRows: 10}"
                      placeholder="请输入内容"
                      v-model="reFormData.pos_id_template">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="templateCommit">提交</el-button>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="reFormData" v-else label-width="100px" @submit.prevent="onSubmit">
                <el-form-item label="操作内容">
                    <el-select v-model="reFormData.opt_type" placeholder="请选择" style="width:217px;" >
                        <el-option v-for="type in operationType" :label="type.label" :value="type.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="城市ID">
                    <el-input
                      type="text"
                      placeholder="请输入城市ID"
                      v-model="reFormData.area_code"
                      style="width:217px;">
                    </el-input>
                </el-form-item>
                <el-form-item label="广告位ID">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 6, maxRows: 10}"
                      placeholder="请输入内容"
                      v-model="reFormData.pos_id_city">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="cityCommit">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.db-operation {
    margin: 20px 0;
}

.db-header {
    border-bottom: 1px solid #d8d8d8;
    margin-bottom: 20px;
}

.db-header-text {
    font-size: 20px;
    margin-right: 80px;
    color: #333;
    cursor: pointer;
    line-height: 40px;
    vertical-align: middle;
    padding: 5px;
}

.db-header-selected {
    border-bottom: 2px solid #e43;
    color: #e43;
}
</style>

<script src="./db-operation.js"></script>
