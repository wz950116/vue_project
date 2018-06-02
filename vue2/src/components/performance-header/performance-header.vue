<template>
    <div>
        <el-form ref="form" label-width="40px" @submit.prevent="onSubmit" :inline="true">
            <el-form-item label="城市">
                <el-select @change="changeCity" class="ad-header-item-value" v-model="selectedCity"
                          filterable style="width: 220px;">
                    <el-option-group v-for="group in cityOptions" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.label">
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号或姓名" label-width="110px">
                <el-input placeholder="输入手机号或姓名" v-model="searchEmployeeId"
                          style="width: 220px;">
                    <el-button slot="append" icon="search" @click.native="search"></el-button>
                </el-input>
            </el-form-item>
            <el-button 
                :plain="true" 
                type="success" 
                @click.native="dialogTableVisible = true" 
                style="margin-right:0;" class="button_right" >
                添加员工
            </el-button>
            <el-button :plain="true" type="success" class="button_right" @click.native="exportData">导出数据
            </el-button>
        </el-form>
        <el-dialog title="添加员工" v-model="dialogTableVisible" class="staff_dialog" size="tiny">
            <el-form :model="staff" :rules="rule" ref="staff" class="staff_width">
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">电话号码</span>
                    <el-form-item class="staff_item" prop="num">
                        <el-input v-model="staff.num" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">姓名</span>
                    <el-form-item class="staff_item" prop="name">
                        <el-input v-model="staff.name" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
                <div style="margin-bottom:15px;">
                    <span class="add-staff-title">城市</span>
                    <el-form-item class="staff_item" prop="city">
                        <el-input v-model="staff.city" auto-complete="off"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer">
                <el-button @click.native="closeDialog">取 消</el-button>
                <el-button type="primary" @click.native="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style scoped>
.add-staff-title {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 20px;
}

.margin-top-20 {
    margin-top: 20px;
}

.staff_item {
    margin-bottom: 0;
    display: inline-block;
}

.button_right {
    float: right;
    margin-right: 10px;
}

.button_search {
    margin-left: 20px;
}

.header-col {
    height: 50px;
}

.el-dialog--tiny {
    width: 25%;
}
</style>
<script>
    import $$performance from "../../script/data/model/performance";
    import _ from "../../lib/underscore.v1.4.4.min";

    const allCities = [];
    
    const search = function (vm, type) {
        const selectedCity = vm.selectedCity;

        window.localStorage.setItem("ad_performance_searchContent", encodeURIComponent(selectedCity));

        const searchEmployeeId = vm.searchEmployeeId;

        if (type != "fromPage") {
            vm.currentPage = 1;
        }
        const params = {
            pageIndex: vm.currentPage,
            eachPageNum: vm.pageSize
        };

        if (searchEmployeeId.trim() != "") {
            _.extend(params, {
                query: searchEmployeeId
            });
        }

        if (selectedCity !== "全部城市") {
            _.extend(params, {
                cities: [selectedCity]
            });
        }

        $$performance.getPerformance(params);
    };

    const checkNum = (rule, value, callback) => {
        if (!value) {
            return callback(new Error("不能为空"));
        } else {
            if (!Number.isInteger(parseInt(value))) {
                return callback(new Error("请输入数字"));
            } else {
                callback();
            }
        }
    };

    const checkEmpty = (rule, value, callback) => {
        if (value.trim() === "") {
            callback(new Error("不能为空"));
        } else {
            callback();
        }
    };

    export default{
        data () {
            return {
                self_name: "performance-header",
                dialogTableVisible: false,
                selectedCity: "全部城市",
                cityOptions: [],
                searchEmployeeId: "",
                staff: {
                    num: "",
                    name: "",
                    city: ""
                },
                rule: {
                    num: [
                        { validator: checkNum, trigger: "blur" }
                    ],
                    name: [
                        { validator: checkEmpty, trigger: "blur" }
                    ],
                    city: [
                        { validator: checkEmpty, trigger: "blur" }
                    ]
                },
                currentPage: 1,
                pageSize: 10
            };
        },
        beforeMount: function () {
            // 数据加载
            const _this = this;
            // 请求已排序的城市列表
            $$performance.getAdParams(function (res) {
                if (res.code === 0) {
                    _this.cityOptions = res.data.areaCodeList;
                    _this.cityOptions.unshift({
                        label: "全部城市",
                        options: [{
                            value: "-1",
                            label: "全部城市"
                        }]
                    });
                }
            });

            $$performance.on("getPerByPage", function (page) {
                _this.currentPage = page;
                search(_this, "fromPage");
            });

            if (window.localStorage.getItem("ad_performance_searchContent")) {
                _this.selectedCity = decodeURIComponent(window.localStorage.getItem("ad_performance_searchContent"));
                search(this);
            }
        },
        methods: {
            closeDialog () {
                this.dialogTableVisible = false;
                this.staff = {
                    num: "",
                    name: "",
                    city: ""
                };
            },
            exportData () {
                const selectedCity = this.selectedCity;
                const searchEmployeeId = this.searchEmployeeId;
                const _this = this;

                const $params = {
                    query: searchEmployeeId || ""
                };

                if (selectedCity !== "全部城市") {
                    _.extend($params, {
                        cities: [selectedCity]
                    });
                }
                $$performance.downLoadPerformace($params, data => {
                    if (data.errorCode === 0) {
                        _this.$notify({
                            title: "数据导出成功",
                            message: "",
                            type: "success",
                            duration: 2000
                        });
                        window.open(data.fileUrl);
                    } else {
                        _this.$notify({
                            title: "数据导出失败",
                            message: "",
                            type: "error",
                            duration: 2000
                        });
                    }
                });
            },
            changeCity () {
                search(this);
            },
            search () {
                search(this);
            },
            submit (ev) {
                const _this = this;
                this.$refs.staff.validate((valid) => {
                    if (valid) {
                        $$performance.addUser({
                            city: _this.staff.city,
                            employee_id: parseInt(_this.staff.num),
                            name: _this.staff.name
                        }, function (data) {
                            if (data.errorCode === 0) {
                                _this.$notify({
                                    title: "添加成功",
                                    message: "",
                                    type: "success",
                                    duration: 2000
                                });
                                if (!allCities.length) {
                                    $$performance.getPerformance({
                                        pageIndex: 1,
                                        eachPageNum: 10
                                    });
                                } else {
                                    $$performance.getPerformance({
                                        cities: allCities,
                                        pageIndex: 1,
                                        eachPageNum: 10
                                    });
                                }
                            } else if (data.errorCode === 2) {
                                _this.$message({
                                    type: "error",
                                    message: "该员工已存在"
                                });
                            } else {
                                _this.$message({
                                    type: "error",
                                    message: "操作失败"
                                });
                            }
                            _this.dialogTableVisible = false;
                            _this.staff = {
                                num: "",
                                name: "",
                                city: ""
                            };
                        });
                    } else {
                        _this.$message({
                            type: "error",
                            message: "操作失败"
                        });
                    }
                });
            }
        }
    };
</script>
