<template>
  <!-- 等swiper初始化完毕后设置可见为隐藏，避免初始化过程中意想不到的样式突变 -->
  <!-- 切换方式为cube时，会无视响应式 -->
  <div
    :style="{visibility: (options&&options.effect==='cube'||inited)?'visible':'hidden'}"
    class="swiper-container"
    @mouseover="showBtn=true"
    @mouseout="showBtn=false"
    ref="swiper-box"
  >
    <slot>
      <ul class="swiper-wrapper">
        <li class="swiper-slide" v-for="(item, index) in imgList" :key="index">
          <a :href="item.href">
            <img @click="$emit('vote', item)" :src="item.url" alt />
          </a>
        </li>
      </ul>
    </slot>

    <!-- 不能用v-if, swiper会根据类名找，所以一开始必须存在 -->
    <div v-show="realImgLength>1">
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>
      <!-- 如果需要导航按钮 -->
      <div v-show="showBtn" class="swiper-button-prev"></div>
      <div v-show="showBtn" class="swiper-button-next"></div>
      <!-- 如果需要滚动条 -->
      <!-- <div class="swiper-scrollbar"></div> -->
    </div>
  </div>
</template>
<script lang="ts" src="./carousel.ts"></script>
