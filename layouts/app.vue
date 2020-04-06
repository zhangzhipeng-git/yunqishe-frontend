<template>
  <div id="id-app" ref="app">
    <AppHeaderComponent />
    <AppBodyComponent />
    <AppFooterComponent />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import Vue from "vue";
import Component from "vue-class-component";
import AppHeaderComponent from "@/layouts/app-header/app-header.vue";
import AppBodyComponent from "@/layouts/app-body/app-body.vue";
import AppFooterComponent from "@/layouts/app-footer/app-footer.vue";
import BaseComponent from "@/core/base-component";
import { Ref } from "vue-property-decorator";

@Component({
  components: {
    AppHeaderComponent,
    AppBodyComponent,
    AppFooterComponent
  }
})
export default class AppComponent extends BaseComponent {
  @Ref('app')
  app$!: any;
  constructor() {
    super();
  }

  /**
   * 移除绑定的事件
   */
  public destroyed(): void {
    this.$$.removeEvent(window, "scroll", this.changeOpacity);
  }
  /**
   * 上下滑动改变顶部透明度
   */
  private changeOpacity() {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    const header: any = this.app$.children[0];
    // x:delta 100 => opacity:delta .1
    // 如 scrollTop 0 时 opacity 1 , scrollTop 500 时 opacity .75
    // opacity = 1 - scrollTop/2000
    if (scrollTop > 500) return;
    header.style.opacity = 1 - scrollTop / 2000;
  }

  private async mounted() {
    // 头部随scroll改变透明度
    this.$$.addEvent(window, "scroll", this.changeOpacity);
    // 获取主题
  }
}
</script>