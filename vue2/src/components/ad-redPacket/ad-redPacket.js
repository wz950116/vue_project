import $$ad from "../../script/data/model/ad";
import $$model from "./model.js";
import AMap from "AMap";
let urlType = "", onOff = true, markers = [];
const nowUrl = location.href;
if (nowUrl.indexOf("focus-test") >= 0) {
    urlType = "-test";
} else if (nowUrl.indexOf("focus-dev") >= 0) {
    urlType = "-dev";
}
export default {
    data () {
        return {
            cityOptions: [],
            tableData: [],
            addRedPacketShow: false,
            // 红包状态
            redStatusShow: false,
            redStatus: "",
            redPacketOrderId: "",

            // 订单状态
            orderStatusShow: false,
            orderStatus: "",
            orderPacketOrderId: "",

            // 设置金额人数
            dialogTitleName: "",
            redNumShow: false,
            inputNum: "",
            redNumId: "",

            // 设置单笔金额
            singleMoneyShow: false,
            orderSingleMoney: "",
            drawMoney_1: "",
            drawMoney_2: "",

            imageUrl: "",
            videoUrl: "",
            checkoutURL: "",
            searchFilterArr: [],
            isShow: 0, // 区分弹框显示 0:创建  1:修改  2:查看
            linkTypeOption: [{
                label: "落地页",
                option: 0
            }, {
                label: "自定义链接",
                option: 1
            }],

            // 筛选红包广告
            filterForm: {
            	dateRange: [new Date(), new Date()],
            	cityValue: [],
            	searchFilter: "",
            	searchContent: ""
            },

            // 新建红包广告
            createForm: {
            	cityValue: "", // 城市编码
            	dateRange: [], // 日期列表
                dateList: [], // 日期参数
                eatateId: "", // 楼盘Id
                linkType: "", // 连接类型
                link: "", // 链接
                resourceTitle: "", // 楼盘名称
            	resourceText: "",
                resourcePic: "",
                resourceList: "",
                phoneNumStr: "",
                geoLng: "", // 纬度
                geoLat: "", // 经度
                estateAddress: "", // 地址
                estateAddressName: "", // 地址名称
                estateCityName: ""
            },
            pickerOptions0: {
                disabledDate (time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },

            // 上传路径
            uploadPicUrl: "",
            posId: "",
            posResourceGroupId: "",
            posResourceIdForPic: "",
            currentPage: 1,
            pageSize: 10,
            totalNum: 0,
            map: ""
        };
    },
    methods: {
        // 导出全部excel
        exportExcel () {
            const _this = this;
            $$model.exportExcel({
                "areaCodeList": _this.filterForm.cityValue.length > 0 ? _this.filterForm.cityValue : null,
                "dateBegin": _this.timeFormat(_this.filterForm.dateRange[0]),
                "dateEnd": _this.timeFormat(_this.filterForm.dateRange[1]),
                "queryType": _this.filterForm.searchFilter,
                "queryContent": _this.filterForm.searchContent
            }, res => {
                if (res.code === 0) {
                    const url = res.data.fileUrl;
                    window.open(url);
                }
            });
        },

        // 添加红包项目
        addRedPacket () {
            const thisNode = document.querySelectorAll(".amap-sug-result")[0];
            if (thisNode) {
                thisNode.parentNode.removeChild(thisNode);
            }
            setTimeout(() => {
                document.getElementById("tipinput").value = "";
                this.map = new AMap.Map("map-container", {
                    resizeEnable: true,
                    zoom: 13,
                    center: [116.397428, 39.90923]
                });
                this.searchContent();
            }, 0);

            this.createForm = {
                cityValue: "",
                dateRange: [],
                dateList: [],
                eatateId: "",
                linkType: "",
                link: "",
                resourceTitle: "",
                resourceText: "",
                resourcePic: "",
                phoneNumStr: "",
                geoLng: "",  // 纬度
                geoLat: "",  // 经度
                estateAddress: "",  // 地址
                estateAddressName: "",  // 地址名称
                estateCityName: ""  // 地址相关城市
            };
            this.imageUrl = "";
            this.posId = "";
            this.isShow = 0;
            this.addRedPacketShow = true;
        },

        closeHandle () {
            if (this.isShow !== 0) return;
            this.$confirm("确认关闭？")
                .then(_ => {
                    this.addRedPacketShow = false;
                })
                .catch(_ => {
                    this.addRedPacketShow = true;
                });
        },

        // 新建红包
        onCreate () {
            const _this = this;
            // 表单简单验证
            if (_this.createForm.cityValue === "") {
                _this.$message({
                    type: "error",
                    message: "请选择城市"
                });
            } else if (_this.createForm.dateList.length == 0) {
                _this.$message({
                    type: "error",
                    message: "请选择日期范围"
                });
            } else if (_this.posId == "") {
                _this.$message({
                    type: "error",
                    message: "请选择红包位"
                });
            } else if (_this.createForm.eatateId === "") {
                _this.$message({
                    type: "error",
                    message: "请输入关联楼盘Id"
                });
            } else if (_this.createForm.linkType === "") {
                _this.$message({
                    type: "error",
                    message: "请选择楼盘链接类型"
                });
            } else if (_this.createForm.linkType === 1 && _this.createForm.link === "") {
                _this.$message({
                    type: "error",
                    message: "请输入自定义链接"
                });
            } else if (_this.createForm.phoneNumStr === "") {
                _this.$message({
                    type: "error",
                    message: "请输入手机账号"
                });
            } else if (_this.createForm.geoLng === "") {
                _this.$message({
                    type: "error",
                    message: "请输入经度"
                });
            } else if (_this.createForm.geoLat === "") {
                _this.$message({
                    type: "error",
                    message: "请输入纬度"
                });
            } else if (_this.createForm.resourceTitle === "") {
                _this.$message({
                    type: "error",
                    message: "请输入楼盘名称"
                });
            } else if (_this.createForm.resourceText === "") {
                _this.$message({
                    type: "error",
                    message: "请输入文字创意"
                });
            } else if (!_this.createForm.resourcePic) {
                _this.$message({
                    type: "error",
                    message: "请上传单图"
                });
            } else if (_this.createForm.resourceList === "") {
                _this.$message({
                    type: "error",
                    message: "请输入投放目标楼盘Id"
                });
            } else if (_this.createForm.estateAddress === "") {
                _this.$message({
                    type: "error",
                    message: "请输入楼盘地址"
                });
            } else {
                const params = {
                    "areaCode": _this.createForm.cityValue,
                    "dateList": _this.createForm.dateList,
                    "posId": _this.posId,
                    "estateId": _this.createForm.eatateId,
                    "linkType": _this.createForm.linkType,
                    "link": _this.createForm.linkType == 1 ? _this.createForm.link : "",
                    "phoneNumStr": _this.createForm.phoneNumStr,
                    "geoLng": _this.createForm.geoLng,
                    "geoLat": _this.createForm.geoLat,
                    "estateAddress": _this.createForm.estateAddress,
                    "estateAddressName": _this.createForm.estateAddressName,
                    "estateCityName": _this.createForm.estateCityName,
                    "resourceData": {
                        "title": {
                            "description": _this.createForm.resourceTitle
                        },
                        "text": {
                            "description": _this.createForm.resourceText
                        },
                        "pic": _this.createForm.resourcePic,
                        "list": {
                            "estate_id_str": _this.createForm.resourceList
                        }
                    }

                };
                if (!onOff) return;
                onOff = false;
                $$model.createRedPacket(params, res => {
                    if (res.code == 0) {
                        _this.$notify({
                            title: "成功",
                            message: "新建红包广告位成功",
                            type: "success"
                        });
                        _this.isShow = -1;
                        _this.addRedPacketShow = false;
                        // 重新请求展示列表数据
                        _this.handleCurrentChange();
                    } else {
                        _this.$message({
                            type: "error",
                            message: res.msg
                        });
                    }
                    onOff = true;
                });
            }
        },

        // 查看创意
        checkoutIdea (row) {
            $$model.checkReaPacket({
                "orderId": row.orderId
            }, res => {
                if (res.code == 0) {
                    this.createForm.cityValue = res.data.areaCode;
                    this.createForm.cityName = res.data.cityName;
                    this.createForm.dateRange = res.data.dateList.length > 0 ? [this.timeFormat2(res.data.dateList[0]), this.timeFormat2(res.data.dateList[res.data.dateList.length - 1])] : [];
                    this.posId = res.data.posId;
                    this.createForm.eatateId = res.data.estateId;
                    this.createForm.linkType = res.data.linkType;
                    this.createForm.link = res.data.link;
                    this.createForm.phoneNumStr = res.data.phoneNumStr;
                    this.createForm.resourceTitle = res.data.resourceData.title.description;
                    this.createForm.resourceText = res.data.resourceData.text.description;
                    this.createForm.resourcePic = res.data.resourceData.pic;
                    this.createForm.resourceList = res.data.resourceData.list.estate_id_list.join(",");
                    this.imageUrl = res.data.resourceData.pic.url;
                    this.showPosName = row.posName;
                    this.isShow = 2;
                    this.addRedPacketShow = true;
                    this.createForm.estateCityName = res.data.estateCityName * 1;
                    setTimeout(() => {
                        const lng = res.data.geoLng || 116.397428,
                            lat = res.data.geoLat || 39.90923;
                        this.map = new AMap.Map("map-container", {
                            resizeEnable: true,
                            zoom: 13,
                            center: [lng, lat]
                        });
                        this.addMarker([res.data.geoLng, res.data.geoLat]);
                        document.getElementById("tipinput").value = res.data.estateAddressName;
                    }, 0);
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },
        // 查看图片
        checkImage () {
            if (this.imageUrl) {
                window.open(this.imageUrl);
            }
        },

        // 编辑创意
        editorIdea (row) {
            const thisNode = document.querySelectorAll(".amap-sug-result")[0];
            if (thisNode) {
                thisNode.parentNode.removeChild(thisNode);
            }
            $$model.checkReaPacket({
                "orderId": row.orderId
            }, res => {
                if (res.code == 0) {
                    this.ideaId = res.data.ideaId;
                    this.createForm.cityValue = res.data.areaCode;
                    this.posId = res.data.posId;
                    this.createForm.phoneNumStr = res.data.phoneNumStr;
                    this.createForm.resourceTitle = res.data.resourceData.title.description;
                    this.createForm.resourceText = res.data.resourceData.text.description;
                    this.createForm.resourcePic = res.data.resourceData.pic;
                    this.createForm.resourceList = res.data.resourceData.list.estate_id_list.join(",");
                    this.imageUrl = res.data.resourceData.pic.url;
                    this.createForm.estateAddress = res.data.estateAddress;
                    this.createForm.estateAddressName = res.data.estateAddressName;
                    this.createForm.estateCityName = res.data.estateCityName * 1;
                    this.createForm.geoLng = res.data.geoLng;
                    this.createForm.geoLat = res.data.geoLat;
                    this.isShow = 1;
                    this.addRedPacketShow = true;
                    this.currentOrderId = row.orderId;
                    setTimeout(() => {
                        document.getElementById("tipinput").value = "";
                        this.searchContent();
                        const lng = res.data.geoLng || 116.397428,
                            lat = res.data.geoLat || 39.90923;
                        this.map = new AMap.Map("map-container", {
                            resizeEnable: true,
                            zoom: 13,
                            center: [lng, lat]
                        });
                        this.addMarker([res.data.geoLng, res.data.geoLat]);
                        document.getElementById("tipinput").value = res.data.estateAddressName;
                    }, 0);
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },
        onEdit () {
            const _this = this;
            const params = {
                "phoneNumStr": _this.createForm.phoneNumStr,
                "orderId": _this.currentOrderId,
                "ideaId": _this.ideaId,
                "estateAddress": _this.createForm.estateAddress,
                "estateAddressName": _this.createForm.estateAddressName,
                "estateCityName": _this.createForm.estateCityName,
                "geoLng": _this.createForm.geoLng,
                "geoLat": _this.createForm.geoLat,
                "resourceData": {
                    "title": {
                        "description": _this.createForm.resourceTitle
                    },
                    "text": {
                        "description": _this.createForm.resourceText
                    },
                    "pic": _this.createForm.resourcePic,
                    "list": {
                        "estate_id_str": _this.createForm.resourceList
                    }
                }
            };
            $$model.editIdea(params, res => {
                if (res.code === 0) {
                    _this.$notify({
                        title: "成功",
                        message: "编辑红包广告位成功",
                        type: "success"
                    });
                    _this.addRedPacketShow = false;

                    // 重新请求展示列表数据
                    _this.handleCurrentChange();
                } else {
                    _this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },

        // 设置单笔红包金额
        editorSingleMoney (row) {
            this.singleMoneyShow = true;
            this.orderSingleMoney = row.orderId;
            $$model.getCurrentDrawMoney({
                "orderId": row.orderId
            }, res => {
                if (res.code === 0) {
                    this.drawMoney_1 = res.data.drawMoney_1;
                    this.drawMoney_2 = res.data.drawMoney_2;
                }
            });
        },
        handleSingleMoney () {
            $$model.editDrawMoney({
                "orderId": this.orderSingleMoney,
                "drawMoney_1": this.drawMoney_1,
                "drawMoney_2": this.drawMoney_2
            }, res => {
                if (res.code === 0) {
                    this.$message({
                        type: "success",
                        message: res.msg
                    });
                    this.singleMoneyShow = false;
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },

        // 新建红包-关联楼盘
        checkoutEatate () {
            const _this = this;
            if (_this.createForm.linkType === 0 && _this.createForm.eatateId != "") {
                const params = {
                    estateId: _this.createForm.eatateId,
                    supportType: "estate"
                };
                $$model.checkoutLink(params, res => {
                    _this.checkoutURL = res.data.link;
                    window.open(_this.checkoutURL);
                });
            } else if (_this.createForm.linkType === 1) {
                window.open(_this.createForm.link);
            }
        },

        beforeUploadImage (file) {
            const _this = this,
                isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif",
                isCity = _this.createForm.cityValue != "",
                isPosId = _this.posId != "";

            if (!isJPG) {
                _this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
                return false;
            }

            if (_this.isShow === 0) {
                if (!isCity) {
                    _this.$message.error("请先选择城市");
                    return false;
                } else if (!isPosId) {
                    _this.$message.error("请先选择红包位");
                    return false;
                }
                return isJPG && isCity && isPosId;
            } else {
                _this.uploadPicUrl = "//ad-manage.focus" + urlType + ".cn/adPosInfo/editBaseIdeaTest/" + (_this.posId + "" + _this.createForm.cityValue) + "_" + _this.posResourceGroupId + "_" + _this.posResourceIdForPic;
                return isJPG;
            }
        },

        handleUploadScucess (res, file) {
            if (res.code === 0) {
                this.$message({
                    type: "success",
                    message: res.msg
                });
                // 图片
                if (res.data.file_type === "PNG" || res.data.file_type === "JPG" || res.data.file_type === "GIF") {
                    this.imageUrl = res.data.url;
                    this.createForm.resourcePic = {
                        "size": res.data.size,
                        "file_type": res.data.file_type,
                        "width": res.data.width,
                        "height": res.data.height,
                        "md5": res.data.md5
                    };
                }
            } else {
                this.$message({
                    type: "error",
                    message: res.msg
                });
            }
        },

        // 时间格式化1
        timeFormat (dateObj) {
            if (!dateObj) return;
            const updatetimeval = dateObj.getFullYear() + "" + ((dateObj.getMonth() + 1) < 10 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1)) + "" + (dateObj.getDate() < 10 ? ("0" + dateObj.getDate()) : dateObj.getDate());
            return updatetimeval;
        },
        // 时间格式化2
        timeFormat2 (date) {
            if (!date) return;
            return new Date(date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8));
        },
        // 时间格式化3
        timeFormat3 (date) {
            if (!date) return;
            return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
        },

        // 展示列表
        handleCurrentChange () {
            const _this = this;

            if (!_this.filterForm.dateRange[0]) {
                _this.tableData = [];
                return;
            }
            const params = {
                "areaCodeList": _this.filterForm.cityValue.length > 0 ? _this.filterForm.cityValue : null,
                "dateBegin": _this.timeFormat(_this.filterForm.dateRange[0]),
                "dateEnd": _this.timeFormat(_this.filterForm.dateRange[1]),
                "queryType": _this.filterForm.searchFilter,
                "queryContent": _this.filterForm.searchContent || "",
                "pageIndex": _this.currentPage,
                "limit": _this.pageSize
            };
            $$model.showRedPacketList(params, res => {
                _this.totalNum = res.data.totalNum;
                const resData = res.data.list;
                if (res.code === 0) {
                    resData.forEach(item => {
                        item.drawJsonOne = item.drawJson["1"];
                        item.drawJsonTwo = item.drawJson["2"];
                        item.downloadJsonOne = item.downloadJson["1"];
                        item.downloadJsonTwo = item.downloadJson["2"];
                        item.downloadJsonAll = item.downloadJson["total"];
                        item.newQRCode = "data:image/png;base64," + item.QRCode;
                        item.QRCodeShow = false;
                        const len = item.date.length;
                        item.date = item.date.slice(0, len - 1);
                    });
                    _this.tableData = resData;
                } else {
                    _this.tableData = [];
                }
            });
        },
        // 展示二维码
        showQRCode (row) {
            this.tableData.forEach(item => {
                item.QRCodeShow = false;
            });
            row.QRCodeShow = true;
        },

        // 红包状态操作
        redStatusSelect (row, type) {
            this.redStatusShow = true;
            this.redStatus = type;
            this.redPacketOrderId = row.orderId;
        },
        handleRedSelect () {
            $$model.editOrder({
                orderId: this.redPacketOrderId,
                typeName: "redPacketStatus",
                value: this.redStatus
            }, res => {
                this.redStatusShow = false;
                if (res.code === 0) {
                    this.$message({
                        type: "success",
                        message: res.msg
                    });
                    // 重新请求展示列表数据
                    this.handleCurrentChange();
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },
        // 订单状态操作
        orderStatusSelect (row, type) {
            this.orderStatusShow = true;
            this.orderStatus = type;
            this.orderPacketOrderId = row.orderId;
        },
        handleOrderSelect () {
            $$model.editOrder({
                orderId: this.orderPacketOrderId,
                typeName: "adOrderStatus",
                value: this.orderStatus
            }, res => {
                this.orderStatusShow = false;
                if (res.code === 0) {
                    this.$message({
                        type: "success",
                        message: res.msg
                    });
                    // 重新请求展示列表数据
                    this.handleCurrentChange();
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },
        // 红包金额人数操作
        redNumSelect (row, name) {
            this.redNumShow = true;
            this.dialogTitleName = name;
            this.redNumId = row.orderId;
            this.inputNum = "";
        },
        handleNumSelect () {
            const type_name = this.dialogTitleName == "设置最高领取总额" ? "maxDrawMoneyTotal" : (this.dialogTitleName == "最多领取人数" ? "maxPersonNum" : "maxExtractMoneyTotal");
            if (isNaN(Number(this.inputNum)) || this.inputNum != parseInt(this.inputNum)) {
                this.$message({
                    type: "error",
                    message: "输入内容格式有误，请重新输入！"
                });
                return;
            } else if (this.inputNum > 100000000) {
                this.$message({
                    type: "error",
                    message: "输入的数值过大，请重新输入！"
                });
                return;
            }

            $$model.editOrder({
                orderId: this.redNumId,
                typeName: type_name,
                value: this.inputNum * 1
            }, res => {
                this.redNumShow = false;
                if (res.code === 0) {
                    this.$message({
                        type: "success",
                        message: res.msg
                    });
                    // 重新请求展示列表数据
                    this.handleCurrentChange();
                } else {
                    this.$message({
                        type: "error",
                        message: res.msg
                    });
                }
            });
        },

        // pageSize改变
        handlePageSizeChange (num) {
            this.currentPage = num;
            this.handleCurrentChange();
        },

        // 添加标记
        addMarker (pos) {
            const marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: pos || [116.397428, 39.90923],
                draggable: true,
                cursor: "move"
            });

            // 删除之前的标记
            this.map.remove(markers);
            markers.push(marker);

            marker.setMap(this.map);
            // 设置点标记的动画效果，此处为弹跳效果
            marker.setAnimation("AMAP_ANIMATION_BOUNCE");
        },
        // 切换城市
        handleCityChange (cityName) {
            document.getElementById("tipinput").value = "";
            // 删除上一次匹配列表
            const thisNode = document.querySelectorAll(".amap-sug-result")[0];
            if (thisNode) {
                thisNode.parentNode.removeChild(thisNode);
            }
            this.map.setZoom(18);
            this.map.setCity(cityName);
            this.searchContent(cityName);
        },
        // 搜索
        searchContent (city) {
            const auto = new AMap.Autocomplete({
                city: city, // 城市
                map: this.map,
                input: "tipinput"
            });
            AMap.event.addListener(auto, "select", e => {
                if (e.poi && e.poi.location) {
                    this.map.setZoomAndCenter(15, e.poi.location);
                    this.addMarker([e.poi.location.lng, e.poi.location.lat]);
                    // 参数
                    this.createForm.geoLng = e.poi.location.lng;
                    this.createForm.geoLat = e.poi.location.lat;
                    this.createForm.estateAddress = e.poi.district + e.poi.address;
                    this.createForm.estateAddressName = e.poi.name;
                }
            });
        }
    },

    watch: {
        "createForm.cityValue": function (value) {
            this.uploadPicUrl = "//ad-manage.focus" + urlType + ".cn/adPosInfo/editBaseIdeaTest/" + (this.posId + "" + value) + "_" + this.posResourceGroupId + "_" + this.posResourceIdForPic;
        },
        posId (value) {
            this.uploadPicUrl = "//ad-manage.focus" + urlType + ".cn/adPosInfo/editBaseIdeaTest/" + (value + "" + this.createForm.cityValue) + "_" + this.posResourceGroupId + "_" + this.posResourceIdForPic;
        },
        "filterForm.dateRange": {
            deep: true,
            handler: function (arr) {
                if (!arr[0]) {
                    this.tableData = [];
                    return;
                }
                this.handleCurrentChange();
            }
        },
        "createForm.dateRange": {
            deep: true,
            handler (arr) {
                if (!arr[0]) return;
                this.createForm.dateList = [];

                const fromDate = this.timeFormat(arr[0]), toDate = this.timeFormat(arr[1]);
                const ab = this.timeFormat3(fromDate).split("-");
                const ae = this.timeFormat3(toDate).split("-");

                const db = new Date();
                db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
                const de = new Date();
                de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);

                const unixDb = db.getTime();
                const unixDe = de.getTime();

                for (let k = unixDb; k <= unixDe;) {
                    this.createForm.dateList.push(this.timeFormat(new Date(parseInt(k))).toString());
                    k = k + 24 * 60 * 60 * 1000;
                }
            }
        }
    },

    beforeMount () {
        const _this = this;

        // 获取参数数据
        $$model.initRedPacketData(res => {
            const data = res.data;
            _this.posResourceGroupId = data.posResourceGroupId;
            _this.posResourceIdForPic = data.posResourceIdForPic;
            _this.searchFilterArr = data.queryTypeList;
            _this.filterForm.searchFilter = data.queryTypeList[0].option;
            _this.posIdList = data.posIdList;
            // 展示列表
            _this.handleCurrentChange();
        });

        // 城市数据
        $$ad.on("getAdParams", data => {
            const cityArr = [];
            const cityOptions = data.data.areaCode;
            for (const i in cityOptions) {
                cityArr.push({
                    id: parseInt(i, 10),
                    name: cityOptions[i]
                });
            }
            _this.cityOptions = data.data.areaCodeList;
        });

        $$ad.getAdParams();
    }
};
