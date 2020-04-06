<template>
  <div id="id-ui-wenyun">
    <div class="wd-main-left">
      <FilterSpreadComponent
        :classify="classify"
        @selectConcern="select($event)"
        @confirm="updateConcern($event)"
      />
      <!-- 内容列表 -->
      <ul class="ui-list">
        <li class="ui-item" v-for="(v, i) in list" :key="i">
          <!-- 标题 -->
          <h3>{{v.title}}</h3>
          <!-- 内容 -->
          <div class="ui-item-conent">
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
          <p class="ui-item-wt-bar">
            <span> <i class="icomoon icon-clock"></i>{{v.createTime}} </span>
            <span> <i class="icomoon icon-star"></i>{{v.concern}} </span>
            <span> <i class="icomoon icon-share"></i>{{v.forward}} </span>
            <span> <i class="icomoon icon-eye"></i>{{v.view}} </span>
            <span> <i class="icomoon icon-message-circle"></i>{{v.commentCount}} </span>
            <button @click="toDetail(v)">查看更多</button>
          </p>
        </li>
      </ul>
      <p class="wd-view-more" @click="seeMore">
        {{!noMore?'查看更多':'暂无更多~'}}
      </p>
    </div>
    <!-- 右侧 -->
    <!-- 侧边栏组件 投影无需样式穿透 - 因为投影内容的样式会同时加上父子组件的样式标识-->
    <SidebarComponent :threshold="'-4rem'">
     <!-- 最近浏览 -->
        <div class="wd-sidebar-ctn" id="forum-active-user">
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
                <p class="wd-user-img-square-vip" v-if="v.partner">
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
        <!-- 问云推荐 -->
        <div class="wd-sidebar-ctn">
          <h3 class="wd-sidebar-ctn-title">问云推荐</h3>
          <div class="wd-sidebar-recommend-list">
            <ul>
              <li v-for="(v, i) in recommendTopicContents" :key="i" @click="goTopicContent(v)">
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
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
