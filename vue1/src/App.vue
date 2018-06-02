<template>
    <div id="app">
        <header class="header">
            <index-header></index-header>
        </header>
        
        <section class="main-content" :style="{ height : mheight + 'px' }">
            <section class="com-left-slider">
                <left-slider></left-slider>
            </section>
            <section 
                class='info-content'
                v-if="isVisible">
                <div class="info-content-wrap">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
    import '@/lib/global.css'
    import '@/lib/ui'
    var indexHeader = window.uiApp.constructor;
    import leftSlider from '@/components/left-slider/left-slider'
    import userModel from '@/model/user';
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
                msg: 'hello vue',
                mheight: document.documentElement.clientHeight - 60,
                isVisible: true
            }
        },
        components: {
            indexHeader,
            leftSlider
        },
        beforeMount () {
            // 定时清除本地存储
            const toDay = new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate();
            const lastDay = window.localStorage.getItem('clear_searchContent_time');
            if (lastDay) {
                toDay === lastDay ? null : window.localStorage.clear();
            } else {
                window.localStorage.setItem('clear_searchContent_time', toDay);
            };
            
            var _this = this;
            userModel.on('setUserInfo', data => {
                var nickName = data.data.info.nickname || data.data.info.username,
                    userIdentity = data.data.roles.length ? data.data.roles[0].description : '未分配权限',
                    mainUrl = "http://house.focus.cn/",
                    siteUrl = "http://productivity.focus" + urlType + ".cn/ecology-ad-admin#/",
                    siteName = "焦点效率管理系统",
                    platformUrl = data.platformUrl,
                    userName = nickName + '(' + userIdentity + ')',
                    logoutUrl = data.logoutUrl;
                uiApp.getModule('module-admin-header').set('mainUrl', mainUrl);
                uiApp.getModule('module-admin-header').set('siteUrl', siteUrl);
                uiApp.getModule('module-admin-header').set('siteName', siteName);
                uiApp.getModule('module-admin-header').set('platformUrl', platformUrl);
                uiApp.getModule('module-admin-header').set('userName', userName);
                uiApp.getModule('module-admin-header').set('logoutUrl', logoutUrl);
                if (data.data.roles.length == 0)  _this.isVisible = false;
            });
        }
    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    html {
        height: 100%;
    }

    body {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }

    #app {
        width: 100%;
        height: 100%;
    }

    #app a {
        text-decoration: none;
    }

    .logo {
        width: 100px;
        height: 100px
    }

    header {
        width: 100%;
        height: 60px;
        background: #324057;
        color: #fff;
    }

    .main-content {
        background-color: #eff2f7;
        overflow: hidden;
    }

    .com-left-slider {
        width: 200px;
        float: left;
        height: 100%;
    }

    .info-content {
        margin-left: 200px;
        height: 100%;
        overflow-y: scroll;
        padding: 0.1px 20px 20px;
        background-color: #ffffff;
    }

    .el-date-picker {
        z-index: 9999 !important;
    }
</style>