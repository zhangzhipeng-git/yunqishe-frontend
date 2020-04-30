<template>
    <div id="id-app">
        <AppHeaderComponent />
        <AppBodyComponent />
        <AppFooterComponent />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from "vue-class-component";
import AppHeaderComponent from "@/layouts/app/app-header/index.vue";
import AppBodyComponent from "@/layouts/app/app-body/index.vue";
import AppFooterComponent from "@/layouts/app/app-footer/index.vue";

@Component({
  components: {
    AppHeaderComponent,
    AppBodyComponent,
    AppFooterComponent
  }
})
export default class AppComponent extends Vue{
  constructor() {
    super();
  }
}
</script>