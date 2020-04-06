/*
 * @Author: your name
 * @Date: 2020-03-22 10:23:10
 * @LastEditTime: 2020-03-22 10:34:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \nuxt-ssr\core\components\reload\reload.ts
 */
import Vue from "vue";
import Component from "vue-class-component";
import { Route } from "vue-router";

/**
 * vue-router 3.1以后无法push当前路由
 * 使用该组件进行跳转，实现间接导航到当前路由
 * 使用：this.$router.push(路由到该组件的路径)
 */
@Component({
  name: "refresh"
})
export default class RefreshComponent extends Vue {
  constructor() {
    super();
  }

  beforeRouteEnter(to: Route, from: Route, next: Function) {
    const fullPath = from.fullPath;
    if (fullPath.split("?")[0] === "/reload") {
      return;
    }
    next((vm: Vue) => {
      vm.$router.back();
      vm.$router.push(fullPath);
    });
  }
}
