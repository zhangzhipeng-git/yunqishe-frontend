<!--
 * @Author: your name
 * @Date: 2020-02-04 19:44:41
 * @LastEditTime: 2020-02-23 12:39:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\app-alert\app-alert.vue
 -->
<template>
  <div class="app-alert">
    <div class="mask"></div>
    <div class="alert">
      <h4 v-if="title">{{title}}</h4>
      <p v-html="content"></p>
      <div class="buttons">
        <div v-tap ref="button1" :class="buttons.length === 2 ? 'left':'right width-100'">{{buttons[0]}}</div>
        <div v-tap ref="button2" class="right" v-if="buttons.length === 2">{{buttons[1]}}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./app-alert.ts"></script>
