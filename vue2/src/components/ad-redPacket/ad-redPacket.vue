<template>
	<div class="ad-redPacket-header">
		<!-- head -->
		<el-form ref="form" :model="filterForm" label-width="70px">
            <el-row type="flex" justify="space-between">
                <el-form-item label="日期">
                    <el-date-picker 
                    	v-model="filterForm.dateRange" type="daterange" 
                    	placeholder="选择日期范围" style="width:217px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="所在城市">
                    <el-select 
                    	v-model="filterForm.cityValue"
                    	multiple filterable
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
                <el-form-item>
                	<el-select 
						v-model="filterForm.searchFilter"
                		style='width:120px;display:inline-block;vertical-align:top;'>
                		<el-option 
                			v-for='item in searchFilterArr'
                			:label='item.label' :value='item.option'>
                		</el-option>
	                </el-select>
	                <div style="display:inline-block;vertical-align:top;margin-left:-4px;">
	                	<el-input v-model="filterForm.searchContent" style="width:240px;">
		                    <el-button slot="append" icon="search" @click='handleCurrentChange'></el-button>
		                </el-input>
	                </div>
                </el-form-item>
            </el-row>
            <el-row style="padding-bottom:20px;">
                <el-button @click.native="exportExcel" style='float:right;'>导出数据</el-button>
                <el-button @click.native="addRedPacket">添加红包项目</el-button>
            </el-row>
        </el-form>
		
		<!-- table -->
        <el-table 
            :data="tableData" 
            border style="width:100%;" 
            ref="multipleTable">
			<el-table-column prop="resourceId" label="广告资源Id" width="170" align="center"></el-table-column>
            <el-table-column prop="orderId" label="红包订单Id" width="170" align="center"></el-table-column>
            <el-table-column prop="posId" label="红包位Id" width="170" align="center"></el-table-column>
            <el-table-column prop="posName" label="红包位名称" width="170" align="center"></el-table-column>
            <el-table-column prop="date" label="投放时间" width="110" align="center"></el-table-column>
            <el-table-column prop="cityName" label="城市名称" width="170" align="center"></el-table-column>
            <el-table-column prop="estateName" label="楼盘名称" width="150" align="center"></el-table-column>
            <el-table-column prop="estateId" label="楼盘Id" width="170" align="center"></el-table-column>
            <el-table-column prop="salePhone" label="400电话号码" width="130" align="center"></el-table-column>
            <el-table-column label="广告创意" width="170" align="center" inline-template>
                <div>
                    <el-button @click='checkoutIdea(row)' class='tableBtn'>查看</el-button>
                    <el-button @click='editorIdea(row)' style="margin-left:0;" class='tableBtn'>编辑</el-button>
                </div>
            </el-table-column>
            <el-table-column label="签到二维码" width="140" align="center" inline-template>
                <div>
                    <el-button @click='showQRCode(row)' v-if='!row.QRCodeShow' class='tableBtn'>查看</el-button>
                    <img :src='row.newQRCode' style="vertical-align:middle;" v-if='row.QRCodeShow'>
                </div>
            </el-table-column>
            <el-table-column prop="PV" label="PV" width="110" align="center"></el-table-column>
            <el-table-column prop="statOpen_1" label='"立刻领取"点击量' width="160" align="center"></el-table-column>
            <el-table-column prop="statLogin" label="手机验证登录量" width="140" align="center"></el-table-column>
            <el-table-column prop="statSchedule" label="红包任务页进入量" width="160" align="center"></el-table-column>
            <el-table-column prop="stat400CallTotal" label="400拨打量（排重）" width="180" align="center"></el-table-column>
            <el-table-column prop="stat400CallPass" label="400接通量（排重）" width="180" align="center"></el-table-column>
            <el-table-column prop="stat400CallComplete" label="400完成量（通话超过1分钟）" width="240" align="center"></el-table-column>
            <el-table-column prop="statOfflineViewHouse" label="线下看房量" width="110" align="center"></el-table-column>
            <el-table-column prop="statExtractMoney" label="已提现人数" width="110" align="center"></el-table-column>
            <el-table-column prop="hasWithdrawedMoney" label="已提现总额" width="110" align="center"></el-table-column>
            <el-table-column 
                label="最高提现总额" inline-template 
                width="130" align="center">
                <div>
                    <span 
                        style="cursor:pointer;color:red;" 
                        @click='redNumSelect(row,"最高提现总额")'>
                        {{ row.maxExtractMoney }}
                    </span>
                </div>
            </el-table-column>
            <el-table-column prop="totalMoney" label="已领取总额" width="110" align="center"></el-table-column>
            <el-table-column
                label="最高领取总额" inline-template 
                width="140" align="center">
                <div>
                    <span style="cursor:pointer;color:red;" @click='redNumSelect(row,"设置最高领取总额")'>
                        {{ row.maxDrawMoneyTotal }}
                    </span>
                </div>
            </el-table-column>
            <el-table-column 
                label="最多领取人数" inline-template 
                width="130" align="center">
                <div>
                    <span 
                        style="cursor:pointer;color:red;" 
                        @click='redNumSelect(row,"最多领取人数")'>
                        {{ row.maxPersonNum }}
                    </span>
                </div>
            </el-table-column>
            <el-table-column
                label="单笔红包金额" inline-template 
                width="150" align="center">
                <div>
                    <span 
                        style="cursor:pointer;color:red;" 
                        @click='editorSingleMoney(row)'>设置
                    </span>
                </div>
            </el-table-column>
            <el-table-column prop="redPacketStatusName" label="红包状态" width="110" align="center"></el-table-column>
            <el-table-column prop="adOrderStatusName" label="投放状态" width="110" align="center"></el-table-column>
            <el-table-column width="130" align="center" inline-template label="红包状态操作">
                <div>
                    <el-button 
                        v-if='row.redPacketStatusName != "可领取" && row.adOrderStatusName == "投放中"' 
                        class='tableBtn' @click="redStatusSelect(row, 0)">
                        开启
                    </el-button>
                    <el-button 
                        v-if='row.redPacketStatusName == "可领取" && row.adOrderStatusName == "投放中"' 
                        class='tableBtn' @click="redStatusSelect(row, 1)">
                        暂停
                    </el-button>
                </div>
            </el-table-column>
            <el-table-column label="投放操作" width="130" align="center" inline-template>
                <div>
                    <el-button v-if='row.adOrderStatusName == "投放中"' class='tableBtn' @click="orderStatusSelect(row, 19)">关闭</el-button>
                </div>
            </el-table-column>
        </el-table>

        <!-- dialog -->
        <el-dialog 
        	v-model="addRedPacketShow"
        	label-width="80px"
            @close='closeHandle'>
            <h1 class="titleName" v-if='isShow == 0'>新建红包</h1>
            <h1 class="titleName" v-if='isShow == 1'>编辑红包</h1>
            <h1 class="titleName" v-if='isShow == 2'>查看红包</h1>
            <el-form ref="editForm">
                <el-form-item v-if='isShow != 1' label='选择城市：'>
                    <el-select 
                    	v-model="createForm.cityValue"
                    	style="width:217px;display:inline-block;"
                    	filterable v-if='isShow != 2'
                    	placeholder="选择城市">
                        <el-option-group
                            v-for="group in cityOptions"
                            :label="group.label">
                            <el-option 
                            	v-for="item in group.options" 
                            	:label="item.label" :value="item.value">
                            </el-option>
                        </el-option-group>
                    </el-select>
                    <span v-if='isShow == 2'>{{ createForm.cityName }}</span>
                </el-form-item>
                
                <el-form-item label="投放日期：" v-if='isShow != 1'>
                    <el-date-picker 
                    	class="edit-price-input"
                    	v-model="createForm.dateRange" 
                    	type="daterange" :disabled='isShow == 2'
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="选择红包位：" v-if='isShow != 1'>
                    <el-select 
                        style="width:217px;display:inline-block;"
                        placeholder="选择广告位"
                        v-model="posId"
                        v-if='isShow != 2'>
                        <el-option 
                            v-for="item in posIdList" 
                            :label="item.label" :value="item.option">
                        </el-option>
                    </el-select>
                    <span v-if='isShow == 2'>{{ showPosName }}</span>
                </el-form-item>

                <el-form-item label="关联楼盘" v-if='isShow != 1'>
                    <el-input
                        style='width:130px;display:inline-block;'
                        size='small' placeholder='请输入楼盘Id'
                        v-model='createForm.eatateId'
                        v-if='isShow == 0'>
                    </el-input>
                    <span v-if='isShow == 2' style="display:inline-block;margin-right:20px;">
                        {{ createForm.eatateId }}
                    </span>
                    <el-select 
                        style="width:130px;display:inline-block;" 
                        size="small" placeholder="链接类型"
                        v-model='createForm.linkType'
                        :disabled='isShow == 2'>
                        <el-option 
                            v-for='item in linkTypeOption'
                            :label='item.label' :value='item.option'>
                        </el-option>
                    </el-select>
                    <el-input 
                        placeholder='请以http或https开头' size='small'
                        style='width:150px;display:inline-block;'
                        v-if='createForm.linkType == 1 && isShow == 0'
                        v-model='createForm.link'>
                    </el-input>
                    <el-button size="small" @click='checkoutEatate'>点击预览</el-button>
                </el-form-item>
                
                <el-form-item label='绑定手机号'>
                    <el-input 
                        class="edit-price-input" 
                        type="text" placeholder="多个手机号之间以英文逗号间隔"
                        v-model="createForm.phoneNumStr" v-if='isShow != 2'>
                    </el-input>
                    <span v-if='isShow == 2'>{{ createForm.phoneNumStr }}</span>
                </el-form-item>
                
                <!-- 可修改 -->
                <el-form-item label="楼盘名称">
                    <el-input 
                    	class="edit-price-input" 
                    	type="text" placeholder="不大于8个字"
                        v-model="createForm.resourceTitle" v-if='isShow != 2'>
                    </el-input>
                    <span v-if='isShow == 2'>{{ createForm.resourceTitle }}</span>
                </el-form-item>
                
                <!-- 可修改 -->
                <el-form-item label='文字创意'>
                    <el-input 
                    	class="edit-price-input" 
                    	type="text" placeholder="不大于14个字"
                        v-model="createForm.resourceText" v-if='isShow != 2'>
                    </el-input>
                    <span v-if='isShow == 2'>{{ createForm.resourceText }}</span>
                </el-form-item>
                
                <!-- 可修改 -->
                <el-form-item label='投放目标楼盘'>
                    <el-input 
                        class="edit-price-input" 
                        type="text" placeholder="多个Id之间以英文逗号间隔"
                        v-model="createForm.resourceList" v-if='isShow != 2'>
                    </el-input>
                    <span v-if='isShow == 2'>{{ createForm.resourceList }}</span>
                </el-form-item>
                
                <!-- 可修改 -->
                <el-form-item>
                    <h4>单图</h4>
                    <div class="inlineBlock">
                        <el-upload
                          	class="avatar-uploader inlineBlock"
                          	:action="uploadPicUrl"
                          	name="image"
                          	:show-upload-list="false"
                          	:with-credentials="true"
                          	:on-success="handleUploadScucess"
                          	:before-upload="beforeUploadImage" v-if='isShow != 2'>
							<img v-if="imageUrl" :src="imageUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <img v-if="imageUrl && isShow == 2" :src="imageUrl" class="avatar" @click='checkImage'>
                    </div>
                    <p class="media-require">规格280×210</p>
                </el-form-item>

                <!-- 地图 -->
                <el-form-item>
                    <div id="myPageTop">
                        <el-select 
                            v-model="createForm.estateCityName" 
                            placeholder="请选择城市" 
                            style='width:200px;margin:0 20px 20px 0;'
                            @change='handleCityChange' filterable
                            :disabled="isShow == 2">
                            <el-option-group
                                v-for="group in cityOptions"
                                :label="group.label">
                                <el-option 
                                    v-for="item in group.options" 
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                        <div class="el-input search" style='min-width:300px;float:left;margin:0 20px 20px 0;'>
                            <input 
                                type="text" placeholder="请输入关键字进行搜索" 
                                id="tipinput" class='el-input__inner' 
                                autocomplete="off" :readonly="isShow == 2">
                        </div>
                    </div>
                    <div id="map-container"></div>
                    <div id="panel"></div>
                </el-form-item>

                <el-form-item style="text-align:center;">
                    <el-button @click.native='onCreate' v-if='isShow == 0'>创建</el-button>
                    <el-button @click.native='onEdit' v-if='isShow == 1'>修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="提示" v-model="redStatusShow" size="tiny">
            <span>你确定要{{ redStatus === 0 ? '开启' : '暂停' }}此红包？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="redStatusShow = false">取 消</el-button>
                <el-button type="primary" @click="handleRedSelect">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="提示" v-model="orderStatusShow" size="tiny">
            <span>你确定要关闭此订单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="orderStatusShow = false">取 消</el-button>
                <el-button type="primary" @click="handleOrderSelect">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :title="dialogTitleName" v-model="redNumShow" size="tiny">
            <el-input 
                :placeholder='dialogTitleName == "最多领取人数" ? "输入人数" : "输入金额"' 
                v-model='inputNum' style="width:180px;">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="redNumShow = false">取 消</el-button>
                <el-button type="primary" @click="handleNumSelect">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title='设置单笔红包金额' v-model="singleMoneyShow" size="tiny">
            <p style='margin:20px 0 10px;'>1次领取</p>
            <el-input v-model='drawMoney_1' style="width:180px;"></el-input>
            <!-- <p style='margin:20px 0 10px;'>2次领取</p>
            <el-input v-model='drawMoney_2' style="width:180px;"></el-input> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="singleMoneyShow = false">取 消</el-button>
                <el-button type="primary" @click="handleSingleMoney">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分页 -->
        <div class="pagination" v-show="totalNum > 0">
            <el-pagination @current-change="handlePageSizeChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
        </div>
	</div>
</template>

<script src='./ad-redPacket.js'></script>
<style>
#map-container {
    width: 100%;
    height: 200px;
}

.marker {
    color: #f60;
    padding: 4px 10px;
    border: 1px solid #fff;
    white-space: nowrap;
    font-size: 12px;
    background-color: #06f;
}

.amap-sug-result {
    z-index: 99999 !important;
    left: 359px !important;
}
</style>
<style scoped>
.ad-redPacket-header {
    margin-top: 20px;
}

.edit-price-input {
    width: 250px;
    display: inline-block;
}

/*icon*/
.icon-question {
    display: inline-block;
    position: relative;
    margin: 0 0 0 5px;
    top: 2px;
    width: 15px;
    height: 15px;
    margin-right: 10px;
    background: url('./img/question.png') no-repeat;
    background-size: 100%;
}

.media-label {
    display: inline-block;
    margin-right: 10px;
}

.media-require {
    margin-left: 40px;
    font-size: 12px;
}

.inlineBlock {
    display: inline-block;
    margin-right: 10px;
    width: 100%;
}

.avatar-uploader.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: auto;
}

.avatar-uploader.el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    vertical-align: middle;
    cursor: pointer;
}

h4 {
    line-height: 40px;
}

.textArea {
    display: inline-block;
}

.el-textarea {
    display: inline-block;
    width: 200px;
}

.el-upload__files {
    display: none;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}

.titleName {
    height: 60px;
    line-height: 60px;
    margin-top: -40px;
}

.tableBtn {
    vertical-align: top;
    margin: 20px 0;
}
</style>