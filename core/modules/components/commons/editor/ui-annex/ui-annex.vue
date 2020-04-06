<!--
 * @Author: your name
 * @Date: 2020-01-05 22:04:28
 * @LastEditTime : 2020-01-09 00:16:28
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\components\commons\editor\ui-annex\ui-annex.vue
 -->
<template>
  <div class="wd-ui-annex">
    <ul>
      <li>
        <button class="wd-upload-local" @click="selectFile">
          本地上传图片 +
        </button>
        <input ref="file" class="wd-edit-file" type="file" />
      </li>
      <li>
        <label>类型</label>
        <RadioGroupComponent
          class="wd-radio-group-type"
          v-model="type"
          :radioGroup="radioGroup"
        />
      </li>
      <li>
        <label for="wd-annex-width">宽度</label>
        <input id="wd-annex-width" type="text" v-model="width" />
      </li>
      <li>
        <label for="wd-annex-height">高度</label>
        <input id="wd-annex-height" type="text" v-model="height" />
      </li>
      <li>
        <label for="wd-annex-link">外链</label>
        <input
          placeholder="https://"
          id="wd-annex-link"
          type="text"
          v-model="url"
        />
      </li>
      <li>
        <button @click="insertOutLink" class="wd-use-link-confirm">插入外链</button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" src="./ui-annex.ts"></script>
