/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\learn\doc-detail\_id.vue
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 28th 2019, 5:24:19 pm
 * Author: zzp-dog
 * 文档详情
 * Copyright (c) 2019 Your Company
 */
<template>
    <div id="id-ui-doc-detail">
        <!-- 侧边菜单-->
        <SidebarNavComponent>
            <SideMenuComponent />
        </SidebarNavComponent>
        <!-- 主体内容 -->
        <div class="ui-main-comtent">
            <!-- 测试富文本编辑器 -->
            <EditorComponent @recieveContent="recieveContent($event)"/>
        </div>
    </div>
</template>
<script lang="ts" src="./_id.ts"></script>
<style lang="scss" scoped src="./_id.scss"></style>