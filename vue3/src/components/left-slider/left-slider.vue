<template>
	<div class="left-slider-wrap">
		<el-menu v-bind:default-active="currentIndex" class="el-menu-vertical-demo">
			
	        <!-- <el-submenu index="2" v-if="accessList.operation_auth">
				<template slot="title">权限审计管理</template>
				<router-link to="/management" v-if="accessList.operation_auth">
					<el-menu-item index="/management">权限管理</el-menu-item>
				</router-link>
			</el-submenu> -->

			<el-submenu index="4">
				<template slot="title">干预选项</template>
				<router-link to="/insert">
					<el-menu-item index="/insert">置顶楼盘</el-menu-item>
				</router-link>
				<router-link to="/delete">
					<el-menu-item index="/delete">过滤楼盘</el-menu-item>
				</router-link>
                <router-link to="/deleted">
                    <el-menu-item index="/deleted">已过滤楼盘</el-menu-item>
                </router-link>
                <router-link to="/history">
                    <el-menu-item index="/history">历史操作</el-menu-item>
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
                operation_auth: false,  // 管理者权限
				insert_auth: false,  // 置顶权限
                delete_auth: false,  // 删除权限
				deleted_auth: false  // 查看已删除权限
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
            case "MANAGE":
                abilityArr = _this.setAllTabsAbility(true);
                break;
            case "INSERT":
                abilityArr = _this.setTabsAbility(["insert_auth"], true);
                break;
            case "DELETE":
                abilityArr = _this.setTabsAbility(["delete_auth", "deleted_auth"], true);
                break;
            };
            return abilityArr;
        }
    },
    beforeMount () {
        this.currentIndex = window.app.currentRouter.path;

        // 初始accessList内的所有值设置为true
        // userModel.on('setUserInfo', res => {
        //     if (res.code === 200) {
        //         const abilityArrByRoles = [],
        //             accesses = res.data.access;
        //         for(let i = 0; i < accesses.length; i++){
        //             abilityArrByRoles.push(this.getAbilityArrByRole(i));
        //         }
        //         this.accessList = this.setAllTabsAbility(false);
        //         for (let i = 0; i < abilityArrByRoles.length; i++) {
        //             abilityArrByRoles[i].forEach(function (v) {
        //                 this.accessList[v] = true;
        //             });
        //         }
        //     }
        // });
    }
};
</script>
