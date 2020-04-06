<!--
 * @Author: your name
 * @Date: 2020-01-07 21:18:19
 * @LastEditTime: 2020-02-18 22:32:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\editor\_form\radio\radio.vue
 -->
<template>
  <span>
    <label class="wd-radio" v-for="(v, i) in list" :key="i">
      <input
        type="radio"
        class="input-radio"
        :value="v[key$]"
        :disabled="disabled||v.disabled"
        v-model="vmodel"
        @click="getActiveIndex(i)"
        @change="emitChange(v[key$])"
      />
      <i
        :class="[
          'icomoon',
          v.disabled ? 'wd-radio-dsiabled' : '',
          i === activeIndex ? 'icon-check-circle-thin' : 'icon-circle-thin'
        ]"
      ></i>
      <span>{{ v[value$] }}</span>
    </label>
  </span>
</template>
<script lang="ts" src="./radio-group.ts"></script>
