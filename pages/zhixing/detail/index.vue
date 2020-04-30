/*
 * Filename: d:\frontend\vue\nuxt-ssr\pages\learn\doc-detail\_id.vue
 * Path: d:\frontend\vue\nuxt-ssr
 * Created Date: Saturday, December 28th 2019, 5:24:19 pm
 * Author: zzp-dog
 * 文档详情
 * Copyright (c) 2019 Your Company
 */
<template>
  <div id="id-doc-detail">
    <!-- 侧边菜单-->
    <SidebarNavComponent class="ui-menu">
      <SideMenuComponent @navigate="navigate($event)" :trees="trees" :childKey="'docClasses'" />
    </SidebarNavComponent>
    <!-- 主体内容 -->
    <div class="ui-main">
      <div class="wd-nav-bar">
        <router-link to="/zhixing">{{name}}</router-link>
        <template v-if="zname">
          <i class="icomoon icon-chevron-right"></i>
          <a>{{zname }}</a>
        </template>
        <template v-if="jname">
          <i class="icomoon icon-chevron-right"></i>
          <a>{{jname }}</a>
        </template>
      </div>
      <!-- 文档内容 -->
      <div class="ui-doc">
        <div ref="doc" class="ui-doc-content" v-html="vhtml"></div>
        <div class="ui-doc-nav">
          <div class="ui-doc-nav-mask"></div>
          <ul>
            <li
              v-for="(v, i) in hs"
              :key="i"
              :class="{active: activeIndex===v.index}"
              @click="toAnchor(v,$event)"
            >
              <a :class="'doc'+v.name">{{v.text}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>