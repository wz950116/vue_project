<template>
    <el-dialog :title='title' v-model='popShow'>
        <el-form :model="form">
            <p>
                <label for="upload">新增预览图</label>
                <el-upload class="inline-input" action="//ad-manage.focus-dev.cn/resource/image/upload/" name="src" type="drag" 
                :thumbnail-mode="true" 
                :with-credentials="true" 
                :on-preview="handlePreview" 
                :on-success="handleSuccess" 
                :on-remove="handleRemove" 
                :default-file-list="fileList" >
                    <i class="el-icon-upload"></i>
                    <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">图片大小不超过500kb</div>
                </el-upload>
            </p>
            <p>
                <label for="description">图片描述</label>
                <el-input id="description" class="inline-input" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请图片描述" v-model="preview.description">
                </el-input>
            </p>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click='removeChange'>取 消</el-button>
            <el-button type="primary" @click="saveChange">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script src="./pop-dialog.js"></script>
<style scoped src="./pop-dialog.css"></style>