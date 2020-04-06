<!--
 * @Author: your name
 * @Date: 2020-02-22 20:16:01
 * @LastEditTime: 2020-03-19 20:44:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\form\sms\sms.vue
 -->
<template>
  <div class="wd-sms">
    <!-- 验证成功后[status===1]禁用 -->
    <input
      ref="sms"
      type="text"
      class="sms-input"
      autocomplete="off"
      v-model="verifycode$"
      :disabled = "status === 1"
      :placeholder="placeholder"
      :class="{
          'success': status === 1,
          'failed': status === 2,
          'timeout': status === 3
      }"
      :readonly="readonly"
      @focus="restStatus"
    />
    <span class="sms-tip">|
      <!-- 认证成功[stauts===1] -->
      <template v-if="status === 1">
        <span class="sms-success">已认证</span>
      </template>
      <!-- 需要再次验证[status===0]或失败[status===2]或超时[stauts===3] -->
      <template v-else>
        <!-- 发送 -->
        <span v-if="isSend" class="sms-second">{{second}}S</span>
        <!-- 未发送 -->
        <span v-else class="sms-send" @click="sendSMS">发送验证码</span>
      </template>
    </span>
  </div>
</template>
<script lang="ts" src="./sms.ts"></script>
