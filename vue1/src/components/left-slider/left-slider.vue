<template>
	<div class="left-slider-wrap">
		<el-menu v-bind:default-active="currentIndex" class="el-menu-vertical-demo">
			<el-submenu index="1" v-if="accessList.ad_seller">
				<template slot="title">业务管理后台</template>
				<router-link to="/seller-manage">
					<el-menu-item index="/seller-manage">员工管理</el-menu-item>
				</router-link>
                <router-link to="/estate-manage">
                    <el-menu-item index="/estate-manage">楼盘管理</el-menu-item>
                </router-link>
			</el-submenu>
			
	        <el-submenu index="8" v-if="accessList.operation || accessList.operation_auth">
				<template slot="title">权限审计管理</template>
				<router-link to="/management" v-if="accessList.operation_auth">
					<el-menu-item index="/management">权限管理</el-menu-item>
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
import userModel from "@/model/user";
export default {
    data () {
        return {
            currentIndex: "/",
            accessList: {
                ad_seller: true, // 销售后台管理
                operation: true, // 权限审计管理
                operation_auth: true // 权限审计管理-权限管理
            }
        };
    },
    methods: {
        setAllTabsAbility (ableOrNot) {
            return this.setTabsAbility(Object.keys(this.accessList), ableOrNot);
        },
        setTabsAbility (tabNames, ableOrNot) {
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
        // 不同身份权限显示不同侧边栏
        getAbilityArrByRole (role) {
            let abilityArr = [];
            const _this = this;
            switch (role) {
            case "ROLE_BE_STAFF_SUPER_ADMIN":
                abilityArr = _this.setAllTabsAbility(true);
                break;
            case "ROLE_BE_STAFF_ADMIN":
                abilityArr = _this.setTabsAbility(["operation_log", "operation_auth", "operation_discount", "operation_whiteList"], false);
                break;
            case "ROLE_BE_STAFF_EDITOR":
                abilityArr = _this.setTabsAbility(["audit"], true);
                break;
            case "ROLE_BE_STAFF_ADPOS_MANAGER":
                abilityArr = _this.setTabsAbility(["ad"], true);
                break;
            case "ROLE_BE_STAFF_ADPOS_DATA_VIEWER":
                abilityArr = _this.setTabsAbility(["city_city"], true);
                break;
            case "ROLE_BE_STAFF_LOCAL_OPERATOR":
                abilityArr = _this.setTabsAbility(["ad_upload"], true);
                break;
            case "ROLE_BE_STAFF_CUSTOMER_MANAGER":
                abilityArr = _this.setTabsAbility(["customer_data"], true);
                break;
            case "ROLE_BE_STAFF_PERFORMANCE_MANAGER":
                abilityArr = _this.setTabsAbility(["performance_data"], true);
                break;
            case "ROLE_BE_STAFF_ESTATE_MANAGE":
                abilityArr = _this.setTabsAbility(["city_data"], true);
                break;
            case "ROLE_BE_STAFF_ACCOUNTANT":
                abilityArr = _this.setTabsAbility(["finance"], true);
                break;
            case "ROLE_BE_STAFF_MSG_OPERATOR":
                abilityArr = _this.setTabsAbility(["notice"], true);
                break;
            case "ROLE_BE_STAFF_ESTATE_VIEW":
                abilityArr = _this.setTabsAbility(["city_data"], true);
                break;
            case "ROLE_BE_STAFF_JOIN_SITE_IDEA_AUDITOR":
                abilityArr = _this.setTabsAbility(["audit_idea"], true);
                break;
            }
            return abilityArr;
        }
    },
    beforeMount () {
        const _this = this;
        this.currentIndex = window.app.currentRouter.path;

        // 初始accessList内的所有值设置为true
        userModel.getUserInfo(res => {
            if (res.code === 0) {
                const abilityArrByRoles = [],
                    roles = res.data.roles;
                roles.forEach(function (item) {
                    abilityArrByRoles.push(_this.getAbilityArrByRole(item.name));
                });
                _this.accessList = _this.setAllTabsAbility(false);
                for (let i = 0; i < abilityArrByRoles.length; i++) {
                    abilityArrByRoles[i].forEach(function (v) {
                        _this.accessList[v] = true;
                    });
                }
            }
        });
    }
};
</script>
