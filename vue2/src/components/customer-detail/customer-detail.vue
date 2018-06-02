<template>
    <div class="customer-detail-wrap">
        <el-row>
            <el-col :span="24">
                <el-breadcrumb separator=">>" class="bread_crumb">
                    <el-breadcrumb-item :to="{ path: breadCrumbList.path }">{{breadCrumbList.level1}}
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>{{breadCrumbList.level2}}</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-form :model="formData">
                    <el-row class="row-staff">
                        <el-col :span="12">
                            <el-form-item label="客户编号：" class="form_item">
                                <span> {{formData.id}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item v-if="cusType==2" label="所属代理：" class="form_item">
                                <span> {{formData.agent}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-tabs type="card" class="tabs">
                        <el-tab-pane label="认证材料">
                            <div v-if="formData.businessLic">
                                <h3>营业执照</h3>
                                <div class="card-img"><img v-bind:src="formData.businessLic"></div>
                            </div>
                            <div v-if="formData.authLic&&formData.authLic.length>0">
                                <h3>预售许可证</h3>
                                <div class="card-img" v-for="item in formData.authLic">
                                    <img v-bind:src="item">
                                </div>
                                <template v-for="i in formData.otherLic" v-if="formData.otherLic.length > 0">
                                    <h3>其他资质</h3>
                                    <div class="card-img"><img v-bind:src="i"></div>
                                </template>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-if="cusType!=1" label="认证楼盘">
                            <el-table :data="loupanList" width="100%" border>
                                <el-table-column property="id" label="楼盘ID" align="center"></el-table-column>
                                <el-table-column property="name" label="楼盘名称" align="center"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane v-else label="子客列表">
                            <el-table :data="customList" width="100%" border>
                                <el-table-column property="id" label="客户ID" align="center"></el-table-column>
                                <el-table-column property="name" label="客户名称" align="center"></el-table-column>
                                <el-table-column property="status" label="状态" align="center"></el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="客户订单">
                            <el-table :data="orderList" width="100%" border>
                                <el-table-column property="id" label="订单ID" align="center"></el-table-column>
                                <el-table-column property="name" label="广告名称" align="center"></el-table-column>
                                <el-table-column property="adType" label="广告类型" align="center"></el-table-column>
                                <el-table-column property="advertisingStatus" label="投放状态"
                                                 align="center"></el-table-column>
                                <el-table-column property="resourceId" label="资源ID" align="center"></el-table-column>
                                <el-table-column property="startDate" label="开始日期" align="center"></el-table-column>
                                <el-table-column property="endDate" label="结束日期" align="center"></el-table-column>
                                <el-table-column property="totalCost" label="订单总价" align="center"></el-table-column>
                                <el-table-column property="addupCost" label="累计消耗" align="center"></el-table-column>
                                <el-table-column property="subOrderIds" label="分配单号" align="center"
                                                 v-if="cusType!=2"></el-table-column>
                            </el-table>
                            <div class="pagination" v-show="this.orderList.length>0">
                                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage"
                                               :page-size="pageSize"
                                               layout="total, prev, pager, next, jumper" :total="total">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
<style scoped>
.pagination {
    margin-top: 20px;
    text-align: right;
}

.margin-bottom-0 {
    margin-bottom: 0;
}

.form_item {
    margin-bottom: 0;
}

.el-form-item__content {
    width: auto !important;
}

.row-staff {
    margin-bottom: 10px;
}

.tabs {
    width: 100%;
}

.card-img {
    margin-bottom: 30px;
}

.card-img img {
    max-width: 600px;
    max-height: 400px;
}

.bread_crumb {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}
</style>
<script>
    import $$customer from "../../script/data/model/customer";
    import _ from "../../lib/underscore.v1.4.4.min";

    export default {
        data () {
            return {
                self_name: "customer-detail",
                cusType: 0,
                orderList: [],
                customList: [],
                loupanList: [],
                formData: {},
                breadCrumbList: {
                    level1: "客户",
                    level2: "",
                    path: "/customer"
                },
                currentPage: 1,
                pageSize: 10,
                total: 0
            };
        },
        methods: {
            handleCurrentChange (val) {
                const that = this;
                that.currentPage = val;
                const params = {
                    id: parseInt(that.$route.query.id),
                    pageIndex: that.currentPage,
                    pageSize: that.pageSize
                };
                $$customer.getChildOrders(params, function (data) {
                    if (data.errorCode === 0 && data.orders) {
                        that.orderList = data.orders || [];
                        that.total = data.totalCount;
                    } else {
                        that.orderList = [];
                    }
                });
            }
        },
        activated: function () {
            const that = this;
            // 数据加载
            const params = {
                id: parseInt(that.$route.query.id)
            };

            $$customer.getCustomerDetail(params, function (data) {
                if (data.errorCode == 0) {
                    that.formData = data;
                    that.cusType = data.type;
                    that.breadCrumbList.level2 = data.name;
                    if (data.type == 1) {
                        // 字客信息
                        $$customer.getChildCustomer(params, function (data) {
                            if (data.errorCode === 0 && data.childGuests) {
                                that.customList = data.childGuests;
                            } else {
                                that.customList = [];
                            }
                        });
                    } else {
                        // 认证楼盘
                        $$customer.getChildEstates(params, function (data) {
                            if (data.errorCode === 0 && data.estates) {
                                that.loupanList = data.estates;
                            } else {
                                that.loupanList = [];
                            }
                        });
                    }
                    // 客户订单
                    _.extend(params, {
                        pageIndex: that.currentPage,
                        pageSize: that.pageSize
                    });
                    $$customer.getChildOrders(params, function (data) {
                        if (data.errorCode === 0 && data.orders) {
                            that.orderList = data.orders || [];
                            that.total = data.totalCount;
                        } else {
                            that.orderList = [];
                        }
                    });
                }
            });
        }
    };
</script>
