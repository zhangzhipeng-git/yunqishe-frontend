<template>
  <div class="wd-no-result">
    <p v-if="!vhtml">
      <i class="icomoon icon-coffee"></i><br />暂无数据~
    </p>
    <div v-else v-html="vhtml"></div>
  </div>
</template>
<script lang="ts" src="./no-result.ts"></script>
