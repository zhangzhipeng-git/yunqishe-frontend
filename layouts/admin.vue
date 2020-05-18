<template>
  <div id="id-sys">
    <AdminComponent />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AdminComponent from "@/layouts/admin/index";

@Component({
  components: { AdminComponent }
})
export default class SystemComponent extends Vue {}
</script>