/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\circle\content\index.ts
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 某个话题下的话题内容列表页
 * Last Modified: Sunday July 19th 2020 7:05:51 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-ui-topic-content">
    <!-- 话题头部导航条 -->
    <div class="wd-nav-bar">
      <a @click="$router.back()">圈子</a>
      <i class="icomoon icon-chevron-right"></i>
      <a @click="$router.go(0)">{{topic.name}}</a>
    </div>
    <!-- 话题信息 -->
    <div class="wd-content-head">
      <div class="wd-content-head-left">
        <img :src="topic.cover" alt="话题封面" />
      </div>
      <div class="wd-content-head-right">
        <p class="wd-content-head-right-up">
          <span class="wd-content-name">{{topic.name}}</span>
          <span class="wd-content-concern" @click="concernTopic">
            <template v-if="getConcern === 1">
              <i class="icon-check"></i> 已关注
            </template>
            <template v-else>
              <i class="icon-plus"></i> 关注
            </template>
          </span>
          <span class="wd-content-info">
            &nbsp;内容
            <span class="wd-number-red">{{topic.contentCount}}</span>
            &nbsp;关注
            <span class="wd-number-red">{{topic.concernCount}}</span>
          </span>
        </p>
        <p class="wd-to-you">{{topic.description}}</p>
      </div>
    </div>
    <!-- 帖子过滤 -->
    <div class="ui-topic-filter">
      <ul>
        <li>
          <i class="icomoon icon-filter"></i>
        </li>
        <li v-for="(v, i) in filters" :key="i" @click="filter(i+1)">
          <a
            :class="{
            'active': searchFilter === i + 1
          }"
            href="javascript:void 0"
          >{{v}}</a>
        </li>
      </ul>
    </div>
    <!-- 帖子列表 -->
    <div class="ui-topicContent-list">
      <PartLoadingComponent v-show="isLoading"/>
      <NoResultComponent v-if="isBlank"/>
      <ul>
        <li v-for="(v, i) in topicContents" :key="i">
          <router-link class="ui-topicContent-wrap" :to="'/circle/detail?id='+v.id+'&pid='+topic.id">
            <span class="ui-topicContent-cover">
              <p class="ui-author-cover">
                <img :src="v.cover" alt="封面" />
              </p>
            </span>
            <span class="ui-topicContent-info">
              <h3 class="ui-topicContent-title">{{v.title}}</h3>
              <p class="ui-topicContent-introduce" :title="v.introduce">{{v.introduce}}</p>
              <p class="ui-topicContent-more">
                <span>
                  <i class="icomoon icon-clock"></i>
                  &nbsp;{{v.createTime}}
                </span>
                <span>
                  <i class="icomoon icon-star"></i>
                  &nbsp;{{v.concernCount}}
                </span>
                <span>
                  <i class="icomoon icon-thumbs-up"></i>
                  &nbsp;{{v.thumbupCount}}
                </span>
                <span>
                  <i class="icomoon icon-eye"></i>
                  &nbsp;{{v.viewCount}}
                </span>
                <span>
                  <i class="icomoon icon-message-circle"></i>
                  &nbsp;{{v.commentCount}}
                </span>
              </p>
            </span>
            <!-- 序号 -->
            <label class="ui-list-label">{{i+1}}</label>
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 查看更多 -->
    <div>
      <p v-if="!!isMoreTopicContent" class="wd-view-more" @click="seeMore">查看更多</p>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>