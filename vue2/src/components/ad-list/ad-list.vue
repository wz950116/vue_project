<template>
    <div style="margin-top:15px;">
        <!-- form部分 -->
        <el-select v-model="select" @change="filterData" placeholder="请选择" class="select-sort" >
            <el-option label="计划名称" value="planName"></el-option>
            <el-option label="计划ID" value="planId"></el-option>
            <el-option label="广告单元名称" value="orderName"></el-option>
            <el-option label="订单ID" value="orderId"></el-option>
            <el-option label="客户名称" value="demanderName"></el-option>
            <el-option label="客户ID" value="demanderId"></el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="input" class="key-word" @change="filterData">
        </el-input>
        <!-- table部分 -->
        <el-table :data="tableData" border style="width:100%;">
            <el-table-column property="orderId" label="订单ID" width="120" align="center">
            </el-table-column>
            <el-table-column property="orderName" label="广告单元名称" width="180" align="center">
            </el-table-column>
            <el-table-column property="planId" label="计划ID" width="100" align="center">
            </el-table-column>
            <el-table-column property="planName" label="计划名称" width="180" align="center">
            </el-table-column>
            <el-table-column property="demanderId" label="客户ID" width="120" align="center">
            </el-table-column>
            <el-table-column property="demanderName" label="客户名称" width="100" align="center">
            </el-table-column>
            <el-table-column property="orderType" label="订单类型" width="200" align="center">
            </el-table-column>
            <el-table-column property="resource" label="广告资源" width="200" align="center">
            </el-table-column>
            <el-table-column label="所选日期" width="200" align="center" inline-template>
                <div>
                    <p v-for="(item, index) in row.days">
                        {{handleDate(item)}}
                    </p>
                </div>
            </el-table-column>
            <el-table-column 
                label="创意" 
                align="center" width="200"
                inline-template>
                <div>
                    <p v-for="item in row.ideas">
                        {{handleIdea(item)}}
                    </p>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
	import $$model_adlist from "./model-adList.js";
export default {
    name: "ad-list",
    data () {
        return {
            input: "",
            select: "",
            tableData: [],
            onOff: true
        };
    },
    mounted () {
        if (this.$route.query.id) {
            this.select = this.$route.query.select;
            this.input = this.$route.query.id + "";
        }

        if (window.localStorage.getItem("ad_list-searchContent")) {
            const storageObj = JSON.parse(window.localStorage.getItem("ad_list-searchContent"));
            this.select = storageObj.select;
            this.input = storageObj.input;
        }
    },
    methods: {
        	filterData () {
        		const select = this.select,
        			input = this.input,
                onOff = this.onOff;

            window.localStorage.setItem("ad_list-searchContent", JSON.stringify({
                select: select,
                input: input
            }));

    			if (input.trim() === "") {
    				this.tableData = [];
    			} else if (onOff) {
                this.onOff = false;
    				// ID不能输入非数字 select不能为空
    				if (/Id$/g.test(select)) {
    					if (!Number(input) && input != 0) {
    						this.$message("ID为非法数字");
    						return;
    					}
    				} else if (!select) {
    					this.$message("请选择搜索范围");
    					return;
    				}
    				const param = {
    					"reqKey": select,
        				"reqValue": input
    				};
    				$$model_adlist.add(param, res => {
                    if (res.code === 0) {
                        this.tableData = res.data;
                        this.onOff = true;
                    }
	        	});
    			}
        	},
        handleDate (value) {
            const key = Object.keys(value),
                arr = value[key];
            let result = key + ":";
            arr.forEach(value => {
                result += value + ",";
            });
            result = result.slice(0, result.length - 1);
            return result;
        },
        handleIdea (arr) {
            let result = "";
            arr.forEach(val => {
                if (val) {
                    result += val + " , ";
                }
            });
            return result.slice(0, result.length - 3);
        }
    }
};
</script>

<style scoped>
    .select-sort {
    width: 150px;
    display: inline-block;
}

.key-word {
    width: 50%;
    margin: 0 0 20px 20px;
    display: inline-block;
}
</style>