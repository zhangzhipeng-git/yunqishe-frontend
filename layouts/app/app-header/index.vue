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
      <SearchComponent class="wd-ui-serach-component" v-model="searchText" @click="toSearch" />
      <!-- 用户信息 -->
      <div class="wd-user-info">
        <div>
          <div class="ui-user-detail">
            <a @click="goUserCenter">
              <img :src="img?img:'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='" alt="头像"/>
            </a>
            <span>
              <a v-if="!hasLogin" @click="login">登录</a>
              <a v-else @click="logout">登出</a>
            </span>
          </div>
          <span>
            <router-link to="#">扫码</router-link>
          </span>
        </div>
      </div>
    </div>
    <!-- 工具列表 -->
    <div class="ui-tool-list">
      <ul>
        <li v-for="(v, i) in [1]" :key="i">
          <a href="javascript: void 0" @click="togglePageSet(i)" :class="{active: showPageSet}">
            <i class="icommon icon-t-shirt"></i>
          </a>
        </li>
      </ul>
    </div>
    <!-- 主题样式设置 -->
    <div class="ui-page-set" :class="showPageSet?'show':'hide'">
      <div class="ui-mask"></div>
      <div class="ui-close" @click="togglePageSet"><i class="icommon icon-chevrons-down"></i></div>
      <!-- 改变页眉和页脚 -->
      <div class="ui-bg">
       <span>头部/底部背景</span><SwitchComponent class="ui-switch" v-model="bg" @click="changeBg($event)" />
      </div>
      <div class="ui-theme">
        <ul>
          <li v-for="(v, i) in [
            {des: '少女粉', clz: 'r'},
            {des: '天空蓝', clz: 'b'},
            {des: '基佬紫', clz: 'p'},
            {des: '护眼绿', clz: 'g'}
          ]" :key="i" @click="chooseTheme(v, i)">
            <a href="javascript: void 0" :class="'ui-'+v.clz + (theme === v.clz?' active':'')">
              <span>{{v.des}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>  
<script lang="ts" src="./index.ts"></script>
  