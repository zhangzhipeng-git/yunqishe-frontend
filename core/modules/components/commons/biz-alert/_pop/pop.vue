<!--
 * @Author: your name
 * @Date: 2020-01-03 22:01:00
 * @LastEditTime : 2020-01-05 12:51:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\alert\pop\pop.vue
 -->
<template>
  <div class="wd-alert wd-my-pop" v-show="show">
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
        <!-- 通过将本组件引入父组件template中插入slot -->
        <!-- slot -->
        <slot />
        </div>
    </div>
  </div>
</template>
<script lang="ts" src="./pop.ts"></script>
