<template>
  <div id="id-admin-index">
    <div class="about-user">
      <!-- 在线人数 -->
      <div class="pie user-online" ref="online"></div>
      <!-- 性别比例 -->
      <div class="pie user-sex" ref="sex"></div>
      <!-- 用户年龄 -->
      <div class="pie user-age" ref="age"></div>
      <!-- 用户职业分布 -->
      <div class="pie user-occupation" ref="occupation"></div>
      <!-- 用户vip分布 -->
      <div class="pie user-vip" ref="vip"></div>
      <!-- 热门话题 -->
      <div class="pie user-hot" ref="hot"></div>
    </div>
    <!-- 网站访问量 -->
    <div class="site-visit" ref="visit"></div>
    <!-- 网站收益量 -->
    <div class="site-profit" ref="profit"></div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>
