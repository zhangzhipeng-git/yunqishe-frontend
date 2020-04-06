<!--
 * @Author: your name
 * @Date: 2020-01-05 14:27:31
 * @LastEditTime: 2020-02-23 20:07:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\form\checkbox\checkbox.vue
 -->
<template>
  <label class="wd-checkbox" @click="$emit('click',$event)">
    <input
      type="checkbox"
      :id="id"
      :checked="checked"
      :disabled="disabled"
      @change="emitChange($event)"
    />
    <i
      class="icomoon"
      :class="{
        'icon-lock wd-checkbox-dsiabled': disabled,
        'icon-square-m': !disabled&&checked === '',
        'icon-square-o': !disabled&&checked === false,
        'icon-check-square': !disabled&&checked === true
      }"
    ></i>
  </label>
</template>
<script lang="ts" src="./checkbox.ts"></script>
