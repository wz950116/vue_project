<template>
    <div class="ad">
        <ad-header class="header"></ad-header>
        <ad-table></ad-table>
    </div>
</template>
<style scoped>
.header {
    display: block !important;
}

.ad {
    margin-top: 20px;
}
</style>
<script>
    import adHeader from "../ad-header/ad-header";
    import adTable from "../ad-table/ad-table";
    export default{
        name: "Ad",
        components: {
            adHeader,
            adTable
        }
    };
</script>
