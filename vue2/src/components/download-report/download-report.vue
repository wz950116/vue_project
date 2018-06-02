<template>
<div>
    <el-button class="download-button" type="primary" @click="downloadReport(1)">充值消耗总表</el-button>
    <el-button class="download-button" type="primary" @click="downloadReport(2)">充值明细表</el-button>
    <el-button class="download-button" type="primary" @click="downloadReport(3)">消耗明细表</el-button>
    <el-button class="download-button" type="primary" @click="downloadReport(4)">T值表</el-button>
    <el-dialog ref="downloadDialog" title="下载" size="tiny">
        选择日期：<el-date-picker ref="datepicker1" v-model="dateRange" type="daterange" :disabled="historySelected" placeholder="选择日期范围" style="width:220px;"></el-date-picker>
        <div class="history">
            <el-checkbox class="radio" v-model="historySelected">下载历史全部数据</el-checkbox>
        </div>
        <el-button class="dialog-download-button" type="primary" @click="toDownload">确认</el-button>
        <el-button class="dialog-download-button" type="primary" @click="cancel">取消</el-button>
    </el-dialog>
    <el-dialog ref="downloadDialogT" title="下载" size="tiny">
        <div>
        选择年份：<el-date-picker ref="datepicker2" v-model="dateRange" type="year" placeholder="选择年份" style="width:220px;"></el-date-picker>
        </div>
        <el-button class="dialog-download-button" type="primary" @click="toDownload">确认</el-button>
        <el-button class="dialog-download-button" type="primary" @click="cancel">取消</el-button>
    </el-dialog>
</div>
</template>
<style scoped>
.download-button {
    margin: 20px;
    display: block;
    width: 130px;
}

.dialog-download-button {
    margin: 20px;
    float: right;
}

.history {
    margin-top: 30px;
}
</style>
<script>
import $$invoice from "../../script/data/model/invoice";
export default {
    name: "DownloadReport",
    data () {
        return {
            historySelected: false,
            dateRange: "",
            currentType: 1
        };
    },
    methods: {
        downloadReport (type) {
            this.currentType = type;
            if (type === 4) {
                this.$refs.downloadDialogT.open();
            } else {
                this.$refs.downloadDialog.open();
            }
        },
        cancel () {
            this.$refs.downloadDialog.close();
            this.$refs.downloadDialogT.close();
        },
        toDownload () {
            const _this = this;
            let params;
            if (_this.currentType !== 4) {
                if (_this.historySelected) {
                    params = {
                        type: _this.currentType
                    };
                } else {
                    const data = _this.$refs.datepicker1.visualValue;
                    if (!data) {
                        return;
                    }
                    params = {
                        type: _this.currentType,
                        startAt: data.substring(0, 10),
                        endAt: data.substring(13)
                    };
                }
            } else {
                if (!_this.$refs.datepicker2.visualValue) {
                    return;
                }
                params = {
                    type: _this.currentType,
                    year: _this.$refs.datepicker2.visualValue
                };
            }
            $$invoice.getFinanceReport(params, function (data) {
                if (data.code === 200) {
                    _this.$notify.success({
                        title: "成功",
                        message: "已发送至您的公司邮箱，请注意查收",
                        duration: 2000
                    });
                    _this.cancel();
                } else {
                    _this.$notify.error({
                        title: "错误",
                        message: "出错了",
                        duration: 2000
                    });
                }
            });
        }
    }
};
</script>
