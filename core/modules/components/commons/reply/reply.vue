<!--
 * @Author: your name
 * @Date: 2020-02-22 20:16:02
 * @LastEditTime: 2020-03-25 22:42:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\reply\reply.vue
 -->
/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\reply\reply.vue
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Sunday, December 15th 2019, 9:02:08 pm
 * Author: zzp-dog
 * 回复组件
 * Copyright (c) 2019 Your Company
 */

<template>
  <div class="wd-component-reply" :class="{'reply-disabled': disabled}">
    <!-- 暗锚点 -->
    <a class="anchorPoint" :name="anchorPoint.name" :style="{'top': anchorPoint.top}"></a>
    <!-- 未登录禁用，可投影-->
    <template v-if="disabled">
      <slot>
        <p>您好，请登录后再进行评论~</p>
        <button class="btn" @click="$emit('disabled', $event)">登录</button>
      </slot>
    </template>
    <!-- 已登录 -->
    <template v-else>
      <textarea ref="textarea" @focus="focus" :style="{height: (spread$?5:1.5)+'rem'}" :id="id" v-model="model$" class="reply-textarea" :placeholder="placeholder$"></textarea>
      <div>
        <!-- 表情 -->
        <EmojiComponent v-if="showEmoji" @selectEmoji="selectEmoji($event)"/>
        <!-- 提交 -->
        <button v-if="showBtn"  class="btn reply-btn" @click="reply">回复</button>
      </div>
    </template>
  </div>
</template>
<script lang="ts" src="./reply.ts"></script>
