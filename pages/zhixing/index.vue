<template>
  <div id="id-ui-learn">
    <div class="ui-banner" :style="{'background-image': banner0.url?'url('+banner0.url+')':'none'}">
      <div class="ui-banner-mask"></div>
      <div class="ui-banner-desc" v-html="banner0.description"></div>
    </div>
    <div class="ui-learn-doc">
      <div class="ui-doc">
        <ul class="ui-classes">
          <!-- 总分类循环 -->
          <template v-for="(v, i) in list">
            <li class="ui-class" :key="i" v-if="!!v.docClasses&&v.docClasses.length">
              <h3 class="ui-class-title">{{v.name}}</h3>
              <ul class="ui-items">
                <!-- 分类中项目循环 -->
                <li class="ui-item" v-for="(vv, ii) in v.docClasses" :key="ii">
                  <router-link :to="'/zhixing/detail?pid='+vv.id+'&name='+vv.name">{{vv.name}}</router-link>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
<style lang="scss" scoped src="./index.scss"></style>