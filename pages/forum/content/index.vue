/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\forum\content\_id.vue
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 7th 2019, 8:23:42 pm
 * Author: zzp-dog
 * 某个板块的帖子
 * Copyright (c) 2019 Your Company
 */

<template>
  <div id="id-ui-block-content">
    <!-- 板块头部导航条 -->
    <div class="wd-content-bar">
      <a @click="$router.back()">论坛</a>
      <i class="icomoon icon-chevron-right"></i>
      <a @click="$router.go(0)">{{block.name}}</a>
    </div>
    <!-- 版主信息 -->
    <div class="wd-content-head">
      <div class="wd-content-head-left">
        <img :src="block.cover" alt="板块封面" />
      </div>
      <div class="wd-content-head-right">
        <p class="wd-content-head-right-up">
          <span class="wd-content-name">{{block.name}}</span>
          <span class="wd-content-concern" @click="concernBlock">
            <template v-if="getConcern === 1">
              <i class="icon-check"></i> 已关注
            </template>
            <template v-else>
              <i class="icon-plus"></i> 关注
            </template>
          </span>
          <span class="wd-content-info">
            &nbsp;内容
            <span class="wd-number-red">{{block.count}}</span>
            &nbsp;关注
            <span class="wd-number-red">{{block.concern}}</span>
          </span>
        </p>
        <p class="wd-to-you">{{block.description}}</p>
      </div>
    </div>
    <!-- 帖子过滤 -->
    <div class="ui-block-filter">
      <ul>
        <li>
          <i class="icomoon icon-filter"></i>
        </li>
        <li v-for="(v, i) in filters" :key="i" @click="filter(i+1)">
          <a :class="{
            'active': searchFilter === i + 1
          }" href="javascript:void 0">{{v}}</a>
        </li>
      </ul>
    </div>
    <!-- 帖子列表 -->
    <div class="ui-invitation-list">
      <ul>
        <li v-for="(v, i) in contents" :key="i" @click="toDetail(v.id)">
          <div class="ui-invitation-cover">
            <p class="ui-author-cover">
              <img :src="v.cover" alt="封面" />
            </p>
          </div>
          <div class="ui-invitation-info">
            <h3 class="ui-invitation-title">{{v.title}}</h3>
            <p class="ui-invitation-introduce">{{v.introduce}}</p>
            <p class="ui-invitation-more">
              <span>
                <i class="icomoon icon-clock"></i>&nbsp;{{v.createTime}}
              </span>
              <span>
                <i class="icomoon icon-star"></i>&nbsp;{{v.collect}}
              </span>
              <span>
                <i class="icomoon icon-thumbs-up"></i>&nbsp;{{v.thumbup}}
              </span>
              <span>
                <i class="icomoon icon-eye"></i>&nbsp;{{v.view}}
              </span>
              <span>
                <i class="icomoon icon-message-circle"></i>&nbsp;{{v.commentCount}}
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 查看更多 -->
    <div>
      <p class="wd-view-more" @click="seeMore">
        {{!noMore?'查看更多':'暂无更多~'}}
      </p>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>