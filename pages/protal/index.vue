/*
 * Project: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr
 * File: d:\ZX_WORK\FRONTEND\vue\nuxt-ssr\pages\protal\index.vue
 * Created Date: Sunday, December 15th 2019, 10:41:15 pm
 * Author: 张志鹏
 * Contact: 1029512956@qq.com
 * Description: 云启社首页
 * Last Modified: Thursday July 9th 2020 9:22:32 pm
 * Modified By: 张志鹏
 * Copyright (c) 2020 ZXWORK
 */
<template>
  <div id="id-ui-protal">
    <!-- 轮播+排行 -->
    <div class="ui-portal-header">
      <!-- 轮播图 -->
      <div class="ui-protal-carousel">
        <CarouselComponent :imgList="imgList" @vote="voteImg($event)" />
      </div>
    </div>
    <!-- 广告1 -->
    <div class="ui-protal-ad">
      <img src="@/assets/images/ad-test/ad1.jpg" alt="请无视我哦，我只是一条小广告..." />
    </div>
    <!-- 列表里没有值时就不显示，以下列表处理方式相同 -->
    <!-- 站内公告 -->
    <div class="ui-tool-bar" v-if="topHasData">
      <h2>置顶内容</h2>
    </div>
    <div class="ui-top-items">
      <ul>
        <li v-for="(item, i) in topList" :key="i">
          <a href="javascript:void 0" class="ui-top-wrap">
            <img :src="item.cover" alt="封面" />
            <span class="ui-top-info">
              <span class="ui-top-title">{{item.title}}</span>
              <span class="ui-top-introduce">{{item.introduce}}</span>
              <span class="ui-info-bar">
                <i class="icomoon icon-commenting-o"></i>
                &nbsp;{{item.commentCount}}
                <i class="icomoon icon-eye"></i>
                &nbsp;{{item.viewCount}}
              </span>
            </span>
            <!-- 序号 -->
            <span class="ui-top-sequence">{{i}}</span>
          </a>
        </li>
      </ul>
      <!-- 查出来满了一页才显示更多按钮，下面的列表处理方式相同 -->
      <p class="ui-switch-pannel" v-if="isMoreTop">
        <a href="javascript:void 0" @click="seeMoreTop">
          更多
          <i class="icommon icon-chevron-down"></i>
        </a>
      </p>
    </div>
    <!-- 近期内容 -->
    <div class="ui-tool-bar" v-if="recentHasData">
      <h2>近期内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
      <ul>
        <li v-for="(item, i) in recentList" :key="i" class="ui-recommends-item">
          <!-- 封面 -->
          <div class="ui-item-cover">
            <a href="javasript:void 0">
              <img :src="item.cover" alt="封面" />
            </a>
          </div>
          <!-- 作品信息 -->
          <div class="ui-item-info">
            <!-- 作品标题-->
            <p class="ui-item-title">
              <a href="Javascript:void 0">{{item.title | strCut(20)}}</a>
            </p>
            <!-- 作品摘要-->
            <p class="ui-item-abstract">
              <a href="Javascript:void 0" :title="item.introduce">{{item.introduce | strCut(20)}}</a>
            </p>
            <!-- 发表时间和浏览次数 -->
            <p class="ui-work-info">
              <i class="icomoon icon-clock"></i>
              <span>{{item.createTime}}</span>
              <i class="icomoon icon-eye"></i>
              <span>{{item.viewCount}}</span>
            </p>
          </div>
        </li>
      </ul>
      <p class="ui-switch-pannel" v-if="isMoreRecent">
        <a href="javascript:void 0" @click="seeMoreRecent">
          更多
          <i class="icommon icon-chevron-down"></i>
        </a>
      </p>
    </div>
    <!-- 热点内容 -->
    <div class="ui-tool-bar" v-if="hotHasData">
      <h2>热点内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
      <ul>
        <li v-for="(item, n) in hotList" :key="n" class="ui-recommends-item">
          <!-- 封面 -->
          <div class="ui-item-cover">
            <a href="javasript:void 0">
              <img :src="item.cover" alt="封面" />
            </a>
          </div>
          <!-- 作品信息 -->
          <div class="ui-item-info">
            <!-- 作品标题-->
            <p class="ui-item-title">
              <a href="Javascript:void 0">{{item.title | strCut(20)}}</a>
            </p>
            <!-- 作品摘要-->
            <p class="ui-item-abstract">
              <a href="Javascript:void 0" :title="item.introduce">{{item.introduce | strCut(20)}}</a>
            </p>
            <!-- 发表时间和浏览次数 -->
            <p class="ui-work-info">
              <i class="icomoon icon-clock"></i>
              <span>{{item.createTime}}</span>
              <i class="icomoon icon-eye"></i>
              <span>{{item.viewCount}}</span>
            </p>
          </div>
        </li>
      </ul>
      <p class="ui-switch-pannel" v-if="isMoreHot">
        <a href="javascript:void 0" @click="seeMoreHot">
          更多
          <i class="icommon icon-chevron-down"></i>
        </a>
      </p>
    </div>
    <!-- 随机内容 -->
    <div class="ui-tool-bar" v-if="randomHasData">
      <h2>随机内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
      <ul>
        <li v-for="(item, n) in randomList" :key="n" class="ui-recommends-item">
          <!-- 封面 -->
          <div class="ui-item-cover">
            <a href="javasript:void 0">
              <img :src="item.cover" alt="封面" />
            </a>
          </div>
          <!-- 作品信息 -->
          <div class="ui-item-info">
            <!-- 作品标题-->
            <p class="ui-item-title">
              <a href="Javascript:void 0">{{item.title | strCut(20)}}</a>
            </p>
            <!-- 作品摘要-->
            <p class="ui-item-abstract">
              <a href="Javascript:void 0" :title="item.introduce">{{item.introduce | strCut(20)}}</a>
            </p>
            <!-- 发表时间和浏览次数 -->
            <p class="ui-work-info">
              <i class="icomoon icon-clock"></i>
              <span>{{item.createTime}}</span>
              <i class="icomoon icon-eye"></i>
              <span>{{item.viewCount}}</span>
            </p>
          </div>
        </li>
      </ul>
      <p class="ui-switch-pannel" v-if="isMoreRandom">
        <a href="javascript:void 0" @click="seeMoreRandom">
          更多
          <i class="icommon icon-chevron-down"></i>
        </a>
      </p>
    </div>
    <!-- 广告2 -->
    <div class="ui-protal-ad">
      <img src="@/assets/images/ad-test/ad2.jpg" alt="请无视我哦，我只是一条小广告..." />
    </div>
    <!-- 本站用户 -->
    <div class="ui-tool-bar" v-if="userHasData">
      <h2>本站用户</h2>
      <!-- 按条件过滤 -->
      <div class="ui-btn-filter">
        <SelectComponent class="ui-select-sex" v-model="sex" :list="sexList" :force="true" @change="changeSex"></SelectComponent>
        <a
          v-for="(item,i) in typeList"
          :key="i"
          href="javascript:void 0"
          @click="selectType(item.key)"
          :class="{active: type === item.key}"
        >{{item.value}}</a>
      </div>
    </div>
    <!-- 本站用户 -->
    <div class="ui-up-items">
      <ul ref="myUp">
        <li class="ui-up-item" v-for="(item, n) in userList" :key="n">
          <a href>
            <!-- 性别图标-->
            <i
              class="icomoon"
              :class="'icon-' + (item.sex===2 ? 'girl': item.sex === 1 ? 'boy' : 'unknown')"
            ></i>
            <img :src="item.avator" alt="用户头像" />
            <p class="ui-up-info">
              <!-- up呢称 -->
              <span>{{item.nickname}}</span>
            </p>
          </a>
        </li>
      </ul>
      <p class="ui-switch-pannel" v-if="isMoreUser">
        <a href="javascript:void 0" @click="seeMoreUser">
          更多
          <i class="icommon icon-chevron-down"></i>
        </a>
      </p>
    </div>
    <!-- 列表（除轮播图列表外）都为空时 -->
    <NoResultComponent
      v-if="!topHasData&&!recentHasData&&!hotHasData&&!randomHasData&&!userHasData"
    />
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>