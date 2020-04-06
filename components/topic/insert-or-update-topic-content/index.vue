<!--
 * @Author: your name
 * @Date: 2020-02-17 17:45:18
 * @LastEditTime: 2020-03-20 20:34:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\pages\admin\user\components\insert-or-update-user\insert-or-update-user.vue
 -->
<template>
  <div class="wd-window-form" id="id-topic-content">
    <form>
      <!-- 所属模块 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">模块</label>
        <input :disabled="true" :value="module===0?'论坛':'问云'" type="text" />
      </div>
      <!-- 所属话题分类 -->
      <div class="wd-form-unit-v" >
        <label class="required" for="">分类</label>
        <SelectComponent
          :key$="'id'"
          :value$="'name'"
          :list="categories"
          v-model="topicContent.tid"
        />
      </div>
      <!-- 是否可见 -->
      <div class="wd-form-unit-v" >
        <label class="required" for="">可见</label>
        <SelectComponent
          class="trueOrFalse"
          :force="true"
          :list="list"
          v-model="topicContent.visible"
        />
      </div>
      <!-- 是否付费 -->
      <div class="wd-form-unit-v" >
        <label class="required" for="">付费</label>
        <SelectComponent
          class="trueOrFalse"
          :force="true"
          :list="list"
          v-model="topicContent.charge"
        />
      </div>
      <!-- 话题内容标题 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">标题</label>
        <input v-model="topicContent.title" type="text" />
      </div>
      <!-- 话题内容封面 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">封面(暂只支持外链)</label>
        <input v-model="topicContent.cover" type="text" />
      </div>
      <!-- 话题内容摘要 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">摘要</label>
        <input v-model="topicContent.introduce" type="text" />
      </div>
      <!-- 话题内容主体 -->
      <div class="wd-form-unit-v">
        <label class="required" for="">主体内容</label>
        <EditorComponent v-model="topicContent.text" :hasBtn="false"/>
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
