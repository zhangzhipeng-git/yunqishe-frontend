<template>
  <div class="wd-carousel" ref="container">
    <!-- 左按钮 -->
    <div class="wd-carousel-left" @click="toPre">
      <a>
        <i class="icomoon icon-chevron-left"></i>
      </a>
    </div>
    <!-- 图片列表 -->
    <!-- 渐变式 -->
    <ul
      v-if="type==='transition'"
      class="wd-carousel-imglist"
      ref="imgList"
      :style="{width: '100%'}"
    >
      <li v-for="(item, index) in imgList" :key="index">
        <img
          alt
          :src="item"
          @click="click(index)"
          :style="{
            height: parentHeight + 'px',
            opacity: index===cindex? '1' : '0',
            transition: 'opacity ' + transTime/1000 + 's',
            width: index===cindex? parentWidth + 'px' : '0'
          }"
        />
      </li>
    </ul>
    <!-- 位移式 -->
    <ul
      v-else
      class="wd-carousel-imglist"
      ref="imgList"
      :style="{
        width: parentWidth*imgList.length + 'px', 
        transition: 'transform ' + transTime/1000 + 's',
        transform: 'translate(-' + (cindex)*parentWidth + 'px)',
      }"
    >
      <li v-for="(item, index) in imgList" :key="index" :style="{width: parentWidth + 'px'}">
        <img :src="item" alt :style="{height: parentHeight + 'px'}" @click="click(index)" />
      </li>
    </ul>
    <!-- 底部序号 -->
    <ul class="wd-carousel-dot">
      <li
        v-for="n in imgList.length"
        :key="n"
        :id="cindex===n-1? 'wd-carousel-dot-active' : ''"
        @mouseover="stop(n-1)"
        @mouseout="start"
      ></li>
    </ul>
    <!-- 右按钮 -->
    <div class="wd-carousel-right" @click="toNex">
      <a>
        <i class="icomoon icon-chevron-right"></i>
      </a>
    </div>
  </div>
</template>
<script lang="ts" src="./carousel.ts"></script>
