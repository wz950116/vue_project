<template>
    <div class="customer-agent">
        <div class="agent-header">
            <span 
                v-for="(item,index) in headerData" 
                class="agent-header-text" 
                v-bind:class="{'agent-header-selected':item.selected}" 
                @click="selectTag(index)">
                {{item.name}}
            </span>
        </div>
        <div class="agent-content">
            <component :is="currentView"></component>
        </div>
    <div>
</template>
<script src="./customer-agent.js"></script>

<style scoped>
.customer-agent {
    margin-top: 20px;
}

.agent-header {
    border-bottom: 1px solid #d8d8d8;
    margin-bottom: 20px;
}

.agent-header-text {
    font-size: 20px;
    margin-right: 80px;
    color: #333;
    cursor: pointer;
    line-height: 40px;
    vertical-align: middle;
    padding: 5px;
}

.agent-header-selected {
    border-bottom: 2px solid #e43;
    color: #e43;
}
</style>
