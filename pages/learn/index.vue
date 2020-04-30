<template>
    <div id="id-ui-learn">
        <div class="ui-banner">
            <h1>知行合一,止于至善</h1>
            <p>知与行的合一，既不是以知来吞并行，认为知便是行，也不是以行来吞并知，认为行便是知.</p>
            <p></p>
            <div class="ui-banner-mask"></div>
        </div>
        <div class="ui-tab">
            <!-- 文档 -->
            <nuxt-link class="ui-tab-doc" to="/learn/docClass">文档</nuxt-link>
            <!-- 视频 -->
            <nuxt-link class="ui-tab-vid" to="/learn/vid">视频</nuxt-link>
        </div>
        <keep-alive>
            <nuxt-child></nuxt-child>
        </keep-alive>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>