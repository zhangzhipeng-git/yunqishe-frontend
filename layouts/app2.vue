<template>
  <div id="id-app">
    <AppHeaderComponent />
    <AppBodyComponent />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AppBodyComponent from "@/layouts/app/app-body/index";
import AppHeaderComponent from "@/layouts/app/app-header/index";

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
  
}
</script>
<style lang="scss" scoped>
#id-app-header {
  opacity: 0.8;
}

#id-app-body {
  padding: 0;
  height:100%;
}
</style>
