<template>
    <el-dialog :title='title' v-model='popShow'>
        <el-form :model="form">
            <p>
                <label for="resourceName">资源名称</label>
                <el-input id="resourceName" class="inline-input" v-model="resourceName" placeholder="请输入内容" >
                    <!-- <template slot="prepend">资源名称</template> -->
                </el-input>
            </p>
            <p>
                <label for="billMethod">计费方式</label>
                <el-checkbox id="billMethod" v-model="billMethod" checked onclick="return false">CPM
                </el-checkbox>
            </p>
            <p>
                <label for="minPrice">底价</label>
                <el-input id="minPrice" class="inline-input" v-model="minPrice" placeholder="请输入内容" >
                    <!-- <template slot="prepend">底价</template> -->
                </el-input>
            </p>
            <table>
                <tr>
                    <th class="tableLeft">关联广告位</th>
                    <th class="tableRight">
                        <el-button @click="addAdsense" type="text" size="small">新增广告位</el-button>
                    </th>
                </tr>
                <tr v-for="item in adsense">
                    <td class="tableLeft">{{item}}</td>
                    <td class="tableRight">
                        <el-button @click="deleteAdsense(item)" type="text" size="small">删除</el-button>
                    </td>
                </tr>
                <tr v-for="(item,index) in newAdsenses">
                    <td class="tableLeft">
                        <el-input v-model="newAdsenses[index]" placeholder="请输入内容"></el-input>
                    </td>
                    <td class="tableRight">
                        <el-button @click="deleteNewAdsense(index)" type="text" size="small">取消</el-button>
                        <el-button @click="saveNewAdsense(index)" type="text" size="small">确定</el-button>
                    </td>
                </tr>
            </table>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click='removeChange'>取 消</el-button>
            <el-button type="primary" @click="saveChange">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script src="./pop-resource.js"></script>
<style scoped src="./pop-resource.css"></style>
