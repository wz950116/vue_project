import $$dbOperation from "../../script/data/model/dbOperation";

export default {
    data () {
        return {
            reFormData: {
                pos_id_template: "",
                pos_id_city: "",
                opt_type: "posAlloccity",
                area_code: ""
            },
            operationType: [
                {
                    label: "广告位城市排期表",
                    value: "posAlloccity"
                }, {
                    label: "广告位城市表",
                    value: "posarea"
                }
            ],
            headerData: [
                {
                    name: "广告位模板排期表",
                    selected: true,
                    content: "ad-template"
                },
                {
                    name: "广告位城市表",
                    selected: false,
                    content: "ad-city"
                }
            ],
            currentView: "ad-template"

        };
    },
    methods: {
        selectTag (selectIndex) {
            this.headerData.forEach(function (item, index) {
                item.selected = (index === selectIndex);
            });
            this.currentView = this.headerData[selectIndex].content;
        },
        templateCommit () {
            const that = this;
            const params = {
                pos_id: that.reFormData.pos_id_template
            };
            $$dbOperation.initialAdPosAlloc(params, function (data) {
                if (data.code === 0) {
                    that.$message({
                        message: "操作成功",
                        type: "success"
                    });
                } else {
                    that.$message.error(data.msg);
                }
            });
        },
        cityCommit () {
            const that = this;
            const params = {
                pos_id: that.reFormData.pos_id_city,
                opt_type: that.reFormData.opt_type
            };
            if (that.reFormData.area_code != "") {
                params.area_code = that.reFormData.area_code
            }
            // console.log(params);
            $$dbOperation.insertAdPosAreaAndAdPosAllocCity(params, function (data) {
                if (data.code === 0) {
                    that.$message({
                        message: "操作成功",
                        type: "success"
                    });
                } else {
                    that.$message.error(data.msg);
                }
            });
        }
    },
    beforeMount () {

    }
};
