<template>
    <div :class="'wd-part-loading-'+(type===1?'list':type===2?'text':'')">
        <i v-show="type&&css3" class="icomoon icon-rotate-cw"></i>
    </div>
</template>
<script lang="ts" src="./part-loading.ts"></script>