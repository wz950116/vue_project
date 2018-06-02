<template>
<div class="left-slider-wrap">
	<el-menu v-bind:default-active="currentIndex" class="el-menu-vertical-demo">
		<el-submenu index="1" v-if="accessList.city || accessList.city_city || accessList.city_data">
			<template slot="title">数据总览</template>
			<router-link to="/city" v-if="accessList.city_city">
				<el-menu-item index="/city">城市数据</el-menu-item>
			</router-link>
			<!-- <router-link to="/city-loupan" v-if="accessList.city_data">
                    <el-menu-item index="/city-loupan">楼盘数据</el-menu-item>
                </router-link> -->

			<router-link to="/city-cpm" v-if="accessList.city_cpm">
				<el-menu-item index="/city-cpm">CPM管理</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu 
			index="2" 
			v-if="accessList.ad || accessList.ad_management || accessList.ad_release || accessList.ad_upload || accessList.ad_history">
			<template slot="title">广告位</template>
			<router-link to="/ad" v-if="accessList.ad || accessList.ad_management">
				<el-menu-item index="/ad">广告位管理</el-menu-item>
			</router-link>
			<router-link to="/ad-release" v-if="accessList.ad || accessList.ad_release">
				<el-menu-item index="/ad-release">广告位释放</el-menu-item>
			</router-link>
			<router-link to="/ad-upload" v-if="accessList.ad || accessList.ad_upload">
				<el-menu-item index="/ad-upload">上传预览图</el-menu-item>
			</router-link>
			<router-link to="/ad-history" v-if="accessList.ad || accessList.ad_history">
				<el-menu-item index="/ad-history">广告快照</el-menu-item>
			</router-link>
			<router-link to="/ad-schedule" v-if="accessList.ad || accessList.ad_schedule">
				<el-menu-item index="/ad-schedule">广告排期</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="3" v-if="accessList.customer || accessList.customer_data">
			<template slot="title">客户管理</template>
			<router-link to="/customer" v-if="accessList.customer_data">
				<el-menu-item index="/customer">客户数据</el-menu-item>
			</router-link>
			<router-link to="/customer_agent" v-if="accessList.customer_agent">
				<el-menu-item index="/customer_agent">代理商管理</el-menu-item>
			</router-link>
			<router-link to="/ad-list" v-if="accessList.ad_list">
				<el-menu-item index="/ad-list">广告订单管理</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="4" v-if="accessList.performance || accessList.performance_data">
			<template slot="title">推广管理</template>
			<router-link to="/performance" v-if="accessList.performance_data">
				<el-menu-item index="/performance">绩效数据</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="5" v-if="accessList.notice">
			<template slot="title">通知管理</template>
			<router-link to="/notice">
				<el-menu-item index="/notice">发布通知</el-menu-item>
			</router-link>
			<router-link to="/message">
				<el-menu-item index="/message">通知列表</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="6" v-if="accessList.audit || accessList.audit_idea">
			<template slot="title">审核</template>
			<router-link to="/audit-account" v-if="accessList.audit">
				<el-menu-item index="/audit-account">账户审核</el-menu-item>
			</router-link>
			<router-link to="/audit-estate" v-if="accessList.audit">
				<el-menu-item index="/audit-estate">楼盘审核</el-menu-item>
			</router-link>
			<router-link to="/audit-order" v-if="accessList.audit || accessList.audit_idea">
				<el-menu-item index="/audit-order">创意审核</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="7" v-if="accessList.finance">
			<template slot="title">财务</template>
			<router-link to="/audit-taxpayer">
				<el-menu-item index="/audit-taxpayer">专票资质</el-menu-item>
			</router-link>
			<router-link to="/audit-invoice">
				<el-menu-item index="/audit-invoice">发票审核</el-menu-item>
			</router-link>
			<router-link to="/download-report">
				<el-menu-item index="/download-report">下载报表</el-menu-item>
			</router-link>
			<router-link to="/charge-review">
				<el-menu-item index="/charge-review">充值审核</el-menu-item>
			</router-link>
		</el-submenu>
		<el-submenu index="8" v-if="accessList.operation || accessList.operation_log || accessList.operation_auth || accessList.operation_recharge || accessList.operation_discount">
			<template slot="title">权限审计管理</template>
			<router-link to="/operation" v-if="accessList.operation_log">
				<el-menu-item index="/operation">操作日志</el-menu-item>
			</router-link>
			<router-link to="/management" v-if="accessList.operation_auth">
				<el-menu-item index="/management">权限管理</el-menu-item>
			</router-link>
			<router-link to="/recharge" v-if="accessList.operation_recharge">
				<el-menu-item index="/recharge">配额管理</el-menu-item>
			</router-link>
			<router-link to="/discount-policy" v-if="accessList.operation_discount">
				<el-menu-item index="/discount-policy">优惠政策管理</el-menu-item>
			</router-link>
			<router-link to="/whiteList" v-if="accessList.operation_whiteList">
				<el-menu-item index="/whiteList">城市白名单</el-menu-item>
			</router-link>
		</el-submenu>

		<el-submenu index="9" v-if="accessList.ad_redPacket">
			<template slot="title">红包广告位</template>
			<router-link to="/ad-redPacket" v-if="accessList.ad_redPacket">
				<el-menu-item index="/ad-redPacket">红包广告位管理</el-menu-item>
			</router-link>
			<router-link to="/redPacketUser" v-if="accessList.ad_redPacket">
				<el-menu-item index="/redPacketUser">用户红包列表</el-menu-item>
			</router-link>
		</el-submenu>

        <el-submenu index="11" v-if="accessList.db_operation">
            <template slot="title">线上数据库操作</template>
            <router-link to="/db-operation" v-if="accessList.db_operation">
                <el-menu-item index="/db-operation">线上数据库操作</el-menu-item>
            </router-link>
        </el-submenu>
    </el-menu>
</div>
</template>
<style scoped>
.left-slider-wrap {
    height: 100%;
}

.left-slider-wrap .el-menu-item {
    border-bottom: 1px solid #e1e1e1;
    background: #eff2f7;
}

.left-slider-wrap .el-menu-item:hover,
.left-slider-wrap .el-menu-item.is-active {
    background-color: #d3dce6;
}

.left-slider-wrap .el-menu-item a {
    display: block;
    color: #475669;
}

.left-slider-wrap .el-menu-item:hover a,
.left-slider-wrap .el-menu-item.is-active a {
    color: #20a0ff;
}

.left-slider-wrap .el-submenu {
    border-bottom: 1px solid #e1e1e1;
}
</style>
<script>
import userModel from "../../script/data/model/user";
export default {
    data () {
        return {
            currentIndex: "/",
            accessList: {
                city: true, // 数据总览
                city_city: true, // 数据总览-城市数据
                city_data: true, // 数据总览-楼盘数据
                city_cpm: true, // 数据总览-CPM管理
                ad: true, // 广告位
                ad_management: true, // 广告位-广告位管理
                ad_release: true, // 广告位-广告位释放
                ad_upload: true, // 广告位-上传预览图
                ad_history: true, // 广告位-广告快照
                ad_schedule: true, // 广告位-广告排期
                customer: true, // 客户管理
                customer_data: true,
                customer_agent: true, // 客户管理-客户数据
                ad_list: true, // 广告订单管理
                performance: true, // 推广管理
                performance_data: true, // 推广管理-绩效数据
                notice: true, // 通知管理
                audit: true, // 审核
                audit_idea: true, // 审核创意
                finance: true, // 财务
                finance_review: true, // 财务
                operation: true, // 权限审计管理
                operation_log: true, // 权限审计管理-操作日志
                operation_auth: true, // 权限审计管理-权限管理
                operation_recharge: true, // 权限审计管理-配额管理
                operation_discount: true, // 权限审计管理-优惠政策管理
                operation_whiteList: true, // 权限审计管理-白名单
                ad_redPacket: true, // 红包广告位
                db_operation: true // 线上数据库操作
            }
        };
    },
    methods: {
        setAllTabsAbility: function (ableOrNot) {
            return this.setTabsAbility(Object.keys(this.accessList), ableOrNot);
        },
        setTabsAbility: function (tabNames, ableOrNot) {
            const _this = this;
            let abilityArr = [];
            ableOrNot = ableOrNot !== undefined ? !!ableOrNot : true;
            if (ableOrNot) {
                abilityArr = tabNames;
            } else {
                Object.keys(_this.accessList).forEach(function (v) {
                    if (tabNames.indexOf(v) == -1) {
                        abilityArr.push(v);
                    }
                });
            }
            return abilityArr;
        },
        getAbilityArrByRole: function (role) {
            let abilityArr = [];
            const _this = this;
            switch (role) {
            case "ROLE_BE_STAFF_SUPER_ADMIN":
                abilityArr = _this.setAllTabsAbility(true);
                break;
            case "ROLE_BE_STAFF_ADMIN":
                abilityArr = _this.setTabsAbility(["operation_log", "operation_auth", "operation_discount", "operation_whiteList", "db_operation"], false);
                break;
            case "ROLE_BE_STAFF_EDITOR":
                abilityArr = _this.setTabsAbility(["audit", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_ADPOS_MANAGER":
                abilityArr = _this.setTabsAbility(["ad", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_ADPOS_DATA_VIEWER":
                abilityArr = _this.setTabsAbility(["city_city", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_LOCAL_OPERATOR":
                abilityArr = _this.setTabsAbility(["ad_upload", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_CUSTOMER_MANAGER":
                abilityArr = _this.setTabsAbility(["customer_data", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_PERFORMANCE_MANAGER":
                abilityArr = _this.setTabsAbility(["performance_data", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_ESTATE_MANAGE":
                abilityArr = _this.setTabsAbility(["city_data", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_ACCOUNTANT":
                abilityArr = _this.setTabsAbility(["finance", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_MSG_OPERATOR":
                abilityArr = _this.setTabsAbility(["notice", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_ESTATE_VIEW":
                abilityArr = _this.setTabsAbility(["city_data", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_JOIN_SITE_IDEA_AUDITOR":
                abilityArr = _this.setTabsAbility(["audit_idea", "ad_history"], true);
                break;
                // 只显示红包
            case "ROLE_BE_STAFF_REDPACKET":
                abilityArr = _this.setTabsAbility(["ad_redPacket", "ad_history"], true);
                break;
            case "ROLE_BE_STAFF_SALES_APP":
                abilityArr = _this.setTabsAbility(["ad_history"], true);
                break;
            }
            return abilityArr;
        }
    },
    beforeMount: function () {
        const _this = this;
        // this.currentIndex = window.app.currentRouter.path;
        // if (this.currentIndex.indexOf('detail') !== -1) {
        // 	this.currentIndex = this.currentIndex.replace('-detail', '');
        // }

        // 初始accessList内的所有值设置为true
        userModel.on("disableTab", roles => {
            const abilityArrByRoles = [];

            if (!roles[0]) {
                this.$router.push("/ad-history-anonymity");
            } else if (this.currentIndex === "/" && roles[0].name === "ROLE_BE_STAFF_REDPACKET") {
                this.currentIndex = "/ad_redPacket";
                this.$router.push("/ad-redPacket");
            } else if (this.currentIndex === "/") {
                this.currentIndex = "/city";
            }

            roles.forEach(function (item) {
                abilityArrByRoles.push(_this.getAbilityArrByRole(item.name));
            });

            _this.accessList = _this.setAllTabsAbility(false);
            for (let i = 0; i < abilityArrByRoles.length; i++) {
                abilityArrByRoles[i].forEach(function (v) {
                    _this.accessList[v] = true;
                });
            }
        });
    }
};
</script>
