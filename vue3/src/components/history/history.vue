<template>
    <div class="seller-list-main">
        <!-- 顶部按钮、搜索组件 -->
        <div class="header">
            <el-form>
                <el-form-item label="城市:" style='float:left;width:460px;'>
                    <el-select
                        v-model="cityList"
                        style="width:180px;"
                        filterable
                        placeholder="请选择省份">
                        <el-option
                            v-for="group in cityInfo"
                            :label="group.province" :key='group.province' :value="group.cityList">
                        </el-option>
                    </el-select>
                    <el-select
                        v-model="queryCity"
                        style="width:180px;"
                        filterable
                        placeholder="请选择城市"
                        @change="initRander()">
                        <el-option
                            v-for="item in cityList"
                            :label="item.cityName" :value="item.cityId" :key="item.cityId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="位置:" style='float:left;width:280px;'>
                    <el-select
                        v-model="posValue"
                        style="width:180px;"
                        placeholder="请选择位置"
                        @change="initRander()">
                        <el-option
                            v-for="item in posList"
                            :label="item === 0 ? '全部' : item" :key='item' :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="时间:" style='float:left;width:280px;'>
                    <el-select
                        v-model="limit"
                        style="width:180px;"
                        placeholder="请选择位置"
                        @change="initRander()">
                        <el-option
                            v-for="item in limitLsit"
                            :label="item.option" :key='item.value' :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <el-form style='float:right;'>
                <el-form-item style='width:280px;'>
                    <el-col :span="16">
                        <el-input 
                            v-model="emailValue" 
                            placeholder="请输入邮箱" 
                            auto-complete="on">
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="initRander(3)">查询</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>

        <!-- table表格 -->
        <div class="table-content">
            <el-table :data="tableData" border style="width: 100%;">
                <el-table-column prop="position" label="位置" align='center' width='80'></el-table-column>
                <el-table-column prop="cityId" label="城市Id" align='center' width='80'></el-table-column>
                <el-table-column prop="managerName" label="操作人员" align='center'></el-table-column>
                <el-table-column prop="pid" label="楼盘Id" align='center'></el-table-column>
                <el-table-column prop="projectName" label="楼盘名称" align='center'></el-table-column>
                <el-table-column prop="from" label="起始时间" align='center'></el-table-column>
                <el-table-column prop="to" label="失效时间" align='center'></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align='center'></el-table-column>
            </el-table>
        </div>

        <!-- 分页组件 -->
        <!-- <div class="footer">
            <el-pagination 
                @current-change="handleCurrentChange" 
                :current-page="page_index" 
                :page-size="page_size" 
                layout="total,prev,pager,next,jumper" :total="totalCount">
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
    import utils from "@/model/utils";
    import $api from "./model.js";
    import _ from "@/lib/underscore.v1.4.4.min";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }

    export default {
        data () {
            return {
                tableData: [],
                page_size: 10,
                page_index: 1,
                totalCount: 0,
                queryCity: '',
                cityList: [],
                posValue: '',
                posList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                emailValue: '',
                limitLsit: [
                    {
                        option: '全部',
                        value: 0
                    },{
                        option: '7天内',
                        value: 7
                    },{
                        option: '30天内',
                        value: 30
                    }
                ],
                limit: '',
            };
        },


        methods: {
            // 渲染函数
            initRander (type) {
                let params = {};
                if (this.queryCity) {
                    _.extend(params, {
                        "cityId": this.queryCity
                    });
                }
                if (this.posValue && this.queryCity) {
                    _.extend(params, {
                        "position": this.posValue
                    });
                } else if (this.posValue && !this.queryCity) {
                    this.$message.error('请选择城市方能查询');
                    return;
                }
                if (this.emailValue) {
                    _.extend(params, {
                        "manager": this.emailValue
                    });
                }
                if (this.limit) {
                    _.extend(params, {
                        "limit": this.limit
                    });
                }

                
                $api.getHistoryList(params, res => {
                    if (res.msg === 'success') {
                        this.tableData = res.data;
                        this.tableData.forEach(item => {
                            if (item.from) {
                                item.from = utils._dateTimeFormatter(new Date(item.from));
                            };
                            if (item.to) {
                                item.to = utils._dateTimeFormatter(new Date(item.to));
                            };
                            if (item.updateTime) {
                                item.updateTime = utils._dateTimeFormatter(new Date(item.updateTime));
                            };
                        });
                    }
                })
            },
            // 翻页事件
            handleCurrentChange (val) {
                this.page_index = val;
                this.initRander();
            },
        },

        computed: {
            cityInfo () {
                let userInfo = this.$store.state.userInfo.info,
                    cityInfo = this.$store.state.cityInfo.info;
                if (userInfo.data) {
                    return cityInfo;
                };
            }
        },
    };
</script>

<style scoped>
    .seller-list-main {
        padding: 30px 0;
        overflow: hidden;
    }
    .header {
        overflow: hidden;
        width: 95%;
        margin: 30px auto;
    }
    .footer {
        float: right;
        margin: 40px 40px 0 0;
    }
</style>
