/*
 * Project: nuxt-ssr
 * FileName: index.vue
 * Author: zzp-dog
 * File Created: Sunday, 15th December 2019 10:41:15 pm
 * description:
 * Last Modified: Saturday, 25th April 2020 8:03:03 pm
 * Modified By: zzp-dog
 * Copyright © zzp-dog, All rights reserved.
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
          <li v-for="(v, i) in tabInvitations" :key="i" @click="toInvitation(v)">
            <a href="#">
              <label :style="{ 'background-color': listColors[i] }">{{
                i+1
              }}</label>
              <span>{{ v.title }}</span>
              <span class="ui-recommend-introduce">{{ v.introduce }}</span>
            </a>
          </li>
        </ul>
        <!-- 推荐内容结束 -->
      </div>
      <!-- 右侧推荐面板结束 -->
    </div>
    <!-- 圈子页内容头部结束-->

    <!-- 圈子版块开始 -->
    <!-- 大众和系统版块 -->
    <div v-for="(v, i) in blocks" :key="i">
      <div v-if="v.plates.length" class="ui-circle-content">
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
          >
            <div
              :class="i + '-' + j === hoverID ? 'show-border' : ''"
              @click="toContent(item)"
              @mouseout="hideHoverStyle"
              @mouseover="showHoverStyle(i + '-' + j)"
              class="ui-item-wrap"
            >
              <!-- 板块入口头部开始 -->
              <div class="ui-item-head">
                <div class="ui-item-cover">
                  <img src="@/assets/images/default-avator.png" alt />
                </div>
                <div class="ui-item-content">
                  <p class="ui-item-title">{{ item.name | strCut(12) }}</p>
                  <p class="ui-item-introduce" :title="item.description">
                    {{ item.description }}
                  </p>
                </div>
              </div>
              <!-- 板块入口头部结束 -->

              <!-- 板块信息条开始 -->
              <div class="ui-item-footer">
                <p>
                  内容&nbsp;{{ item.countCount }}&nbsp;关注&nbsp;{{
                    item.concernCount
                  }}&nbsp;
                  <a>点击进入</a>
                </p>
              </div>
              <!-- 板块信息条结束 -->
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 圈子版块结束 -->
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
