<!--
 * @Author: your name
 * @Date: 2020-01-03 22:01:00
 * @LastEditTime : 2020-01-05 12:51:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\alert\pop\pop.vue
 -->
<template>
  <div id="id-wd-pop" class="wd-alert" v-show="show">
    <div class="wd-mask" ref="mask"></div>
    <div class="wd-content">
      <div
        class="wd-content-wrap"
        :style="{ transition: 'all ' + (active ? enter : leave) / 1000 + 's' }"
        :class="[
          animation === 'scale' ? 'wd-pop-for-scale' : 'wd-pop',
          animation + '-enter',
          animation + (active ? '-active' : '-leave')
        ]"
      >
        <div class="wd-close" @click="close">
          <i class="icomoon icon-x-circle"></i>
        </div>
        <!-- 以下两种是通过组件ts中直接调用静态方法创建弹出组件 -->
        <!-- v-html -->
        <div v-if="typeof content === 'string'" v-html="content">
          什么也木有~
        </div>
        <!-- 动态组件 handler:vue实例 -->
        <component v-else :handler="handler" :is="'child'"></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./pop.ts"></script>
