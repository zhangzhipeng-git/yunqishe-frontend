<template>
    <div class="wd-upload">
        <!-- 插槽 -->
        <slot/>
        <!-- 文件表单，无上传按钮时position为绝对定位，否则为相对定位 -->
        <div class="wd-upload-file" :style="{'position': hasBtn?'relative':'absolute'}">
            <input :style="{'cursor': disabled?'not-allowed':'default'}" :disabled="disabled" type="file" @change="onchange($event)" :accept="accept" ref="file" v-if="rebuild"/>
            <button :style="{'cursor': disabled?'not-allowed':'default'}" :disabled="disabled" v-if="hasBtn">{{text}}</button>
        </div>
    </div>
</template>
<script lang="ts" src="./upload.ts"></script>
