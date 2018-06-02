import $$model_agent from '../model-agent.js'
import _ from '../../../lib/underscore.v1.4.4.min';
import $$customer from '../../../script/data/model/customer';
let symbol = true;
export default {
    data() {
        return {
            expendForm: {
                consultantStatus: '', //推广顾问，多选
                areaCode: null, //城市选择
                dateRange: [], //日期选择,数组
                extra: "", //输入框内容
                pageSize: "10", //每页显示数目
                pageIndex: "1" //当前页码
            },
            Consultant: [],
            tableData: [],
            areaCodeList: [], //城市列表
            totalCount: 0 //总数据条数
        }
    },
    watch: {
        expendForm: {
            deep: true,
            handler(newVal) {
                if (symbol && this.expendForm.consultantStatus.length === 0) {
                    symbol = false;
                    return;
                };
                //数据更新
                localStorage.setItem("customer-agent-expend", JSON.stringify(newVal));
                this.searchExpend();
            }
        }
    },
    methods: {
        showAgentDetail (data) {
            // 页面间传参
            this.$router.push({
                name: 'customer-agent-detail',
                query: {
                    agentId: data.agentID,
                    agentName: encodeURI(data.agentName)
                }
            });
        },
        dateFormat(date) {
            var date = date ? new Date(date) : new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        },
        download() {
            //参数与筛选相同，返回一个链接然后打开
            var that = this;
            var params = that.getExpendParams(true);
            $$customer.searchExpend(params, data => {
                if (data.code != 0) {
                    that.$message({
                        showClose: true,
                        message: data.msg,
                        type: 'error'
                    });
                    return;
                } else {
                    window.open(data.data);
                }
            })
        },
        handleSizeChange (val) {
            this.expendForm.pageSize = val;
        },
        handleCurrentChange (val) {
            this.expendForm.pageIndex = val;
        },
        searchExpend (data) {
            var that = this;
            var params = that.getExpendParams();
            //请求符合条件的代理商列表
            $$customer.searchExpend(params, data => {
                if (data.code !== 0) {
                    that.$message({
                        showClose: true,
                        message: data.msg,
                        type: 'error'
                    });
                    return;
                } else {
                    let newData = data.data.mapList;
                    newData.forEach(item => {
                        item.grantConsumption = item.grantConsumption == 'null' ? '暂无' : item.grantConsumption;
                        item.creditConsumption = item.creditConsumption == 'null' ? '暂无' : item.creditConsumption;
                    });
                    that.tableData = newData;
                    that.totalCount = data.data.totalCount;
                }
            })
        },
        getExpendParams(download = false) {
            var params = {
                areaCode: this.expendForm.areaCode.length !== 0 ? this.expendForm.areaCode : null,
                startDate: this.dateFormat(this.expendForm.dateRange[0]),
                endDate: this.dateFormat(this.expendForm.dateRange[1]),
                pageSize: this.expendForm.pageSize,
                pageIndex: this.expendForm.pageIndex,
                extra: this.expendForm.extra,
                export: download.toString(),
                consultantStatus: this.expendForm.consultantStatus
            }
            return JSON.parse(JSON.stringify(params));
        },
        searchAgent () {
            this.searchExpend();
        }
    },
    beforeMount () {
        var that = this;
        //请求推广顾问列表
        var tmpConsultant = [];
        $$customer.getConsultantList(data => {
            that.Consultant = tmpConsultant.concat(data.data);
            that.expendForm.consultantStatus.push(that.Consultant[0].id);
        })
        //请求城市列表
        $$customer.getCityList(data => {
            that.areaCodeList = data.data.areaCodeList;
            var cityArr = [];
            var cityOptions = data.data.areaCode;
            for (var i in cityOptions) {
                cityArr.push({
                    id: parseInt(i, 10),
                    name: cityOptions[i]
                });
            }
            var temp = {
                pageSize: "10",
                pageIndex: "1"
            }
            _.extend(that.expendForm, JSON.parse(localStorage.getItem("customer-agent-expend")), temp);
            if (!Array.isArray(that.expendForm.dateRange)) {
                var endDate = new Date();
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                that.expendForm.dateRange = [startDate, endDate];
            }
        })
    },
    // beforeDestroy () {
    //     var temp = {
    //         consultantStatus: this.expendForm.consultantStatus,
    //         areaCode: this.expendForm.areaCode,
    //         dateRange: this.expendForm.dateRange,
    //         extra: this.expendForm.extra
    //     }
    //     localStorage.setItem("customer-agent-expend", JSON.stringify(temp));
    // }
}