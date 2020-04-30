<template>
  <div id="id-ui-media-detail">
    <!-- 头部媒体 -->
    <div class="ui-media-header">
      <mediaComponent :src="src" @firstPlay="firstPlay($event)">
        <template v-if="privilege.type">
          <div class="ui-privilege">
            <div class="ui-privilege-wrap">
              <p class="ui-privilege-tip">{{privilege.tip}}</p>
              <p class="ui-privilege-btn"><button @click="toGetPrivilege">{{privilege.text}}</button></p>
            </div>
          </div>
        </template>
      </mediaComponent>
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
            <a :class="{ active: activeIndex === i }" href="javascript: void 0"
              >第{{ i + 1 }}集</a
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- 评论 -->
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
