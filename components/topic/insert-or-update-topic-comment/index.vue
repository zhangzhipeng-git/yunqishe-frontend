<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-15 17:06:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-user\insert-or-update-user.vue
 -->
<template>
  <div class="wd-window-form" id="id-topic-comment">
    <form>
      <!-- 是否可见 -->
      <div class="wd-form-unit-v" >
        <label class="required" for="">可见</label>
        <SelectComponent
          class="trueOrFalse"
          :force="true"
          :list="list"
          v-model="topicComment.visible"
        />
      </div>
      <!-- 是否付费 -->
      <div class="wd-form-unit-v" >
        <label class="required" for="">付费</label>
        <SelectComponent
          class="trueOrFalse"
          :force="true"
          :list="list"
          v-model="topicComment.charge"
        />
      </div>
      <!-- 话题内容回复或评论主体 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">主体内容</label>
        <EditorComponent v-model="topicComment.text" :hasBtn="false"/>
      </div>
    </form>
    <div class="wd-btn-group">
      <ButtonComponent @click="close" class="wd-cancle" :throttle="0" :text="'取消'" />
      <ButtonComponent @click="confirm" :text="'确认'"/>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
