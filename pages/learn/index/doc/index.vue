<template>
    <div id="id-ui-learn-doc">
        <div class="ui-doc">
            <ul class="ui-classes">
                <!-- 总分类循环 -->
                <li v-for="i in 5" :key="i" class="ui-class">
                    <h3 class="ui-class-tittle">文档{{i}}</h3>
                    <ul class="ui-items">
                        <!-- 分类中项目循环 -->
                        <li class="ui-item" v-for="j in 7" :key="j"><nuxt-link :to="'/learn/doc-detail/' + '1'">分类{{j}}</nuxt-link></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>