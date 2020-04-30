<template>
    <div class="wd-switch" @click="switch$" :style="{'border-width':v?'0':'1PX'}">
        <div :style="{width:v?'100%':'0%'}" class="wd-switch-bg"></div>
        <div :style="{left: v?'50%':'0%'}" class="wd-switch-handle"></div>
    </div>
</template>
<script lang="ts" src="./switch.ts"></script>
