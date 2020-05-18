<template>
  <div class="app-loader">
    <div class="mask"></div>
    <div v-if="type === 'circle'" class="three-circle-scale">
      <div class="circle1"></div>
      <div class="circle2"></div>
      <div class="circle3"></div>
    </div>
    <div v-else class="timer"><div class="center"></div></div>
  </div>
</template>
<script lang="ts" src="./app-loader.ts"></script>
