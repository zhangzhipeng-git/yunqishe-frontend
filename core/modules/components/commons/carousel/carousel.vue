<template>
  <!-- 等swiper初始化完毕后设置高度为100%，避免初始化过程中意想不到的样式突变 -->
  <div
    class="swiper-container"
    :style="{height:inited?'100%':'0'}"
    @mouseover="showBtn=true"
    @mouseout="showBtn=false"
  >
    <ul class="swiper-wrapper">
      <li class="swiper-slide" v-for="(item, index) in imgList" :key="index">
        <a :href="item.href">
          <img @click="$emit('vote', item)" :src="item.url" alt />
        </a>
      </li>
    </ul>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div v-show="showBtn" class="swiper-button-prev"></div>
    <div v-show="showBtn" class="swiper-button-next"></div>

    <!-- 如果需要滚动条 -->
    <!-- <div class="swiper-scrollbar"></div> -->
  </div>
</template>
<script lang="ts" src="./carousel.ts"></script>
