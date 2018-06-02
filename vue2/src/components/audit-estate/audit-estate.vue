<template>
    <div style="padding-top:20px;">
        <audit-building-header class="header">
        </audit-building-header>
        <audit-building-table></audit-building-table>
    </div>
</template>
<script>
    import auditBuildingHeader from "../audit-estate-header/audit-estate-header";
    import auditBuildingTable from "../audit-estate-table/audit-estate-table";

    export default{
        data () {
            return {
                msg: "account"
            };
        },
        components: {
            auditBuildingHeader,
            auditBuildingTable
        }
    };
</script>
