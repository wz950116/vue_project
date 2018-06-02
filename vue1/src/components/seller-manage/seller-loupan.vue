<template>
	<div class="seller-loupan-main">
		<div class="header">
			<el-button class="banner-btn" type="primary" @click="goBack">
				<i class="el-icon-arrow-left" style="margin-right:10px;"></i>返回
			</el-button>
			<div class="seller-info">
				<span class="banner-text">{{ sellerInfo.name }}</span>
				<span class="banner-text">{{ sellerInfo.email }}</span>
			</div>
		</div>
		<div style="width:100%;overflow:hidden;">
			<div class="btn-input-box">
				<el-button 
					class="add-btns" 
					type="primary"
					@click="openAdd">
					<i class="el-icon-plus"></i>&nbsp;添加
				</el-button>
				<el-button 
					class="add-btns" 
					type="primary"
					@click="deleteLoupan()">
					<i class="el-icon-delete"></i>&nbsp;删除
				</el-button>
				
				<el-input :placeholder="queryTip" v-model="queryContent" style="width: 300px;float: right;">
					<el-button slot="append" icon="el-icon-search" @click="initRander"></el-button>
				</el-input>
				<el-select v-model="queryType" placeholder="请选择" style="width: 120px;float: right;">
					<el-option label="楼盘名" :value="queryList.estateName"></el-option>
					<el-option label="楼盘ID" :value="queryList.estateId"></el-option>
				</el-select>
			</div>
			<div class="table-content">
				<el-table :data="loupanList" border style="width:100%;" @selection-change="handleSelectionChange">
					<el-table-column type="selection"></el-table-column>
					<el-table-column prop="estateName" label="楼盘名称" align='center'>
					</el-table-column>
					<el-table-column prop="estateId" label="楼盘ID" align='center'>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button type="primary" class="delete-btns" @click="deleteLoupan(scope.row.estateId, 1)">
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 分页组件 -->
		<div class="footer">
			<el-pagination @current-change="handleCurrentChange" :page-size="page_size" layout="total,prev,pager,next,jumper" :total="totalCount">
			</el-pagination>
		</div>

		<!-- 添加负责楼盘模态框 -->
		<el-dialog title="添加负责楼盘" :visible.sync="addFormVisible">

			<el-form :model="formAdd" style="padding:0 50px;">
				<el-form-item label="楼盘ID:">
					<el-input v-model="formAdd.estateId" placeholder="输入楼盘ID" class="dialog-input"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addLoupan">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import $api from "./model.js";
	export default {
	    data () {
	        return {
	            addFormVisible: false,
	            sellerInfo: {},
	            sellerId: "",
	            queryContent: "",
	            queryType: "",
	            queryTip: "输入楼盘名称或楼盘ID",
	            queryList: {},
	            loupanList: [],
	            page_size: 15,
	            page_index: 1,
	            totalCount: 0,
	            formAdd: {
	                estateId: ""
	            },
	            multipleSelection: []
	        };
	    },
	    watch: {
	        "$route": function (to, from) {
	            const that = this;
	            that.queryContent = "";
	            that.queryType = "";
	            that.initRander();
	        },
	        queryType: function (val, oldVal) {
	            if (val != "") {
	                if (val == this.queryList.estateName) {
	                    this.queryTip = "输入楼盘名称";
	                } else if (val == this.queryList.estateId) {
	                    this.queryTip = "输入楼盘ID";
	                } else {
	                    this.queryTip = "输入楼盘名称或楼盘ID";
	                }
	            } else {
	                this.queryTip = "输入楼盘名称或楼盘ID";
	            }
	        }
	    },
	    methods: {
	        initRander () {
	            const that = this;
	            // 从路由获取到sellerId
	            that.sellerId = that.$route.params.id;

	            // 发请求，根据员工id发送请求获取员工对应的楼盘数据
	            $api.getEstateList({
	                salesUserId: that.sellerId,
	                queryType: that.queryType,
	                queryContent: that.queryContent,
	                pageIndex: that.page_index,
	                limit: that.page_size
	            }, res => {
	                that.totalCount = res.data.count * 1;
	                that.loupanList = res.data.list;
	                that.sellerInfo.name = res.data.name;
	                that.sellerInfo.email = res.data.sohuMail;
	                that.addFormVisible = false;
	            });
	        },
	        goBack () {
	            this.$router.push({
	                name: "seller-list"
	            });
	        },
	        // 翻页事件
	        handleCurrentChange (val) {
	            this.page_index = val;
	            this.initRander();
	        },

	        // 删除楼盘
	        deleteLoupan (rowEstate, type) {
	            const that = this;
	            if (that.multipleSelection.length == 0 && type !== 1) {
	            	that.$message({
	            		type: "warning",
	            		message: "请先选择楼盘"
	            	});
	            	return;
	            }
	            that.$confirm("确定删除该楼盘吗？", "提示", {
	                confirmButtonText: "确定",
	                cancelButtonText: "取消",
	                type: "warning"
	            }).then(() => {
                const selectedArr = [];
                if (type != 1) {
                	that.multipleSelection.forEach(item => {
                		selectedArr.push(item.estateId);
                	});
                }

                $api.deleteEstate({
	                    salesUserId: that.sellerId,
	                    estateId: rowEstate,
	                    estateIdList: selectedArr
	                }, res => {
	                    if (res.msg == "success") {
	                        that.$message("删除成功");
	                        that.initRander();
	                    } else {
	                        that.$message.error(res.msg);
	                    }
	                });
	            }).catch(() => {
	                that.$message({
	                    type: "info",
	                    message: "已取消删除"
	                });
	            });
	        },

	        // 添加楼盘
	        openAdd () {
	            const that = this;
	            that.addFormVisible = true;
	            that.formAdd.estateId = "";
	        },
	        addLoupan () {
	            const that = this;
	            const params = {
	                estateId: that.formAdd.estateId,
	                salesUserId: that.sellerId
	            };
	            if (!params.estateId) {
	                that.$message.error("楼盘Id不可为空");
	                return;
	            }
	            $api.addEstate(params, res => {
	                if (res.msg == "success") {
	                    that.$message("添加成功");
	                    that.initRander();
	                } else {
	                    that.$message.error(res.msg);
	                }
	            });
	        },

	        // 选择table中的checkbox事件
	        handleSelectionChange (val) {
	            this.multipleSelection = val;
	        }
	    },
	    beforeMount () {
	        const that = this;
	        // 获取必要参数
	        $api.getParameters({}, res => {
	            that.queryList.estateName = res.data.estateQueryList[0].option;
	            that.queryList.estateId = res.data.estateQueryList[1].option;
	        });
	    },
	    mounted () {
	        this.initRander();
	    }
	};
</script>

<style scoped>
.seller-loupan-main {
    padding: 30px 0;
    overflow: hidden;
}

.header {
    overflow: hidden;
    width: 100%;
}

.header .banner-btn {
    float: left;
    margin: 0 20px;
}

.seller-info .banner-text {
    float: left;
    margin-left: 10px;
    display: inline-block;
    font-size: 16px;
    line-height: 36px;
}

.btn-input-box {
    float: left;
    overflow: hidden;
    width: 65%;
    margin: 15px 0 0 135px;
}

.btn-input-box .add-btns {
    float: left;
}

.table-content {
    float: left;
    overflow: hidden;
    width: 40%;
    margin-left: 135px;
    margin-top: 15px;
}

.footer {
    float: left;
    margin: 20px 0 0 600px;
}

.dialog-input {
    width: 350px;
}

.delete-btns {
    display: block;
    margin: 0 auto;
}
</style>
