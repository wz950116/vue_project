import $$model_agent from '../model-agent.js'
import $$customer from '../../../script/data/model/customer';
import _ from '../../../lib/underscore.v1.4.4.min';
export default {
    data() {
        return {
            customAgentForm: {
                provinceValue: '',
                cityValue: '',
            },
            provinceOptions: [],
            cityOptions: [],
            searchAgentId: '',
            tableData: [],
            pageIndex: 1,
            pageSize: 30,
            demanderIds: [],
            total: 0,
            agent: {
                ID: ''
            },
            KPI: {
                target: '',
                dateRange: []
            },
            credit: {
                line: ''
            },
            dialogAgentVisible: false,
            dialogKPIVisible: false,
            dialogCreditVisible: false,
            isRequire: false
        }
    },
    methods: {
        getCity() {
            if (!this.isRequire) return;
            var params = {
                    "provinceIds": this.customAgentForm.provinceValue
                },
                that = this;

            window.localStorage.setItem('customer_agent_searchContent', JSON.stringify({
                'provinceCodes': this.customAgentForm.provinceValue
            }));

            $$customer.getCity(params, function(data) {
                that.cityOptions = data.cityList;
            });
        },
        getlist() {
            if (!this.isRequire) return;
            let params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                keyword: this.searchAgentId,
                cityCodes: this.customAgentForm.cityValue,
                provinceCodes: this.customAgentForm.provinceValue
            };

            window.localStorage.setItem('customer_agent_searchContent', JSON.stringify({
                'provinceCodes': params.provinceCodes,
                'cityCodes': params.cityCodes
            }));

            $$model_agent.list(params, res => {
                if (res.code == 200) {
                    this.tableData = res.data.customerList;
                    this.total = res.data.totalCount;
                    this.pageIndex = res.data.pageIndex;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            });
        },
        searchAgent() {
            this.getlist();
        },
        dialogVisible(attr) {
            this[attr] = true;
        },
        dialogClose(attr) {
            this[attr] = false;
        },
        addDemander() {
            let params = {
                demanderId: parseInt(this.agent.ID)
            };

            $$model_agent.getDemanderInfo(params, res => {
                if (res.code == 200) {
                    this.$confirm('你将添加 ' + res.data + '为签约代理商, 是否确认?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        $$model_agent.add({ demanderId: parseInt(this.agent.ID) }, res => {
                            if (res.code == 200) {
                                this.$message({
                                    type: 'info',
                                    message: '新增成功'
                                });
                                setTimeout(function() {
                                    location.reload();
                                }, 400);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消新增'
                        });
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }

            });

        },
        setupKPI() {
            let params = {
                demanderId: this.demanderIds,
                target: parseInt(this.KPI.target),
                startDate: this.timeFormat(this.KPI.dateRange[0]) + ' 00:00:00',
                endDate: this.timeFormat(this.KPI.dateRange[1]) + ' 23:59:59',
            };
            if (this.demanderIds.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请选择代理商！'
                })
                return;
            }
            $$model_agent.setKpi(params, res => {
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '设置KPI成功'
                    });
                    setTimeout(function() {
                        location.reload();
                    }, 400);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            });
        },
        setupCredit() {
            let params = {
                demanderId: this.demanderIds,
                creditLine: parseInt(this.credit.line)
            };
            if (this.demanderIds.length == 0) {
                this.$message({
                    type: 'error',
                    message: '请选择代理商！'
                })
                return;
            }
            $$model_agent.setCreditLine(params, res => {
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '设置信用额度成功'
                    });
                    setTimeout(function() {
                        location.reload();
                    }, 400);

                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        creditList() {
            let params = {
                keyword: this.searchAgentId,
                cityCodes: this.customAgentForm.cityValue,
                provinceCodes: this.customAgentForm.provinceValue
            };
            $$model_agent.creditList(params, res => {
                if (res.errorCode == 0) {
                    window.open(res.fileUrl);
                }

            });

        },
        handleSelectionChange(val) {
            var _this = this;
            _this.demanderIds = [];
            [].slice.call(val, 0).forEach(function(item) {
                _this.demanderIds.push(item.demanderId);
            });
        },
        handleCurrentChange(val) {
            this.pageIndex = val;
            this.getlist();
        },
        timeFormat (day) {
            var day = new Date(day);
            var year = day.getFullYear();
            var month = day.getMonth() + 1;
            var date = day.getDate();
            return '' + year + '-' + (month < 10?'0' + month : month) + '-' + (date < 10?'0' + date : date);
        }
    },
    mounted () {
        var that = this;
        $$customer.getCustomerParams(function(data) {
            that.provinceOptions = data.provinceList;

            // 本地存储历史记录
            if (window.localStorage.getItem('customer_agent_searchContent')) {
                var storageObj = JSON.parse(window.localStorage.getItem('customer_agent_searchContent'));
                if (storageObj.provinceCodes && storageObj.provinceCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        provinceValue: storageObj.provinceCodes
                    })
                }
                if (storageObj.cityCodes && storageObj.cityCodes.length > 0) {
                    _.extend(that.customAgentForm, {
                        cityValue: storageObj.cityCodes
                    })
                }
            } else {
                $$model_agent.list({
                    pageIndex: that.pageIndex,
                    pageSize: that.pageSize,
                    keyword: that.$route.query.id || "",
                    cityCodes: [],
                    provinceCodes: []
                }, res => {
                    if (res.code == 200) {
                        that.tableData = res.data.customerList;
                        that.total = res.data.totalCount;
                    }
                });
            }
            that.isRequire = true;
        });
    }
}
