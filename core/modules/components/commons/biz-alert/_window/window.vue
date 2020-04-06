<!--
 * @Author: your name
 * @Date: 2020-01-04 13:50:20
 * @LastEditTime: 2020-02-20 17:33:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\alert\window\window.vue
 -->
<template>
  <div v-show="show" class="wd-alert wd-my-window">
    <div class="wd-mask" ref="mask"></div>
    <div class="wd-content" id="id-window-content">
      <div
        ref="window"
        class="wd-window"
        :id="min?'':'id-window-max'"
        :class="[
          animation + '-enter',
          animation + (active ? '-active' : '-leave')
        ]"
      >
        <!-- 窗口工具条 -->
        <div class="wd-window-tool" @mousedown="start" @tragstart="tragstart">
          <h3>{{ title }}</h3>
          <p>
            <!-- isScale true-显示放大缩小，flase-不显示放大缩小,_isScale同isScale兼容方式2 -->
            <i
              v-if="isScale"
              @click="switchSize"
              class="icomoon"
              :class="min ? 'icon-maximize' : 'icon-minimize'"
            ></i>
            <i @click="close" class="icomoon icon-x-square"></i>
          </p>
        </div>
        <!-- 窗口面板 -->
        <div class="wd-window-pannel" ref="pannel">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./window.ts"></script>
