<template>
    <div class="seller-list-main">
        <!-- 顶部按钮、搜索组件 -->
        <div class="header">
            <el-form style="float:left;">
                <el-form-item label="城市:" style='display:inline-block;width:500px;'>
                    <el-select
                        v-model="cityList"
                        style="width:180px;"
                        filterable
                        placeholder="请选择省份"
                        @change='refreshCity'>
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
                        @change='handleChangeCity'>
                        <el-option
                            v-for="item in cityList"
                            :label="item.cityName" :value="item.cityId" :key="item.cityId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-form style="float:right;">
                <el-form-item>
                    <el-col :span="16">
                        <el-input v-model="pid" placeholder="楼盘ID" auto-complete="on" class="dialog-input"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="initRander">查询</el-button>
                    </el-col>
                </el-form-item>
            </el-form>
        </div>

        <!-- table表格 -->
        <div class="table-content">
            <el-table :data="tableData" border style="width: 100%;">
                <el-table-column prop="index" label="位置" align='center' width='80'></el-table-column>
                <el-table-column prop="pid" label="楼盘id" align='center'></el-table-column>
                <el-table-column prop="projName" label="楼盘名" align='center'></el-table-column>
                <el-table-column prop="title" label="标题" align='center'></el-table-column>
                <el-table-column prop="price" label="价格" align='center'></el-table-column>
                <el-table-column prop="projAddress" label="楼盘地址" align='center'></el-table-column>
                <el-table-column label="操作"  align='center'>
                    <template slot-scope="scope">
                        <span><el-button
                                class="table-btns"
                                type="text"
                                @click="filterLoupan(scope.row)">
                            <i class="el-icon-delete"></i>&nbsp;滤除
                        </el-button></span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页组件 -->
        <div class="footer">
            <el-pagination 
                @current-change="handleCurrentChange" 
                :current-page="page_index" 
                :page-size="page_size" 
                layout="total,prev,pager,next,jumper" :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import $api from "./model.js";
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
                currentTableData: [],
                page_size: 10,
                page_index: 1,
                totalCount: 0,
                queryCity: "",
                addFormVisible: false,
                editFormVisible: false,
                cityOptions: [],
                cityList: [],
                pid: "",
            };
        },


        methods: {
            // 渲染函数
            initRander () {
                if (!this.queryCity) return;
                // 获取列表数据
                $api.getAllProjectInfo({
                    pid: this.pid,
                    cityId: this.queryCity,
                    page: this.page_index
                }, res => {
                    if (res.msg == "success") {
                        this.tableData = res.data.list;
                        this.totalCount = res.data.count * 1;
                        var index = (this.page_index - 1) * this.page_size;
                        for (var i = 0; i < this.tableData.length; i++) {
                            this.tableData[i].index = i + index + 1;
                        }
                    } else {
                        this.$message({
                            type: "error",
                            message: res.msg
                        });
                    }
                });
            },
            // 翻页事件
            handleCurrentChange (val) {
                this.page_index = val;
                this.initRander();
            },
            // 切换城市
            handleChangeCity () {
                this.page_index = 1;
                this.initRander();
            },
            // 切换省份清空城市
            refreshCity () {
                this.queryCity = '';
            },
            // 过滤楼盘操作
            filterLoupan (item) {
                this.$confirm("确定要滤除该楼盘吗？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    $api.addDeleteInfo({
                        pid: item.pid,
                        projectName: item.projName,
                        cityId: this.queryCity,
                    }, res => {
                        if (res.msg == "success") {
                            this.$message("滤除成功");
                            this.initRander();
                        } else {
                            this.$message({
                                type: "error",
                                message: res.msg
                            });
                        }
                    });

                }).catch(function (e) {
                    // console.log(e);
                });
            },
        },

        watch: {
            $route () {
                this.initRander();
            }
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

    .table-btns {
        display: block;
        width: 80px;
        line-height: 28px;
        background: rgb(32, 160, 255);
        color: #fff;
        border-radius: 5px;
        padding: 0 15px;
        margin: 0 auto;
    }

    .table-btns:hover {
        background: rgba(32, 160, 255, 0.8);
    }

    .table-content {
        width: 95%;
        margin: 30px auto;
    }

    .footer {
        float: right;
        margin-right: 40px;
    }
</style>
