<template>
	<div class="seller-list-main">
		<!-- 顶部按钮、搜索组件 -->
		<div class="header">
			<el-button class="header-btns" type="primary" @click="addFormVisible = true">
				<i class="el-icon-plus" style="margin-right:10px;"></i>新增
			</el-button>
			<el-button class="header-btns" type="primary" @click="clickEditBtn" :disabled="!hasChecked">
				<i class="el-icon-edit" style="margin-right:10px;"></i>编辑
			</el-button>
			<el-button class="header-btns" type="primary" @click="clickDeleteBtn" :disabled="!hasChecked">
				<i class="el-icon-delete" style="margin-right:10px;"></i>删除
			</el-button>
			<!-- upload Excel -->
			<el-upload 
				:action="uploadUrl" 
				:show-file-list = "false"
				:with-credentials = "true" 
				:before-upload="beforeUpload" 
				:on-success="uploadSuccess"
				style='float:left;'>
				<el-button class="header-btns" type="primary">
					<i class="el-icon-upload" style="margin-right:10px;"></i>
					{{ saveUploadLabel }}
				</el-button>
			</el-upload>
			<!-- filter -->
			<el-select 
				v-model="queryType" 
				slot="prepend" 
				placeholder="请选择" 
				style="width:120px;float:left;">
				<el-option label="姓名" :value="queryList.name"></el-option>
				<el-option label="邮箱" :value="queryList.email"></el-option>
			</el-select>
			<el-input 
				:placeholder="queryTip"
				v-model="queryContent" 
				class="header-search">
				<el-button slot="append" icon="el-icon-search" @click='clickSearchBtn'></el-button>
			</el-input>
		</div>

		<el-form :model="formAdd" style="padding:0 60px;float:right;">
			<el-form-item label="城市:" style='display:inline-block;width:250px;'>
				<el-select 
                	v-model="queryCity" 
                	style="width:180px;" 
                	filterable
                	@change='initRander'>
                	<el-option-group>
                    	<el-option label='全部城市' value=''></el-option>
                	</el-option-group>
                	<el-option-group>
                    	<el-option label='全国' value='100000'></el-option>
                	</el-option-group>
                    <el-option-group
                        v-for="group in cityOptions"
                        :label="group.label" :key='group.label'>
                        <el-option 
                        	v-for="item in group.options" 
                        	:label="item.label" :value="item.value" :key="item.value">
                        </el-option>
                    </el-option-group>
                </el-select>
			</el-form-item>
			<el-form-item label="角色:" style='display:inline-block;width:220px;'>
				<el-select 
                	v-model="queryRole" 
                	style="width:140px;"
                	@change='initRander'>
                	<el-option label='全部' value=''></el-option>
					<el-option 
						v-for='item in salesRoleList'
						:label='item.label' :value='item.option' :key='item.option'>
					</el-option>
                </el-select>
			</el-form-item>
		</el-form>

		<!-- table表格 -->
		<div class="table-content">
			<el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange">
				<el-table-column type="selection"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="cityName" label="城市"></el-table-column>
				<el-table-column prop="salesUserId" label="员工编号"></el-table-column>
				<el-table-column prop="sohuMail" label="邮箱"></el-table-column>
				<el-table-column prop="level" label="级别"></el-table-column>
				<el-table-column prop="salesRole" label="角色"></el-table-column>
				<el-table-column prop="leaderName" label="上级"></el-table-column>
				<el-table-column label="负责楼盘" style='text-align:center;'>
					<template slot-scope="scope">
							<router-link 
								class="table-btns" 
								:to="{ name: 'seller-loupan', params: {id: scope.row.salesUserId}}">
								查看
							</router-link>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 分页组件 -->
		<div class="footer">
			<el-pagination @current-change="handleCurrentChange" :page-size="page_size" layout="total,prev,pager,next,jumper" :total="totalCount">
			</el-pagination>
		</div>

		<!-- 新增员工模态框 -->
		<el-dialog title="新增员工" :visible.sync="addFormVisible">
			<el-form :model="formAdd" style="padding:0 60px;">
				<el-form-item label="姓名:">
					<el-input v-model="formAdd.name" placeholder="输入姓名" auto-complete="on" class="dialog-input"></el-input>
				</el-form-item>
				<el-form-item label="城市:">
					<el-select 
                    	v-model="formAdd.areaCode" 
                    	style="width:217px;" 
                    	filterable>
                    	<el-option-group>
                        	<el-option label='全国' value='100000'></el-option>
                    	</el-option-group>
                        <el-option-group
                            v-for="group in cityOptions"
                            :label="group.label" :key='group.label'>
                            <el-option 
                            	v-for="item in group.options" 
                            	:label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
				</el-form-item>
				<el-form-item label="邮箱:">
					<el-input v-model="formAdd.sohuMail" placeholder="输入邮箱" auto-complete="on" class="dialog-input"></el-input>
				</el-form-item>
				<el-form-item label="级别:">
					<el-select v-model="formAdd.level" placeholder="选择级别" class="dialog-input" @change="selectLevel">
						<el-option 
							v-for='item in levelList'
							:label='item.label' :value='item.option' :key='item.option'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色:">
					<el-select v-model="formAdd.salesRole" placeholder="选择角色" class="dialog-input">
						<el-option 
							v-for='item in salesRoleList'
							:label='item.label' :value='item.option' :key='item.option'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上级:">
					<el-select 
						:disabled="isAdmin" 
						v-model="formAdd.leaderId" 
						placeholder="选择上级" 
						class="dialog-input" filterable>
						<el-option 
							v-for="item in leaderList" 
							:label="item.name" :value="item.salesUserId" :key="item.salesUserId">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSeller">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑员工模态框 -->
		<el-dialog title="编辑员工" :visible.sync="editFormVisible">
			<el-form :model="formEdit" style="padding:0 60px;">
				<el-form-item label="姓名:" v-if="multipleSelection.length <= 1">
					<el-input v-model="formEdit.name" placeholder="输入姓名" auto-complete="on" class="dialog-input"></el-input>
				</el-form-item>
				<el-form-item label="城市:" v-if="multipleSelection.length <= 1">
					<el-select 
                    	v-model="formEdit.areaCode" 
                    	style="width:217px;" 
                    	filterable>
                    	<el-option-group>
                        	<el-option label='全国' value='100000'></el-option>
                    	</el-option-group>
                        <el-option-group
                            v-for="group in cityOptions"
                            :label="group.label" :key='group.label'>
                            <el-option 
                            	v-for="item in group.options" 
                            	:label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
				</el-form-item>
				<el-form-item label="邮箱:" v-if="multipleSelection.length <= 1">
					<el-input v-model="formEdit.sohuMail" placeholder="输入邮箱" auto-complete="on" class="dialog-input"></el-input>
				</el-form-item>
				<el-form-item label="角色:" v-if="multipleSelection.length <= 1">
					<el-select v-model="formEdit.salesRole" placeholder="选择角色" class="dialog-input">
						<el-option 
							v-for='item in salesRoleList'
							:label='item.label' :value='item.option' :key='item.option'>
						</el-option>	
					</el-select>
				</el-form-item>
				<el-form-item label="级别:" v-if="multipleSelection.length <= 1">
					<el-select v-model="formEdit.level" placeholder="选择级别" class="dialog-input" @change="selectLevel">
						<el-option 
							v-for='item in levelList' 
							:label='item.label' :value='item.option' :key='item.option'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="上级:">
					<el-select 
						:disabled="isAdmin" 
						v-model="formEdit.leaderId" 
						filterable placeholder="选择上级" 
						class="dialog-input">
						<el-option 
							v-for="item in leaderList" 
							:label="item.name" :value="item.salesUserId" :key="item.salesUserId">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSeller">确 定</el-button>
			</div>
		</el-dialog>
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
	            page_size: 10,
	            page_index: 1,
	            totalCount: 0,
	            queryList: {},
	            queryTip: "输入员工姓名或邮箱",
	            queryType: "",
	            queryContent: "",
	            queryCity: "",
	            queryRole: "",
	            uploadUrl: "//productivity.focus" + urlType + ".cn/api/salesManage/createByExcel",
	            salesRoleList: [], // 角色列表
	            levelList: [], // 级别列表
	            multipleSelection: [],
	            addFormVisible: false,
	            editFormVisible: false,
	            hasChecked: false,
	            isAdmin: false,
	            formAdd: {
	                name: "",
	                level: "",
	                sohuMail: "",
	                leaderId: "",
	                salesRole: "",
	                areaCode: ""
	            },
	            formEdit: {
	                name: "",
	                level: "",
	                sohuMail: "",
	                leaderId: "",
	                salesUserIdList: [],
	                salesRole: "",
	                areaCode: ""
	            },
	            leaderList: [],
	            cityOptions: [],
	            saveUploadLabel: "导入人员"
	        };
	    },

	    watch: {
	        multipleSelection (val, oldVal) {
	            if (val.length > 0) {
	                this.hasChecked = true;
	            } else {
	                this.hasChecked = false;
	            }
	        },
	        queryType (val, oldVal) {
	            if (val != "") {
	                if (val == this.queryList.name) {
	                    this.queryTip = "输入员工姓名";
	                } else if (val == this.queryList.email) {
	                    this.queryTip = "输入员工邮箱";
	                } else {
	                    this.queryTip = "输入员工姓名或邮箱";
	                }
	            } else {
	                this.queryTip = "输入员工姓名或邮箱";
	            }
	        }
	    },

	    methods: {
	        initRander () {
	            const that = this;
	            // 获取列表数据
	            $api.getListData({
	                queryType: that.queryType,
	                queryContent: that.queryContent,
	                salesRole: that.queryRole,
	                areaCode: that.queryCity,
	                pageIndex: that.page_index,
	                limit: that.page_size
	            }, res => {
	                that.tableData = res.data.list;
	                that.totalCount = res.data.count * 1;
	            });
	        },
	        // 选择table中的checkbox事件
	        handleSelectionChange (val) {
	            this.multipleSelection = val;
	        },

	        // 编辑按钮点击事件
	        clickEditBtn () {
	            const that = this;
	            that.editFormVisible = true;

	            if (that.multipleSelection.length == 1) {
	                // 编辑一个人员
	                that.formEdit.name = that.multipleSelection[0].name;
	                that.formEdit.areaCode = that.multipleSelection[0].cityName;
	                that.formEdit.sohuMail = that.multipleSelection[0].sohuMail;
	                that.formEdit.salesRole = that.multipleSelection[0].salesRole == "销售" ? 1 : 2;
	                that.formEdit.level = that.multipleSelection[0].level == "普通" ? 10 : 11;
	                that.formEdit.leaderId = (that.multipleSelection[0].leaderId == -1) ? "" : this.multipleSelection[0].leaderId;
	                that.formEdit.salesUserIdList = [];
	                that.formEdit.salesUserIdList.push(that.multipleSelection[0].salesUserId);

	                // 若选择级别为管理员，则没有上级
	                if (that.formEdit.level == 11) {
	                    // 则将上级选择栏设为不可选择，formAdd设为空
	                    that.formEdit.leaderId = "";
	                    that.isAdmin = true;
	                } else {
	                    that.isAdmin = false;
	                }
	            } else {
	                // 编辑多个人员
	                that.formEdit.name = "";
	                that.formEdit.sohuMail = "";
	                that.formEdit.level = "";
	                that.formEdit.leaderId = "";
	                that.formEdit.salesUserIdList = [];
	                that.multipleSelection.forEach((item, index) => {
	                    that.formEdit.salesUserIdList.push(item.salesUserId);
	                });
	            }
	        },

	        // 点击删除按钮事件
	        clickDeleteBtn () {
	            const that = this;
	            let deleteIdList = []; 
	            that.multipleSelection.forEach((item, index) => {
	                // push要删除员工的number或id
	                deleteIdList.push(item.salesUserId);
	            });

	            that.$confirm("确定要删除吗？", "提示", {
	                confirmButtonText: "确定",
	                cancelButtonText: "取消",
	                type: "warning"
	            }).then(function () {
	                $api.deleteSeller({
	                    salesUserIdList: deleteIdList
	                }, res => {
	                    if (res.msg == "success") {
	                        that.$message("删除成功");
	                        that.initRander();
	                    } else {
	                        that.$message({
	                            type: "error",
	                            message: "部分用户删除失败，请先清除绑定楼盘"
	                        });
	                    }
	                });
	            }).catch(function (e) {
	                // console.log(e);
	            });
	        },

	        // 翻页事件
	        handleCurrentChange (val) {
	            this.page_index = val;
	            this.initRander();
	        },

	        // 点击选择级别
	        selectLevel (val) {
	            // 若选择级别为管理员，则没有上级
	            if (val == 11) {
	                this.formAdd.leaderId = "";
	                this.formEdit.leaderId = "";
	                this.isAdmin = true;
	            } else {
	                this.isAdmin = false;
	            }
	        },

	        // 提交新建销售人员 确认按钮
	        addSeller () {
	            const that = this;
	            const params = {};
	            for (const key in that.formAdd) {
	                params[key] = that.formAdd[key];
	            }
	            if (!params.name) {
	                that.$message.error("姓名不可以为空");
	                return;
	            }
	            if (!(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(params.sohuMail))) {
	                that.$message.error("邮箱格式错误");
	                return;
	            }
	            if (!params.salesRole) {
	                that.$message.error("请选择角色");
	                return;
	            }
	            if (!params.level) {
	                that.$message.error("请选择级别");
	                return;
	            }
	            if (!params.areaCode) {
	                that.$message.error("请选择城市");
	                return;
	            }

	            if (params.leaderId == "") {
	                params.leaderId = -1;
	            }
	            // 提交表单发送请求新建用户
	            $api.createSeller(params, (res) => {
	                if (res.msg == "success") {
	                    that.$message("添加成功");
	                    that.initRander();
	                    that.addFormVisible = false;
	                } else {
	                    that.$message.error(res.msg);
	                }
	            });
	        },

	        // 编辑销售人员 确认按钮
	        editSeller () {
	            const that = this;
	            const editParams = {};
	            for (const key in that.formEdit) {
	                editParams[key] = that.formEdit[key];
	            }
	            if (editParams.leaderId == "") {
	                editParams.leaderId = -1;
	            }
	            // 提交表单发送请求编辑用户
	            $api.editSeller(editParams, (res) => {
	                if (res.msg == "success") {
	                    that.$message("编辑成功");
	                    that.initRander();
	                    that.editFormVisible = false;
	                } else {
	                    that.$message.error(res.msg);
	                }
	            });
	        },

	        // 搜索
	        clickSearchBtn () {
	            const that = this;
	            that.initRander();
	        },

	        // 上传前判断格式
	        beforeUpload (file) {
	            const fileName = file.name;
	            const index = fileName.lastIndexOf(".");
	            const fileType = fileName.substring(index + 1, fileName.length);
	            if (fileType == "xlsx" || fileType == "xls") {
	                return true;
	            } else {
	                this.$message.error("只能上传Excel文件");
	                return false;
	            }
	        },

	        // 上传成功，刷新页面
	        uploadSuccess (res) {
	            if (res.msg == "success") {
	                this.$message.success(res.msg);
	            } else {
	                this.$message.error(res.msg);
	            }
	        }
	    },

	    beforeMount () {
	        const that = this;
	        // 获取必要参数
	        $api.getParameters({}, res => {
	            that.queryList.name = res.data.queryList[0].option; // 姓名
	            that.queryList.email = res.data.queryList[1].option; // 邮箱
	            that.levelList = res.data.levelList; // 级别
	            that.salesRoleList = res.data.salesRoleList; // 角色
	            that.cityOptions = res.data.areaCodeList; // 城市列表
	        });

	        // 获取领导列表
	        $api.getLeaderList({
	            name: ""
	        }, res => {
	            that.leaderList = res.data.list;
	            that.totalCount = res.data.count * 1;
	        });
	    },
	    mounted () {
	        this.initRander();
	    }
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

.header .header-btns {
    float: left;
    margin-right: 20px;
}

.header .header-input {
    float: left;
    margin-left: 20px;
}

.header .header-search {
    width: 260px;
    float: left;
}

.table-content {
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
    text-align: center;
    padding: 0 15px;
    margin: 0 auto;
}

.table-btns:hover {
    background: rgba(32, 160, 255, 0.8);
}

.dialog-input {
    float: left;
    width: 70%;
}

.footer {
    float: right;
    margin-right: 40px;
}
</style>
