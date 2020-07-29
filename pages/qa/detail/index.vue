/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\qa\detail\index.vue
 * Created Date: Thursday, December 26th 2019, 7:11:47 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 
 * Last Modified: Sunday May 17th 2020 1:51:33 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */

<template>
  <div id="id-ui-qa-detail">
    <div class="wd-stairs-content">
      <!-- 问题作者信息 -->
      <div class="wd-content-head">
        <div
          class="wd-content-head-left"
          @mouseenter="showMask(topic)"
          @mouseleave="hideMask(topic)"
        >
          <img :src="topic.cover" alt="模块封面" />
          <template v-if="topic.mask">
            <div class="wd-content-head-cover-mask"></div>
            <div class="wd-content-concern" @click="collect(topic)">
              <template v-if="getConcern(topic) === 1">
                <i class="icomoon icon-check"></i> 已关注
              </template>
              <template v-else>
                <i class="icomoon icon-plus"></i> 关注
              </template>
            </div>
          </template>
        </div>
        <div class="wd-content-head-right">
          <p class="wd-content-head-right-up">
            <span class="wd-content-name">{{ topic.name }}</span>
            <span class="wd-content-info">
              &nbsp;发帖
              <span class="wd-number-red">{{ topic.contentCount||'' }}</span>
              <br />&nbsp;关注
              <span class="wd-number-red">{{ topic.concernCount||'' }}</span>
            </span>
          </p>
          <p class="wd-to-you">{{ topic.description }}</p>
        </div>
      </div>
      <!-- 头部 -->
      <div class="wd-main-left">
        <!-- 问题内容 -->
        <div class="wd-stair2-level0">
          <!-- 楼主 -->
          <div class="wd-stair2-level0-head ui-first-stair">
            <div class="wd-stair2-level0-head-avator">
              <img :src="user.avator" alt="用户头像" />
            </div>
            <div class="wd-stair2-level1-head-info">
              <p>
                <span class="wd-stair2-nickname">{{ user.nickname }}</span>
                <!-- vip或svip，额外标识 -->
                <span v-if="vip.identity" class="wd-user-role">
                  {{
                  vip.identity
                  }}
                </span>
                <!-- 用户角色名 -->
                <span v-if="vip.name" class="wd-user-description">
                  {{
                  vip.name
                  }}
                </span>
                <!-- 用户称号(黑铁-最强王者) -->
                <span v-if="user.designation" class="wd-user-designation">{{ user.designation }}</span>
                <!-- 神秘标识 -->
                <span
                  v-if="user.extraname"
                  class="wd-user-extranmae"
                >{{ topicContent.user.extraname }}</span>
                <!-- 用户等级 -->
                <span class="wd-user-level">Lv.{{ user.level }}</span>
              </p>
              <p>
                <i class="icomoon icon-clock"></i>
                <span>{{ topicContent.createTime }}</span>
                <i
                  class="icomoon"
                  :class="'icon-' + (topicContent.device === 1 ? 'monitor' : 'tablet')"
                ></i>
                <span>{{ topicContent.device === 1 ? "PC端" : "移动端" }}</span>
              </p>
            </div>
          </div>
          <!-- 正文 -->
          <div class="wd-stair2-level0-body">
            <p v-html="cleanVHtml(topicContent.text)"></p>
            <!-- 发表的相关信息 -->
            <p class="wd-stair2-level0-deliver">
              <span class="wd-stair2-right-tag-level-0">#1楼</span>
              <i class="icomoon icon-map-pin"></i>
              <span>{{ topicContent.address }}</span>
              <i class="icomoon icon-eye"></i>
              <span>{{ topicContent.viewCount||'' }}</span>
              <!-- 收藏 -->
              <a @click="collect(topicContent)">
                <i
                  class="icomoon"
                  :class="'icon-' + (getConcern(topicContent) ? 'star' : 'star-o')"
                ></i>
                <span>{{ topicContent.concernCount||'' }}</span>
              </a>
              <!-- 点赞 -->
              <a @click="thumbup(topicContent, 1)">
                <i
                  class="icomoon"
                  :class="'icon-thumbs-' + (getThumb(topicContent) === 1 ? 'up' : 'up-o')"
                ></i>
                <span>{{ topicContent.thumbupCount||'' }}</span>
              </a>
              <!-- 1级回复按钮 -->
              <a href="#topReply$" class="wd-stair2-level0-deliver-btn">
                <label for="topReply" @click="setTopReply(topicContent)">回复</label>
              </a>
            </p>
          </div>
        </div>
        <!-- 1级回复 -->
        <div class="ui-reply">
          <div class="ui-reply-wrap">
            <client-only>
              <ReplyComponent
                v-model="replyObj0.text"
                @submit="submit(replyObj0, 0)"
                @focus="setTopReply(topicContent)"
                @disabled="toLogin"
                :id="'topReply'"
                :showEmoji="true"
                :placeholder="replyObj0.placeholder"
                :disabled="!curUser"
                :anchorPoint="{ name: 'topReply$', top: '-6rem' }"
              />
            </client-only>
          </div>
        </div>
        <!-- 问题1级回复 -->
        <div class="wd-stair2-level1" v-for="(item, index) in Lv1Comments" :key="index">
          <!-- 1级回复楼层头部 -->
          <div class="wd-stair2-level1-head">
            <div>
              <img :src="item.user.avator" alt="用户头像" />
            </div>
            <!-- 1级回复者昵称和等级 -->
            <div>
              <p>
                <!-- 1级回复 - 第几层 -->
                <span class="wd-stair2-level1-index">#{{ index + 2 }}楼</span>
                <!-- 1级回复者昵称 -->
                <span class="wd-stair2-level1-nickname">{{ item.user.nickname }}</span>
                <!-- 1级回复者等级 -->
                <span class="wd-stair2-level1-level">Lv.{{ item.user.level }}</span>
              </p>
              <p>
                <i class="icomoon icon-clock"></i>
                <span>{{ item.createTime }}</span>
                <i class="icomoon" :class="'icon-' + (item.device === 1 ? 'monitor' : 'tablet')"></i>
                <span>{{ item.device === 1 ? "PC端" : "移动端" }}</span>
              </p>
            </div>
          </div>
          <!-- 1级回复楼层 -->
          <div class="wd-stair2-level1-body" :ref="'reply' + index">
            <!-- 1级回复容器-->
            <div class="wd-stair-level1-content-wrap">
              <!-- 1级回复内容 -->
              <pre class="wd-stair2-right-wrap-body-level-1" v-html="item.text"></pre>
              <!-- 1级回复信息条 -->
              <p class="wd-stair2-level1-deliver">
                <!-- 踩顶互斥 -->
                <a @click="thumbup(item, 2)">
                  <i
                    class="icomoon"
                    :class="'icon-thumbs-' + (getThumb(item) === 1 ? 'up' : 'up-o')"
                  ></i>
                  <span>{{ item.thumbup||'' }}</span>
                </a>
                <a @click="thumbdown(item, 2)">
                  <!-- 前台不显示反对数，但后台显示 -->
                  <i
                    class="icomoon"
                    :class="'icon-thumbs-' + (getThumb(item) === 2 ? 'down' : 'down-o')"
                  ></i>
                </a>
                <i class="icomoon icon-message-square"></i>
                <span>{{ item.commentCount||'' }}</span>
                <a href="#childReply$" class="wd-stair2-level1-deliver-btn">
                  <label
                    for="childReply"
                    @click="openAndSetChildReply($refs['reply' + index], item, 1, item)"
                  >回复</label>
                </a>
              </p>
            </div>
            <!-- 2级及以上回复 - 在1级回复中显示 -->
            <div class="wd-stair2-level2" v-for="(item_, index_) in item.comments" :key="index_">
              <!-- 2级回复头部楼层 -->
              <div class="wd-stair2-level2-head">
                <div>
                  <img :src="item_.user.avator" alt="用户头像" />
                </div>
                <!-- 2级回复者昵称和等级 -->
                <div>
                  <p>
                    <!-- 2级回复 - 第几层 -->
                    <span
                      class="wd-stair2-level2-index"
                    >#{{index + 2 +"-" +((((item.pageInfo && item.pageInfo.pageNum) || 1) - 1) *GTLv1CommentPageSize +(index_ + 1))}}楼</span>
                    <!-- 2级回复者昵称 -->
                    <span class="wd-stair2-level2-nickname">{{ item_.user.nickname }}</span>
                    <!-- 2级回复者等级 -->
                    <span class="wd-stair2-level2-level">Lv.{{ item_.user.level }}</span>
                    <!-- 不是对1级回复的回复需要显示@对谁回复 -->
                    <span
                      class="wd-stair-right-wrap-head-neck-level-2"
                      v-if="item.uid !== item_.who.id && item_.who.id"
                    >
                      <i class="alt">@</i>
                      {{ item_.who.nickname }}
                    </span>
                  </p>
                  <p>
                    <i class="icomoon icon-clock"></i>
                    <span>{{ item_.createTime }}</span>
                    <i
                      class="icomoon"
                      :class="'icon-' + (item_.device === 1 ? 'monitor' : 'tablet')"
                    ></i>
                    <span>{{ item_.device === 1 ? "PC端" : "移动端" }}</span>
                  </p>
                </div>
              </div>
              <!-- 2级回复正文 -->
              <div class="wd-stair2-level2-body">
                <!-- 2级回复容器-->
                <div class="wd-stair-level2-content-wrap">
                  <!-- 2级回复内容 -->
                  <pre class="wd-stair2-level2-content" v-html="item_.text"></pre>
                  <!-- 2级回复信息条 -->
                  <p class="wd-stair2-level2-deliver">
                    <!-- 踩顶互斥 -->
                    <a @click="thumbup(item_, 2)">
                      <!-- 顶 -->
                      <i
                        class="icomoon"
                        :class="'icon-thumbs-' + (getThumb(item_) === 1 ? 'up' : 'up-o')"
                      ></i>
                      <span>{{ item_.thumbupCount||'' }}</span>
                    </a>
                    <a @click="thumbdown(item_, 2)">
                      <!-- 踩 -->
                      <i
                        class="icomoon"
                        :class="'icon-thumbs-' +(getThumb(item_) === 2 ? 'down' : 'down-o')"
                      ></i>
                    </a>
                    <a href="#childReply$" class="wd-stair2-level2-deliver-btn">
                      <label
                        for="childReply"
                        @click="openAndSetChildReply($refs['reply' + index], item_, 2, item)"
                      >回复</label>
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <!-- 点击回复，插入对1级或2级及以上回复的回复组件 -->
            <!-- 2级回复 点击查看更多后可能显示分页 -->
            <p
              v-if="item.commentCount > GTLv1CommentCount && !item.changeToPaging"
              class="wd-stair2-view-more-level-2"
            >
              共
              <span class="comment-count">{{ item.commentCount }}</span>条回复,
              <a href="javascript:void 0" @click="pagingQuery(item)">查看更多</a>
            </p>
            <!-- 需要1级回复设置一个响应式属性来展示分页条 -->
            <PageBarComponent
              class="page-bar"
              v-show="item.pageInfo && item.pageInfo.pages > 1"
              :pageInfo="item.pageInfo"
              @toPage="toPage(item, $event)"
            />
          </div>
        </div>
        <!-- 1级回复 每次看10条 -->
        <p v-if="isMoreLv1Comment" class="wd-view-more" @click="seeMore">查看更多</p>
      </div>

      <!-- 对1级或2级及以上的回复组件 -->
      <client-only>
        <ReplyComponent
          class="seconde-reply"
          @submit="submit(replyObj1, 1)"
          v-model="replyObj1.text"
          :spread="false"
          :showEmoji="true"
          :id="'childReply'"
          :disabled="!curUser"
          :placeholder="replyObj1.placeholder"
          :anchorPoint="{ name: 'childReply$', top: '-12rem' }"
          ref="childReply"
          v-show="showChildReply"
        />
      </client-only>

      <!-- 内容部分 -->
    </div>
    <!-- 侧边栏组件 -->
    <SidebarComponent :bottom="isMoreLv1Comment?'4rem':'0.5rem'">
      <!-- 活跃用户 -->
        <div class="wd-sidebar-ctn" id="circle-active-user">
          <h3 class="wd-sidebar-ctn-title">最近活跃</h3>
          <div class="wd-sidebar-ctn-user-list">
            <ul class>
              <li v-for="(v, i) in activeUsers" :key="i" class="wd-user-img-square">
                <router-link :to="'/user?id='+v.id">
                  <img :src="v.avator" alt="用户头像" />
                  <p class="wd-user-img-partner" v-if="v.partner">
                    <i class="icomoon icon-star"></i>
                  </p>
                  <p
                    class="wd-user-img-square-honor"
                    v-if="v.roleNames&&v.roleNames.indexOf('vip')>-1"
                  >{{v.roleNames|vip}}</p>
                  <p
                    class="wd-user-img-square-nickname"
                    :title="v.nickname"
                  >{{v.nickname|strCut(6)}}</p>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- 问云推荐 -->
        <div class="wd-sidebar-ctn">
          <h3 class="wd-sidebar-ctn-title">问云推荐</h3>
          <div class="wd-sidebar-recommend-list">
            <ul>
              <li v-for="(v, i) in recommendTopicContents" :key="i">
                <a @click="toCurrentPage($event)" :href="'/qa/detail?id='+v.id+'&pid='+v.pid">
                  <p class="wd-sidebar-recommend-cover">
                    <!-- 内容封面 -->
                    <img v-if="v.cover" :src="v.cover" alt="内容封面" />
                    <span class="img" v-once v-else v-html="getDefaultImg()"></span>
                  </p>
                  <div class="wd-sidebar-recommend-ctn">
                    <!-- 内容标题 -->
                    <p class="wd-sidebar-recommend-ctn-title">{{v.title}}</p>
                    <!-- 内容简介 -->
                    <p class="wd-sidebar-recommend-ctn-introduce">{{v.introduce}}</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
    </SidebarComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
