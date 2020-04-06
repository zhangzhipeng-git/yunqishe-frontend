<!--
 * @Author: your name
 * @Date: 2020-02-17 22:39:10
 * @LastEditTime: 2020-03-08 15:07:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\form\select\select.vue
 -->
<!-- 利用checkbox的v-model实现 -->
<!-- 注意：在严格模式下，ie不允许标签属性重复，以及vnode的属性重复[不要使用:type] -->
<template>
  <div class="wd-select-component" @click.stop>
    <!-- 搜索功能只限单选 -->
    <input
      type="text"
      v-model="inputValue"
      @blur="inputValue = inputValue$"
      @input="!multiple && isSearch && search($event)"
      :disabled="disabled || !isSearch || multiple"
    /><i
      :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      @click="toggle"
      class="icomoon icon-chevron-down"
    ></i>
    <ul
      v-if="!disabled"
      :class="[
        isSpread ? 'open' : 'close',
        noBorder ? 'no-border' : '',
        noScrollBar ? 'no-scrollbar' : ''
      ]"
    >
      <!-- 选中请选择时，把请选择禁用掉 -->
      <li v-for="(v, i) in list$" :key="i">
        <a href="javascript:void 0">
          <label>{{ v[value$] }}<input
              @change="change(v)"
              :value="v[key$]"
              v-model="model$"
              :disabled="model$.includes(v[key$])"
              type="checkbox"
            />
            <i class="icommon icon-check"></i>
          </label>
        </a>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./select.ts"></script>
