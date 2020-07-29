<template>
  <div id="id-ui-circle">
    <div class="wd-main-left">
      <FilterSpreadComponent
        :classify="classify"
        @selectConcern="select($event)"
        @confirm="updateConcern($event)"
      />
      <!-- 内容列表 -->
      <NoResultComponent v-if="!topicContents.length"/>
      <ul v-else class="ui-list">
        <li class="ui-item" v-for="(v, i) in topicContents" :key="i">
          <!-- 标题 -->
          <h3>{{v.title}}</h3>
          <!-- 内容 -->
          <div class="ui-item-content">
            <!-- 封面，如果有 -->
            <p v-if="v.cover" class="ui-item-left ui-margin-left-2rem">
              <img :src="v.cover" :alt="v.alt||'内容封面'" />
            </p>
            <!-- 简介，如果没有上述封面，则下边的会自适应左移增加左外间距并且宽度变为auto-->
            <p
              :class="!v.cover ? 'ui-item-no-img' : ''"
              class="ui-item-right"
            >
              {{v.introduce}}
            </p>
          </div>
          <!-- 信息条 -->
          <p class="ui-item-type-bar">
            <span> <i class="icomoon icon-clock"></i>{{v.createTime}} </span>
            <span> <i class="icomoon icon-star"></i>{{v.concernCount}} </span>
            <span> <i class="icomoon icon-share"></i>{{v.forwardCount}} </span>
            <span> <i class="icomoon icon-eye"></i>{{v.viewCount}} </span>
            <span> <i class="icomoon icon-message-circle"></i>{{v.commentCount}} </span>
            <router-link :to="'/qa/detail?id='+v.id+'&pid='+v.pid">查看更多</router-link>
          </p>
        </li>
      </ul>
      <p v-if="isMoreTopicContent" class="wd-view-more" @click="seeMore">查看更多</p>
    </div>
    <!-- 右侧 -->
    <!-- 侧边栏组件 投影无需样式穿透 - 因为-->
    <SidebarComponent :bottom="isMoreTopicContent?'4rem':'0'" class="wd-main-right">
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
                <router-link :to="'/qa/detail?id='+v.id+'&pid='+v.pid">
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
                </router-link>
              </li>
            </ul>
          </div>
        </div>
    </SidebarComponent>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
