/**
 * 每次请求nuxt的服务端会执行，
 * 这里控制每次请求服务端后只在客户端执行。
 * 涉及加解密的功能在客户端完成
 * 避免nuxt服务端过于复杂和出现性能问题
 * @param Context
 */
import App from "@/core/context/app-context.ts";
import Component from "vue-class-component";
export default function({ $axios }: any) {
  const app = App.getAppContext();
  const http = app.getHttp();
  http.setAxios($axios);

  // Register the router hooks with their names
  Component.registerHooks([
    "beforeRouteEnter",
    "beforeRouteLeave",
    "beforeRouteUpdate" // for vue-router 2.2+
  ]);

}
