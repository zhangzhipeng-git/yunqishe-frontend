<!--
 * @Author: your name
 * @Date: 2020-02-20 10:41:14
 * @LastEditTime: 2020-02-21 14:26:04
 * @LastEditors: Please set LastEditors
 * @Description: 这个组件不使用递归模板渲染，递归模板渲染比较慢
 * @FilePath: \nuxt-ssr\components\commons\tree\tree.vue
 -->
<template>
  <div class="wd-tree">
    <ul>
      <li
        v-for="(v, i) in list$"
        :key="i"
        :style="{ 'padding-left': v.level * .5 + 'rem' }"
        :class="'height-' + (v.spread ? 'y' : 'n')"
      >
        <i
          @click="toggle(v)"
          class="icomoon"
          :class="v.childs?('icon-caret-' + (v.childs[0].spread ? 'down' : 'right')):'blank'"
        ></i>
        <CheckBoxComponent class="checkbox" v-model="v.checked" @change="check($event, v)" /><span>{{ v[value$] }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./tree.ts"></script>
