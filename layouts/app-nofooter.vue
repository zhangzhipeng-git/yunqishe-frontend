<template>
  <div>
    <AppHeaderComponent />
    <AppBodyComponent />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import Vue from "vue";
import Component from "vue-class-component";
import AppBodyComponent from "@/layouts/app-body/app-body.vue";
import AppHeaderComponent from "@/layouts/app-header/app-header.vue";

@Component({
  components: {
    AppHeaderComponent,
    AppBodyComponent
  }
})
export default class AppComponent extends Vue {
  [k: string]: any;
  constructor() {
    super();
  }

  private async mounted() {
    // 获取主题
  }
}
</script>
<style lang="scss" scoped>
#id-app-header {
  height: 0;
  opacity: 0.8;
}

#id-app-body {
  padding: 0;
}

#id-app-footer {
  display: none;
}
</style>
