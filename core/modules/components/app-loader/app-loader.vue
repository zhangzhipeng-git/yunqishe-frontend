<template>
  <div class="app-loader">
    <div class="mask"></div>
    <div v-if="type === 'timer'" class="timer"><div class="center"></div></div>
    <div v-else class="animation">
      <div class="animation-outter"></div>
      <div class="animation-inner"></div>
    </div>
  </div>
</template>
<script lang="ts" src="./app-loader.ts"></script>
