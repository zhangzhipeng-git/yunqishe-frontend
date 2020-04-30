<template>
  <div id="id-app-header">
    <div class="wd-header-bar">
      <!-- 站名 -->
      <div class="wd-site-name">
        <h2>云启社</h2>
      </div>
      <!-- app导航 -->
      <div class="wd-app-root-nav">
        <ul>
          <li>
            <router-link to="/protal">首页</router-link>
          </li>
          <li>
            <router-link to="/circle">圈子</router-link>
          </li>
          <li>
            <router-link to="/qa">问云</router-link>
          </li>
          <li>
            <router-link to="/zhixing">知行</router-link>
          </li>
          <li>
            <router-link to="/media">微媒体</router-link>
          </li>
          <li>
            <router-link to="/rank">排行榜</router-link>
          </li>
        </ul>
      </div>
      <!-- 搜索输入 -->
      <SearchComponent class="wd-ui-serach-component" v-model="searchText" @input="toSearch" />
      <!-- 用户信息 -->
      <div class="wd-user-info">
        <div>
          <div class="ui-user-detail">
            <a @click="goUserCenter">
              <img v-if="false" src alt />
              <img else src="@/assets/images/default-avator.png" alt="默认头像" />
            </a>
            <span>
              <router-link v-if="!hasLogin" to="/login">登录</router-link>
              <a v-else @click="logout">登出</a>
            </span>
          </div>
          <span>
            <router-link to="#">扫码</router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>  
<script lang="ts" src="./index.ts"></script>
  