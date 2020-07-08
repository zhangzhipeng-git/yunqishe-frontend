/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\protal\protal.vue
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Wednesday, December 4th 2019, 10:25:32 pm
 * Author: zzp-dog
 * 门户首页
 * Copyright (c) 2019 Your Company
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
    <!-- 站内公告 -->
    <div class="ui-tool-bar">
      <h2>站内公告</h2>
    </div>
    <div>
      <ul class="ui-site-notice">
      <li v-for="i in 5" :key="i">
        <a href="javascript:void 0" class="ui-notice-wrap">
          <img src="@/assets/images/ad-test/ad1.jpg" alt="">
          <span class="ui-notice-info">
            <span class="ui-notice-title">{{'标题'}}</span>
            <span class="ui-notice-introduce">{{'简介哈哈哈哈'}}</span>
            <span class="ui-info-bar">
              <i class="icomoon icon-commenting-o"></i>&nbsp;202
              <i class="icomoon icon-eye"></i>&nbsp;222
            </span>
          </span>
          <!-- 序号 -->
          <span class="ui-notice-sequence">{{i}}</span>
        </a>
      </li>
    </ul>
    </div>
    <!-- 近期内容 -->
    <div class="ui-tool-bar">
      <h2>近期内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
        <ul>
            <li v-for="n in 24" :key="n" class="ui-recommends-item">
                <!-- 封面 -->
                <div class="ui-item-cover">
                  <a href="javasript:void 0"><img src="@/assets/images/carousel-test/tantailang.jpg" alt=""></a>
                </div>
                <!-- 作品信息 -->
                <div class="ui-item-info">
                    <!-- 作品标题-->
                    <p class="ui-item-title"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 作品摘要-->
                    <p class="ui-item-abstract"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 发表时间和浏览次数 -->
                    <p class="ui-work-info">
                        <i class="icomoon icon-clock"></i><span>2019-07-09</span>
                        <i class="icomoon icon-eye"></i><span>222</span>
                    </p>
                </div>
            </li>
        </ul>
        <p class="ui-switch-pannel"><a href="javascript:void 0">{{isOpen1?'收起':'更多'}}<i class="icommon" :class="'icon-chevron-'+(isOpen1?'up':'down')"></i></a></p>
    </div>
    <!-- 热点内容 -->
    <div class="ui-tool-bar">
      <h2>热点内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
        <ul>
            <li v-for="n in 24" :key="n" class="ui-recommends-item">
                <!-- 封面 -->
                <div class="ui-item-cover">
                  <a href="javasript:void 0"><img src="@/assets/images/carousel-test/tantailang.jpg" alt=""></a>
                </div>
                <!-- 作品信息 -->
                <div class="ui-item-info">
                    <!-- 作品标题-->
                    <p class="ui-item-title"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 作品摘要-->
                    <p class="ui-item-abstract"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 发表时间和浏览次数 -->
                    <p class="ui-work-info">
                        <i class="icomoon icon-clock"></i><span>2019-07-09</span>
                        <i class="icomoon icon-eye"></i><span>222</span>
                    </p>
                </div>
            </li>
        </ul>
        <p class="ui-switch-pannel"><a href="javascript:void 0">{{isOpen1?'收起':'更多'}}<i class="icommon" :class="'icon-chevron-'+(isOpen1?'up':'down')"></i></a></p>
    </div>
    <!-- 随机内容 -->
    <div class="ui-tool-bar">
      <h2>随机内容</h2>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
        <ul>
            <li v-for="n in 24" :key="n" class="ui-recommends-item">
                <!-- 封面 -->
                <div class="ui-item-cover">
                  <a href="javasript:void 0"><img src="@/assets/images/carousel-test/tantailang.jpg" alt=""></a>
                </div>
                <!-- 作品信息 -->
                <div class="ui-item-info">
                    <!-- 作品标题-->
                    <p class="ui-item-title"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 作品摘要-->
                    <p class="ui-item-abstract"><a href="Javascript:void 0">{{'炭太郎变强了2顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶' | strCut(20)}}</a></p>
                    <!-- 发表时间和浏览次数 -->
                    <p class="ui-work-info">
                        <i class="icomoon icon-clock"></i><span>2019-07-09</span>
                        <i class="icomoon icon-eye"></i><span>222</span>
                    </p>
                </div>
            </li>
        </ul>
        <p class="ui-switch-pannel"><a href="javascript:void 0">{{isOpen1?'收起':'更多'}}<i class="icommon" :class="'icon-chevron-'+(isOpen1?'up':'down')"></i></a></p>
    </div>
     <!-- 广告2 -->
    <div class="ui-protal-ad">
      <img src="@/assets/images/ad-test/ad2.jpg" alt="请无视我哦，我只是一条小广告..." />
    </div>
    <!-- 本站用户 -->
    <div class="ui-tool-bar">
        <h2>本站用户</h2>
        <!-- 按条件过滤 -->
        <div class="ui-btn-filter">
          <SelectComponent class="ui-select-sex" v-model="sex" :list="sexList" :force="true"></SelectComponent>
          <a href="javascript:void 0">活跃</a>
          <a href="javascript:void 0">新人</a>        
          <a href="javascript:void 0">随机</a>
        </div>
    </div>
    <!-- 本站用户 -->
    <div class="ui-up-items">
        <ul ref="myUp">
            <li class="ui-up-item" v-for="n in 32" :key="n"
              @mouseout="hideUpInfo"
              @mouseover="showUpInfo($event,n)"
              :class="{'wd-no-margin-right' : n%8===0 , 'wd-no-margin-bottom':n > ((16/8)-1)*8 }"
            >
              <!-- 性别图标-->
              <i class="icomoon" :class="'icon-' + (Math.random() > .5 ? 'girl': 'boy')"></i>
              <img src="@/assets/images/default-avator.png" alt="">
              <p class="ui-up-info">
                <!-- up呢称 -->
                <span>会飞的松鼠</span>
              </p>
            </li>
        </ul>
        <p class="ui-switch-pannel"><a href="javascript:void 0">{{isOpen1?'收起':'更多'}}<i class="icommon" :class="'icon-chevron-'+(isOpen1?'up':'down')"></i></a></p>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>