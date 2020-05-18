<template>
  <div id="id-ui-media">
    <!-- 头部视频 -->
    <div class="ui-media-header">
      <VideoComponent :src="src" :options="{autoplay: true}"/>
    </div>
    <div class="ui-class" v-for="(v,i) in lists" :key="i">
      <h1 v-if="v.mediaClasses.length" class="ui-class-title">{{v.name}}</h1>
      <ul>
        <li v-for="(vv,ii) in v.mediaClasses" :key="ii">
          <router-link :to="'/media/detail?id='+vv.id">
            <img :src="vv.cover|defaultImg" alt="视频封面" />
            <div class="ui-mask">
              <p>
                <i class="icommon icon-play"></i>
              </p>
            </div>
          </router-link>
          <p class="ui-media-name">{{vv.name}}</p>
          <p class="ui-media-user">
            <span class="fl">
              <img :src="vv.user&&vv.user.avator" alt="作者头像" />
              {{vv.user&&vv.user.nickname}}
            </span>
            <span class="fr">
              <i class="icommon icon-eye"></i>
              {{vv.viewCount}}
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>