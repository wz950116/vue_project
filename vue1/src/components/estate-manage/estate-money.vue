<template>
	<div class='child-content'>
	  	<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-row>
	  			<el-button class="banner-btn" type="primary" @click="goBack">
					<i class="el-icon-arrow-left" style="margin-right:10px;"></i>返回
				</el-button>
                <el-button class="header-btns" type="primary" @click="showEstateBtn('add')">
                    <i class="el-icon-plus" style="margin-right:10px;"></i>新增
                </el-button>
                <el-button class="header-btns" type="primary" @click="showEstateBtn('edit')" :disabled="!hasChecked">
                    <i class="el-icon-edit" style="margin-right:10px;"></i>编辑
                </el-button>
                <el-button class="header-btns" type="primary" @click="clickDeleteBtn" :disabled="!hasChecked">
                    <i class="el-icon-delete" style="margin-right:10px;"></i>删除
                </el-button>
			</el-row>
	  		<h3 class='estate-name'>
				楼盘名称：{{ estateName }}
			</h3>
		    <el-tab-pane label="楼盘投放目标" name="first">
		    	<div class="table-content">
					<el-table 
						:data="tableDataOne" 
						border style="width: 100%;"
                		@selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column prop="year" label="年度" align='center'></el-table-column>
						<el-table-column prop="targetMoney" label="投放目标" align='center'></el-table-column>
					</el-table>
				</div>
		    </el-tab-pane>

		    <el-tab-pane label="楼盘投放记录" name="second">
		    	<div class="table-content">
					<el-table 
						:data="tableDataTwo" 
						border style="width: 100%;"
                		@selection-change="handleSelectionChange">
						<el-table-column type="selection"></el-table-column>
						<el-table-column prop="month" label="投放时间" align='center'></el-table-column>
						<el-table-column prop="adMoney" label="投放金额" align='center'></el-table-column>
					</el-table>
				</div>
		    </el-tab-pane>
	  	</el-tabs>

	  	<!-- 楼盘投放目标模态框 -->
        <el-dialog :title="addOrEdit === 'add' ? '新增楼盘投放目标' : '编辑楼盘投放目标'" :visible.sync="estateTargetVisible">
            <el-form :model="inputTag" style="padding:0 60px;">
                <el-form-item label="投放年份（年） :">
                    <el-input 
                        v-model="inputTag.year" 
                        placeholder="请输入投放年份 格式为xxxx" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="投放目标（万） :">
                    <el-input 
                        v-model="inputTag.targetMoney" 
                        placeholder="请输入投放目标" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="estateTargetVisible = false">取 消</el-button>
                <el-button type="primary" @click="estateTargetBtn">确 定</el-button>
            </div>
        </el-dialog>

	  	<!-- 楼盘投放记录模态框 -->
        <el-dialog :title="addOrEdit === 'add' ? '新增楼盘投放记录' : '编辑楼盘投放记录'" :visible.sync="estateLogVisible">
            <el-form :model="inputLog" style="padding:0 60px;">
                <el-form-item label="投放月份（月） :">
                    <el-input 
                        v-model="inputLog.month" 
                        placeholder="请输入投放月份 格式为xxxx年xx月" 
                        auto-complete="on" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
                <el-form-item label="投放金额（万） :">
                    <el-input 
                        v-model="inputLog.adMoney" 
                        placeholder="请输入投放金额" 
                        class="dialog-input">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="estateLogVisible = false">取 消</el-button>
                <el-button type="primary" @click="estateLogBtn">确 定</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
	import $api from "./model.js";
  	export default {
		data() {
			return {
				activeName: 'second',
				tableDataOne: [],
				tableDataTwo: [],
				queryId: null,
				inputTag: {
					year: '',
					targetMoney: '',
				},
				inputLog: {
					month: '',
					adMoney: '',
				},
				estateLogVisible: false,
				estateTargetVisible: false,
				hasChecked: false,
				multipleSelection: [],
				addOrEdit: '',
			};
		},
		methods: {
			handleClick(tab, event) {
				if (!this.queryId) return;
				let name = this.activeName;
				if (name === 'first') {
					const params = {
						estateId: this.queryId
					};
					$api.getAdMoneyTarget(params, res => {
						if (res.msg === 'success') {
							this.tableDataOne = res.data;
						}
					})
				} else if (name === 'second') {
					const params = {
						estateId: this.queryId
					};
					$api.getAdMoneyInfo(params, res => {
						if (res.msg === 'success') {
							this.tableDataTwo = res.data.history;
						}
					})

				}
			},
			// 展示模态框
			showEstateBtn (type) {
				let name = this.activeName;
				// 投放记录 or 投放目标
				if (name === 'first') {
					this.estateTargetVisible = true;
					// 新增 or 编辑
					if (type === 'add') {
						this.inputTag = {
							month: '',
							adMoney: '',
						};
						this.addOrEdit = 'add';
					} else if (type === 'edit') {
						this.inputTag.year = this.multipleSelection[0].year;
						this.inputTag.targetMoney = this.multipleSelection[0].targetMoney.split('万')[0];
						this.addOrEdit = 'edit';
					}
				} else if (name === 'second') {
					this.estateLogVisible = true;
					// 新增 or 编辑
					if (type === 'add') {
						this.inputLog = {
							month: '',
							adMoney: '',
						};
						this.addOrEdit = 'add';
					} else if (type === 'edit') {
						this.inputLog.month = this.multipleSelection[0].month;
						this.inputLog.adMoney = this.multipleSelection[0].adMoney.split('万')[0];
						this.addOrEdit = 'edit';
					}
				};
			},
			upsertAdmoney (params) {
				$api.upsertAdmoney(params, res => {
					if (res.msg === 'success') {
						this.$message.success('succes');
						this.estateLogVisible = false;
						this.estateTargetVisible = false;
						this.handleClick();
					} else {
						this.$message.error('参数有误');
					}
				}); 
			},
			// 新增Target
			estateTargetBtn () {
				let params = {
					estateId: this.queryId * 1,
					day: this.inputTag.year,
					money: this.inputTag.targetMoney && this.inputTag.targetMoney.split('万')[0] * 1,
					moneyType: 1,
				};
				if (params.day === undefined || params.day === '') {
					this.$message.error('投放日期不能为空');
					return;
				} else if (params.money === undefined || params.money === '') {
					this.$message.error('投放目标不能为空');
					return;
				}
				this.upsertAdmoney(params);
			},
			// 新增Log
			estateLogBtn () {
				let params = {
					estateId: this.queryId * 1,
					day: this.inputLog.month,
					money: this.inputLog.adMoney && this.inputLog.adMoney.split('万')[0] * 1,
					moneyType: 0,
				};
				if (params.day === undefined || params.day === '') {
					this.$message.error('投放日期不能为空');
					return;
				} else if (params.money === undefined || params.money === '') {
					this.$message.error('投放金额不能为空');
					return;
				};
				this.upsertAdmoney(params);
			},
			// 删除
			clickDeleteBtn () {
				let name = this.activeName, params = {};
				if (name === 'first') {
					params.estateId = this.queryId * 1,
					params.moneyType = 1,
					params.inputStr = this.multipleSelection.length > 1 ? (this.multipleSelection.reduce((total, item) => {
						return (total.year ? total.year : total) + ',' + item.year;
					})) : this.multipleSelection[0].year;
				} else if (name === 'second') {
					params.estateId = this.queryId * 1,
					params.moneyType = 0,
					params.inputStr = this.multipleSelection.length > 1 ? (this.multipleSelection.reduce((total, item) => {
						return (total.month ? total.month : total) + ',' + item.month;
					})) : this.multipleSelection[0].month;
				};
				this.$confirm("确定要删除吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					$api.deleteAdmoney(params, res => {
						if (res.msg == "success") {
							this.$message(res.msg);
							this.handleClick();
						} else {
							this.$message({
								type: "error",
								message: res.msg
							});
						}
					})
				});
			},
            // 选择table中的checkbox事件
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
			goBack () {
				this.$router.push({
	                name: "estate-manage"
	            });
			}
		},
		computed: {
			estateName () {
				return this.$route.query.name;
			}
		},
		watch: {
			'$route': function (data) {
				this.queryId = data.params.id;
				this.handleClick();
			},
            multipleSelection (val, oldVal) {
                if (val.length > 0) {
                    this.hasChecked = true;
                } else {
                    this.hasChecked = false;
                }
            },
		},
		mounted () {
			this.queryId = this.$route.params.id;
			this.handleClick();
		}
  	};
</script>

<style scoped>
	.estate-name {
		height: 40px;
		line-height: 40px;
		font-size: 16px;
		margin-top: 20px;
	}
	.child-content {
		margin: 10px;
	}
	.table-content {
	    width: 95%;
	    margin: 30px auto;
	}
	.banner-btn {
		margin-right: 20px;
	}
	.dialog-input {
	    float: left;
	    width: 70%;
	}
</style>