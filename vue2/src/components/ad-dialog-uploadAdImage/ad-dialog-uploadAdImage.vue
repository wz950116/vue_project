<template>
    <div>
        <el-dialog title="上传打底图" v-model="uploadAddImage" label-width="80px" size="large">
            <p class="ad-name">广告单元：{{ adName }}</p>
            <h3>选择推广内容</h3>
            <ul class="support-list">
                <li v-if="supportTypeMap.estate">
                    <el-radio class="radio" v-model="supportType" label="estate">关联楼盘</el-radio>
                    <el-input v-show="supportType == 'estate'" v-model="estateId" @change="luoDiType = ''" placeholder="请输入楼盘ID"></el-input>
                    <el-select v-show="supportType == 'estate'" v-model="luoDiType"  placeholder="请选择落地页" @change="changeLuoDiType">
                        <el-option
                          label="楼盘详情页"
                          value="1">
                        </el-option>
                        <el-option
                          label="自定义链接"
                          value="2">
                        </el-option>
                    </el-select>
                    <el-input v-show="supportType == 'estate'" v-model="baseIdeaLink.estate" v-if="luoDiType == 2" placeholder="请输入页面链接"></el-input>
                    <el-button v-show="supportType == 'estate'" @click="previewEstateLink(baseIdeaLink.estate, 'estate')">点击预览</el-button>
                </li>
                <li v-if="supportTypeMap.live">
                    <el-radio class="radio" v-model="supportType" label="live">焦点直播</el-radio>
                    <el-input v-show="supportType == 'live'" v-model="liveId" @blur="getLinkByLiveId" placeholder="请输入直播间ID"></el-input>
                    <el-button v-show="supportType == 'live'" @click="previewLinkByLiveId">点击预览</el-button>
                </li>
                <li v-if="supportTypeMap.news">
                    <el-radio class="radio" v-model="supportType" label="news">文章资讯</el-radio>
                    <el-input v-show="supportType == 'news'"  v-model="baseIdeaLink.news" placeholder="请输入文章链接"></el-input>
                    <el-button v-show="supportType == 'news'" @click="isValidLink('news')">点击预览</el-button>
                </li>
                <li v-if="supportTypeMap.forum">
                    <el-radio class="radio" v-model="supportType" label="forum">论坛帖子</el-radio>
                    <el-input v-show="supportType == 'forum'" v-model="baseIdeaLink.forum" placeholder="请输入帖子链接"></el-input>
                    <el-button v-show="supportType == 'forum'" @click="isValidLink('forum')">点击预览</el-button>
                </li>
                <li v-if="supportTypeMap.web">
                    <el-radio class="radio" v-model="supportType" label="web">其它网页</el-radio>
                    <el-input v-show="supportType == 'web'" v-model="baseIdeaLink.web" placeholder="请输入页面链接"></el-input>
                    <el-button v-show="supportType == 'web'" @click="previewLink(baseIdeaLink.web, 'web')">点击预览</el-button>
                </li>
            </ul>
            <h3>上传广告创意</h3>
            <div class="material-list mt10" v-if="material.length > 1">
                选择样式 <el-radio v-for="item in material"  class="radio" v-model="materialType" :label="item.groupId">{{ item.groupName }}</el-radio>
            </div>
            <ul>
                <li v-for="item in material" v-if="item.groupId == materialType" :key="item.groupId">
                    <el-form ref="form" :model="form">
                        <div class="" v-for="(show, index) in item.showList">
                            <h4>{{ show.showName }}</h4>
                            <div class="">
                                <div class="inlineBlock" v-for="posResource in show.posResourceList">
                                    <div class="inlineBlock"  v-if="posResource.type == 0">
                                        <el-input
                                          type="textarea"
                                          :rows="2"
                                          placeholder="请输入内容"
                                          @focus = "setCurInputResourceId(posResource.posResourceId)"
                                          @change="inputLength"
                                          v-model="form[posResource.posResourceId].description">
                                        </el-input>
                                        <span>{{ form[posResource.posResourceId].descriptionLength ? form[posResource.posResourceId].descriptionLength : 0 }}/{{ posResource.descriptionMaxLength }}</span>
                                    </div>
                                    <div class="inlineBlock"  v-if="posResource.type == 1 || posResource.type == 2 || posResource.type == 3">
                                       <el-upload
                                          class="avatar-uploader"
                                          :action="getUrl + '_' + item.groupId + '_' + posResource.posResourceId"
                                          name="image"
                                          :with-credentials="true"
                                          :show-upload-list="false"
                                          :on-success="handleUploadScucess"
                                          :before-upload="beforeUploadImage"
                                          >
                                          <img @click="setImgResourceFormate(posResource)" v-if="form[posResource.posResourceId].url" :src="form[posResource.posResourceId].url" class="avatar">
                                          <i @click="setImgResourceFormate(posResource)" v-else class="el-icon-plus avatar-uploader-icon"></i>
                                       </el-upload>
                                     </div>
                                     <div class="inlineBlock"  v-if="posResource.type == 4 || posResource.type == 5 || posResource.type == 6">
                                        <el-upload
                                          class="avatar-uploader inlineBlock"
                                          :action="getUrl + '_' + item.groupId + '_' + posResource.posResourceId"
                                          name="image"
                                          :show-upload-list="false"
                                          :with-credentials="true"
                                          :on-success="handleUploadScucess"
                                          :before-upload="beforeUploadImage"
                                          >
                                          <img @click="setImgResourceFormate(posResource)" v-if="form[posResource.posResourceId].url" :src="form[posResource.posResourceId].url" class="avatar">
                                          <i @click="setImgResourceFormate(posResource)" v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <el-input class="textArea"
                                          type="textarea"
                                          :rows="2"
                                          @focus = "setCurInputResourceId(posResource.posResourceId)"
                                          @change="inputLength"
                                          placeholder="请输入内容"
                                          v-model="form[posResource.posResourceId].description">
                                        </el-input>
                                        <span>{{ form[posResource.posResourceId].descriptionLength ? form[posResource.posResourceId].descriptionLength : 0 }}/{{ posResource.descriptionMaxLength }}</span>
                                     </div>
                                     <div class="inlineBlock"  v-if="posResource.type == 7">
                                        <el-upload
                                          class="upload-demo inlineBlock"
                                          :action="getUrl + '_' + item.groupId + '_' + posResource.posResourceId"
                                          name="image"
                                          :with-credentials="true"
                                          :on-success = "uploadVideoSuccess"
                                          :on-remove = "removeVideo"
                                          :default-file-list="fileList">
                                          <el-button size="small" @click="curVideoResourceId = posResource.posResourceId" type="primary">点击上传</el-button>
                                          <div slot="tip" class="el-upload__tip">只能上传flv文件</div>
                                        </el-upload>
                                     </div>
                                     <div class="inlineBlock"  v-if="posResource.type == 9">
                                        <ul>
                                            <li v-for="n in 5">
                                                <span>{{ n }}</span>
                                                <el-input style="margin-bottom:10px;" v-model="rankData['list'][n-1]['name']" placeholder="请输入楼盘名称"></el-input>
                                                <el-input style="margin-bottom:10px;" v-model="rankData['list'][n-1]['dealPrice']" placeholder="请输入平均价格"></el-input> 元/平米
                                                <el-input style="margin-bottom:10px;" v-model="rankData['list'][n-1]['dealNum']" placeholder="请输入成交套数"></el-input> 套
                                                <el-input style="margin-bottom:10px;" v-model="rankData['list'][n-1]['link']" placeholder="请输入链接"></el-input>
                                            </li>
                                        </ul>
                                     </div>
                                     <div class="inlineBlock"  v-if="posResource.type == 11">
                                         <el-input v-model="form[posResource.posResourceId].description" placeholder="请输入日期"></el-input>
                                         <el-input v-model="form[posResource.posResourceId].num1" @change="form[posResource.posResourceId].num1 = parseInt(form[posResource.posResourceId].num1)" placeholder="请输入上个月成交量"></el-input> 套
                                         <el-input v-model="form[posResource.posResourceId].num2" @change="form[posResource.posResourceId].num2 = parseInt(form[posResource.posResourceId].num2)" placeholder="请输入本月成交量"></el-input> 套
                                     </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancel">取 消</el-button>
                <el-button type="primary" @click.native="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import $$ad from "../../script/data/model/ad";
    import $$model from "../../script/data/model/interaction";
    let urlType = "";
    const nowUrl = location.href;
    if (nowUrl.indexOf("focus-test") >= 0) {
        urlType = "-test";
    } else if (nowUrl.indexOf("focus-dev") >= 0) {
        urlType = "-dev";
    }
    export default{
        data () {
            return {
                curResourceId: -1,
                supportType: "estate",
                uploadAddImage: false,
                adName: "",
                supportTypeMap: {},
                material: [],
                materialType: 1,
                luoDiType: "",
                estateList: [],
                estateId: "",
                liveId: "",
                form: {},
                getUrl: "",
                curImageResourceId: -1,
                curImageFormate: {},
                curInputResourceId: -1,
                curVideoResourceId: -1,
                baseIdeaLink: {
                    estate: "",
                    news: "",
                    web: "",
                    forum: "",
                    live: ""
                },
                rankData: {
                    list: [{ "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }]
                },
                linkType: 1,
                checked: true,
                fileList: []
            };
        },
        methods: {
            cancel: function () {
                this.uploadAddImage = false;
            },
            checkValidLink: function (type) {
                let link = this.baseIdeaLink[type];
                const httpReg = /http:\/\/|https:\/\//g,
                    urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                if (!link) {
                    this.$message.error("请输入网址链接");
                    return;
                } else if (!httpReg.test(link)) {
                    link = "http://" + link;
                }
                if (!urlReg.test(link)) {
                    this.$message.error("请输入格式正确的网址链接");
                    return;
                }
                if (type) {
                    this.baseIdeaLink[type] = link;
                }
                return link;
            },
            previewLink: function (link, type) {
                const a = document.createElement("a"),
                    httpReg = /http:\/\/|https:\/\//g,
                    urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                a.target = "_blank";
                if (!link) {
                    this.$message.error("请输入网址链接");
                    return;
                } else if (!httpReg.test(link)) {
                    link = "http://" + link;
                }
                if (!urlReg.test(link)) {
                    this.$message.error("请输入格式正确的网址链接");
                    return;
                }
                if (type) {
                    this.baseIdeaLink[type] = link;
                }
                a.href = link;
                a.click();
            },
            isValidLink: function (type) {
                const link = this.checkValidLink(type);
                if (!link) {
                    return;
                }
                $$model.isValidLink({
                    supportType: type,
                    link: link
                });
            },
            previewEstateLink: function (link, type) {
                if (!this.estateId.trim()) {
                    this.$message({
                        type: "error",
                        message: "请输入楼盘ID"
                    });
                    return;
                }
                if (!this.luoDiType) {
                    this.$message({
                        type: "error",
                        message: "请选择落地页"
                    });
                    return;
                } else if (this.luoDiType == 1 && !link) {
                    this.$message({
                        type: "error",
                        message: "楼盘Id不存在"
                    });
                    return;
                }
                this.previewLink(link, type);
            },
            getLinkByLiveId: function () {
                if (this.liveId) {
                    $$model.getLinkByLiveId({
                        supportType: "live",
                        liveId: this.liveId
                    });
                }
            },
            previewLinkByLiveId: function () {
                if (this.liveId) {
                    $$model.previewLinkByLiveId({
                        supportType: "live",
                        liveId: this.liveId

                    });
                } else {
                    this.$message({
                        type: "error",
                        message: "请输入直播间ID"
                    });
                }
            },
            setForm: function (groupId) {
                const showList = this.material[parseInt(groupId) - 1].showList,
                    obj = {};
                let num = 0,
                    rankId;
                showList.forEach(function (item) {
                    num += item.posResourceList.length;
                    item.posResourceList.forEach(function (val) {
                        if (val.type == 9) {
                            rankId = val.posResourceId;
                        }
                    });
                });
                for (let i = 1; i <= num; i++) {
                    obj[i] = {};
                }
                this.form = Object.assign({}, obj);
                if (rankId) {
                    this.rankData = {
                        list: [{ "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }, { "name": "", "dealPrice": "", "dealNum": "", "link": "" }]
                    };
                    this.form[rankId] = this.rankData;
                }
            },
            resetForm: function () {
                this.supportType = "";
                this.materialType = 1;
                this.luoDiType = "";
                this.estateList = [];
                this.estateId = "";
                this.liveId = "";
                this.baseIdeaLink = {
                    estate: "",
                    news: "",
                    web: "",
                    forum: "",
                    live: ""
                };
                this.linkType = 1;
                this.checked = true;
                this.fileList = [];
            },
            setCurInputResourceId: function (posResourceId) {
                this.curInputResourceId = posResourceId;
            },
            gblen: function (str) {
                let len = 0;
                for (let i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                        len += 1;
                    } else {
                        len += 0.5;
                    }
                }
                return len;
            },
            inputLength: function (val) {
                this.$set(this.form[this.curInputResourceId], "descriptionLength", val ? Math.floor(this.gblen(val)) : 0);
            },
            setImgResourceFormate: function (posResource) {
                this.curImageResourceId = posResource.posResourceId;
                this.curImageFormate = posResource;
            },
            handleUploadScucess: function (res, file) {
                const data = res.data;
                if (res.code == 0) {
                    this.form[this.curImageResourceId] = Object.assign({}, this.form[this.curImageResourceId], data);
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            },
            beforeUploadImage: function (file) {
                const fileMaxSize = this.curImageFormate.fileMaxSize / 1024 / 1024,
                    isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif",
                    isLtSize = file.size / 1024 / 1024 < fileMaxSize;
                if (!isJPG) {
                    this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
                }
                if (!isLtSize) {
                    this.$message.error(`上传图片大小不能超过 ${fileMaxSize}MB!`);
                }
                return isJPG && isLtSize;
            },
            changeLuoDiType: function () {
                const type = this.luoDiType,
                    loupanId = this.estateId;
                if (type == "1") {
                    if (!loupanId.trim()) {
                        this.$message({
                            type: "error",
                            message: "请输入楼盘Id"
                        });
                    }
                    $$model.getEstateById({
                        supportType: "estate",
                        estateId: loupanId
                    });
                    this.linkType = 0;
                } else {
                    this.baseIdeaLink["estate"] = "";
                }
            },
            uploadVideoSuccess: function (res, file, fileList) {
                if (res.code == 0) {
                    this.fileList.length = 0;
                    this.fileList.push({
                        name: file.name,
                        file: res.data.url
                    });
                    this.form[this.curVideoResourceId] = res.data;
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            },
            removeVideo: function () {
                this.form[this.curVideoResourceId] = {};
            },
            isRequiredSupportType: function () {
                const map = this.supportTypeMap;
                let result = false;
                for (const key in map) {
                    if (map[key]) {
                        result = true;
                    }
                }
                return result;
            },
            save: function () {
                const _this = this,
                    link = _this.checkValidLink(_this.supportType) || "",
                    isRequiredSupportType = _this.isRequiredSupportType();
                if (isRequiredSupportType && !_this.supportType) {
                    _this.$message({
                        type: "error",
                        message: "请选择推广内容"
                    });
                    return;
                }
                $$model.editBaseIdea({
                    baseIdeaLink: link,
                    resourceId: _this.curResourceId,
                    posResourceGroupId: _this.materialType,
                    supportType: _this.supportType,
                    estateId: _this.estateId,
                    linkType: _this.linkType,
                    liveId: _this.liveId,
                    data: _this.form
                });
            }
        },
        watch: {
            materialType: function (groupId) {
                this.setForm(groupId);
            }
        },
        beforeMount: function () {
            const _this = this;
            // 显示上传打底图dialog，初始化数据
            $$model.on("showUploadAdImageDialog", function (params) {
                _this.resetForm();
                const row = params.row;
                _this.curResourceId = row.resourceId;
                _this.uploadAddImage = true;
                _this.adName = row.adName;
                _this.supportTypeMap = row.supportTypeMap;
                _this.material = row.material;
                _this.getUrl = "//ad-manage.focus" + urlType + ".cn/adPosInfo/editBaseIdeaTest/" + row.resourceId;
                _this.setForm(_this.materialType);
            });

            // 根据楼盘id获取链接信息
            $$model.on("getEstateById", function (data) {
                if (data.code == 0) {
                    _this.baseIdeaLink["estate"] = data.data.link;
                } else {
                    _this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
            });

            // 检查链接合法性
            $$model.on("isValidLink", function (data) {
                if (data.code == 0) {
                    _this.previewLink(data.data.urls.pc);
                } else {
                    _this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
            });

            // 根据liveID获取直播链接等数据
            $$model.on("getLinkByLiveId", function (data) {
                if (data.code == 0) {
                    _this.profileUrl = data.data.profileUrl;
                    _this.title = data.data.title;
                    // _this.previewLink(data.data.urls.pc);
                    _this.baseIdeaLink["live"] = data.data.urls.pc;
                } else {
                    _this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
            });
            // 根据liveID获取直播链接并预览
            $$model.on("previewLinkByLiveId", function (data) {
                if (data.code == 0) {
                    _this.profileUrl = data.data.profileUrl;
                    _this.title = data.data.title;
                    _this.previewLink(data.data.urls.pc);
                    _this.baseIdeaLink["live"] = data.data.urls.pc;
                } else {
                    _this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
            });
            // 上传打底图回调
            $$model.on("editBaseIdea", function (data) {
                if (data.code == 0) {
                    _this.$notify({
                        title: "上传打底图成功",
                        message: "",
                        type: "success",
                        duration: 2000
                    });
                    // 刷新广告位列表
                    $$ad.actionSuccess();
                    _this.uploadAddImage = false;
                } else {
                    _this.$message({
                        type: "error",
                        message: data.msg
                    });
                }
            });
        }
    };
</script>

<style scoped>
    .mt10 {
    margin-top: 10px;
}

.ad-name {
    font-size: 15px;
    line-height: 30px;
}

h3 {
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
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
    display: block;
}

h4 {
    line-height: 40px;
}

.textArea {
    display: inline-block;
    margin-left: 10px;
}

.el-textarea {
    display: inline-block;
    width: 200px;
}

.el-upload__files {
    display: none;
}
</style>
