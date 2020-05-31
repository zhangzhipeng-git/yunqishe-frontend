/*
 * Filename: d:\frontend\vue\nuxt-ssr\components\commons\filter-spread\_filter-spread.scss
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Sunday, December 22nd 2019, 1:30:56 pm
 * Author: zzp-dog
 * 展开式过滤器html
 * Copyright (c) 2019 Your Company
 */

<template>
  <div class="wd-filter-spread">
    <!-- 关注的 -->
    <div class="wd-list-concern">
      <div v-if="isSpread" class="wd-list-tip">
        <h4>我的关注</h4><template v-if="copy_classify.concern && copy_classify.concern.length > 1">拖动调整顺序或移至分类推荐</template>
      </div>
      <ul>
        <!-- emitConcern发射点击的那个关注选项e，用于重新发起请求 -->
        <li
          v-for="(e, i) in copy_classify.concern"
          :key="i"
          :class="i === activeIndex? 'ui-concern-active': ''"
          @mousedown="startSort($event, i)"
        >
          <a
            @click="selectConcern($event,e,i)"
            :style="{cursor: isSpread && i === 0?'not-allowed':'pointer' }"
          >{{e.name}}</a>
        </li>
      </ul>
      <!-- 按钮 -->
      <div class="wd-spread-close" @click="action">
        <a>
          {{isSpread?'收起': '展开'}}
          <i
            class="icomoon icon-chevron-down"
            :class="isSpread? 'ui-rotate-z180' : 'ui-rotate-z0'"
          ></i>
        </a>
      </div>
    </div>
    <!-- 推荐分类面板,取消和确认按钮面板 -->
    <div class="wd-list-pannel" :class="isSpread ? 'ui-height-9rem': 'ui-height-0'">
      <!-- 推荐的 -->
      <div class="wd-list-recommend">
        <div class="wd-list-tip">
          <h4>分类推荐</h4><template v-if="copy_classify.recommend&&copy_classify.recommend.length > 0">点击分类添加至我的关注</template>
        </div>
        <ul>
          <li v-for="(e, i) in copy_classify.recommend" :key="i" @click="addToConcern(e)">
            <a>{{e.name}}</a>
          </li>
          <li
            v-if="!copy_classify.recommend || copy_classify.recommend.length < 1"
            id="filter-list-recommend-more"
          >更多分类敬请期待</li>
        </ul>
      </div>
      <!-- 取消或确认 -->
      <div class="wd-action-choose">
        <button @click="cancel">取消</button>
        <button @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./filter-spread.ts"></script>
