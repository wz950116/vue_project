<template>
    <div>
        <el-dialog title="查看创意" v-model="uploadAdImagePreview" label-width="80px" size="large">
            <p class="ad-name">广告单元：{{ adName }}</p>
            <h3>推广内容</h3>
            <div class="support-content" v-if="ideaContent">
                <div v-if="ideaContent.type_id == 'estate'">
                    <span>关联楼盘: {{ ideaContent.name }}</span>
                    <span>落地页：{{ ideaContent.linkType == 0 ? '楼盘详情页' : '自定义页面' }}</span>
                    <span>页面链接：{{ ideaContent.link }}</span>
                    <el-button @click="previewLink">点击预览</el-button>
                </div>
                <div v-else>
                    <span>{{ supportType[ideaContent.type_id] }}</span>
                    <span>页面链接：{{ ideaContent.link }}</span>
                    <el-button @click="previewLink">点击预览</el-button>
                </div>
            </div>
            <h3>上传广告创意</h3>
            <div class="" v-for="show in showList">
                <h4>{{ show.showName }}</h4>
                <div class="">
                    <div class="inlineBlock" v-for="posResource in show.posResourceList">
                        <div class="inlineBlock"  v-if="posResource.type == 0">
                            {{ resourceList[posResource.posResourceId - 1] && resourceList[posResource.posResourceId - 1].despriction }}
                        </div>
                        <div class="inlineBlock w600"  v-if="posResource.type == 1 || posResource.type == 2 || posResource.type == 3">
                            <img :src="resourceList[posResource.posResourceId - 1].url" alt="">
                        </div>
                        <div class="inlineBlock"  v-if="posResource.type == 4 || posResource.type == 5 || posResource.type == 6">
                            <img style="max-width: 600px;" :src="resourceList[posResource.posResourceId - 1].url"  alt="">
                            <span>{{ resourceList[posResource.posResourceId - 1] && resourceList[posResource.posResourceId - 1].despriction }}</span>
                        </div>
                        <div class="inlineBlock"  v-if="posResource.type == 7">
                            <span>视频链接：</span><a :href="resourceList[posResource.posResourceId - 1].url">{{ resourceList[posResource.posResourceId - 1].url }}</a>
                        </div>
                        <div class="inlineBlock"  v-if="posResource.type == 9">
                            <ul>
                                <li v-for="n in 5">
                                    <span>{{ n }}</span>
                                    <span>{{ resourceList[posResource.posResourceId - 1].list[n-1]['name'] }}</span>
                                    <span>{{ resourceList[posResource.posResourceId - 1].list[n-1]['dealPrice'] }} 元/平米</span>
                                    <span>{{ resourceList[posResource.posResourceId - 1].list[n-1]['dealNum'] }} 套</span>
                                    <span>{{ resourceList[posResource.posResourceId - 1].list[n-1]['link'] }}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="inlineBlock"  v-if="posResource.type == 11">
                            <span>{{ resourceList[posResource.posResourceId - 1].description }} {{ resourceList[posResource.posResourceId - 1].num1 }}套 {{ resourceList[posResource.posResourceId - 1].num2 }}套</span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import $$model from "../../script/data/model/interaction";
    export default{
        data () {
            return {
                uploadAdImagePreview: false,
                adName: "",
                showList: [],
                resourceList: [],
                ideaContent: {},
                supportType: {
                    estate: "关联楼盘",
                    news: "文章资讯",
                    forum: "论坛帖子",
                    live: "焦点直播",
                    web: "其它网页"
                }
            };
        },
        props: ["type"],
        methods: {
            cancel: function () {
                this.uploadAdImagePreview = false;
            },
            previewLink: function () {
                const a = document.createElement("a");
                a.target = "_blank";
                a.href = this.ideaContent.link;
                a.click();
            },
            showVideo: function () {

            }
        },
        beforeMount: function () {
            const _this = this;
            // 显示上传打底图dialog，初始化数据
            $$model.on("show" + _this.type + "UploadAdImagePreviewDialog", row => {
                _this.uploadAdImagePreview = true;
                _this.adName = row.adName || row.ad_pos_name;
                _this.ideaContent = row.ideaContent || row.idea_content;
                _this.showList = row.baseIdeaGroupId ? row.material[row.baseIdeaGroupId - 1].showList : row.material[row.resource_group_id - 1].showList;
                _this.resourceList = row.resourceList;
            });
        }
    };
</script>
<style scoped>
    .ad-name {
    font-size: 15px;
    line-height: 30px;
}

.mt10 {
    margin-top: 10px;
}

h3 {
    line-height: 40px;
}

.info-area {
    margin: 20px auto;
    word-break: break-all;
    color: #f00;
}

li {
    list-style-type: none;
    margin-bottom: 10px;
}

.radio {
    margin-right: 10px;
}

.el-select,
.el-input {
    display: inline-block;
    margin-right: 10px;
}

.support-list .el-select {
    width: 150px;
}

.support-list .el-input {
    width: 150px;
}

.inlineBlock {
    display: inline-block;
    margin-right: 10px;
}

.inlineBlock span {
    margin-right: 10px;
}

h4 {
    line-height: 40px;
}

.w600 {
    max-width: 600px;
}

.w600 img {
    width: 100%;
}

.support-content {
    line-height: 40px;
}

.support-content span {
    margin-right: 20px;
}
</style>
