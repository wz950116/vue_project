import $$pop_request from './pop-request.js'
export default {
    data() {
        return {
            title: "新增广告资源",
            popShow: false,
            resourceName: '',
            billMethod: 1,
            minPrice: 0,
            adsense: [],
            //数组内容为各新广告位名称
            newAdsenses: []
        }
    },
    methods: {
        //新增广告位
        addAdsense() {
            this.newAdsenses.push("");
        },
        //删除广告位
        deleteAdsense(ad) {
            var index = this.adsense.indexOf(ad);
            this.adsense.splice(index, 1);
        },
        //取消新增广告位
        deleteNewAdsense(index) {
            this.newAdsenses.splice(index, 1);
        },
        //保存新增广告位
        saveNewAdsense(index) {
            this.adsense.push(this.newAdsenses[index]);
            this.newAdsenses.splice(index, 1);
        },
        //取消更改
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
        //确定保存更改
        saveChange() {
            if (!this.adsense.length) {
                this.$message({
                    type: 'warning',
                    message: '无广告位信息!'
                });
                return;
            }
            var newResource = {
                name: this.resourceName,
                //ＣＰＭ与ＣＰＣ选择
                costType: this.billMethod == true ? 0 : 1,
                floorPrice: parseFloat(this.minPrice),
                posIdList: this.adsense.map(function(item) {
                    return parseInt(item);
                })
            };
            if (this.newAdsenses.length) {
                this.$confirm('有广告位信息尚未保存, 是否放弃保存?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*$$pop_request.addResource(newResource,res => {
                        if(res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '继续编辑!'
                            });
                            this.popShow = false;
                        }
                    })*/
                    this.$emit("addResource", newResource);
                    this.popShow = false;
                }).catch();
            } else {
                this.$emit("addResource", newResource);
                this.popShow = false;
            }

        }
    },
    watch: {
        popShow: function(newval) {
            if (newval === false) {
                this.resourceName = '';
                this.minPrice = 0;
                this.adsense = [];
                //数组内容为各新广告位名称
                this.newAdsenses = []
            }
        }
    }
}
