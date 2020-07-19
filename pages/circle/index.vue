/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\circle\index.scss
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 圈子首页
 * Last Modified: Sunday July 19th 2020 3:10:06 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-ui-circle">
    <!-- 圈子页内容头部开始 -->
    <div class="ui-circle-header">
      <!-- 头部左侧banner开始 -->
      <div class="ui-circle-cover">
        <img src="@/assets/images/carousel-test/tantailang.jpg" alt />
      </div>
      <!-- 头部左侧banner结束 -->

      <!-- 右侧推荐面板开始 -->
      <div class="ui-circle-recommend">
        <!-- 推荐标题开始 -->
        <h2 class="ui-recommend-title">近期推荐</h2>
        <!-- 推荐标题结束 -->

        <!-- 推荐内容开始 -->
        <ul class="ui-recommend-content">
          <li v-for="(v, i) in tabTopicContents" :key="i" @click="toInvitation(v)">
            <router-link :to="'/circle/detail?id='+v.id+'&pid='+v.pid">
              <label :style="{ 'background-color': listColors[i] }">{{
                i+1
              }}</label>
              <span>{{ v.title }}</span>
              <span class="ui-recommend-introduce">{{ v.introduce }}</span>
            </router-link>
          </li>
        </ul>
        <!-- 推荐内容结束 -->
      </div>
      <!-- 右侧推荐面板结束 -->
    </div>
    <!-- 圈子页内容头部结束-->

    <!-- 圈子话题开始 -->
    <!-- 大众和系统话题 -->
    <div v-for="(v, i) in blocks" :key="i">
      <div v-if="v&&v.plates.length" class="ui-circle-content">
        <h2>{{ v.name }}</h2>
        <ul class="ui-items">
          <li
            class="ui-item"
            v-for="(item, j) in v.plates"
            :key="j"
            :class="{
              'wd-no-margin-right': (j + 1) % 3 === 0,
              'wd-no-margin-bottom': j >= (~~(v.plates.length / 3)) * 3
            }"
            :style="{
              'background-image': 'url('+item.cover+')' 
            }"
          >
            <router-link
              class="ui-item-wrap"
              :title="item.description"
              :to="'/circle/content?id='+item.id"
            >
              <!-- 滤镜 -->
              <span class="ui-item-filter"></span>
              <!-- 话题入口头部开始 -->
              <span class="ui-item-head">
                  <p class="ui-item-title">{{ item.name | strCut(12) }}</p>
                  <p class="ui-item-introduce">
                    {{ item.description }}
                  </p>
              </span>
              <!-- 话题入口头部结束 -->
              <!-- 话题信息条开始 -->
              <span class="ui-item-footer">
                <p>
                  内容&nbsp;{{ item.countCount }}&nbsp;关注&nbsp;{{
                    item.concernCount
                  }}&nbsp;
                  <router-link :to="'/circle/content?id='+item.id">点击进入</router-link>
                </p>
              </span>
              <!-- 话题信息条结束 -->
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 圈子话题结束 -->
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
