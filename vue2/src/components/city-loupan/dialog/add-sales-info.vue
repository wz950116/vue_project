<template>
    <div class="add-sales-info">
        <el-dialog :title="title" v-model="dialogVisble" size="small">
            <div class="add-sales-wrapper clearfix">
                <div class="add-sales-left add-sales-item">
                    <el-button size="small" @click="handleAddDialogShow">新增分组</el-button>
                    <div class="sales-line-wrapper">
                        <div v-for="item in displayGroupList" class="add-sales-line clearfix">
                            <div class="sales-line-left">
                                <span class="left-title">{{item.name}}</span>
                            </div>
                            <div class="sales-line-right">
                                <el-button type="text" size="small" @click="handleEditDialogShow(item)">编辑</el-button>
                                <el-button type="text" size="small" @click="handleDelGroup(item.id)">删除</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="add-sales-left add-sales-item">
                    <el-button size="small" @click="handelAddMemberDialogShow">新增组员</el-button>
                    <div class="sales-line-wrapper" v-loading="addMemberDialog.loading" element-loading-text="数据加载中">
                        <div v-for="item in displayMemberList" class="add-sales-line clearfix">
                            <div class="sales-line-left">
                                <span class="left-title">{{item.name}}</span>
                                <span class="left-title">{{item.groupName}}</span>
                            </div>
                            <div class="sales-line-right">
                                <el-button type="text" size="small" @click="handelEditMemberDialogShow(item)">编辑</el-button>
                                <el-button type="text" size="small" @click="handleDelMember(item)">删除</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="btn-gr">
                <el-button @click="dialogVisble = false">取消</el-button>
                <el-button type="primary">确认</el-button>
            </div> -->
        </el-dialog>
        <el-dialog :title="addGroupDialog.title" v-model="addGroupDialog.addGroupVisble" size="tiny">
            <el-form ref="addGroup" :model="addGroupDialog.addGroupForm" :rules="addGroupDialog.addGroupRule" label-width="100px">
                <el-form-item label="城市:">
                    <span>{{cityName}}</span>
                </el-form-item>
                <el-form-item label="分组名称:" prop="name">
                    <el-input size="small" v-model="addGroupDialog.addGroupForm.name"></el-input>
                </el-form-item>
                <div class="btn-gr">
                    <el-button @click="addGroupDialog.addGroupVisble = false">取消</el-button>
                    <el-button type="primary" @click="handleAddGroup">确认</el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog :title="addMemberDialog.title" v-model="addMemberDialog.addMemberVisble" size="tiny">
            <el-form ref="addMember" :model="addMemberDialog.addMemberForm" :rules="addMemberDialog.addMemberRule" label-width="100px">
                <el-form-item label="城市:">
                    <span>{{cityName}}</span>
                </el-form-item>
                <el-form-item label="所属小组:" prop="groupId">
                    <el-select :disabled="addMemberDialog.groupIdDisable" size="small" v-model="addMemberDialog.addMemberForm.groupId" placeholder="选择小组">
                        <el-option v-for="item in displayGroupList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="组员姓名:" prop="name">
                    <el-input size="small" v-model="addMemberDialog.addMemberForm.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-input :disabled="addMemberDialog.emailDisable" size="small" v-model="addMemberDialog.addMemberForm.email"></el-input>
                </el-form-item>
                <div class="btn-gr">
                    <el-button @click="addMemberDialog.addMemberVisble = false">取消</el-button>
                    <el-button type="primary" @click="handleAddMember">确认</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script src="./add-sales-info.js"></script>
<style scoped>
    .clearfix {
        zoom: 1;
    }

    .clearfix:after {
        content: '';
        display: block;
        line-height: 0;
        visibility: hidden;
        clear: both;
    }

    .add-sales-wrapper {
        padding: 0 0 30px 0;
    }

    .add-sales-item {
        float: left;
        margin-left: 20px;
    }

    .sales-line-wrapper {
        margin: 10px 0 0 0;
        border: 1px solid #ccc;
        width: 310px;
        height: 300px;
        overflow-y: scroll;
    }

    .add-sales-item:first-child {
        margin-left: 0;
    }

    .add-sales-line {
        padding: 0 10px;
    }

    .sales-line-left {
        float: left;
    }

    .left-title {
        padding: 7px 0;
        font-size: 12px;
        line-height: 2;
    }

    .sales-line-right {
        float: right;
    }

    .btn-gr {
        float: right;
        padding: 0 0 30px 0
    }
</style>