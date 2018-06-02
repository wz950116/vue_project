<template>
    <div class="city">
        <city-header class="header">
        </city-header>
        <city-table></city-table>
    </div>
</template>
<style scoped>
    .city {
    margin-top: 20px;
}
</style>
<script>
    import cityHeader from "../city-header/city-header";
    import cityTable from "../city-table/city-table";

    export default{
        name: "City",
        components: {
            cityHeader,
            cityTable
        }
    };
</script>
