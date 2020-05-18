<template>
    <div class="wd-go-search">
        <input class="wd-go-search-input" type="text" :placeholder="placeholder"
            v-model="value"
            @input="emitInput"
        />
        <i tappable @click="emitClick" class="icomoon icon-search"></i>
    </div>
</template>
<script lang="ts" src="./search.ts"></script>
