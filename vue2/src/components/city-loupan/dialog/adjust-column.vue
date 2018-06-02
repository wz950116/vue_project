<template>
    <el-dialog size="tiny" title="自定义列" v-model="dialogVisble">
        <template v-for="item in adjustList">
            <div>
                <el-checkbox @change="checkAll(item)" v-model="item.visible">{{item.label}}</el-checkbox>
                <div class="gray" v-if="item.children">
                    <el-checkbox @change="check(item, it)" v-for="it in item.children" v-model="it.visible">{{it.label}}</el-checkbox>
                </div>
            </div>
        </template>
    </el-dialog>
</template>
<script>
let setAllNode = (node, bool) => {
    if (node.children) {
        node.children.forEach(item => {
            item.visible = bool;
            setAllNode(item, bool);
        });
    }
};

export default {
    name: 'adjust-column',
    data() {
        let adjustList = this.$parent.thead;
        return {
            dialogVisble: false,
            adjustList: adjustList
        }
    },
    methods: {
        checkAll(data) {
            if (data.visible) {
                if (data.children) {
                    data.children.forEach(item => {
                        item.visible = true;
                        if (item.children) {
                            setAllNode(item, true);
                        }
                    });
                }
            } else {
                setAllNode(data, false);
            }
        },
        check(item, it) {
            let checkNum = 0;
            if (it.visible === true) {
                setAllNode(it, true);
            } else {
                setAllNode(it, false);
            }
            item.children.forEach(item => {
                if (item.visible === true) {
                    checkNum++;
                }
            });

            if (checkNum === 0) {
                item.visible = false;
                setAllNode(item, false);
            } else {
                item.visible = true;
                if (checkNum === item.children.length) {
                    setAllNode(item, true);
                }
            }
        }
    },
    watch: {
        dialogVisble(val) {
            if (val === true) {
                this.adjustList = this.$parent.thead;
            }
        }
    }
}
</script>
<style scoped>
    .gray {
        background: #ccc;
        margin: 0 0 0 20px;
    }
</style>