<template>
  <div id="id-ui-learn">
    <div class="ui-banner">
      <div class="ui-banner-mask"></div>
      <div class="ui-banner-text">
        <h1>知行合一，止于至善</h1>
        <p>知与行的合一，既不是以知来吞并行，认为知便是行，也不是以行来吞并知，认为行便是知.</p>
        <p></p>
      </div>
    </div>
    <div class="ui-learn-doc">
      <div class="ui-doc">
        <ul class="ui-classes">
          <!-- 总分类循环 -->
          <li v-for="i in 5" :key="i" class="ui-class">
            <h3 class="ui-class-tittle">文档{{i}}</h3>
            <ul class="ui-items">
              <!-- 分类中项目循环 -->
              <li class="ui-item" v-for="j in 7" :key="j">
                <nuxt-link :to="'/zhixing/doc-detail/' + '1'">分类{{j}}</nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>