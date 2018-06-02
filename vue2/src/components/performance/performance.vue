<template>
    <div class="performance-wrap">
        <performance-header>
        </performance-header>
        <performance-table></performance-table>
    </div>
</template>
<style scoped>
    .performance-wrap {
    padding: 20px;
}
</style>
<script>
    import performanceHeader from "../performance-header/performance-header";
    import performanceTable from "../performance-table/performance-table";

    export default{
        data () {
            return {
                msg: "performance"
            };
        },
        components: {
            performanceHeader,
            performanceTable
        }
    };
</script>
