<template lang="html">
    <div class="wrap">
        <city-loupan-header></city-loupan-header>
        <city-loupan-table></city-loupan-table>
    </div>
</template>
<script>
import cityLoupanHeader from "../city-loupan-header/city-loupan-header";
import cityLoupanTable from "../city-loupan-table/city-loupan-table";
export default {
    name: "CityLoupan",
    components: {
        cityLoupanHeader,
        cityLoupanTable
    }
};
</script>
