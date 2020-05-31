<template>
    <div class="wd-upload">
        <!-- 文件表单 -->
        <div class="wd-upload-file">
            <input type="file" :accept="accept" ref="file" />
        </div>
        <!-- 插槽 -->
        <slot/>
    </div>
</template>
<script lang="ts" src="./upload.ts"></script>
