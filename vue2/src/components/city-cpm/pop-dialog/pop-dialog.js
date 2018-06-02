import $$pop_request from './pop-request.js'
export default {
    data() {
            return {
                popShow: false,
                title: '预览图编辑',
                fileType: '',
                md5: '',
                form: {},
                preview: {
                    id: 0,
                    url: "",
                    description: "",
                },
                fileList: []
            }
        },
    methods: {
        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePreview(file) {
            // console.log(file.response);
        },
        handleSuccess(response, file, fileList) {
            if (response.code != 0) {
                this.$message({
                    message: '图片格式错误',
                    type: 'warning'
                });
                this.fileList = [];
                return;
            }
            this.fileType = response.data.file_type;
            this.md5 = response.data.md5;
            //this.preview.url = response.data.url;
        },

        //不保存退出
        removeChange() {
            this.$confirm('编辑内容尚未提交，是否放弃', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'warning',
                    message: '放弃提交!'
                });
                this.popShow = false;
            }).catch(() => {
                this.$message({
                    type: 'success',
                    message: '继续编辑!'
                });
            });
        },
        //保存提交后推出
        saveChange() {
            var location = this;
            var args = {};
            args.resourceId = this.resourcesId;
            args.fileType = this.fileType == "" ? /\.([a-zA-Z]+)$/g.exec(this.preview.url)[1] : this.fileType;
            args.md5 = this.md5 == "" ? new RegExp("\\/([0-9a-zA-Z]+)\\." + args.fileType + "$").exec(this.preview.url)[1] : this.md5;
            args.description = this.preview.description;
            //判断新增/修改，后根据设置url与发送参数
            if (this.preview.url != "") {
                //修改
                args.previewId = this.preview.id;

                $$pop_request.updatePreview(args, res => {
                    if (res.code == 200) {
                        location.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.popShow = false;
                        this.$emit("reload");
                    } else {
                        location.$message.error("提交失败！");
                    }
                })
            } else {
                //新增
                $$pop_request.addPreview(args, res => {
                    if (res.code == 200) {
                        this.popShow = false;
                        this.$emit("reload");
                    } else {
                        location.$message.error("提交失败！");
                        console.log("fail");
                    }
                })
            }
        }
    },
    watch: {
        popShow: function(newval) {
            if (newval === false) {
                this.fileList = [];
                this.preview.id = 0;
                this.preview.url = "";
                this.preview.description = "";
            }
        }
    },

}
