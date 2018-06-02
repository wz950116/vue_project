<template>
    <div class="city-detail">
        <el-breadcrumb separator=">>" class="bread_crumb">
            <el-breadcrumb-item :to="{ path: breadCrumbList.path }">{{breadCrumbList.level1}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadCrumbList.level2}}</el-breadcrumb-item>
        </el-breadcrumb>
        <city-detail-header class="header">
        </city-detail-header>
        <city-detail-table></city-detail-table>
    </div>
</template>
<style scoped>
    .city-detail {
    margin-top: 20px;
}

.bread_crumb {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
}
</style>
<script>
    import cityDetailHeader from "../city-detail-header/city-detail-header";
    import cityDetailTable from "../city-detail-table/city-detail-table";
    import $$city from "../../script/data/model/city";
    export default{
        data () {
            return {
                msg: "city",
                breadCrumbList: {
                    level1: "城市数据",
                    level2: "",
                    path: "/city"
                }
            };
        },
        components: {
            cityDetailHeader,
            cityDetailTable
        },
        activated: function () {
            const that = this;
            // 数据加载
            this.breadCrumbList.level2 = that.$route.query.name;
            $$city.getCityDetailAgain();
        }
    };
</script>
