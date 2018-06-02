<template>
    <div class="header-wrap">
        <h1><a :href="mainUrl" class="system-name">{{msg}}</a></h1>
        <div class="header-right">
            <span class="login">{{userName}}</span>({{userIdentity}})
            <span @click="logout" class="loginOut">退出</span>
        </div>
    </div>
</template>
<style scoped>
.header-wrap {
    overflow: hidden;
    width: 100%;
    height: 100%;
}

.header-wrap h1 {
    float: left;
    margin-left: 20px;
    margin-top: 20px;
}

.header-wrap .system-name {
    color: #fff;
    font-size: 20px;
    font-weight: 400;
}

.header-right {
    float: right;
    height: 60px;
    line-height: 60px;
    margin-right: 15px;
    font-size: 15px;
}

.login {
    margin-right: 5px;
    font-size: 25px;
}

.loginOut {
    color: #fff;
    font-size: 15px;
}

.loginOut:hover {
    cursor: pointer;
    text-decoration: underline !important;
}
</style>
<script>
    import userModel from "../../script/data/model/user";
    export default{
        data () {
            return {
                name: "",
                msg: "广告后台管理系统",
                userName: "",
                userIdentity: "",
                mainUrl: "",
                logoutUrl: ""
            };
        },
        methods: {
            logout: function () {
                location.href = this.logoutUrl;
            }
        },
        beforeMount: function () {
            const _this = this;
            userModel.on("setUserInfo", function (data) {
                _this.userName = data.data.info.nickname || data.data.info.username;
                _this.userIdentity = data.data.roles[0].description;
                _this.mainUrl = data.mainUrl;
                _this.logoutUrl = data.logoutUrl;
                userModel.disableTab(data.data.roles[0].name);
            });
        }
    };
</script>
