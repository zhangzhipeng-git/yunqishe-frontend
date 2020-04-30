<template>
    <div :class="'wd-part-loading-'+(type===1?'list':type===2?'text':'')">
        <i v-if="!!type&&css3" class="icommon icon-rotate-cw"></i>
    </div>
</template>
<script lang="ts" src="./part-loading.ts"></script>