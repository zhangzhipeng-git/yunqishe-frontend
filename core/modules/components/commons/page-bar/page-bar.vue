<!--
 * @Author: your name
 * @Date: 2020-02-28 15:47:29
 * @LastEditTime: 2020-02-29 14:42:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\commons\page-bar\page-bar.vue
 -->
<template>
  <ul
    class="wd-page-bar"
    v-show="show"
  >
    <!-- 分页详情 -->
    <li class="page-head" v-if="pageInfo$.detail">
      <template v-if="pageInfo$.total">
        <span>总</span>
        <span class="total">{{ pageInfo$.total }}</span>
        <span>条</span>
      </template>
      <span style="padding-left:.5rem"></span>
      <template v-if="pageInfo$.pages">
        <span>总</span>
        <span class="pages">{{ pageInfo$.pages }}</span>
        <span>页</span>
      </template>
    </li>
    <!-- 分页大小 -->
    <li class="page-neck" v-if="pageInfo$.pageSizes && pageInfo$.pageSizes.length">
      <div class="changePageSize" @click="spread = !spread">{{ pageInfo$.pageSize }}/页&nbsp;<i class="icomoon icon-caret-up"></i></div>
      <ul v-show="spread" :style="{ top: -(pageInfo$.pageSizes.length * 1.5) + 'rem' }">
        <li v-for="(v, i) in pageSizes" :key="i" @click="changePageSize(v)">
          <a href="javascript:void 0" :class="{ active: v === pageInfo$.pageSize }">{{ v }}条/页</a>
        </li>
      </ul>
    </li>
    <!-- 分页导航 -->
    <li class="page-body">
      <ul>
        <li @click="toPage(1)">
          <a class="first" :class="{ disabled: !prev }" href="javascript:void 0">首页</a>
        </li><li @click="toPreviousPage">
          <a :class="{ disabled: !prev }" href="javascript:void 0"><i class="icomoon icon-chevron-left"></i></a>
        </li><li v-for="(v, i) in slideWindow" :key="i" @click="toPage(v)">
          <a href="javascript:void 0" :class="{ active: pageNum === v }">{{v}}</a>
        </li><li @click="toNextPage">
          <a :class="{ disabled: !next }" href="javascript:void 0"><i class="icomoon icon-chevron-right"></i></a>
        </li><li @click="toPage(pageInfo$.pages)">
          <a class="last" :class="{ disabled: !next }" href="javascript:void 0">尾页</a>
        </li>
      </ul>
    </li>
    <!-- 分页跳转 -->
    <li class="page-tail" v-if="pageInfo$.jump">
      <span>到第</span>
      <input v-model="to" type="text" />
      <span>页</span>
      <button @click="go">GO</button>
    </li>
  </ul>
</template>
<script lang="ts" src="./page-bar.ts"></script>
