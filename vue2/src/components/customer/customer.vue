<template>
    <div>
        <customer-header class="header" ref="customerHeader">
        </customer-header>
        <customer-table ref="customerTable"></customer-table>
    </div>
</template>
<script>
    import customerHeader from "../customer-header/customer-header";
    import customerTable from "../customer-table/customer-table";

    export default{
        data () {
            return {
                msg: "customer"
            };
        },
        components: {
            customerHeader,
            customerTable
        }
    };
</script>
