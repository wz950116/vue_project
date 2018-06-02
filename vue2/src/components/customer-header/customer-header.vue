<template>
    <div>
        <el-row :gutter="0" class="margin-top-20">
            <el-form ref="form" :model="customHeadForm" label-width="40px" @submit.prevent="onSubmit">
                <el-row type="flex" justify="space-between">
                    <el-form-item label="省份" class="form_item">
                        <el-select class="ad-header-item-value" multiple v-model="customHeadForm.provinceValue"
                                   @change="getCity()"
                                   style="width: 220px;">
                            <el-option
                                    v-for="item in provinceOptions"
                                    :label="item.name"
                                    :value="item.areaCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="城市" class="form_item">
                        <el-select class="ad-header-item-value" multiple v-model="customHeadForm.cityValue"
                                   @change="getCustomerList()"
                                   style="width: 220px;">
                            <el-option
                                    v-for="item in cityOptions"
                                    :label="item.name"
                                    :value="item.areaCode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="类型" class="form_item">
                        <el-select class="ad-header-item-value" multiple v-model="customHeadForm.typeValue"
                                   @change="getCustomerList()"
                                   style="width: 220px;">
                            <el-option
                                    v-for="item in typeOptions"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="space-between">
                    <el-form-item label="状态" class="form_item">
                        <el-select class="ad-header-item-value" multiple v-model="customHeadForm.stateValue"
                                   @change="getCustomerList()"
                                   style="width: 220px;">
                            <el-option
                                    v-for="item in stateOptions"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级" class="form_item">
                        <el-select class="ad-header-item-value" multiple v-model="customHeadForm.lvlValue"
                                   @change="getCustomerList()" style="width: 220px;">
                            <el-option
                                    v-for="item in lvlOptions"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label-width="40px">
                        <el-input placeholder="输入客户ID或姓名" v-model="searchCustomId"
                                  style="width: 220px;margin-right: 15px;">
                            <el-button slot="append" icon="search" @click.native.prevent="searchCustomer()"></el-button>
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>

        </el-row>
    </div>
</template>
<style scoped>
    .form_item {
    margin-right: 15px;
}

.margin-top-20 {
    margin-top: 20px;
}
</style>
<script>
    import $$customer from "../../script/data/model/customer";
    import _ from "../../lib/underscore.v1.4.4.min";
    export default{
        data () {
            return {
                self_name: "customer-header",
                customHeadForm: {
                    provinceValue: "",
                    cityValue: "",
                    typeValue: "",
                    stateValue: "",
                    lvlValue: ""
                },
                searchCustomId: "",
                provinceOptions: [],
                cityOptions: [],
                typeOptions: [],
                stateOptions: [],
                lvlOptions: [],
                tag: false,
                currentPage: 1,
                pageSize: 10
            };
        },
        methods: {
            getCity () {
                // 根据省获取市
                const params = {
                        "provinceIds": this.customHeadForm.provinceValue
                    }, that = this;
                $$customer.getCity(params, function (data) {
                    that.cityOptions = data.cityList;
                    that.getCustomerList();
                });
            },
            searchCustomer () {
                if (this.searchCustomId == "") {
                    return;
                }
                const params = {
                    keyword: this.searchCustomId
                };
                $$customer.getCustomerList(params);
            },
            getCustomerList (type) {
                const _this = this;
                if (!_this.tag) {
                    return;
                }
                if (type != "fromPage") {
                    _this.currentPage = 1;
                }
                const params = {
                    "pageIndex": _this.currentPage,
                    "pageSize": _this.pageSize
                };
                if (this.searchCustomId !== "") {
                    _.extend(params, {
                        "keyword": this.searchCustomId
                    });
                }
                if (this.customHeadForm.typeValue.length > 0) {
                    _.extend(params, {
                        "type": this.customHeadForm.typeValue
                    });
                }
                if (this.customHeadForm.stateValue.length > 0) {
                    _.extend(params, {
                        "status": this.customHeadForm.stateValue || null
                    });
                }
                if (this.customHeadForm.lvlValue.length > 0) {
                    _.extend(params, {
                        "level": this.customHeadForm.lvlValue || null
                    });
                }
                if (this.customHeadForm.provinceValue.length > 0) {
                    _.extend(params, {
                        "provinceCodes": this.customHeadForm.provinceValue
                    });
                }
                if (this.customHeadForm.cityValue.length > 0) {
                    _.extend(params, {
                        "cityCodes": this.customHeadForm.cityValue
                    });
                }

                window.localStorage.setItem("customer_data_searchContent", JSON.stringify(params));

                $$customer.getCustomerList(params);
            }
        },
        watch: {
            "$route": function () {
                const that = this;
                if (window.localStorage.getItem("customer_data_searchContent")) {
                    that.tag = true;
                    const storageObj = JSON.parse(window.localStorage.getItem("customer_data_searchContent"));
                    that.customHeadForm.provinceValue = storageObj.provinceCodes || [];
                    that.customHeadForm.cityValue = storageObj.cityCodes || [];
                    that.customHeadForm.typeValue = storageObj.type || [];
                    that.customHeadForm.stateValue = storageObj.status || [];
                    that.customHeadForm.lvlValue = storageObj.level || [];
                }
            }
        },
        beforeMount: function () {
            const that = this;
            // 各种参数
            $$customer.getCustomerParams(function (data) {
                that.provinceOptions = data.provinceList;
                that.typeOptions = data.customerType.items;
                that.stateOptions = data.customerStatus.items;
                that.lvlOptions = data.customerLevel.items;

                if (window.localStorage.getItem("customer_data_searchContent")) {
                    that.tag = true;
                    const storageObj = JSON.parse(window.localStorage.getItem("customer_data_searchContent"));
                    that.customHeadForm.provinceValue = storageObj.provinceCodes || [];
                    that.customHeadForm.cityValue = storageObj.cityCodes || [];
                    that.customHeadForm.typeValue = storageObj.type || [];
                    that.customHeadForm.stateValue = storageObj.status || [];
                    that.customHeadForm.lvlValue = storageObj.level || [];
                } else {
                    $$customer.getCustomerList({
                        "pageIndex": 1,
                        "pageSize": 10
                    }, function () {
                        that.tag = true;
                    });
                }
            });
    
            $$customer.on("getCustomerByPage", function (page) {
                that.currentPage = page;
                that.getCustomerList("fromPage");
            });
        }
    };
</script>
