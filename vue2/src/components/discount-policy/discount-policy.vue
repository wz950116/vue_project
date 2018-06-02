<template lang="html">
    <div class="wrap">
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <discount-policy-cash></discount-policy-cash>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <discount-policy-level></discount-policy-level>
          </div>
        </el-col>
      </el-row>
    </div>
</template>
<style scoped>

</style>
<script>
import discountPolicyCash from "../discount-policy-cash/discount-policy-cash";
import discountPolicyLevel from "../discount-policy-level/discount-policy-level";
export default {
    name: "DiscountPolicy",
    components: {
        discountPolicyCash,
        discountPolicyLevel
    }
};
</script>
