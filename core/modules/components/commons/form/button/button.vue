<!--
 * @Author: your name
 * @Date: 2020-02-02 15:13:05
 * @LastEditTime: 2020-02-16 16:12:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\form\button\button.vue
 -->
<template>
  <div class="wd-button" :class="disabled_ ? 'disabled' : ''">
    <button
      @click="emitClick"
      :disabled="disabled_"
      :class="[btnclz, disabled_ ? 'disabled' : '']"
    >
      <template v-if="!!text">
        {{ text }}
      </template>
      <slot v-else />
    </button>
  </div>
</template>
<script lang="ts" src="./button.ts"></script>
