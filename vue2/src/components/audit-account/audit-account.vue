<template>
    <div style="padding-top:20px;">
        <audit-account-header class="header">
        </audit-account-header>
        <audit-account-table></audit-account-table>
    </div>
</template>
<style>

</style>
<script>
    import auditAccountHeader from "../audit-account-header/audit-account-header";
    import auditAccountTable from "../audit-account-table/audit-account-table";
    export default{
        name: "auditAccount",
        data () {
            return {
                msg: "account"
            };
        },
        components: {
            auditAccountHeader,
            auditAccountTable
        }
    };
</script>
