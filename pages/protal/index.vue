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
        <CarouselComponent :transTime="500" :interval="5000" :imgList="imgList" :type="'translate'" @vote="log" />
      </div>
      <!-- 右侧排行 -->
      <div class="ui-protal-header-right">
        <ul>
          <!-- 排行item -->
          <li
            class="ui-protal-header-right-item"
            v-for="n in 4"
            :key="n"
            @mouseover="showRankUpInfo(n)"
            @mouseout="hideRankUpInfo"
            :class="{'wd-no-margin-right' : n%2===0 , 'wd-no-margin-bottom':n > ((4/2)-1)*2 }"
          >
            <!-- 排名等级 -->
            <span class="ui-rank-level" :style="{backgroundColor: rankColors[n-1]}">{{n}}</span>
            <img src="@/assets/images/carousel-test/eval2.jpg" alt />
            <!-- 底部遮罩 -->
            <div class="ui-item-bottom-mask"></div>
            <!-- 摘要 -->
            <div v-show="n!==rankIndex" class="ui-item-abstract">樱满集的王者觉醒📌</div>
            <!-- 作品信息（图片底部） -->
            <div class="ui-item-bottom" :class="n===rankIndex?'ui-2rem-height': 'ui-no-height'">
              <!-- 作者小头像 -->
              <img src="@/assets/images/default-avator.png" alt />
              <!-- 作品信息 -->
              <div class="ui-item-info">
                  <!-- 作者名称和等级 -->
                <p class="ui-author-info">
                  <span class>会飞的松鼠</span>[<span>武林萌主</span>]
                </p>
                <!-- 发表时间和浏览次数 -->
                <p class="ui-work-info">
                  <i class="icomoon icon-clock"></i>
                  <span>2010-08-07</span>
                  <i class="icomoon icon-eye"></i>
                  <span>556</span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 广告1 -->
    <div class="ui-protal-ad">
      <img src="@/assets/images/ad-test/ad1.jpg" alt="请无视我哦，我只是一条小广告..." />
    </div>
    <!-- 推广 -->
    <div class="ui-tool-bar">
      <h2>推广内容</h2>
      <!-- 更多 -->
      <div class="ui-btn-more">
        <a href="javascript:void 0">更多 》</a>
      </div>
    </div>
    <!-- 内容列表 -->
    <div class="ui-recommend-items">
        <ul>
            <li v-for="n in 10" :key="n" class="ui-recommends-item"
                @mouseover="showRecommendMask(n)"
                :class="{'wd-no-margin-right' : n%5===0 , 'wd-no-margin-bottom':n > ((10/5)-1)*5 }"
            >
                <!-- 封面 -->
                <img src="@/assets/images/carousel-test/tantailang.jpg" alt="">
                <!-- 作品信息（图片底部） -->
                <div class="ui-item-bottom">
                    <!-- 作品摘要 -->
                    <p class="ui-item-abstract">炭太郎变强了</p>
                    <!-- 发表时间和浏览次数 -->
                    <p class="ui-work-info">
                        <i class="icomoon icon-clock"></i><span>2019-07-09</span>
                        <i class="icomoon icon-eye"></i><span>222</span>
                    </p>
                </div>
                <!-- 作品鼠标悬浮时遮罩 -->
                <div v-if="n===recommendIndex" class="ui-recommend-item-mask"></div>
                <div v-if="n===recommendIndex" class="ui-recommend-item-tip"
                   @mouseleave="hideRecommendMask"
                >
                    #<span>阅读</span>
                </div>
            </li>
        </ul>
    </div>
     <!-- 广告2 -->
    <div class="ui-protal-ad">
      <img src="@/assets/images/ad-test/ad2.jpg" alt="请无视我哦，我只是一条小广告..." />
    </div>
    <!-- 上榜UP -->
    <div class="ui-tool-bar">
        <h2>上榜UP</h2>
        <!-- 更多，如何上榜 -->
        <div class="ui-btn-more">
            <a href="javascript:void 0">更多 》</a>
        </div>
    </div>
    <!-- 上榜up -->
    <div class="ui-up-items">
        <ul ref="myUp">
            <li class="ui-up-item" v-for="n in 16" :key="n"
              @mouseout="hideUpInfo"
              @mouseover="showUpInfo($event,n)"
              :class="{'wd-no-margin-right' : n%8===0 , 'wd-no-margin-bottom':n > ((16/8)-1)*8 }"
            >
                <!-- 正面 -->
                <div :class="n===upIndex? 'rotateY-180' : ''" class="ui-up-item-front">
                  <img src="@/assets/images/default-avator.png" alt="">
                  <p class="ui-up-info">
                    <!-- 性别图标 和 年龄-->
                    <i class="icomoon" 
                      :class="'icon-' + (0 === 0 ? 'girl': 'boy')"
                    >
                    23
                    </i>
                    <!-- up呢称 -->
                    <span>会飞的松鼠</span>
                  </p>
                </div>
                <!-- 反面 -->
                <div class="ui-up-item-back" :class="n===upIndex? 'rotateY--180' : ''" >
                  <div class="ui-up-item-info-mask"></div>
                  <div class="ui-up-item-info">
                    <p class="ui-up-to-you">to you:</p>
                    <!-- 简介 -->
                    <p class="ui-up-say-to-you">艾伦父亲的身份终于被揭晓了，地下室的秘密慢慢地浮出水面，巨人的历史...</p>
                  </div>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>