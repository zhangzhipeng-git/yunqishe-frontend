/* * Filename: d:\frontend\vue\nuxt-ssr\pages\circle\detail\_id.vue * Path:
d:\frontend\vue\nuxt-ssr * Created Date: Saturday, December 7th 2019, 8:24:08 pm
* Author: zzp-dog * 帖子详情 * Copyright (c) 2019 Your Company */
<template>
  <div id="id-ui-circle-detail">
    <!-- 帖子头部导航条 -->
    <div class="wd-nav-bar">
      <router-link to="/circle">论坛</router-link>
      <i class="icomoon icon-chevron-right"></i>
      <a @click="$router.push('/circle/content')">{{ topic&&topic.name }}</a>
      <i class="icomoon icon-chevron-right"></i>
      <!-- 刷新 -->
      <a @click="$router.go(0)">{{ invitation.title }}</a>
    </div>
    <!-- 帖子作者信息 -->
    <div class="wd-content-head">
      <div class="wd-content-head-left">
        <img :src="topic.cover" alt="板块封面" />
      </div>
      <div class="wd-content-head-right">
        <p class="wd-content-head-right-up">
          <span class="wd-content-name">{{ topic&&topic.name }}</span>
          <span class="wd-content-concern" @click="collect(topic)">
            <template v-if="getConcern(topic) === 1">
              <i class="icon-check"></i> 已关注
            </template>
            <template v-else>
              <i class="icon-plus"></i> 关注
            </template>
          </span>
          <span class="wd-content-info">
            &nbsp;发帖
            <span class="wd-number-red">{{ topic.contentCount||'' }}</span>
            &nbsp;关注
            <span class="wd-number-red">{{ topic.concernCount||'' }}</span>
          </span>
        </p>
        <p class="wd-to-you">{{ topic.description }}</p>
      </div>
    </div>
    <div>
      <!-- 左侧 -->
      <div class="wd-main-left">
        <!-- 帖子内容 -->
        <div class="wd-stair-level-0">
          <!-- 楼主 -->
          <div class="wd-stair-left-level-0 ui-first-stair">
            <p>
              <img :src="user.avator" alt="用户头像" />
            </p>
            <p class="wd-stair-neck">{{ user.nickname }}</p>
            <!-- vip或svip，额外标识 -->
            <p v-if="vip.identity" class="wd-user-vip">{{ vip.identity }}</p>
            <!-- 用户角色名 -->
            <p v-if="vip&&vip.name" class="wd-user-description">{{ vip&&vip.name }}</p>
            <!-- 用户称号(黑铁-最强王者) -->
            <p v-if="user.designation" class="wd-user-designation">{{ user.designation }}</p>
            <!-- 神秘标识 -->
            <p v-if="user.extraname" class="wd-user-extranmae">{{ invitation.user.extraname }}</p>
            <!-- 用户等级 -->
            <p class="wd-user-level">Lv.{{ user.level }}</p>
          </div>
          <!-- 正文 -->
          <div class="wd-stair-right-level-0">
            <p v-html="cleanVHtml(invitation.text)"></p>
            <!-- 发表的相关信息 -->
            <p class="wd-stair-right-deliver-level-0">
              <span class="wd-stair-right-tag-level-0">#1楼</span>
              <i class="icomoon icon-map-pin"></i>
              <span>{{ invitation.address }}</span>
              <i class="icomoon icon-clock"></i>
              <span>{{ invitation.createTime }}</span>
              <i
                class="icomoon"
                :class="
                'icon-' + (invitation.device === 1 ? 'monitor' : 'tablet')
              "
              ></i>
              <span>{{ invitation.device === 1 ? "PC端" : "移动端" }}</span>
              <i class="icomoon icon-eye"></i>
              <span>{{ invitation.viewCount||'' }}</span>
              <!-- 收藏 -->
              <a @click="collect(invitation)">
                <i class="icomoon" :class="'icon-' + (getConcern(invitation) ? 'star' : 'star-o')"></i>
                <span>{{ invitation.concernCount||'' }}</span>
              </a>
              <!-- 点赞 -->
              <a @click="thumbup(invitation, 1)">
                <i
                  class="icomoon"
                  :class="
                  'icon-thumbs-' + (getThumb(invitation) === 1 ? 'up' : 'up-o')
                "
                ></i>
                <span>{{ invitation.thumbupCount||'' }}</span>
              </a>
              <!-- 1级回复按钮 -->
              <a href="#topReply$" class="wd-stair-right-reply-btn-level-0">
                <label for="topReply" @click="setTopReply(invitation)">回复</label>
              </a>
            </p>
          </div>
        </div>
        <!-- 1级回复 -->
        <div class="ui-reply">
          <div class="ui-reply-img">
            <img :src="user.avator" :alt="!$store.state.user ? '未登录' : '用户头像'" />
          </div>
          <div class="ui-reply-wrap">
            <ReplyComponent
              v-model="replyObj0.text"
              @submit="submit(replyObj0, 0)"
              @focus="setTopReply(invitation)"
              :id="'topReply'"
              :showEmoji="true"
              :placeholder="replyObj0.placeholder"
              :disabled="!curUser"
              :anchorPoint="{ name: 'topReply$', top: '-6rem' }"
            />
          </div>
        </div>
        <!-- 帖子1级回复 -->
        <div class="wd-stair-level-1" v-for="(item, index) in topReplys" :key="index">
          <!-- 1级回复楼层左侧 -->
          <div class="wd-stair-left-level-1">
            <p>
              <img :src="item.user.avator" alt="用户头像" />
            </p>
          </div>
          <!-- 1级回复楼层右侧 -->
          <div class="wd-stair-right-level-1" :ref="'reply' + index">
            <!-- 1级回复容器-->
            <div class="wd-stair-right-wrap-level-1">
              <!-- 1级回复者昵称和等级 -->
              <h4 class="wd-stair-right-wrap-head-level-1">
                <!-- 1级回复 - 第几层 -->
                <span class="wd-stair-right-wrap-head-tag-level-1">#{{ index + 2 }}楼</span>
                <!-- 1级回复者昵称 -->
                <span class="wd-stair-right-wrap-head-neck-level-1">
                  {{
                  item.user.nickname
                  }}
                </span>
                <!-- 1级回复者等级 -->
                <span class="wd-stair-right-wrap-head-level-level-1">Lv.{{ item.user.level }}</span>
              </h4>
              <!-- 1级回复内容 -->
              <pre class="wd-stair-right-wrap-body-level-1" v-html="item.text"></pre>
              <!-- 1级回复信息条 -->
              <p class="wd-stair-right-wrap-deliver-level-1">
                <i class="icomoon icon-clock"></i>
                <span>{{ item.createTime }}</span>
                <i class="icomoon" :class="'icon-' + (item.device === 1 ? 'monitor' : 'tablet')"></i>
                <span>{{ item.device === 1 ? "PC端" : "移动端" }}</span>
                <!-- 踩顶互斥 -->
                <a @click="thumbup(item, 2)">
                  <i
                    class="icomoon"
                    :class="
                    'icon-thumbs-' + (getThumb(item) === 1 ? 'up' : 'up-o')
                  "
                  ></i>
                  <span>{{ item.thumbupCount||'' }}</span>
                </a>
                <a @click="thumbdown(item, 2)">
                  <!-- 前台不显示反对数，但后台显示 -->
                  <i
                    class="icomoon"
                    :class="
                    'icon-thumbs-' + (getThumb(item) === 2 ? 'down' : 'down-o')
                  "
                  ></i>
                </a>
                <i class="icomoon icon-message-square"></i>
                <span>{{ item.commentCount ||''}}</span>
                <a href="#childReply$" class="wd-stair-right-wrap-deliver-btn-level-1">
                  <label
                    for="childReply"
                    @click="openAndSetChildReply($refs['reply' + index], item, 1, item)"
                  >回复</label>
                </a>
              </p>
            </div>
            <!-- 2级及以上回复 - 在1级回复中显示 -->
            <div class="wd-stair-level-2" v-for="(item_, index_) in item.comments" :key="index_">
              <!-- 2级回复左侧楼层 -->
              <div class="wd-stair-left-level-2">
                <p>
                  <img :src="item_.user.avator" alt="用户头像" />
                </p>
              </div>
              <!-- 2级回复正文 -->
              <div class="wd-stair-right-level-2">
                <!-- 2级回复容器-->
                <div class="wd-stair-right-wrap-level-2">
                  <!-- 2级回复者昵称和等级 -->
                  <h4 class="wd-stair-right-wrap-head-level-2">
                    <!-- 2级回复第几层，没点击查看更多，item是没有响应式属性pageInfo的 -->
                    <span class="wd-stair-right-wrap-head-tag-level-2">
                      #{{
                      index +
                      2 +
                      "-" +
                      ((((item.pageInfo && item.pageInfo.pageNum) || 1) - 1) *
                      GTLv1CommentPageSize +
                      (index_ + 1))
                      }}楼
                    </span>
                    <!-- 2级回复者昵称 -->
                    <span class="wd-stair-right-wrap-head-neck-level-2">
                      {{
                      item_.user.nickname
                      }}
                    </span>
                    <!-- 2级回复者等级 -->
                    <span class="wd-stair-right-wrap-head-level-level-2">Lv.{{ item_.user.level }}</span>
                    <!-- 不是对1级回复的回复需要显示@对谁回复 -->
                    <span
                      class="wd-stair-right-wrap-head-neck-level-2"
                      v-if="item.uid !== item_.who.id"
                    >
                      <i class="alt">@</i>
                      {{ item_.who.nickname }}
                    </span>
                  </h4>
                  <!-- 2级回复内容 -->
                  <pre class="wd-stair-right-wrap-body-level-2" v-html="item_.text"></pre>
                  <!-- 2级回复信息条 -->
                  <p class="wd-stair-right-wrap-deliver-level-2">
                    <i class="icomoon icon-clock"></i>
                    <span>{{ item_.createTime }}</span>
                    <i
                      class="icomoon"
                      :class="
                      'icon-' + (item_.device === 1 ? 'monitor' : 'tablet')
                    "
                    ></i>
                    <span>{{ item_.device === 1 ? "PC端" : "移动端" }}</span>
                    <!-- 踩顶互斥 -->
                    <a @click="thumbup(item_, 2)">
                      <!-- 顶 -->
                      <i
                        class="icomoon"
                        :class="
                        'icon-thumbs-' + (getThumb(item_) === 1 ? 'up' : 'up-o')
                      "
                      ></i>
                      <span>{{ item_.thumbupCount||'' }}</span>
                    </a>
                    <a @click="thumbdown(item_, 2)">
                      <!-- 踩 -->
                      <i
                        class="icomoon"
                        :class="
                        'icon-thumbs-' +
                          (getThumb(item_) === 2 ? 'down' : 'down-o')
                      "
                      ></i>
                    </a>
                    <!-- item_.id=item.id，这里让2级回复的id都设为1级回复的id，使2级以上回复成为1级回复的直接子回复 -->
                    <a href="#childReply$" class="wd-stair-right-wrap-deliver-btn-level-2">
                      <label
                        for="childReply"
                        @click="
                        (item_.id = item.id),
                          openAndSetChildReply($refs['reply' + index], item_, 2, item)
                      "
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
              class="wd-view-more-leve-2"
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
        <p class="wd-view-more" @click="seeMore">{{!noMore?'查看更多':'暂无更多~'}}</p>
      </div>

      <!-- 对1级或2级及以上的回复组件 -->
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

      <!-- 右侧 -->
      <!-- 侧边栏组件 投影内容的样式会同时加上父子组件的样式标识-->
      <SidebarComponent :threshold="'-4rem'" class="wd-main-right">
        <!-- 最近浏览 -->
        <div class="wd-sidebar-ctn" id="circle-active-user">
          <h3 class="wd-sidebar-ctn-title">最近活跃</h3>
          <div class="wd-sidebar-ctn-user-list">
            <ul class>
              <li
                v-for="(v, i) in activeUsers"
                :key="i"
                class="wd-user-img-square"
                @click="goUserCenter(v)"
              >
                <img :src="v.avator" alt="用户头像" />
                <p class="wd-user-img-partner" v-if="v.partner">
                  <i class="icomoon icon-star"></i>
                </p>
                <p
                  class="wd-user-img-square-honor"
                  v-if="v.roleNames&&v.roleNames.indexOf('vip')>-1"
                >{{v.roleNames|vip}}</p>
                <p class="wd-user-img-square-nickname" :title="v.nickname">{{v.nickname|strCut(6)}}</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 帖子推荐 -->
        <div class="wd-sidebar-ctn">
          <h3 class="wd-sidebar-ctn-title">帖子推荐</h3>
          <div class="wd-sidebar-recommend-list">
            <ul>
              <li v-for="(v, i) in recommendInvitations" :key="i" @click="goInvitation(v)">
                <a href="javascript:void 0">
                  <p class="wd-sidebar-recommend-cover">
                    <!-- 内容封面 -->
                    <img :src="v.cover" alt="内容封面" />
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
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
