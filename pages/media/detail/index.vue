/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\media\detail\index.vue
 * Created Date: Saturday, April 18th 2020, 4:50:09 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Monday May 4th 2020 2:20:17 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-ui-media-detail">
    <!-- 头部媒体 -->
    <div class="ui-media-header">
      <VideoComponent :src="src">
        <NoPrivilegeComponent v-if="selectContent.privilegeType>0" :pay="$refs.pay" :content="selectContent"/>
      </VideoComponent>
      <div class="ui-user">
        <div class="fl">
          <div class="ui-user-avator">
            <img :src="user.avator" alt="用户头像" />
          </div>
          <div class="ui-user-info">
            <p class="ui-user-name-level">
              <span class="wd-user-nickname">{{ user.nickname }}</span>
              <span class="wd-user-level">Lv.{{ user.level }}</span>
            </p>
            <p class="ui-user-create-time">发表于{{ mediaClass.createTime }}</p>
          </div>
        </div>
        <div class="fr">
          <button>+&nbsp;关注</button>
        </div>
      </div>
      <!-- 播放列表 -->
      <div class="ui-play-list" v-if="mediaContents.length > 1">
        <h3>播放列表</h3>
        <ul>
          <li @click="goPlay(v, i)" v-for="(v, i) in mediaContents" :key="i">
            <a :class="{ active: activeIndex === i }" href="javascript: void 0">第{{ i + 1 }}集</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- 支付组件 -->
    <PayComponent ref="pay"/>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
