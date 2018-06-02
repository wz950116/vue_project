<template>
    <div class="ad-detail">
        <el-breadcrumb separator=">>" class="bread_crumb">
            <el-breadcrumb-item :to="{ path: breadCrumbList.path }">{{breadCrumbList.level1}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadCrumbList.level2}}</el-breadcrumb-item>
        </el-breadcrumb>
        <ad-detail-header class="header">
        </ad-detail-header>
        <ad-detail-table></ad-detail-table>
    </div>
</template>
<style scoped>
    .ad-detail {
    margin: 20px;
}

.bread_crumb {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}
</style>
<script>
    import adDetailHeader from "../ad-detail-header/ad-detail-header";
    import adDetailTable from "../ad-detail-table/ad-detail-table";
    import $$ad from "../../script/data/model/ad";

    export default{
        data () {
            return {
                breadCrumbList: {
                    level1: "广告位管理",
                    level2: "",
                    path: "/ad"
                }
            };
        },
        components: {
            adDetailHeader,
            adDetailTable
        },
        activated: function () {
            const id = this.$route.query.adId;
            const that = this;
            // 数据加载
            this.breadCrumbList.level2 = that.$route.query.name;
            $$ad.getIdAndGetDetail(id);
        }
    };
</script>
