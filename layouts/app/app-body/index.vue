<template>
  <div id="id-app-body">
    <keep-alive>
        <router-view :keep-alive-props="{ exclude: [] }"/>
    </keep-alive>
  </div>
</template>
<script lang="ts" src="./index.ts"></script>
