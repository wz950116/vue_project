<template>
	<div style="margin-top:20px;">
		<!-- header -->
		<el-form ref="form" :model="filterForm" label-width="70px">
            <el-row type="flex">
                <el-form-item label="日期">
                    <el-date-picker 
                    	v-model="filterForm.dateRange" type="daterange" 
                    	placeholder="选择日期范围" style="width:217px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="所在城市">
                    <el-select 
                    	v-model="filterForm.cityValue" 
                    	style="width:217px;" 
                    	filterable multiple
                        @change='handleCurrentChange'>
                        <el-option-group
                            v-for="group in cityOptions"
                            :label="group.label">
                            <el-option 
                            	v-for="item in group.options" 
                            	:label="item.label" :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务进度">
                    <el-select
                        style="width:217px;"
                        v-model='filterForm.taskSchedule'
                        @change='handleCurrentChange'>
                        <el-option 
                            v-for="item in scheduleOptions" 
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提现状态">
                    <el-select
                        style="width:217px;"
                        v-model='filterForm.extractStatus'
                        @change='handleCurrentChange'>
                        <el-option 
                            v-for="item in extractOptions" 
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row style="padding-bottom:20px;">
                <el-button @click.native="exportExcel" style='float:left;'>导出数据</el-button>
                <el-input 
                    v-model="filterForm.searchContentId" 
                    style="width:180px;float:right;"
                    placeholder="请输入搜索楼盘Id">
                    <el-button slot="append" icon="search" @click='handleCurrentChange'></el-button>
                </el-input>
                <el-input 
                    v-model="filterForm.searchContentPhone" 
                    style="width:180px;margin-right:40px;float:right;"
                    placeholder="请输入搜索手机号">
                    <el-button slot="append" icon="search" @click='handleCurrentChange'></el-button>
                </el-input>
            </el-row>
        </el-form>

        <!-- content -->
		<el-table 
            :data="tableData" 
            border style="width:100%;"
            ref="multipleTable">
            <el-table-column prop="drawDate" label="领取日期" width="130" align="center"></el-table-column>
            <el-table-column prop="cityName" label="城市" width="130" align="center"></el-table-column>
            <el-table-column prop="phoneNum" label="手机账号" width="130" align="center"></el-table-column>
            <el-table-column prop="orderId" label="红包Id" width="130" align="center"></el-table-column>
            <el-table-column label="IP地址" width="130" align="center" inline-template>
            	<div class='handle-text' :title='row.IP | ipFormat'>
            		{{ row.IP }}
            	</div>
            </el-table-column>
            <el-table-column label="设备号" width="130" align="center" inline-template>
            	<div class='handle-text' :title='row.deviceName'>
            		{{ row.deviceName }}
            	</div>
            </el-table-column>
            <el-table-column prop="estateName" label="楼盘名称" width="130" align="center"></el-table-column>
            <el-table-column sortable prop="taskSchedule" label="任务进度" width="150" align="center"></el-table-column>
            <el-table-column prop="totalMoney" label="红包总额" width="130" align="center"></el-table-column>
            <el-table-column prop="hasWithdrawedMoney" label="已提现金额" width="140" align="center"></el-table-column>
            <el-table-column prop="" label="提现操作" width="180" align="center" inline-template>
            	<div style='height:60px;line-height:60px;'>
            		<el-button 
            			@click='getMoney(row)'
                        v-if='row.hasWithdrawedMoney === 0'
                        :disabled='!row.canExtractMoney || row.hasWithdrawedMoney !== 0'>
                        提现
            		</el-button>
                    <div v-else>已提现</div>
            	</div>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination" v-show="totalNum > 0">
            <el-pagination @current-change="handlePageSizeChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
	</div>
</template>

<script>
	import $$ad from "../../script/data/model/ad";
import $$model from "./model.js";

	export default {
	    data () {
	        return {
	            tableData: [],
	            cityOptions: [],
            scheduleOptions: [{
                label: "全部",
                value: null
            }, {
                label: "领取成功",
                value: 0
            }, {
                label: "完成400任务",
                value: 1
            }, {
                label: "完成看房签到",
                value: 2
            }],
            extractOptions: [{
                label: "全部",
                value: null
            }, {
                label: "不可提现",
                value: 0
            }, {
                label: "可提现",
                value: 1
            }, {
                label: "已提现",
                value: 2
            }],
	            filterForm: {
	                dateRange: [new Date(), new Date()],
	                cityValue: [],
	                searchContentId: "",
	                searchContentPhone: "",
	                extractCode: "",
                taskSchedule: null,
                extractStatus: null
	            },
	            currentPage: 1,
	            pageSize: 10,
	            totalNum: 0
	        };
	    },
	    methods: {
	        // 导出excel表
	        exportExcel () {
	            const _this = this;
	            const params = {
	                "areaCodeList": _this.filterForm.cityValue.length > 0 ? _this.filterForm.cityValue : null,
                "dateBegin": _this.timeFormat(_this.filterForm.dateRange[0]),
                "dateEnd": _this.timeFormat(_this.filterForm.dateRange[1]),
                "estateId": _this.filterForm.searchContentId,
                "userPhone": _this.filterForm.searchContentPhone,
                "processStatus": _this.filterForm.taskSchedule,
                "extractStatus": _this.filterForm.extractStatus,
                "pageIndex": _this.currentPage,
                "limit": _this.pageSize
    	        };
	            $$model.exportExcel(params, res => {
	                if (res.code === 0) {
	                    window.open(res.data.url);
	                }
	            });
	        },
	        // 展示列表
	        handleCurrentChange () {
	            const _this = this;
            const params = {
	                "areaCodeList": _this.filterForm.cityValue.length > 0 ? _this.filterForm.cityValue : null,
	                "dateBegin": _this.timeFormat(_this.filterForm.dateRange[0]),
	                "dateEnd": _this.timeFormat(_this.filterForm.dateRange[1]),
	                "estateId": _this.filterForm.searchContentId,
	                "userPhone": _this.filterForm.searchContentPhone,
                "processStatus": _this.filterForm.taskSchedule,
                "extractStatus": _this.filterForm.extractStatus,
	                "pageIndex": _this.currentPage,
	                "limit": _this.pageSize
	            };
	            $$model.getRedUserList(params, res => {
	                if (res.code === 0) {
	                    _this.totalNum = res.data.totalNum;
	                    _this.tableData = res.data.list;
	                }
            });
        },
	        // 时间格式化
        timeFormat (dateObj) {
            	if (!dateObj) return "";
            const updatetimeval = dateObj.getFullYear() + "" + ((dateObj.getMonth() + 1) < 10 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1)) + "" + (dateObj.getDate() < 10 ? ("0" + dateObj.getDate()) : dateObj.getDate());
            return updatetimeval;
        },

        // pageSize改变
        handlePageSizeChange (num) {
            this.currentPage = num;
            this.handleCurrentChange();
        },

        // 提现
        getMoney (row) {
            	$$model.extractMoney({
            		"date": row.drawDate,
			        "orderId": row.orderId,
			        "phoneNum": row.phoneNum
            	}, res => {
            		if (res.code === 0) {
            			this.$message({
            				type: "success",
            				message: "提现成功"
            			});
                    this.handleCurrentChange();
            		} else {
            			this.$message({
            				type: "error",
            				message: res.msg
            			});
            		}
            	});
        }
	    },
	    watch: {
	        "filterForm.dateRange": {
            deep: true,
            handler: function () {
                this.handleCurrentChange();
            }
        }
	    },
	    filters: {
	        ipFormat (strIP) {
	            const arr = strIP.split(", ");
            let newStr = "";
	            arr.forEach(item => {
	                newStr += item + "\n";
	            });
	            return newStr.slice(0, newStr.length - 1);
	        }
	    },
	    beforeMount () {
	        const _this = this;
	        const params = {
	            "areaCodeList": _this.filterForm.cityValue.length > 0 ? _this.filterForm.cityValue : null,
	            "dateBegin": _this.timeFormat(_this.filterForm.dateRange[0]),
	            "dateEnd": _this.timeFormat(_this.filterForm.dateRange[1]),
	            "estateId": _this.filterForm.searchContentId,
	            "userPhone": _this.filterForm.searchContentPhone,
            "processStatus": _this.filterForm.taskSchedule,
            "extractStatus": _this.filterForm.extractStatus,
	            "pageIndex": _this.currentPage,
	            "limit": _this.pageSize
	        };
	        $$model.getRedUserList(params, res => {
	            if (res.code === 0) {
	                _this.totalNum = res.data.totalNum;
	                _this.tableData = res.data.list;
	            }
        });

	        // 城市数据
        $$ad.on("getAdParams", data => {
            const cityArr = [];
            const cityOptions = data.data.areaCode;
            for (const i in cityOptions) {
                cityArr.push({
                    id: parseInt(i, 10),
                    name: cityOptions[i]
                });
            }
            _this.cityOptions = data.data.areaCodeList;
        });

        $$ad.getAdParams();
	    }
	};
</script>

<style scoped>
	.handle-text {
    height: 24px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}
</style>