<template>
    <div style="padding-top:20px;">
        <audit-idea-header class="header"></audit-idea-header>
        <audit-idea-table></audit-idea-table>
    </div>
</template>
<script>
    import auditIdeaHeader from "../audit-order-header/audit-order-header";
    import auditIdeaTable from "../audit-order-table/audit-order-table";

    export default{
        data () {
            return {
                msg: "bill"
            };
        },
        components: {
            auditIdeaHeader,
            auditIdeaTable
        }
    };
</script>
